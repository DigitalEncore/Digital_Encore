/**
 * Digital Encore - Main JavaScript File
 * Handles theme toggle, form validation, EmailJS integration, and smooth interactions
 */

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeContactForm();
    initializeAnimations();
    initializeSmoothScrolling();
    initializeAccordion();
    initializeChatWidget();
    initializeCarousel();
    initializeModals();
    initializeFlowAnimations();
    initializeScrollReveal();
    initializeSearch();
});

// ========================================
// THEME MANAGEMENT
// ========================================

function initializeTheme() {
    const themeToggle = document.getElementById('encoreThemeToggle');
    const themeIcon = themeToggle.querySelector('.encore-theme-icon');
    const body = document.body;
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('encore-theme') || 'light';
    setTheme(savedTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    const body = document.body;
    const themeIcon = document.querySelector('.encore-theme-icon');
    
    body.setAttribute('data-theme', theme);
    localStorage.setItem('encore-theme', theme);
    
    // Update theme icon
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun encore-theme-icon';
    } else {
        themeIcon.className = 'fas fa-moon encore-theme-icon';
    }
}

// ========================================
// NAVIGATION
// ========================================

function initializeNavigation() {
    const mobileToggle = document.getElementById('encoreMobileToggle');
    const navMenu = document.getElementById('encoreNavMenu');
    const navLinks = document.querySelectorAll('.encore-nav-link');
    const header = document.querySelector('.encore-header');
    const fixedLogo = document.querySelector('.encore-fixed-logo');
    const mobileLogo = document.querySelector('.encore-mobile-logo');
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('encore-nav-active');
        mobileToggle.classList.toggle('encore-mobile-toggle-active');
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('encore-nav-active');
            mobileToggle.classList.remove('encore-mobile-toggle-active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('encore-nav-active');
            mobileToggle.classList.remove('encore-mobile-toggle-active');
        }
    });
    
    // Modern scroll-based navbar animations
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        
        // Add scrolled class for background change
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show navbar and logo based on scroll direction
        if (scrollY > lastScrollY && scrollY > 100) {
            // Scrolling down - hide navbar and logo
            header.classList.add('hidden');
            header.classList.remove('visible');
            if (fixedLogo) {
                fixedLogo.classList.add('hidden');
            }
            if (mobileLogo) {
                mobileLogo.classList.add('hidden');
            }
        } else {
            // Scrolling up - show navbar and logo
            header.classList.remove('hidden');
            header.classList.add('visible');
            if (fixedLogo) {
                fixedLogo.classList.remove('hidden');
            }
            if (mobileLogo) {
                mobileLogo.classList.remove('hidden');
            }
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
    
    // Initialize navbar state
    updateNavbar();
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.encore-nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('encore-nav-link-active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('encore-nav-link-active');
        }
    });
}

// ========================================
// CONTACT FORM & EMAILJS
// ========================================

function initializeContactForm() {
    // Wait for EmailJS to be available
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded yet, retrying...');
        setTimeout(initializeContactForm, 100);
        return;
    }
    
    // Initialize EmailJS
    emailjs.init('b3HVcRXicSj4JkoTl');
    
    const form = document.getElementById('encoreContactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.encore-btn-text');
    const btnIcon = submitBtn.querySelector('.encore-btn-icon');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        setButtonLoading(submitBtn, btnText, btnIcon, true);
        
        try {
            // Get form data (matching EmailJS template field names)
            const formData = {
                first_name: document.getElementById('encoreFirstName').value.trim(),
                last_name: document.getElementById('encoreLastName').value.trim(),
                email: document.getElementById('encoreEmail').value.trim(),
                phone: document.getElementById('encorePhone').value.trim(),
                message: document.getElementById('encoreMessage').value.trim(),
                timestamp: new Date().toLocaleString()
            };
            
            // Add optional fields if they exist
            const country = document.getElementById('encoreCountry');
            const service = document.getElementById('encoreService');
            
            if (country && country.value) {
                formData.country = country.value;
            } else {
                formData.country = 'Not specified';
            }
            
            if (service && service.value) {
                formData.service = service.value;
            } else {
                formData.service = 'Not specified';
            }
            
            // Send email
            const emailResponse = await emailjs.send(
                'service_lzcfyrv',
                'template_ruvnjn8',
                formData
            );
            
            // Also save to Google Sheets (optional - won't block if it fails)
            try {
                console.log('Sending to Google Sheets:', formData);
                await saveToGoogleSheets(formData);
                console.log('Google Sheets save successful');
            } catch (sheetsError) {
                console.log('Google Sheets save failed (non-critical):', sheetsError);
            }
            
            if (emailResponse.status === 200) {
                // Track form submission conversion
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Contact Form Submission',
                        content_category: 'Form',
                        value: 1,
                        currency: 'USD'
                    });
                }
                
                // Redirect to thank you page
                window.location.href = 'thank-you.html';
            } else {
                throw new Error('Failed to send message');
            }
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            showAlert('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
        } finally {
            // Reset button state
            setButtonLoading(submitBtn, btnText, btnIcon, false);
        }
    });
}

function validateForm() {
    const firstName = document.getElementById('encoreFirstName');
    const lastName = document.getElementById('encoreLastName');
    const email = document.getElementById('encoreEmail');
    const phone = document.getElementById('encorePhone');
    const message = document.getElementById('encoreMessage');
    
    const fields = [
        { element: firstName, name: 'First Name' },
        { element: lastName, name: 'Last Name' },
        { element: email, name: 'Email Address' },
        { element: phone, name: 'Phone Number' },
        { element: message, name: 'Message' }
    ];
    
    // Check for optional fields
    const country = document.getElementById('encoreCountry');
    const service = document.getElementById('encoreService');
    
    if (country) {
        fields.push({ element: country, name: 'Country' });
    }
    
    if (service) {
        fields.push({ element: service, name: 'Service Interest' });
    }
    
    let isValid = true;
    const missingFields = [];
    
    fields.forEach(field => {
        const value = field.element.value.trim();
        
        // Remove previous error styling
        field.element.classList.remove('encore-form-error');
        
        if (!value) {
            field.element.classList.add('encore-form-error');
            missingFields.push(field.name);
            isValid = false;
        }
    });
    
    // Email validation
    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue && !emailRegex.test(emailValue)) {
        email.classList.add('encore-form-error');
        showAlert('Please enter a valid email address.', 'error');
        isValid = false;
    }
    
    // Phone validation (flexible for international numbers)
    const phoneValue = phone.value.trim();
    // Accepts: +63, 63, 09xx, 9xx, +1, 1, etc. with 7-15 digits total
    const phoneRegex = /^[\+]?[0-9][\d\s\-\(\)]{6,20}$/;
    if (phoneValue && !phoneRegex.test(phoneValue)) {
        phone.classList.add('encore-form-error');
        showAlert('Please enter a valid phone number (e.g., +63 912 345 6789, 0912 345 6789, or 912 345 6789).', 'error');
        isValid = false;
    }
    
    if (!isValid && missingFields.length > 0) {
        const fieldText = missingFields.length === 1 ? 'field' : 'fields';
        showAlert(`Please fill in the following ${fieldText}: ${missingFields.join(', ')}`, 'error');
    }
    
    return isValid;
}

function setButtonLoading(button, textElement, iconElement, isLoading) {
    if (isLoading) {
        button.disabled = true;
        textElement.textContent = 'Sending...';
        iconElement.className = 'fas fa-spinner fa-spin encore-btn-icon';
        button.classList.add('encore-btn-loading');
    } else {
        button.disabled = false;
        textElement.textContent = 'Send Message';
        iconElement.className = 'fas fa-paper-plane encore-btn-icon';
        button.classList.remove('encore-btn-loading');
    }
}

// ========================================
// GOOGLE SHEETS INTEGRATION
// ========================================

async function saveToGoogleSheets(formData) {
    // Google Apps Script Web App URL
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxVGZVgtyD5046yV514p1L1YTNblDI8C4gyJXrXYDcfOWtET6b2Khyw83bWHkDWc12iOQ/exec';
    
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        console.log('Data saved to Google Sheets successfully');
        return response;
    } catch (error) {
        console.error('Google Sheets save error:', error);
        throw error;
    }
}

// ========================================
// ALERTS & NOTIFICATIONS
// ========================================

function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('encoreAlertContainer');
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `encore-alert encore-alert-${type}`;
    
    const icon = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
    
    alert.innerHTML = `
        <i class="${icon} encore-alert-icon"></i>
        <span class="encore-alert-message">${message}</span>
    `;
    
    // Add to container
    alertContainer.appendChild(alert);
    
    // Trigger animation
    setTimeout(() => {
        alert.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }, 5000);
    
    // Remove on click
    alert.addEventListener('click', function() {
        alert.classList.remove('show');
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    });
}

// ========================================
// ANIMATIONS & SCROLL EFFECTS
// ========================================

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Don't add animation to encore-hero-visual on mobile devices
                if (entry.target.classList.contains('encore-hero-visual') && window.innerWidth <= 767) {
                    observer.unobserve(entry.target);
                    return;
                }
                entry.target.classList.add('encore-animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.encore-service-card, .encore-benefit-item, .encore-hero-content, .encore-hero-visual, .encore-section-header, .encore-get-started-hero-content, .encore-thank-you-content'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', handleParallax);
}

function handleParallax() {
    // Disable parallax effect on mobile devices (screen width <= 767px)
    if (window.innerWidth <= 767) {
        return;
    }
    
    const scrolled = window.pageYOffset;
    const heroCard = document.querySelector('.encore-hero-card');
    
    if (heroCard) {
        const rate = scrolled * -0.5;
        heroCard.style.transform = `perspective(1000px) rotateY(-5deg) rotateX(5deg) translateY(${rate}px)`;
    }
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.encore-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// FORM ENHANCEMENTS
// ========================================

// Add floating label effect
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('.encore-form-input, .encore-form-textarea');
    
    formInputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('encore-form-focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.parentElement.classList.remove('encore-form-focused');
            }
        });
        
        // Check if input has value on load
        if (input.value.trim()) {
            input.parentElement.classList.add('encore-form-focused');
        }
        
        // Real-time validation
        input.addEventListener('input', function() {
            this.classList.remove('encore-form-error');
        });
    });
});

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll events
const optimizedScrollHandler = throttle(updateActiveNavigation, 100);
const optimizedParallaxHandler = throttle(handleParallax, 16);

window.addEventListener('scroll', optimizedScrollHandler);
window.addEventListener('scroll', optimizedParallaxHandler);

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Keyboard navigation for theme toggle
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        document.getElementById('encoreThemeToggle').click();
    }
});

// Focus management for mobile menu
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send error reports to a logging service here
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You could send error reports to a logging service here
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Format phone number
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// ========================================
// ACCORDION FUNCTIONALITY
// ========================================

function initializeAccordion() {
    const accordionItems = document.querySelectorAll('.encore-accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.encore-accordion-header');
        const content = item.querySelector('.encore-accordion-content');
        const icon = header.querySelector('.encore-accordion-icon');
        
        if (!header || !content) return;
        
        header.addEventListener('click', function() {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // Close all other accordion items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherHeader = otherItem.querySelector('.encore-accordion-header');
                    const otherContent = otherItem.querySelector('.encore-accordion-content');
                    const otherIcon = otherHeader.querySelector('.encore-accordion-icon');
                    
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherContent.classList.remove('open');
                    otherItem.classList.remove('active');
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current item
            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.classList.remove('open');
                item.classList.remove('active');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            } else {
                header.setAttribute('aria-expanded', 'true');
                content.classList.add('open');
                item.classList.add('active');
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
            }
        });
        
        // Keyboard navigation
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}

// ========================================
// CHAT WIDGET FUNCTIONALITY
// ========================================

function initializeChatWidget() {
    const chatToggle = document.getElementById('encore-chat-toggle');
    const chatWindow = document.getElementById('encore-chat-window');
    const chatClose = document.getElementById('encore-chat-close');
    const chatInput = document.getElementById('encore-chat-input');
    const chatSend = document.getElementById('encore-chat-send');
    const chatMessages = document.getElementById('encore-chat-messages');
    const chatBadge = document.getElementById('encore-chat-badge');
    const quickReplies = document.querySelectorAll('.encore-chat-quick-reply');
    const chatPopup = document.getElementById('encore-chat-popup');
    const chatPopupClose = document.getElementById('encore-chat-popup-close');
    
    if (!chatToggle || !chatWindow) return;
    
    let isOpen = false;
    let messageCount = 0;
    let conversationContext = {
        lastTopic: null,
        userIndustry: null,
        userGoals: [],
        previousQuestions: [],
        followUpNeeded: false
    };
    
    // Enhanced Chat responses database with comprehensive coverage
    const responses = {
        // Core Services
        'what services do you offer?': 'We offer comprehensive digital solutions including modern website development, business process automation, customer experience optimization, and custom digital features. Our services span across web development, automation systems, digital transformation, and ongoing support. What specific challenges are you looking to solve?',
        'services': 'Our main services include: 🌐 Professional Website Development, ⚡ Business Process Automation, 📱 Custom Web Applications, 🔧 Digital Transformation Consulting, 📊 Analytics & Optimization, and 🛠️ Ongoing Technical Support. Which area interests you most?',
        'website development': 'We create modern, responsive websites that are fast, SEO-optimized, and user-friendly. Our websites include custom designs, mobile optimization, content management systems, and integration with your business tools. What type of website are you looking for?',
        'automation': 'We help businesses automate repetitive tasks and streamline workflows. This includes customer management systems, order processing, inventory management, email marketing automation, and custom business logic. What processes would you like to automate?',
        'web development': 'Our web development services include custom websites, web applications, e-commerce solutions, and API integrations. We use modern technologies and best practices to ensure your site is fast, secure, and scalable. What kind of web solution do you need?',
        
        // Pricing & Budget
        'how much does a website cost?': 'Great question! Every project is unique, so pricing depends on your specific needs and goals. Rather than giving you a generic range, I\'d love to understand your requirements first. What type of website or solution are you looking for?',
        'pricing': 'Our pricing is customized based on your specific requirements and goals. We offer transparent, value-based pricing with no hidden fees. To provide you with accurate pricing, I\'d love to learn more about your project. What kind of solution are you looking for?',
        'budget': 'I appreciate you asking about budget! To provide you with the most accurate pricing, I\'d love to understand your project requirements first. We work with various budget ranges and can suggest solutions that fit your needs. What specific goals are you trying to achieve?',
        'cost': 'Great question about cost! Every project is unique, so pricing varies based on your specific needs. We offer flexible payment options and can work within your budget. What type of website or solution are you planning? This will help me give you more relevant information.',
        'expensive': 'We understand budget is important! We offer competitive pricing and flexible payment options. Our goal is to provide value that exceeds the investment. What\'s your budget range, and what are you looking to achieve? We can suggest solutions that fit your needs.',
        'cheap': 'We offer competitive pricing without compromising quality. Our solutions are designed to provide excellent value for your investment. What\'s your budget range? We can work with you to find the best solution within your means.',
        
        // Timeline & Process
        'how long does a project take?': 'Project timelines vary based on complexity and scope. A simple business website typically takes 2-4 weeks, while complex web applications can take 6-12 weeks. To give you an accurate timeline, I\'d need to understand your specific requirements. What kind of project are you planning?',
        'timeline': 'Project timelines are customized based on your requirements. We provide detailed project schedules and keep you updated throughout the process. To give you a realistic timeline, I\'d need to understand your project scope. What are you looking to build or improve?',
        'how long': 'Project duration depends on complexity and features. We provide detailed timelines during our consultation and keep you updated throughout the process. What type of project are you considering?',
        'when will it be ready': 'We provide detailed project schedules and regular updates throughout development. Timeline depends on your specific requirements. What kind of project are you planning?',
        'process': 'Our process includes: 1) Free consultation to understand your needs, 2) Project planning and timeline, 3) Design and development, 4) Testing and optimization, 5) Launch and training, 6) Ongoing support. Would you like to know more about any specific step?',
        
        // Industries & Use Cases
        'restaurant': 'We specialize in restaurant websites with online ordering, table reservations, menu management, and customer reviews. Our restaurant solutions help increase orders and improve customer experience. What specific features does your restaurant need?',
        'healthcare': 'We create HIPAA-compliant healthcare websites with patient portals, appointment booking, telemedicine integration, and secure communication. What type of healthcare practice do you have?',
        'ecommerce': 'We build powerful e-commerce websites with inventory management, payment processing, order tracking, and customer accounts. Our solutions are optimized for conversions and sales growth. What products are you selling?',
        'real estate': 'We develop real estate websites with property listings, virtual tours, lead capture, and CRM integration. Our solutions help agents generate more leads and close more deals. Are you an agent or agency?',
        'fitness': 'We create fitness websites with class scheduling, member portals, payment processing, and workout tracking. Our solutions help gyms and trainers grow their membership. What type of fitness business do you have?',
        'professional services': 'We build professional service websites with client portals, appointment booking, document sharing, and billing integration. Our solutions help consultants and service providers streamline their business. What type of professional services do you offer?',
        
        // Technical Questions
        'mobile': 'All our websites are fully responsive and mobile-optimized. We ensure your site looks and works perfectly on all devices - phones, tablets, and desktops. Mobile optimization is included in all our projects.',
        'seo': 'We include SEO optimization in all our websites, including fast loading speeds, mobile optimization, clean code, and search engine best practices. We can also provide ongoing SEO services to improve your rankings.',
        'hosting': 'We can help you with hosting setup and management. We recommend reliable hosting providers and can assist with domain registration, SSL certificates, and ongoing maintenance.',
        'maintenance': 'We offer ongoing maintenance and support services including updates, backups, security monitoring, and technical support. What kind of ongoing support are you looking for?',
        'security': 'Security is a top priority. We implement best practices including SSL certificates, secure coding, regular updates, and security monitoring. All our websites are built with security in mind.',
        
        // Contact & Consultation
        'i want a free consultation': 'Excellent! I\'d be happy to help you get started. You can contact us directly at vanjerson2@gmail.com or visit our contact page to schedule your free consultation. We\'ll assess your needs and provide customized recommendations.',
        'consultation': 'We offer free consultations to understand your needs and provide customized recommendations. You can reach us at vanjerson2@gmail.com or through our contact form. What would you like to discuss?',
        'contact': 'You can reach us at vanjerson2@gmail.com or through our contact form. We typically respond within 24 hours and offer free consultations to discuss your project needs.',
        'email': 'You can reach us at vanjerson2@gmail.com. We respond to all emails within 24 hours and offer free consultations to discuss your project.',
        'phone': 'You can reach us at vanjerson2@gmail.com to schedule a phone consultation. We offer free phone consultations to discuss your project needs.',
        'meeting': 'We offer free consultations via email, phone, or video call. You can reach us at vanjerson2@gmail.com to schedule a meeting that works for you.',
        
        // Specific Requests
        'i need a website for my business': 'Excellent! A professional website can transform your business. To provide you with the best solution, I\'d love to learn more about your business. What industry are you in, and what are your main goals for the website?',
        'i want to automate my business processes': 'Great choice! Automation can save you time and reduce errors. What specific processes are you looking to automate? Are you thinking about customer management, order processing, or something else?',
        'i need help with my current website': 'We can help improve your existing website! We offer website audits, redesigns, performance optimization, and feature additions. What issues are you experiencing with your current site?',
        'i want to start an online business': 'That\'s exciting! We can help you build the perfect online presence for your business. This includes a professional website, e-commerce functionality, and business automation. What type of online business are you planning?',
        'i need a custom solution': 'We specialize in custom web solutions tailored to your specific needs. We can build custom web applications, integrations, and business logic. What kind of custom solution are you looking for?',
        
        // Support & Help
        'help': 'I\'m here to help! I can answer questions about our services, pricing, process, or help you get started with a project. What would you like to know more about?',
        'support': 'We provide ongoing support for all our projects including technical assistance, updates, and maintenance. You can reach our support team at vanjerson2@gmail.com. What kind of support do you need?',
        'problem': 'I\'m sorry to hear you\'re experiencing an issue. Please describe the problem you\'re facing, and I\'ll do my best to help you resolve it. You can also contact our support team at vanjerson2@gmail.com.',
        'issue': 'I\'m here to help resolve any issues you might have. Please describe the problem, and I\'ll assist you or connect you with our technical team. You can also reach us at vanjerson2@gmail.com.',
        
        // Default fallback
        'default': 'Thank you for your message! I\'m here to help with any questions about our services, pricing, process, or technical requirements. To provide you with the most relevant information, could you tell me more about what you\'re looking to achieve? You can also contact us at vanjerson2@gmail.com for a free consultation.'
    };
    
    // Toggle chat window
    chatToggle.addEventListener('click', function() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.classList.add('open');
            chatBadge.style.display = 'none';
            chatInput.focus();
        } else {
            chatWindow.classList.remove('open');
        }
    });
    
    // Close chat window
    chatClose.addEventListener('click', function() {
        isOpen = false;
        chatWindow.classList.remove('open');
    });
    
    // Send message function
    function sendMessage(message) {
        if (!message.trim()) return;
        
        // Update conversation context
        updateConversationContext(message);
        
        // Add user message
        addMessage(message, 'user');
        
        // Simulate typing delay with typing indicator
        setTimeout(() => {
            showTypingIndicator();
        }, 500);
        
        setTimeout(() => {
            hideTypingIndicator();
            const response = getResponse(message.toLowerCase());
            addMessage(response, 'bot');
        }, 1500);
        
        // Clear input
        chatInput.value = '';
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'encore-chat-message encore-chat-message-bot encore-typing-indicator';
        typingDiv.innerHTML = `
            <div class="encore-chat-avatar">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            </div>
            <div class="encore-chat-bubble encore-typing-bubble">
                <div class="encore-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.encore-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `encore-chat-message encore-chat-message-${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'encore-chat-avatar';
        
        if (sender === 'bot') {
            avatar.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            `;
        } else {
            avatar.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
            `;
        }
        
        const bubble = document.createElement('div');
        bubble.className = 'encore-chat-bubble';
        
        // Add Get Started button for bot messages
        const getStartedButton = sender === 'bot' ? 
            `<div class="encore-chat-action-buttons">
                <button class="encore-chat-get-started-btn" onclick="window.location.href='get-started.html'">
                    Get Started
                </button>
            </div>` : '';
        
        bubble.innerHTML = `
            <p>${text}</p>
            ${getStartedButton}
            <span class="encore-chat-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        messageCount++;
    }
    
    // Enhanced response matching with intelligent keyword detection
    function getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for exact matches first
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        // Intelligent keyword matching with context awareness
        const keywordMap = {
            // Services
            'service': ['services', 'what services do you offer?'],
            'website': ['website development', 'i need a website for my business'],
            'automation': ['automation', 'i want to automate my business processes'],
            'web development': ['web development', 'website development'],
            'app': ['web development', 'i need a custom solution'],
            'application': ['web development', 'i need a custom solution'],
            
            // Pricing & Budget
            'price': ['pricing', 'how much does a website cost?'],
            'cost': ['cost', 'how much does a website cost?'],
            'budget': ['budget', 'pricing'],
            'expensive': ['expensive', 'pricing'],
            'cheap': ['cheap', 'pricing'],
            'affordable': ['pricing', 'budget'],
            'investment': ['pricing', 'budget'],
            
            // Timeline
            'time': ['timeline', 'how long does a project take?'],
            'long': ['how long', 'how long does a project take?'],
            'duration': ['timeline', 'how long does a project take?'],
            'when': ['when will it be ready', 'timeline'],
            'ready': ['when will it be ready', 'timeline'],
            'finish': ['timeline', 'how long does a project take?'],
            'complete': ['timeline', 'how long does a project take?'],
            
            // Industries
            'restaurant': ['restaurant'],
            'food': ['restaurant'],
            'cafe': ['restaurant'],
            'healthcare': ['healthcare'],
            'medical': ['healthcare'],
            'doctor': ['healthcare'],
            'clinic': ['healthcare'],
            'ecommerce': ['ecommerce'],
            'shop': ['ecommerce'],
            'store': ['ecommerce'],
            'sell': ['ecommerce'],
            'real estate': ['real estate'],
            'property': ['real estate'],
            'agent': ['real estate'],
            'fitness': ['fitness'],
            'gym': ['fitness'],
            'trainer': ['fitness'],
            'professional': ['professional services'],
            'consultant': ['professional services'],
            'lawyer': ['professional services'],
            'accountant': ['professional services'],
            
            // Technical
            'mobile': ['mobile'],
            'responsive': ['mobile'],
            'seo': ['seo'],
            'search': ['seo'],
            'hosting': ['hosting'],
            'domain': ['hosting'],
            'maintenance': ['maintenance'],
            'support': ['support'],
            'security': ['security'],
            'secure': ['security'],
            
            // Contact & Consultation
            'contact': ['contact'],
            'email': ['email'],
            'phone': ['phone'],
            'call': ['phone'],
            'consultation': ['consultation', 'i want a free consultation'],
            'free': ['i want a free consultation', 'consultation'],
            'meeting': ['meeting'],
            'discuss': ['consultation'],
            'talk': ['consultation'],
            
            // Specific Requests
            'help': ['help'],
            'problem': ['problem'],
            'issue': ['issue'],
            'broken': ['problem'],
            'fix': ['support'],
            'improve': ['i need help with my current website'],
            'redesign': ['i need help with my current website'],
            'update': ['maintenance'],
            'start': ['i want to start an online business'],
            'business': ['i need a website for my business'],
            'custom': ['i need a custom solution'],
            'unique': ['i need a custom solution'],
            'special': ['i need a custom solution']
        };
        
        // Find the best matching keyword
        let bestMatch = null;
        let bestScore = 0;
        
        for (const [keyword, responses] of Object.entries(keywordMap)) {
            if (lowerMessage.includes(keyword)) {
                // Calculate relevance score based on keyword position and context
                const keywordIndex = lowerMessage.indexOf(keyword);
                const score = keyword.length + (lowerMessage.length - keywordIndex) / lowerMessage.length;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = responses[0]; // Use the first (most relevant) response
                }
            }
        }
        
        // Check if message needs human support
        if (needsHumanSupport(message)) {
            return generateHumanSupportResponse(message);
        }
        
        // Return the best match or generate a contextual response
        if (bestMatch && responses[bestMatch]) {
            return responses[bestMatch];
        }
        
        // Generate contextual response for custom questions
        return generateContextualResponse(lowerMessage);
    }
    
    // Update conversation context based on user message
    function updateConversationContext(message) {
        const lowerMessage = message.toLowerCase();
        
        // Detect industry mentions
        const industries = ['restaurant', 'healthcare', 'medical', 'ecommerce', 'real estate', 'fitness', 'professional', 'lawyer', 'accountant', 'consultant', 'gym', 'clinic', 'cafe', 'food', 'shop', 'store'];
        for (const industry of industries) {
            if (lowerMessage.includes(industry)) {
                conversationContext.userIndustry = industry;
                break;
            }
        }
        
        // Detect goals and needs
        if (lowerMessage.includes('website') || lowerMessage.includes('site')) {
            conversationContext.userGoals.push('website');
        }
        if (lowerMessage.includes('automation') || lowerMessage.includes('automate')) {
            conversationContext.userGoals.push('automation');
        }
        if (lowerMessage.includes('ecommerce') || lowerMessage.includes('online store')) {
            conversationContext.userGoals.push('ecommerce');
        }
        if (lowerMessage.includes('mobile') || lowerMessage.includes('responsive')) {
            conversationContext.userGoals.push('mobile');
        }
        if (lowerMessage.includes('seo') || lowerMessage.includes('search')) {
            conversationContext.userGoals.push('seo');
        }
        
        // Store previous questions for context
        conversationContext.previousQuestions.push(message);
        if (conversationContext.previousQuestions.length > 5) {
            conversationContext.previousQuestions.shift(); // Keep only last 5 questions
        }
        
        // Detect if follow-up is needed
        conversationContext.followUpNeeded = lowerMessage.includes('?') || 
                                           lowerMessage.includes('how') || 
                                           lowerMessage.includes('what') || 
                                           lowerMessage.includes('why');
    }
    
    // Generate contextual responses for custom questions
    function generateContextualResponse(message) {
        // Check for question patterns
        if (message.includes('?') || message.includes('how') || message.includes('what') || message.includes('why') || message.includes('when') || message.includes('where')) {
            // Industry-specific questions
            if (message.includes('restaurant') || message.includes('food') || message.includes('cafe')) {
                return 'Great question about restaurant solutions! We specialize in restaurant websites with online ordering, menu management, and customer engagement features. What specific aspect of restaurant technology are you interested in?';
            }
            if (message.includes('healthcare') || message.includes('medical') || message.includes('doctor')) {
                return 'Excellent question about healthcare solutions! We create HIPAA-compliant websites with patient portals, appointment booking, and secure communication. What type of healthcare practice do you have?';
            }
            if (message.includes('ecommerce') || message.includes('shop') || message.includes('sell')) {
                return 'Great question about e-commerce! We build powerful online stores with inventory management, payment processing, and customer accounts. What products are you looking to sell online?';
            }
            
            // Technical questions
            if (message.includes('mobile') || message.includes('phone') || message.includes('tablet')) {
                return 'Great question about mobile optimization! All our websites are fully responsive and work perfectly on all devices. Mobile optimization is included in all our projects. What specific mobile features are you interested in?';
            }
            if (message.includes('seo') || message.includes('search') || message.includes('google')) {
                return 'Excellent question about SEO! We include comprehensive SEO optimization in all our websites, including fast loading, mobile optimization, and search engine best practices. What SEO goals do you have?';
            }
            
            // General business questions
            if (message.includes('business') || message.includes('company') || message.includes('startup')) {
                return 'Great question about business solutions! We help businesses of all sizes with their digital presence and automation needs. What type of business are you running, and what challenges are you facing?';
            }
            
            // Default question response
            return 'That\'s a great question! I\'d be happy to help you with that. To provide you with the most accurate and helpful information, could you tell me a bit more about your specific situation or requirements? You can also contact us at vanjerson2@gmail.com for a detailed discussion.';
        }
        
        // Check for statement patterns
        if (message.includes('need') || message.includes('want') || message.includes('looking for')) {
            if (message.includes('website') || message.includes('site')) {
                return 'I understand you\'re looking for a website solution! That\'s exciting. To provide you with the best recommendation, could you tell me more about your business and what goals you want to achieve with your website?';
            }
            if (message.includes('automation') || message.includes('automate')) {
                return 'Great! Automation can really transform your business efficiency. What specific processes or tasks are you looking to automate? This will help me suggest the best solutions for your needs.';
            }
            if (message.includes('help') || message.includes('assistance')) {
                return 'I\'m here to help! I can assist you with questions about our services, pricing, process, or help you get started with a project. What specific area would you like help with?';
            }
        }
        
        // Check for problem statements
        if (message.includes('problem') || message.includes('issue') || message.includes('broken') || message.includes('not working')) {
            return 'I\'m sorry to hear you\'re experiencing an issue. I\'m here to help resolve it. Could you describe the problem in more detail? You can also contact our support team at vanjerson2@gmail.com for immediate assistance.';
        }
        
        // Check for urgency indicators
        if (message.includes('urgent') || message.includes('asap') || message.includes('quickly') || message.includes('fast')) {
            return 'I understand this is urgent! I\'ll do my best to help you quickly. Could you provide more details about what you need? For immediate assistance, you can also contact us directly at vanjerson2@gmail.com.';
        }
        
        // Generate personalized response based on conversation context
        let personalizedResponse = 'Thank you for your message! ';
        
        // Add industry-specific context
        if (conversationContext.userIndustry) {
            personalizedResponse += `I see you're interested in ${conversationContext.userIndustry} solutions. `;
        }
        
        // Add goals context
        if (conversationContext.userGoals.length > 0) {
            const goalsText = conversationContext.userGoals.join(', ');
            personalizedResponse += `Based on your interest in ${goalsText}, `;
        }
        
        // Add follow-up based on context
        if (conversationContext.userIndustry && conversationContext.userGoals.length > 0) {
            personalizedResponse += `I can provide specific recommendations for your ${conversationContext.userIndustry} business. What specific challenges are you facing with ${conversationContext.userGoals[0]}?`;
        } else if (conversationContext.userIndustry) {
            personalizedResponse += `I can help you with ${conversationContext.userIndustry}-specific solutions. What type of digital solution are you looking for?`;
        } else if (conversationContext.userGoals.length > 0) {
            personalizedResponse += `I can help you with ${conversationContext.userGoals[0]} solutions. What industry is your business in?`;
        } else {
            personalizedResponse += 'I\'m here to help with any questions about our services, pricing, process, or technical requirements. To provide you with the most relevant information, could you tell me more about what you\'re looking to achieve?';
        }
        
        personalizedResponse += ' You can also contact us at vanjerson2@gmail.com for a free consultation.';
        
        return personalizedResponse;
    }
    
    // Check if message needs human support
    function needsHumanSupport(message) {
        const lowerMessage = message.toLowerCase();
        
        // Complex technical questions
        const complexKeywords = ['api', 'database', 'server', 'backend', 'frontend', 'framework', 'programming', 'code', 'development', 'technical', 'integration', 'custom development'];
        for (const keyword of complexKeywords) {
            if (lowerMessage.includes(keyword)) {
                return true;
            }
        }
        
        // Multiple questions in one message
        const questionCount = (lowerMessage.match(/\?/g) || []).length;
        if (questionCount > 2) {
            return true;
        }
        
        // Very long messages (likely complex requests)
        if (message.length > 200) {
            return true;
        }
        
        // Specific request for human
        if (lowerMessage.includes('human') || lowerMessage.includes('person') || lowerMessage.includes('agent') || lowerMessage.includes('representative')) {
            return true;
        }
        
        return false;
    }
    
    // Generate human support response
    function generateHumanSupportResponse(message) {
        return `I understand you have a complex question that would benefit from speaking with one of our experts. Let me connect you with our team for personalized assistance. You can reach us directly at vanjerson2@gmail.com or schedule a free consultation. We'll provide detailed answers to your technical questions and help you with your specific requirements.`;
    }
    
    // Send button click
    chatSend.addEventListener('click', function() {
        const message = chatInput.value.trim();
        sendMessage(message);
    });
    
    // Enter key to send
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const message = chatInput.value.trim();
            sendMessage(message);
        }
    });
    
    // Quick reply buttons
    quickReplies.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            sendMessage(message);
        });
    });
    
    // Show popup after 2 seconds
    setTimeout(() => {
        if (!isOpen && chatPopup) {
            chatPopup.classList.add('show');
        }
    }, 2000);
    
    // Show badge after 3 seconds
    setTimeout(() => {
        if (!isOpen) {
            chatBadge.style.display = 'flex';
        }
    }, 3000);
    
    // Add attention-grabbing animation after 5 seconds
    setTimeout(() => {
        if (!isOpen) {
            chatToggle.style.animation = 'encore-chat-nudge 3s ease-in-out infinite, encore-chat-attention 2s ease-in-out 3';
        }
    }, 5000);
    
    // Close popup when close button is clicked
    if (chatPopupClose) {
        chatPopupClose.addEventListener('click', function() {
            if (chatPopup) {
                chatPopup.classList.remove('show');
            }
        });
    }
    
    // Close popup when chat is opened
    chatToggle.addEventListener('click', function() {
        if (isOpen && chatPopup) {
            chatPopup.classList.remove('show');
        }
    });
    
    // Click popup to open chat
    if (chatPopup) {
        chatPopup.addEventListener('click', function(e) {
            if (e.target.closest('.encore-chat-popup-close')) return;
            chatToggle.click();
        });
    }
    
    // Hide badge when chat is opened
    chatToggle.addEventListener('click', function() {
        if (isOpen) {
            chatBadge.style.display = 'none';
        }
    });
}

// ========================================
// 3D CAROUSEL FUNCTIONALITY
// ========================================

function initializeCarousel() {
    const carousel = document.getElementById('encore3DCarousel');
    
    if (!carousel) return;
    
    // Check if we're on mobile (screen width <= 480px)
    const isMobile = window.innerWidth <= 480;
    
    if (isMobile) {
        // Mobile carousel - horizontal scroll implementation
        initializeMobileCarousel(carousel);
    } else {
        // Desktop carousel - 3D rotation with hover pause
        initializeDesktopCarousel(carousel);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 480;
        if (newIsMobile !== isMobile) {
            // Reinitialize carousel if mobile/desktop state changed
            initializeCarousel();
        }
    });
}

function initializeDesktopCarousel(carousel) {
    // Remove any mobile-specific styles that might have been applied
    carousel.style.animation = '';
    carousel.style.transform = '';
    carousel.style.display = '';
    carousel.style.overflowX = '';
    carousel.style.scrollSnapType = '';
    carousel.style.gap = '';
    carousel.style.padding = '';
    carousel.style.width = '';
    carousel.style.height = '';
    carousel.style.transformStyle = '';
    carousel.style.scrollbarWidth = '';
    carousel.style.msOverflowStyle = '';
    carousel.style.setProperty('-webkit-scrollbar', '');
    
    // Restore carousel items to default CSS positioning
    const carouselItems = carousel.querySelectorAll('.encore-carousel-item');
    carouselItems.forEach((item, index) => {
        item.style.flex = '';
        item.style.width = '';
        item.style.height = '';
        item.style.position = '';
        item.style.transform = '';
        item.style.scrollSnapAlign = '';
    });
    
    // Remove any existing event listeners to prevent duplicates
    carousel.removeEventListener('mouseenter', handleMouseEnter);
    carousel.removeEventListener('mouseleave', handleMouseLeave);
    
    // Pause auto-rotation on hover
    function handleMouseEnter() {
        carousel.style.animationPlayState = 'paused';
    }
    
    function handleMouseLeave() {
        carousel.style.animationPlayState = 'running';
    }
    
    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);
}

function initializeMobileCarousel(carousel) {
    const carouselContainer = carousel.parentElement;
    const carouselItems = carousel.querySelectorAll('.encore-carousel-item');
    let currentIndex = 0;
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let startScrollLeft = 0;
    
    // Ensure carousel is in mobile mode
    carousel.style.animation = 'none';
    carousel.style.transform = 'none';
    carousel.style.display = 'flex';
    carousel.style.overflowX = 'auto';
    carousel.style.scrollSnapType = 'x mandatory';
    carousel.style.gap = 'var(--encore-space-4)';
    carousel.style.padding = 'var(--encore-space-4) 0';
    carousel.style.width = '100%';
    carousel.style.height = 'auto';
    carousel.style.transformStyle = 'flat';
    carousel.style.scrollbarWidth = 'none';
    carousel.style.msOverflowStyle = 'none';
    
    // Hide scrollbar for webkit browsers
    carousel.style.setProperty('-webkit-scrollbar', 'display: none');
    
    // Set up carousel items for mobile
    carouselItems.forEach((item, index) => {
        item.style.flex = '0 0 280px';
        item.style.width = '280px';
        item.style.height = '350px';
        item.style.position = 'relative';
        item.style.transform = 'none';
        item.style.scrollSnapAlign = 'center';
    });
    
    // Touch/swipe support for mobile
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startScrollLeft = carousel.scrollLeft;
        isDragging = true;
        carousel.style.scrollBehavior = 'auto';
    }, { passive: true });
    
    carousel.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // Only prevent default if it's a horizontal swipe and significant movement
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
            e.preventDefault();
            carousel.scrollLeft = startScrollLeft + diffX;
        }
    }, { passive: false });
    
    carousel.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only trigger if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            const itemWidth = 280 + 16; // 280px width + 16px gap
            const scrollAmount = itemWidth;
            
            if (diffX > 0) {
                // Swipe left - go to next item
                carousel.scrollLeft += scrollAmount;
            } else {
                // Swipe right - go to previous item
                carousel.scrollLeft -= scrollAmount;
            }
        }
        
        carousel.style.scrollBehavior = 'smooth';
    }, { passive: true });
    
    // Add scroll snap behavior
    carousel.addEventListener('scroll', function() {
        const itemWidth = 280 + 16; // 280px width + 16px gap
        const scrollLeft = carousel.scrollLeft;
        const newIndex = Math.round(scrollLeft / itemWidth);
        
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < carouselItems.length) {
            currentIndex = newIndex;
        }
    });
    
    // Add mouse support for desktop users on mobile view
    let mouseStartX = 0;
    let mouseStartY = 0;
    let isMouseDragging = false;
    let mouseStartScrollLeft = 0;
    
    carousel.addEventListener('mousedown', function(e) {
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        mouseStartScrollLeft = carousel.scrollLeft;
        isMouseDragging = true;
        carousel.style.scrollBehavior = 'auto';
        e.preventDefault();
    });
    
    carousel.addEventListener('mousemove', function(e) {
        if (!isMouseDragging) return;
        
        const currentX = e.clientX;
        const currentY = e.clientY;
        const diffX = mouseStartX - currentX;
        const diffY = mouseStartY - currentY;
        
        // Only prevent default if it's a horizontal drag
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
            e.preventDefault();
            carousel.scrollLeft = mouseStartScrollLeft + diffX;
        }
    });
    
    carousel.addEventListener('mouseup', function(e) {
        if (!isMouseDragging) return;
        isMouseDragging = false;
        
        const endX = e.clientX;
        const endY = e.clientY;
        const diffX = mouseStartX - endX;
        const diffY = mouseStartY - endY;
        
        // Only trigger if horizontal drag is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            const itemWidth = 280 + 16; // 280px width + 16px gap
            const scrollAmount = itemWidth;
            
            if (diffX > 0) {
                // Drag left - go to next item
                carousel.scrollLeft += scrollAmount;
            } else {
                // Drag right - go to previous item
                carousel.scrollLeft -= scrollAmount;
            }
        }
        
        carousel.style.scrollBehavior = 'smooth';
    });
    
    // Prevent text selection during drag
    carousel.addEventListener('selectstart', function(e) {
        if (isMouseDragging) {
            e.preventDefault();
        }
    });
}

// ========================================
// MODAL SYSTEM
// ========================================

function initializeModals() {
    const modals = document.querySelectorAll('.encore-modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');

    // Workflow animation functionality
    function initWorkflowAnimations(modal) {
        const workflowSteps = modal.querySelectorAll('.encore-workflow-step');
        const resultsSection = modal.querySelector('.encore-workflow-results');
        const ctaSection = modal.querySelector('.encore-workflow-cta');
        
        if (!workflowSteps.length) return;

        // Check if mobile device
        const isMobile = window.innerWidth <= 767;
        
        // If mobile, show all content immediately without animations
        if (isMobile) {
            workflowSteps.forEach(step => {
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
                step.style.visibility = 'visible';
            });
            
            if (resultsSection) {
                resultsSection.style.opacity = '1';
                resultsSection.style.transform = 'translateY(0)';
                resultsSection.style.visibility = 'visible';
            }
            
            if (ctaSection) {
                ctaSection.style.opacity = '1';
                ctaSection.style.transform = 'translateY(0)';
                ctaSection.style.visibility = 'visible';
            }
            return;
        }

        // Auto-reveal sequence from start to end (desktop only)
        function startAutoReveal() {
            // Animate workflow steps with slower, more gradual timing
            workflowSteps.forEach((step, index) => {
                setTimeout(() => {
                    step.classList.add('animate');
                    
                    // Smooth scroll to center the current step
                    step.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, index * 1200); // Increased from 800ms to 1200ms for slower reveal
            });

            // Animate results section after all workflow steps
            if (resultsSection) {
                setTimeout(() => {
                    resultsSection.classList.add('animate');
                    resultsSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, workflowSteps.length * 1200 + 600); // Increased delay after all steps
            }

            // Animate CTA section after results
            if (ctaSection) {
                setTimeout(() => {
                    ctaSection.classList.add('animate');
                    ctaSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, workflowSteps.length * 1200 + 1500); // Increased delay after results section
            }
        }

        // Start the auto-reveal sequence when modal opens
        setTimeout(() => {
            startAutoReveal();
        }, 500); // Small delay to ensure modal is fully loaded
    }
    
    // Open modal function
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Initialize workflow animations if this modal has workflow content
        setTimeout(() => {
            initWorkflowAnimations(modal);
        }, 100);
        
        // Handle window resize for mobile/desktop switching
        const handleResize = () => {
            initWorkflowAnimations(modal);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Clean up resize listener when modal closes
        const cleanup = () => {
            window.removeEventListener('resize', handleResize);
        };
        
        modal.addEventListener('modal-closed', cleanup);
        
        // Focus management
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
    
    // Close modal function
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close all modals function
    function closeAllModals() {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
    
    // Event listeners for modal triggers
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });
    
    // Event listeners for industry images (clickable images)
    const industryImages = document.querySelectorAll('.encore-industry-image[data-modal]');
    industryImages.forEach(image => {
        image.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const modalId = this.getAttribute('data-modal');
            console.log('Image clicked, opening modal:', modalId);
            openModal(modalId);
        });
    });
    
    // Also make the entire industry card clickable
    const industryCards = document.querySelectorAll('.encore-industry-card');
    industryCards.forEach(card => {
        const image = card.querySelector('.encore-industry-image[data-modal]');
        if (image) {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.encore-explore-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const modalId = image.getAttribute('data-modal');
                    console.log('Card clicked, opening modal:', modalId);
                    openModal(modalId);
                }
            });
            
            // Add touch support for mobile devices
            card.addEventListener('touchend', function(e) {
                // Check if this is a quick tap (not a swipe)
                const touchDuration = Date.now() - (card._touchStartTime || 0);
                if (touchDuration < 300) { // Quick tap within 300ms
                    e.preventDefault();
                    e.stopPropagation();
                    const modalId = image.getAttribute('data-modal');
                    console.log('Card touched, opening modal:', modalId);
                    openModal(modalId);
                }
            }, { passive: false });
            
            // Track touch start time
            card.addEventListener('touchstart', function(e) {
                card._touchStartTime = Date.now();
            }, { passive: true });
        }
    });
    
    // Event listeners for modal close buttons
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.encore-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal');
                closeModal(modalId);
            });
        }
        
        // Close modal when clicking outside content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                const modalId = modal.id;
                closeModal(modalId);
            }
        });
        
        // Add mobile swipe-down gesture to close modal
        addMobileSwipeToClose(modal);
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Prevent body scroll when modal is open
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const modal = mutation.target;
                if (modal.classList.contains('encore-modal')) {
                    if (modal.classList.contains('active')) {
                        document.body.style.overflow = 'hidden';
                    } else {
                        // Check if any other modals are open
                        const activeModals = document.querySelectorAll('.encore-modal.active');
                        if (activeModals.length === 0) {
                            document.body.style.overflow = '';
                        }
                    }
                }
            }
        });
    });
    
    modals.forEach(modal => {
        observer.observe(modal, { attributes: true });
    });
}

// Add mobile swipe-down gesture to close modal
function addMobileSwipeToClose(modal) {
    let startY = 0;
    let startX = 0;
    let isDragging = false;
    let startTime = 0;
    
    modal.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        startTime = Date.now();
        isDragging = true;
    }, { passive: true });
    
    modal.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const diffY = currentY - startY;
        const diffX = currentX - startX;
        
        // Only handle vertical swipes that start from the top
        if (startY < 100 && Math.abs(diffY) > Math.abs(diffX) && diffY > 0) {
            // Add visual feedback by moving the modal down slightly
            const modalContent = modal.querySelector('.encore-modal-content');
            if (modalContent && diffY < 200) {
                modalContent.style.transform = `translateY(${diffY * 0.3}px)`;
                modalContent.style.opacity = Math.max(0.3, 1 - (diffY / 200));
            }
        }
    }, { passive: true });
    
    modal.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;
        
        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;
        const diffY = endY - startY;
        const diffX = endX - startX;
        const duration = Date.now() - startTime;
        
        // Reset modal position
        const modalContent = modal.querySelector('.encore-modal-content');
        if (modalContent) {
            modalContent.style.transform = '';
            modalContent.style.opacity = '';
        }
        
        // Close modal if swipe down is significant and fast enough
        if (startY < 100 && 
            Math.abs(diffY) > Math.abs(diffX) && 
            diffY > 100 && 
            duration < 500) {
            const modalId = modal.id;
            closeModal(modalId);
        }
    }, { passive: true });
}

// ========================================
// EXPORT FOR TESTING (if needed)
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        showAlert,
        setTheme,
        formatPhoneNumber,
        copyToClipboard,
        initializeAccordion,
        initializeChatWidget,
        initializeCarousel,
        initializeModals,
        initializeFlowAnimations
    };
}

// ========================================
// FLOW ANIMATIONS
// ========================================

function initializeFlowAnimations() {
    // Function to animate modal content when modal opens
    function animateModalContent(modal) {
        // Reset all animations first
        const allAnimatedElements = modal.querySelectorAll('.animate');
        allAnimatedElements.forEach(element => element.classList.remove('animate'));
        
        // Animate different concept types
        const conceptType = getModalConceptType(modal);
        
        switch(conceptType) {
            case 'timeline':
                animateTimelineFlow(modal);
                break;
            case 'process':
                animateProcessFlow(modal);
                break;
            case 'journey':
                animateJourneyMap(modal);
                break;
            case 'dashboard':
                animateDashboardMetrics(modal);
                break;
            case 'story':
                animateStoryChapters(modal);
                break;
            case 'comparison':
                // Comparison doesn't need auto-animation, it's user-triggered
                break;
            default:
                // Fallback to old flow animation
                animateLegacyFlow(modal);
        }
    }
    
    // Determine modal concept type based on content
    function getModalConceptType(modal) {
        if (modal.querySelector('.encore-timeline-container')) return 'timeline';
        if (modal.querySelector('.encore-process-container')) return 'process';
        if (modal.querySelector('.encore-journey-container')) return 'journey';
        if (modal.querySelector('.encore-dashboard-container')) return 'dashboard';
        if (modal.querySelector('.encore-story-container')) return 'story';
        if (modal.querySelector('.encore-comparison-container')) return 'comparison';
        return 'legacy';
    }
    
    // Timeline Flow Animation
    function animateTimelineFlow(modal) {
        const sections = modal.querySelectorAll('.encore-timeline-section');
        const connector = modal.querySelector('.encore-transformation-connector');
        const results = modal.querySelector('.encore-results-timeline');
        
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('animate');
            }, index * 900); // Slowed down from 600ms to 900ms
        });
        
        if (connector) {
            setTimeout(() => {
                connector.style.opacity = '1';
                connector.style.transform = 'scale(1)';
            }, sections.length * 600 + 300);
        }
        
        if (results) {
            setTimeout(() => {
                results.style.opacity = '1';
                results.style.transform = 'translateY(0)';
            }, sections.length * 600 + 600);
        }
    }
    
    // Process Flow Animation
    function animateProcessFlow(modal) {
        const steps = modal.querySelectorAll('.encore-process-step');
        const benefits = modal.querySelector('.encore-benefits-showcase');
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('animate');
            }, index * 750); // Slowed down from 500ms to 750ms
        });
        
        if (benefits) {
            setTimeout(() => {
                benefits.style.opacity = '1';
                benefits.style.transform = 'translateY(0)';
            }, steps.length * 500 + 300);
        }
    }
    
    // Journey Map Animation
    function animateJourneyMap(modal) {
        const nodes = modal.querySelectorAll('.encore-journey-node');
        const connections = modal.querySelectorAll('.encore-journey-connection');
        const features = modal.querySelector('.encore-interactive-features');
        
        nodes.forEach((node, index) => {
            setTimeout(() => {
                node.classList.add('animate');
            }, index * 600); // Slowed down from 400ms to 600ms
        });
        
        connections.forEach((connection, index) => {
            setTimeout(() => {
                connection.style.opacity = '1';
                connection.style.transform = 'scale(1)';
            }, (index + 1) * 400 + 200);
        });
        
        if (features) {
            setTimeout(() => {
                features.style.opacity = '1';
                features.style.transform = 'translateY(0)';
            }, nodes.length * 400 + 400);
        }
    }
    
    // Dashboard Metrics Animation
    function animateDashboardMetrics(modal) {
        const panels = modal.querySelectorAll('.encore-metrics-panel');
        const arrow = modal.querySelector('.encore-dashboard-arrow');
        const features = modal.querySelector('.encore-features-dashboard');
        
        panels.forEach((panel, index) => {
            setTimeout(() => {
                panel.classList.add('animate');
            }, index * 600); // Slowed down from 400ms to 600ms
        });
        
        if (arrow) {
            setTimeout(() => {
                arrow.style.opacity = '1';
                arrow.style.transform = 'scale(1)';
            }, panels.length * 400 + 200);
        }
        
        if (features) {
            setTimeout(() => {
                features.style.opacity = '1';
                features.style.transform = 'translateY(0)';
            }, panels.length * 400 + 400);
        }
    }
    
    // Story Chapters Animation
    function animateStoryChapters(modal) {
        const characterIntro = modal.querySelector('.encore-character-intro');
        const chapters = modal.querySelectorAll('.encore-chapter');
        const cta = modal.querySelector('.encore-story-cta');
        
        if (characterIntro) {
            setTimeout(() => {
                characterIntro.style.opacity = '1';
                characterIntro.style.transform = 'translateY(0)';
            }, 200);
        }
        
        chapters.forEach((chapter, index) => {
            setTimeout(() => {
                chapter.classList.add('animate');
            }, 600 + (index * 900)); // Slowed down from 400 + (index * 600) to 600 + (index * 900)
        });
        
        if (cta) {
            setTimeout(() => {
                cta.style.opacity = '1';
                cta.style.transform = 'translateY(0)';
            }, 400 + (chapters.length * 600) + 300);
        }
    }
    
    // Legacy Flow Animation (for old flow elements)
    function animateLegacyFlow(modal) {
        const flowSteps = modal.querySelectorAll('.encore-flow-step');
        const flowArrows = modal.querySelectorAll('.encore-flow-arrow');
        const resultsSection = modal.querySelector('.encore-results-section');
        const resultItems = modal.querySelectorAll('.encore-result-item');
        
        if (flowSteps.length === 0 && flowArrows.length === 0) {
            return;
        }
        
        flowSteps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('animate');
            }, index * 600); // Slowed down from 400ms to 600ms
        });
        
        flowArrows.forEach((arrow, index) => {
            setTimeout(() => {
                arrow.classList.add('animate');
            }, (index + 1) * 400 + 200);
        });
        
        if (resultsSection) {
            setTimeout(() => {
                resultsSection.classList.add('animate');
            }, flowSteps.length * 400 + 400);
        }
        
        resultItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
            }, flowSteps.length * 400 + 600 + (index * 200));
        });
    }
    
    // Add event listeners to modal triggers to start animations
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            // Start animation after modal is fully opened
            setTimeout(() => {
                const modal = document.getElementById(modalId);
                if (modal) {
                    animateModalContent(modal);
                }
            }, 300);
        });
    });
    
    // Initialize comparison toggle functionality
    initializeComparisonToggle();
}

// Comparison Toggle Functionality
function initializeComparisonToggle() {
    const toggleButtons = document.querySelectorAll('.encore-toggle-btn');
    const comparisonViews = document.querySelectorAll('.encore-comparison-view');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Remove active class from all buttons and views
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            comparisonViews.forEach(view => view.classList.remove('active'));
            
            // Add active class to clicked button and corresponding view
            this.classList.add('active');
            const targetView = document.querySelector(`.encore-view-${view}`);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

function initializeScrollReveal() {
    // Create intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // For staggered items, add delay based on their position
                if (entry.target.classList.contains('encore-stagger-item')) {
                    const siblings = Array.from(entry.target.parentNode.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all elements with scroll reveal classes
    const revealElements = document.querySelectorAll(`
        .encore-scroll-reveal,
        .encore-fade-in-left,
        .encore-fade-in-right,
        .encore-scale-up,
        .encore-stagger-item,
        .encore-slide-up-rotate,
        .encore-bounce-in,
        .encore-flip-in
    `);

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Special handling for hero section (reveal immediately)
    const heroSection = document.querySelector('.encore-hero');
    if (heroSection) {
        heroSection.classList.add('revealed');
    }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================

function initializeSearch() {
    const searchToggle = document.getElementById('encoreSearchToggle');
    const searchModal = document.getElementById('encoreSearchModal');
    const searchOverlay = document.getElementById('encoreSearchOverlay');
    const searchClose = document.getElementById('encoreSearchClose');
    const searchInput = document.getElementById('encoreSearchInput');
    const searchClear = document.getElementById('encoreSearchClear');
    const searchSuggestions = document.getElementById('encoreSearchSuggestions');
    const searchResults = document.getElementById('encoreSearchResults');
    const searchNoResults = document.getElementById('encoreSearchNoResults');
    const searchResultsList = document.getElementById('encoreSearchResultsList');
    const searchResultsCount = document.getElementById('encoreSearchResultsCount');
    const searchTags = document.querySelectorAll('.encore-search-tag');

    // Search data - content to search through
    const searchData = [
        {
            title: "Website UI/UX Development",
            description: "Stunning, user-centered designs that captivate visitors and drive conversions. Modern interfaces with exceptional user experience and seamless interactions.",
            type: "Service",
            url: "services.html",
            keywords: ["website", "development", "UI", "UX", "design", "interface", "user experience"]
        },
        {
            title: "CRM Automation",
            description: "Intelligent customer relationship management systems that automatically track, organize, and nurture leads throughout the entire sales funnel.",
            type: "Service",
            url: "services.html",
            keywords: ["CRM", "automation", "customer", "relationship", "management", "leads", "sales"]
        },
        {
            title: "Email Campaign Automation",
            description: "Powerful email marketing automation that nurtures leads, engages customers, and drives conversions with personalized, targeted campaigns.",
            type: "Service",
            url: "services.html",
            keywords: ["email", "marketing", "automation", "campaigns", "leads", "conversions"]
        },
        {
            title: "Calendar Booking System",
            description: "Seamless appointment scheduling systems that automate bookings, send reminders, and integrate with your existing workflow.",
            type: "Service",
            url: "services.html",
            keywords: ["calendar", "booking", "appointment", "scheduling", "automation", "reminders"]
        },
        {
            title: "Business System Automation",
            description: "Smart workflows that eliminate repetitive tasks and automatically organize customer data. Streamline your processes and never miss a lead again.",
            type: "Service",
            url: "services.html",
            keywords: ["business", "automation", "workflow", "processes", "data", "organization"]
        },
        {
            title: "Customer Experience Solutions",
            description: "AI-powered communication tools and automated support systems that provide instant responses and personalized customer experiences.",
            type: "Service",
            url: "services.html",
            keywords: ["customer", "experience", "AI", "communication", "support", "automation"]
        },
        {
            title: "Google Analytics Setup",
            description: "Comprehensive website analytics setup and configuration to track visitor behavior, measure performance, and gain valuable insights for business growth.",
            type: "Service",
            url: "services.html",
            keywords: ["Google", "Analytics", "tracking", "performance", "insights", "data"]
        },
        {
            title: "Professional Digital Services",
            description: "Digital Encore is a growing provider of professional digital services, specializing in website development and automation solutions.",
            type: "About",
            url: "index.html",
            keywords: ["professional", "digital", "services", "website", "development", "automation"]
        },
        {
            title: "Why Choose Digital Encore",
            description: "We don't just build websites – we create digital ecosystems that drive your business forward with professional image, efficiency, and customer-first approach.",
            type: "About",
            url: "why-choose-us.html",
            keywords: ["why", "choose", "professional", "efficiency", "customer", "first", "scalability"]
        },
        {
            title: "Get Free Consultation",
            description: "Ready to transform your business? Let's discuss how we can help you achieve your goals and grow your business with our comprehensive services.",
            type: "Contact",
            url: "contact.html",
            keywords: ["consultation", "free", "transform", "business", "goals", "contact"]
        }
    ];

    // Open search modal
    function openSearch() {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    }

    // Close search modal
    function closeSearch() {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
        searchInput.value = '';
        showSuggestions();
        hideClearButton();
    }

    // Show suggestions
    function showSuggestions() {
        searchSuggestions.style.display = 'block';
        searchResults.style.display = 'none';
        searchNoResults.style.display = 'none';
    }

    // Show results
    function showResults(results) {
        searchSuggestions.style.display = 'none';
        searchResults.style.display = 'block';
        searchNoResults.style.display = 'none';
        
        searchResultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
        
        searchResultsList.innerHTML = '';
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'encore-search-result-item';
            resultItem.innerHTML = `
                <div class="encore-search-result-title">${result.title}</div>
                <div class="encore-search-result-description">${result.description}</div>
                <span class="encore-search-result-type">${result.type}</span>
            `;
            
            resultItem.addEventListener('click', () => {
                window.location.href = result.url;
                closeSearch();
            });
            
            searchResultsList.appendChild(resultItem);
        });
    }

    // Show no results
    function showNoResults() {
        searchSuggestions.style.display = 'none';
        searchResults.style.display = 'none';
        searchNoResults.style.display = 'block';
    }

    // Search function
    function search(query) {
        if (!query.trim()) {
            showSuggestions();
            return;
        }

        const results = searchData.filter(item => {
            const searchText = (item.title + ' ' + item.description + ' ' + item.keywords.join(' ')).toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        if (results.length > 0) {
            showResults(results);
        } else {
            showNoResults();
        }
    }

    // Show/hide clear button
    function toggleClearButton() {
        if (searchInput.value.trim()) {
            searchClear.style.display = 'flex';
        } else {
            searchClear.style.display = 'none';
        }
    }

    function hideClearButton() {
        searchClear.style.display = 'none';
    }

    // Event listeners
    searchToggle.addEventListener('click', openSearch);
    searchOverlay.addEventListener('click', closeSearch);
    searchClose.addEventListener('click', closeSearch);
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        showSuggestions();
        hideClearButton();
    });

    // Search input events
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        search(query);
        toggleClearButton();
    });

    // Search tag clicks
    searchTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchTerm = tag.getAttribute('data-search');
            searchInput.value = searchTerm;
            search(searchTerm);
            toggleClearButton();
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Open search with Ctrl/Cmd + K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
        
        // Close search with Escape
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeSearch();
        }
    });

    // Initialize
    showSuggestions();
}
