// FIXED: Mobile menu navigation - properly close menu when clicking links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        // Get the target section from href
        const href = link.getAttribute('href');
        
        // Close mobile menu if open
        if (window.innerWidth <= 768 && nav.classList.contains('active')) {
            closeMobileMenu();
            
            // Wait for menu to close before scrolling (if needed)
            setTimeout(() => {
                if (href && href !== '#') {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 300); // Match the CSS transition time
        } else if (window.innerWidth > 768 && href && href !== '#') {
            // For desktop, just scroll smoothly
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});
