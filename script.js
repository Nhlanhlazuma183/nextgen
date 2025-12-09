<script>
    
        
        // DOM Elements
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const navLinkItems = document.querySelectorAll('.nav-link');
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        const sessionType = document.getElementById('sessionType');
        const transportGroup = document.getElementById('transportGroup');
        const calculateBtn = document.getElementById('calculateBtn');
        const calculatorResult = document.getElementById('calculatorResult');
        const calculatedPrice = document.getElementById('calculatedPrice');
        const calculationDetail = document.getElementById('calculationDetail');
        const bookCalculatedBtn = document.getElementById('bookCalculatedBtn');
        const faqItems = document.querySelectorAll('.faq-item');
        const contactForm = document.getElementById('contactForm');
        const messageStatus = document.getElementById('messageStatus');
        const bookingModal = document.getElementById('bookingModal');
        const bookNowBtn = document.getElementById('bookNowBtn');
        const modalClose = document.getElementById('modalClose');
        const bookingForm = document.getElementById('bookingForm');
        const bookingStatus = document.getElementById('bookingStatus');
        const testimonialTrack = document.getElementById('testimonialTrack');
        const sliderDots = document.querySelectorAll('.slider-dot');
        const selectPlanBtns = document.querySelectorAll('[data-plan]');
        
        // Pricing data
        const pricingData = {
            'one-on-one-online': { rate: 120, type: 'hourly', baseText: 'One-on-One Online Tutoring' },
            'group-online': { rate: 70, type: 'hourly-per-learner', baseText: 'Online Group Class' },
            'house-calls': { rate: 130, type: 'hourly-plus-transport', baseText: 'House Call Tutoring' },
            'monthly-group': { rate: 650, type: 'monthly', baseText: 'Monthly Group Classes (Both Subjects)' }
        };
        
        // Testimonial slider
        let currentSlide = 1;
        const totalSlides = document.querySelectorAll('.testimonial-slide').length;
        
        // Mobile Navigation Toggle
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking a link
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                
                // Update active nav link
                navLinkItems.forEach(item => item.classList.remove('active'));
                link.classList.add('active');
            });
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section');
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinkItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
        
        // Pricing Tab Switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show corresponding tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
                
                // Update calculator if needed
                if (sessionType.value.includes(tabId)) {
                    updateTransportVisibility();
                }
            });
        });
        
        // Show/hide transport fee based on session type
        function updateTransportVisibility() {
            if (sessionType.value === 'house-calls') {
                transportGroup.style.display = 'block';
            } else {
                transportGroup.style.display = 'none';
            }
        }
        
        sessionType.addEventListener('change', updateTransportVisibility);
        
        // Cost Calculator
        calculateBtn.addEventListener('click', calculateCost);
        
        // Also calculate when inputs change
        document.getElementById('hours').addEventListener('input', calculateCost);
        document.getElementById('weeks').addEventListener('input', calculateCost);
        document.getElementById('learners').addEventListener('input', calculateCost);
        document.getElementById('transport').addEventListener('change', calculateCost);
        sessionType.addEventListener('change', calculateCost);
        
        function calculateCost() {
            const type = sessionType.value;
            const hours = parseInt(document.getElementById('hours').value) || 2;
            const weeks = parseInt(document.getElementById('weeks').value) || 4;
            const learners = parseInt(document.getElementById('learners').value) || 1;
            const transport = parseInt(document.getElementById('transport').value) || 0;
            const subject = document.getElementById('subject').value;
            
            let totalCost = 0;
            let detailText = '';
            
            switch(type) {
                case 'one-on-one-online':
                    totalCost = 120 * hours * weeks;
                    detailText = `${hours} hour${hours > 1 ? 's' : ''} per week × ${weeks} week${weeks > 1 ? 's' : ''} = R${totalCost}`;
                    break;
                    
                case 'group-online':
                    totalCost = 70 * hours * weeks * learners;
                    detailText = `${learners} learner${learners > 1 ? 's' : ''} × ${hours} hour${hours > 1 ? 's' : ''} per week × ${weeks} week${weeks > 1 ? 's' : ''} = R${totalCost}`;
                    break;
                    
                case 'house-calls':
                    totalCost = (130 * hours * weeks) + (transport * weeks);
                    detailText = `${hours} hour${hours > 1 ? 's' : ''} per week × ${weeks} week${weeks > 1 ? 's' : ''} (R${130 * hours * weeks}) + Transport (R${transport}/week) = R${totalCost}`;
                    break;
                    
                case 'monthly-group':
                    // Monthly fee for both subjects
                    if (subject === 'both') {
                        totalCost = 650 * Math.ceil(weeks / 4);
                        detailText = `Monthly group classes (both subjects): R650/month × ${Math.ceil(weeks / 4)} month${Math.ceil(weeks / 4) > 1 ? 's' : ''} = R${totalCost}`;
                    } 
                    // Monthly fee for mathematics only
                    else if (subject === 'mathematics') {
                        totalCost = 500 * Math.ceil(weeks / 4);
                        detailText = `Monthly group classes (mathematics only): R500/month × ${Math.ceil(weeks / 4)} month${Math.ceil(weeks / 4) > 1 ? 's' : ''} = R${totalCost}`;
                    }
                    // Physical sciences would be additional
                    else {
                        totalCost = 650 * Math.ceil(weeks / 4);
                        detailText = `Monthly group classes (both subjects recommended): R650/month × ${Math.ceil(weeks / 4)} month${Math.ceil(weeks / 4) > 1 ? 's' : ''} = R${totalCost}`;
                    }
                    break;
            }
            
            // Update display
            calculatedPrice.textContent = `R${totalCost}`;
            calculationDetail.textContent = detailText;
            calculatorResult.classList.add('active');
            
            // Scroll to results
            calculatorResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Book calculated plan
        bookCalculatedBtn.addEventListener('click', () => {
            openBookingModal();
            
            // Pre-fill booking form with calculated values
            const type = sessionType.value;
            const subject = document.getElementById('subject').value;
            
            document.getElementById('bookingPlan').value = type;
            document.getElementById('bookingSubject').value = subject;
        });
        
        // FAQ Accordion
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
        
        // Contact Form Submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showMessage('Thank you for your message! I will get back to you within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageStatus.classList.remove('success');
                messageStatus.textContent = '';
            }, 5000);
        });
        
        // Email validation
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        
        // Show message function
        function showMessage(text, type) {
            messageStatus.textContent = text;
            messageStatus.className = 'message-status ' + type;
        }
        
        // Booking Modal
        function openBookingModal() {
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeBookingModal() {
            bookingModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        bookNowBtn.addEventListener('click', openBookingModal);
        modalClose.addEventListener('click', closeBookingModal);
        
        // Close modal when clicking outside
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
                closeBookingModal();
            }
        });
        
        // Booking Form Submission
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('bookingName').value;
            const email = document.getElementById('bookingEmail').value;
            const phone = document.getElementById('bookingPhone').value;
            const plan = document.getElementById('bookingPlan').value;
            const subject = document.getElementById('bookingSubject').value;
            const message = document.getElementById('bookingMessage').value;
            
            // Simple validation
            if (!name || !email || !phone || !plan || !subject) {
                showBookingMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showBookingMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showBookingMessage('Booking request submitted successfully! I will contact you within 24 hours to confirm your session.', 'success');
            
            // Reset form
            bookingForm.reset();
            
            // Close modal after 3 seconds
            setTimeout(() => {
                closeBookingModal();
                bookingStatus.classList.remove('success');
                bookingStatus.textContent = '';
            }, 3000);
        });
        
        // Show booking message function
        function showBookingMessage(text, type) {
            bookingStatus.textContent = text;
            bookingStatus.className = 'message-status ' + type;
        }
        
        // Testimonial Slider
        function updateSlider() {
            const slideWidth = 100 / totalSlides;
            testimonialTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
            
            // Update dots
            sliderDots.forEach((dot, index) => {
                if (index != currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Dot navigation
        sliderDots.forEach(dot => {
            dot.addEventListener('click', function() {
                currentSlide = parseInt(this.getAttribute('data-slide'));
                updateSlider();
            });
        });
        
        // Auto-slide testimonials
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 5000);
        
        // Select plan buttons
        selectPlanBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const plan = this.getAttribute('data-plan');
                openBookingModal();
                document.getElementById('bookingPlan').value = plan;
            });
        });
        
        // Initialize calculator
        updateTransportVisibility();
        calculateCost();
        
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                header.style.padding = '10px 0';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                header.style.padding = '15px 0';
            }
        });
    </script>