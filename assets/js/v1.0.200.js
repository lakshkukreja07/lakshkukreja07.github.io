// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    lucide.createIcons();

    // Initialize all components
    initThemeToggle();
    initNavbarScroll();
    initSmoothScrolling();
    initBackToTop();
    initModal();
    initScrollAnimations();
    initCounters();
    initNewsletterForm();

    console.log('Videcon Website v1.0.200 (beta channel) loaded successfully');
});

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('videcon-theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        updateThemeIcon(true);
    }

    // Toggle theme function
    function toggleTheme() {
        // Disable transitions
        document.documentElement.style.transition = 'none';

        const isDarkMode = document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('videcon-theme', isDarkMode ? 'dark' : 'light');
        updateThemeIcon(isDarkMode);

        // Re-enable transitions after a short delay
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 10);
    }

    // Update theme icon
    function updateThemeIcon(isDarkMode) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            if (isDarkMode) {
                themeIcon.setAttribute('data-lucide', 'moon');
            } else {
                themeIcon.setAttribute('data-lucide', 'sun');
            }
            lucide.createIcons();
        }
    }

    // Add event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Navbar scroll functionality
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll down - hide navbar
            navbar.classList.add('hidden');
        } else {
            // Scroll up - show navbar
            navbar.classList.remove('hidden');
        }

        lastScrollTop = scrollTop;
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
                backToTopBtn.style.transform = 'translateY(0)';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
                backToTopBtn.style.transform = 'translateY(10px)';
            }
        });

        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Modal functionality
function initModal() {
    const watchStoryBtn = document.getElementById('watch-story');
    const exploreBtn = document.getElementById('explore-btn');
    const videoModal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');

    // Open modal
    if (watchStoryBtn) {
        watchStoryBtn.addEventListener('click', function () {
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Explore button scrolls to products
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function () {
            const productsSection = document.getElementById('products');
            if (productsSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = productsSection.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Close modal
    function closeModal() {
        if (videoModal) {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (videoModal) {
        videoModal.addEventListener('click', function (e) {
            if (e.target === videoModal || e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements to animate
    const elementsToAnimate = document.querySelectorAll(
        '.product-card, .innovation-card, .sustainability-stat, .value-card, .timeline-item'
    );

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .product-card,
        .innovation-card,
        .sustainability-stat,
        .value-card,
        .timeline-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .product-card.animate-in,
        .innovation-card.animate-in,
        .sustainability-stat.animate-in,
        .value-card.animate-in,
        .timeline-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .product-card:nth-child(1) { transition-delay: 0.1s; }
        .product-card:nth-child(2) { transition-delay: 0.2s; }
        .product-card:nth-child(3) { transition-delay: 0.3s; }
        
        .innovation-card:nth-child(1) { transition-delay: 0.1s; }
        .innovation-card:nth-child(2) { transition-delay: 0.2s; }
        .innovation-card:nth-child(3) { transition-delay: 0.3s; }
        .innovation-card:nth-child(4) { transition-delay: 0.4s; }
        
        .timeline-item:nth-child(1) { transition-delay: 0.1s; }
        .timeline-item:nth-child(2) { transition-delay: 0.3s; }
        .timeline-item:nth-child(3) { transition-delay: 0.5s; }
        
        .value-card:nth-child(1) { transition-delay: 0.1s; }
        .value-card:nth-child(2) { transition-delay: 0.2s; }
        .value-card:nth-child(3) { transition-delay: 0.3s; }
        .value-card:nth-child(4) { transition-delay: 0.4s; }
    `;
    document.head.appendChild(style);
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-value[data-count]');

    if (!counters.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const current = parseInt(counter.textContent);

                if (current === target) return;

                const duration = 2000;
                const step = target / (duration / 16);
                let currentValue = current;

                const updateCounter = () => {
                    currentValue += step;
                    if (currentValue < target) {
                        counter.textContent = Math.floor(currentValue);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Newsletter form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = this.querySelector('.form-input');
            const email = emailInput.value;

            if (validateEmail(email)) {
                // Simulate form submission
                emailInput.value = '';

                // Show success message
                showNotification('Successfully subscribed to our newsletter!', 'success');
            } else {
                // Show error message
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Notification function
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 16px 20px;
                border-radius: var(--radius-squircle);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                max-width: 400px;
                animation: slideIn 0.3s ease-out;
                box-shadow: var(--shadow-lg);
                background-color: var(--color-bg);
                border: 1px solid var(--color-border);
            }
            
            .notification-success {
                border-left: 4px solid var(--color-secondary);
            }
            
            .notification-error {
                border-left: 4px solid #ea4335;
            }
            
            .notification i {
                width: 20px;
                height: 20px;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Add to DOM
        document.body.appendChild(notification);

        // Initialize Lucide icons in notification
        lucide.createIcons();

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';

            // Add slideOut animation
            const slideOutStyle = document.createElement('style');
            slideOutStyle.textContent = `
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(slideOutStyle);

            // Remove from DOM after animation
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}