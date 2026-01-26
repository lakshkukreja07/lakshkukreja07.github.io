// Common JavaScript for Videcon website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initThemeToggle();
    initMobileMenu();
    initSmoothScrolling();
    initBackToTop();
    initModal();
    initAnimations();
    initFloatingCards();

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleSmall = document.getElementById('theme-toggle-small');
    const themeIcon = document.getElementById('theme-icon');

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('videcon-theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        themeIcon.innerHTML = '<use href="#moon-icon"></use>';
    }

    // Toggle theme function
    function toggleTheme() {
        const isDarkMode = document.documentElement.classList.toggle('dark-mode');

        // Update icon
        if (isDarkMode) {
            themeIcon.innerHTML = '<use href="#moon-icon"></use>';
            localStorage.setItem('videcon-theme', 'dark');
        } else {
            themeIcon.innerHTML = '<use href="#sun-icon"></use>';
            localStorage.setItem('videcon-theme', 'light');
        }
    }

    // Add event listeners
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (themeToggleSmall) themeToggleSmall.addEventListener('click', toggleTheme);
}

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('show');

            // Update menu icon
            const icon = menuToggle.querySelector('.icon use');
            if (mobileMenu.classList.contains('show')) {
                icon.setAttribute('href', '#x-icon');
            } else {
                icon.setAttribute('href', '#menu-icon');
            }
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('show');
                const icon = menuToggle.querySelector('.icon use');
                icon.setAttribute('href', '#menu-icon');
            });
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') return;

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

// Back to top button
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });

        // Scroll to top when clicked
        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Modal functionality
function initModal() {
    const videoBtn = document.getElementById('video-btn');
    const videoModal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');
    const exploreBtn = document.getElementById('explore-btn');
    const contactBtn = document.getElementById('contact-btn');

    // Open modal when video button is clicked
    if (videoBtn && videoModal) {
        videoBtn.addEventListener('click', function () {
            videoModal.classList.add('show');
        });
    }

    // Close modal when close button is clicked
    if (modalClose && videoModal) {
        modalClose.addEventListener('click', function () {
            videoModal.classList.remove('show');
        });
    }

    // Close modal when clicking outside the modal content
    if (videoModal) {
        videoModal.addEventListener('click', function (e) {
            if (e.target === videoModal) {
                videoModal.classList.remove('show');
            }
        });
    }

    // Explore button scrolls to products section
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

    // Contact button scrolls to footer
    if (contactBtn) {
        contactBtn.addEventListener('click', function () {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize animations
function initAnimations() {
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
    const elementsToAnimate = document.querySelectorAll('.product-card, .feature-item, .timeline-item');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Initialize floating cards animation
function initFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');

    cards.forEach(card => {
        // Randomize animation delay and duration slightly
        const randomDelay = Math.random() * 2;
        const randomDuration = 5 + Math.random() * 3;

        card.style.animationDelay = `${randomDelay}s`;
        card.style.animationDuration = `${randomDuration}s`;
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .product-card, .feature-item, .timeline-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .product-card.animate-in, 
    .feature-item.animate-in, 
    .timeline-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .timeline-item:nth-child(1) { transition-delay: 0.1s; }
    .timeline-item:nth-child(2) { transition-delay: 0.3s; }
    .timeline-item:nth-child(3) { transition-delay: 0.5s; }
    
    .feature-item:nth-child(1) { transition-delay: 0.1s; }
    .feature-item:nth-child(2) { transition-delay: 0.2s; }
    .feature-item:nth-child(3) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);
