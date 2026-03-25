/**
 * ALIMI DIGITAL - Modern Portfolio Website
 * Main JavaScript for interactions and animations
 */

// ============================================
// Mobile Navigation
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInsideNav = hamburger?.contains(e.target) || navMenu?.contains(e.target);
    if (!isClickInsideNav && navMenu?.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================
// Active Navigation Link
// ============================================
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if ((currentPath === '/' || currentPath.includes('index')) && href === '#home') {
            link.classList.add('active');
        }
    });
}

// Check active link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

updateActiveNavLink();

// ============================================
// Smooth Scroll
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Intersection Observer for Animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe cards for fade-in animations
document.querySelectorAll('.project-card, .stat-card').forEach(el => {
    observer.observe(el);
});

// ============================================
// Contact Form
// ============================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    if (!name.trim() || !message.trim()) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Log form data (in production, send to backend)
    console.log('Form submitted:', { name, email, message });
    
    // Show success message
    const originalText = contactForm.querySelector('button span').textContent;
    contactForm.querySelector('button span').textContent = '✓ Message Sent!';
    
    // Reset form
    contactForm.reset();
    
    // Restore button text
    setTimeout(() => {
        contactForm.querySelector('button span').textContent = originalText;
    }, 3000);
}

// ============================================
// Form Helpers
// ============================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// Parallax Effect (Light)
// ============================================
document.addEventListener('mousemove', (e) => {
    const blobs = document.querySelectorAll('.blob');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    blobs.forEach((blob, index) => {
        const blob1Offset = (index + 1) * 5;
        blob.style.transform = `translate(${x * blob1Offset}px, ${y * blob1Offset}px)`;
    });
});

// ============================================
// Stagger Animation Helper
// ============================================
function staggerElements(elements, delay = 0.1) {
    elements.forEach((el, index) => {
        el.style.animationDelay = `${delay * index}s`;
    });
}

// Apply stagger to hero CTA buttons
const heroButtons = document.querySelectorAll('.hero-cta-group .btn');
if (heroButtons.length > 0) {
    // Already has animation in CSS, just ensure timing
    heroButtons.forEach((btn, index) => {
        btn.style.animationDelay = `${0.6 + index * 0.2}s`;
    });
}

// ============================================
// Scroll-based Animations
// ============================================
const handleScrollAnimations = debounce(() => {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            el.classList.add('animate');
        } else {
            el.classList.remove('animate');
        }
    });
}, 100);

window.addEventListener('scroll', handleScrollAnimations);
handleScrollAnimations();

// ============================================
// Utility Functions
// ============================================
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// ============================================
// Performance: Lazy Load Images (if needed)
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ============================================
// Initialize on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('ALIMI DIGITAL portfolio initialized');
    
    // Add any initialization code here
    
    // Ensure animations are smooth
    document.documentElement.style.scrollBehavior = 'smooth';
});

// ============================================
// Window Load Event
// ============================================
window.addEventListener('load', () => {
    // Remove loading state if present
    document.body.classList.remove('loading');
});
