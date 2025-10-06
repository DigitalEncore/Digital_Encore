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
    
    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
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
    
    // Chat responses database
    const responses = {
        'what services do you offer?': 'We offer comprehensive website solutions, business automation, customer experience optimization, and custom features. Our services include modern web development, process automation, and digital transformation solutions. What specific challenges are you looking to solve?',
        'how much does a website cost?': 'Great question! Every project is unique, so pricing depends on your specific needs and goals. Rather than giving you a generic range, I\'d love to understand your requirements first. What type of website or solution are you looking for?',
        'how long does a project take?': 'Project timelines vary based on complexity and scope. To give you an accurate timeline, I\'d need to understand your specific requirements. What kind of project are you planning?',
        'i want a free consultation': 'Excellent! I\'d be happy to help you get started. You can contact us directly at vanjerson2@gmail.com or visit our contact page to schedule your free consultation. We\'ll assess your needs and provide customized recommendations.',
        'pricing': 'I understand you\'re interested in pricing! Every project is different, so I\'d love to learn more about your specific needs first. What kind of solution are you looking for? This will help me provide you with accurate pricing information.',
        'timeline': 'Project timelines are customized based on your requirements. To give you a realistic timeline, I\'d need to understand your project scope. What are you looking to build or improve?',
        'contact': 'You can reach us at vanjerson2@gmail.com or through our contact form. We typically respond within 24 hours and offer free consultations to discuss your project needs.',
        'budget': 'I appreciate you asking about budget! To provide you with the most accurate pricing, I\'d love to understand your project requirements first. What specific goals are you trying to achieve?',
        'cost': 'Great question about cost! Every project is unique, so pricing varies based on your specific needs. What type of website or solution are you planning? This will help me give you more relevant information.',
        'i need a website for my business': 'Excellent! A professional website can transform your business. To provide you with the best solution, I\'d love to learn more about your business. What industry are you in, and what are your main goals for the website?',
        'i want to automate my business processes': 'Great choice! Automation can save you time and reduce errors. What specific processes are you looking to automate? Are you thinking about customer management, order processing, or something else?',
        'default': 'Thank you for your message! I\'m here to help with any questions about our services. To provide you with the most relevant information, could you tell me more about what you\'re looking to achieve? You can also contact us at vanjerson2@gmail.com for a free consultation.'
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
    
    // Get appropriate response
    function getResponse(message) {
        // Check for exact matches first
        for (const [key, response] of Object.entries(responses)) {
            if (message.includes(key)) {
                return response;
            }
        }
        
        // Check for keywords
        if (message.includes('service') || message.includes('offer')) {
            return responses['what services do you offer?'];
        } else if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
            return responses['how much does a website cost?'];
        } else if (message.includes('time') || message.includes('long') || message.includes('duration')) {
            return responses['how long does a project take?'];
        } else if (message.includes('contact') || message.includes('email') || message.includes('reach')) {
            return responses['contact'];
        } else if (message.includes('consultation') || message.includes('free') || message.includes('meeting')) {
            return responses['i want a free consultation'];
        }
        
        return responses['default'];
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
        initializeChatWidget
    };
}
