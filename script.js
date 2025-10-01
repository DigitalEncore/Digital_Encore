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
            // Get form data
            const formData = {
                firstName: document.getElementById('encoreFirstName').value.trim(),
                lastName: document.getElementById('encoreLastName').value.trim(),
                email: document.getElementById('encoreEmail').value.trim(),
                phone: document.getElementById('encorePhone').value.trim(),
                message: document.getElementById('encoreMessage').value.trim(),
                timestamp: new Date().toLocaleString()
            };
            
            // Send email
            const response = await emailjs.send(
                'service_lzcfyrv',
                'template_ruvnjn8',
                formData
            );
            
            if (response.status === 200) {
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
                entry.target.classList.add('encore-animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.encore-service-card, .encore-benefit-item, .encore-hero-content, .encore-hero-visual'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', handleParallax);
}

function handleParallax() {
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
// EXPORT FOR TESTING (if needed)
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        showAlert,
        setTheme,
        formatPhoneNumber,
        copyToClipboard
    };
}
