lucide.createIcons();

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const nav = document.getElementById('nav');
const body = document.body;

function toggleMobileMenu() {
    nav.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');

    const icon = mobileMenuBtn.querySelector('i');
    if (nav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        body.style.overflow = 'hidden';
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        body.style.overflow = '';
    }
}

function closeMobileMenu() {
    nav.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
    body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
mobileMenuOverlay.addEventListener('click', closeMobileMenu);

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

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMobileMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('active')) {
        closeMobileMenu();
    }
    // Reinitialize the indicator on resize
    setTimeout(initNavIndicator, 100);
});

const navIndicator = document.getElementById('navIndicator');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavIndicator() {
    if (window.innerWidth <= 768) return;

    const headerHeight = document.querySelector('.header').offsetHeight;
    let currentSection = 'home';
    let maxVisibleArea = 0;

    // Check each section
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionBottom = sectionTop + section.offsetHeight;
        const viewportTop = window.scrollY;
        const viewportBottom = window.scrollY + window.innerHeight;

        // Calculate visible area
        const visibleTop = Math.max(sectionTop, viewportTop);
        const visibleBottom = Math.min(sectionBottom, viewportBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleHeight > 0) {
            const visiblePercentage = visibleHeight / section.offsetHeight;
            
            // Update if this section is more visible
            if (visiblePercentage > maxVisibleArea) {
                maxVisibleArea = visiblePercentage;
                currentSection = section.getAttribute('id');
            }
        }
    });

    // Update active link and indicator position
    const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
    
    if (activeLink) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        // Add active class to current link
        activeLink.classList.add('active');
        
        // Update indicator position
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = document.querySelector('.nav').getBoundingClientRect();
        
        navIndicator.style.width = `${linkRect.width}px`;
        navIndicator.style.left = `${linkRect.left - navRect.left}px`;
        navIndicator.style.opacity = '1';
        navIndicator.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
}

function initNavIndicator() {
    if (window.innerWidth <= 768) return;

    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = document.querySelector('.nav').getBoundingClientRect();

        navIndicator.style.width = `${linkRect.width}px`;
        navIndicator.style.left = `${linkRect.left - navRect.left}px`;
        navIndicator.style.opacity = '1';
    }
}

document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');

    const toggleIcon = document.createElement('div');
    toggleIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="faq-toggle">
                <path d="m6 9 6 6 6-6"/>
            </svg>`;
    question.appendChild(toggleIcon);

    question.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

const siteByTrigger = document.getElementById('siteByPopupTrigger');
const siteInfoPopup = document.getElementById('siteInfoPopup');
const popupClose = document.getElementById('popupClose');

siteByTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.style.overflow = 'hidden';
    siteInfoPopup.classList.add('active');
});

function closePopup() {
    siteInfoPopup.classList.remove('active');
    document.body.style.overflow = '';
}

popupClose.addEventListener('click', closePopup);

siteInfoPopup.addEventListener('click', (e) => {
    if (e.target === siteInfoPopup) {
        closePopup();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteInfoPopup.classList.contains('active')) {
        closePopup();
    }
});

function startCounterAnimation(element) {
    if (element.classList.contains('animated')) return;

    const target = parseFloat(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let current = 0;
    const increment = target / steps;

    // Reset to 0 first
    element.textContent = '0' + suffix;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        let displayValue;
        if (target >= 1000000) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (target >= 1000) {
            displayValue = (current / 1000).toFixed(1) + 'K';
        } else {
            displayValue = Math.round(current);
        }

        element.textContent = displayValue + suffix;
    }, stepDuration);

    element.classList.add('animated');
}

function animateStats() {
    const statItems = document.querySelectorAll('.stat-item h3');

    statItems.forEach((stat) => {
        const rect = stat.getBoundingClientRect();
        const isInViewport = rect.top <= window.innerHeight * 0.9 && rect.bottom >= 0;

        if (isInViewport && !stat.classList.contains('animated')) {
            startCounterAnimation(stat);
        }
    });
}

function resetCounters() {
    document.querySelectorAll('.stat-item h3').forEach(stat => {
        stat.classList.remove('animated');
        stat.textContent = '0' + (stat.getAttribute('data-suffix') || '');
    });
}

setTimeout(() => {
    resetCounters();

    setTimeout(() => {
        animateStats();
    }, 100);
}, 2100);

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

let scrollTimeout;
let isScrolling = false;

window.addEventListener('scroll', () => {
    // Update navigation indicator smoothly
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
            updateNavIndicator();
            isScrolling = false;
        });
    }
    
    // Animate stats
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        animateStats();
    }, 50);
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(() => {
            animateStats();
        }, 100);
    }
});

document.querySelectorAll('.contact-card-link').forEach(link => {
    link.addEventListener('mouseenter', function () {
        const arrowIcon = this.parentElement.querySelector('.arrow-icon');
        if (arrowIcon) {
            arrowIcon.style.transform = 'translate(2px, -2px)';
        }
    });

    link.addEventListener('mouseleave', function () {
        const arrowIcon = this.parentElement.querySelector('.arrow-icon');
        if (arrowIcon) {
            arrowIcon.style.transform = 'translate(0, 0)';
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initNavIndicator();
    
    // Initial stats animation after loading
    setTimeout(() => {
        animateStats();
    }, 500);
});

// Initial animation after page loads
setTimeout(() => {
    setTimeout(() => {
        animateStats();
    }, 300);
}, 2100);
