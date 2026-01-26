 // Initialize Lucide Icons
        lucide.createIcons();

        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const nav = document.getElementById('nav');

        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            });
        });

        // Enhanced smooth scrolling for anchor links with proper header offset
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navigation indicator animation
        const navIndicator = document.getElementById('navIndicator');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        // Function to update navigation indicator
        function updateNavIndicator() {
            if (window.innerWidth <= 768) return; // Don't show on mobile

            const headerHeight = document.querySelector('.header').offsetHeight;
            let currentSection = 'home';

            // Find current section
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 50;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    currentSection = section.getAttribute('id');
                }
            });

            // Find the active link
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);

            if (activeLink) {
                // Update active classes
                navLinks.forEach(link => link.classList.remove('active'));
                activeLink.classList.add('active');

                // Update indicator position
                const linkRect = activeLink.getBoundingClientRect();
                const navRect = document.querySelector('.nav').getBoundingClientRect();

                navIndicator.style.width = `${linkRect.width}px`;
                navIndicator.style.left = `${linkRect.left - navRect.left}px`;
                navIndicator.style.opacity = '1';
            }
        }

        // Initialize indicator position
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

        // Add active class to nav links on scroll with proper offset
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            const headerHeight = document.querySelector('.header').offsetHeight;

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                // Add buffer for better scrolling detection
                if (scrollY >= (sectionTop - headerHeight - 50)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });

            // Update indicator
            updateNavIndicator();
        });

        // Enhanced number counting animation for stats with proper ascending values
        function animateStats() {
            const statNumbers = document.querySelectorAll('.stat-item h3');
            const finalValues = [2000, 550, 20, 1000000];
            const startValues = [100, 50, 1, 100000];
            const suffixes = ['+', '+', '+', '+'];

            statNumbers.forEach((stat, index) => {
                const rect = stat.getBoundingClientRect();
                const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

                if (isVisible && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');

                    // Set initial value to prevent layout shift
                    stat.textContent = '0';

                    let currentValue = startValues[index];
                    const endValue = finalValues[index];
                    const duration = 1200;
                    const increment = Math.ceil((endValue - currentValue) / 40);
                    const suffix = suffixes[index];

                    function formatNumber(num) {
                        if (num >= 1000000) {
                            return (num / 1000000).toFixed(1) + 'M' + suffix;
                        } else if (num >= 100000) {
                            return (num / 1000).toFixed(0) + 'K' + suffix;
                        } else if (num >= 1000) {
                            return (num / 1000).toFixed(1) + 'K' + suffix;
                        } else {
                            return num + suffix;
                        }
                    }

                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= endValue) {
                            currentValue = endValue;
                            clearInterval(timer);
                            stat.textContent = formatNumber(endValue);
                        } else {
                            stat.textContent = formatNumber(currentValue);
                        }
                    }, duration / 40);
                }
            });
        }

        // Initialize everything
        window.addEventListener('load', () => {
            lucide.createIcons();
            animateStats();
            initNavIndicator();

            // Add resize listener for indicator
            window.addEventListener('resize', initNavIndicator);
        });

        window.addEventListener('scroll', animateStats);

        // Trigger animation on page load for stats in view
        setTimeout(animateStats, 300);
