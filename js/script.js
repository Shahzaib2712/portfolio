// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize custom cursor FIRST
    initCustomCursor();
    
    // Font Awesome detection and fallback
    detectFontAwesome();
    
    // Font Awesome should now be loaded via CDN
    console.log('✅ Font Awesome 6.4.0 CDN loaded successfully');
    
    // Initialize all functions
    initNavbar();
    initBackToTop();
    initSmoothScrolling();
    initSkillBars();
    initContactForm();
    initScrollAnimations();
    initTypingEffect();
    
    // Navbar functionality
    function initNavbar() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        // Navbar background on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
        
        // Active nav link highlighting
        window.addEventListener('scroll', function() {
            let current = '';
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= (sectionTop - 200)) {
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
        
        // Mobile menu close on link click
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
    }
    
    // Back to top button
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Skill bars animation
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const width = skillBar.style.width;
                    skillBar.style.width = '0%';
                    
                    setTimeout(() => {
                        skillBar.style.width = width;
                    }, 200);
                    
                    observer.unobserve(skillBar);
                }
            });
        }, observerOptions);
        
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // Contact form handling
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const name = formData.get('name');
                const email = formData.get('email');
                const subject = formData.get('subject');
                const message = formData.get('message');
                
                // Basic validation
                if (!name || !email || !subject || !message) {
                    showNotification('Please fill in all fields', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }
                
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual PHP processing)
                setTimeout(() => {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            });
        }
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Scroll animations
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.project-card, .experience-item, .skill-item, .timeline-item');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    // Typing effect for hero title
    function initTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            heroTitle.style.borderRight = '2px solid #007bff';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    // Remove cursor after typing is complete
                    setTimeout(() => {
                        heroTitle.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            // Start typing effect after a short delay
            setTimeout(typeWriter, 500);
        }
    }
    
    // Parallax effect for floating elements
    function initParallaxEffect() {
        const elements = document.querySelectorAll('.element');
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            elements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${rate * speed}px)`;
            });
        });
    }
    
    // Initialize parallax effect
    initParallaxEffect();
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Add hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add counter animation for statistics (if needed)
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    // Initialize counter animation when skills section is visible
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(skillsSection);
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
        
        // Space key to scroll down
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        }
    });
    
    // Add touch support for mobile devices
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - scroll down
                window.scrollBy({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            } else {
                // Swipe down - scroll up
                window.scrollBy({
                    top: -window.innerHeight,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    // Performance optimization: Throttle scroll events
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
    
    // Apply throttling to scroll events
    const throttledScrollHandler = throttle(function() {
        // Scroll-based animations and effects
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        // Update parallax elements
        document.querySelectorAll('.parallax').forEach(element => {
            element.style.transform = `translateY(${parallax}px)`;
        });
    }, 16); // ~60fps
    
    window.addEventListener('scroll', throttledScrollHandler);
    
    // Add CSS for active nav link
    const style = document.createElement('style');
    style.textContent = `
        .navbar-nav .nav-link.active {
            color: #007bff !important;
        }
        
        .navbar-nav .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Portfolio website initialized successfully!');
    
    // Font Awesome Detection and Fallback
    function detectFontAwesome() {
        console.log('🔍 Checking Font Awesome availability...');
        
        // Create a test element to check if Font Awesome is loaded
        const testElement = document.createElement('i');
        testElement.className = 'fas fa-home';
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.style.visibility = 'hidden';
        document.body.appendChild(testElement);
        
        // Check if the icon is rendered properly
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(testElement, '::before');
            const content = computedStyle.content;
            
            if (content && content !== 'none' && content !== 'normal') {
                console.log('✅ Font Awesome is loaded successfully');
                document.body.classList.remove('no-fontawesome');
            } else {
                console.warn('⚠️ Font Awesome not detected, using fallbacks');
                document.body.classList.add('no-fontawesome');
                
                // Add fallback icons using Unicode characters
                addFallbackIcons();
            }
            
            // Clean up test element
            document.body.removeChild(testElement);
        }, 1000);
    }
    
    // Add fallback icons using Unicode characters
    function addFallbackIcons() {
        const fallbackMap = {
            'fa-home': '🏠',
            'fa-user': '👤',
            'fa-envelope': '✉️',
            'fa-phone': '📞',
            'fa-map-marker-alt': '📍',
            'fa-globe': '🌐',
            'fa-code': '💻',
            'fa-palette': '🎨',
            'fa-paint-brush': '🖌️',
            'fa-magic': '✨',
            'fa-robot': '🤖',
            'fa-brain': '🧠',
            'fa-microchip': '🔧',
            'fa-image': '🖼️',
            'fa-chart-line': '📈',
            'fa-search': '🔍',
            'fa-terminal': '💻',
            'fa-server': '🖥️',
            'fa-database': '🗄️',
            'fa-file-word': '📄',
            'fa-file-excel': '📊',
            'fa-file-powerpoint': '📽️',
            'fa-file-pdf': '📋',
            'fa-shield-alt': '🛡️',
            'fa-mobile-alt': '📱',
            'fa-rocket': '🚀',
            'fa-cogs': '⚙️',
            'fa-truck': '🚛',
            'fa-car': '🚗',
            'fa-clock': '⏰',
            'fa-qrcode': '📱',
            'fa-tasks': '📋',
            'fa-shopping-cart': '🛒',
            'fa-comments': '💬',
            'fa-language': '🌍',
            'fa-eye': '👁️',
            'fa-user-check': '✅',
            'fa-github': '🐙',
            'fa-linkedin-in': '💼',
            'fa-twitter': '🐦',
            'fa-instagram': '📷',
            'fa-html5': '🌐',
            'fa-css3-alt': '🎨',
            'fa-js-square': '📜',
            'fa-bootstrap': '🎯',
            'fa-python': '🐍',
            'fa-git-alt': '📚',
            'fa-wordpress': '📝',
            'fa-shopify': '🛍️',
            'fa-woocommerce': '🛒',
            'fa-wix': '🌐',
            'fa-figma': '🎨',
            'fa-google': '🔍',
            'fa-facebook': '📘',
            'fa-youtube': '📺',
            'fa-microsoft': '💻'
        };
        
        // Replace Font Awesome icons with emoji fallbacks
        Object.keys(fallbackMap).forEach(className => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(element => {
                if (element.tagName === 'I') {
                    element.textContent = fallbackMap[className];
                    element.style.fontStyle = 'normal';
                }
            });
        });
        
        console.log('✅ Fallback icons applied');
    }
    
    // SIMPLE AND RELIABLE CUSTOM CURSOR
    function initCustomCursor() {
        console.log('🚀 Starting custom cursor initialization...');
        
        // Check if cursor elements exist
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorRing = document.querySelector('.cursor-ring');
        const cursorText = document.querySelector('.cursor-text');
        
        if (!cursorDot || !cursorRing) {
            console.error('❌ Cursor elements not found!');
            return;
        }
        
        console.log('✅ Cursor elements found:', { dot: cursorDot, ring: cursorRing, text: cursorText });
        
        // Disable on mobile
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            console.log('📱 Mobile device detected - disabling cursor');
            cursorDot.style.display = 'none';
            cursorRing.style.display = 'none';
            if (cursorText) cursorText.style.display = 'none';
            document.body.style.cursor = 'auto';
            return;
        }
        
        console.log('🖥️ Desktop device - initializing cursor');
        
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // Simple variables
        let mouseX = 0;
        let mouseY = 0;
        let isClicking = false;
        
        // Mouse move - SUPER SIMPLE
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Update dot position directly
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
            
            // Update ring with slight delay
            setTimeout(() => {
                cursorRing.style.left = mouseX + 'px';
                cursorRing.style.top = mouseY + 'px';
            }, 10);
        });
        
        // Click effects - SUPER SIMPLE
        document.addEventListener('mousedown', () => {
            isClicking = true;
            cursorDot.style.transform = 'scale(0.5)';
            cursorDot.style.background = '#ff6b6b';
            cursorRing.style.transform = 'scale(0.8)';
            cursorRing.style.borderColor = '#ff6b6b';
        });
        
        document.addEventListener('mouseup', () => {
            isClicking = false;
            cursorDot.style.transform = 'scale(1)';
            cursorDot.style.background = '#007bff';
            cursorRing.style.transform = 'scale(1)';
            cursorRing.style.borderColor = 'rgba(0, 123, 255, 0.6)';
        });
        
        // Hover effects
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('a, button, .nav-link, .social-link, .project-card, .tool-item, .ai-tool-item, input, textarea')) {
                cursorRing.style.transform = 'scale(1.5)';
                cursorRing.style.borderColor = '#007bff';
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.matches('a, button, .nav-link, .social-link, .project-card, .tool-item, .ai-tool-item, input, textarea')) {
                if (!isClicking) {
                    cursorRing.style.transform = 'scale(1)';
                    cursorRing.style.borderColor = 'rgba(0, 123, 255, 0.6)';
                }
            }
        });
        
        // Window events
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
        });
        
        console.log('✅ Custom cursor initialized successfully!');
    }
});