// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileToggle = document.getElementById('mobileToggle');
const mainMenu = document.getElementById('mainMenu');
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const tradeinForm = document.getElementById('tradeinForm');
const tradeinResult = document.getElementById('tradeinResult');
const spinBtn = document.getElementById('spinBtn');
const prizeWheel = document.getElementById('prizeWheel');
const userPoints = document.getElementById('userPoints');
const spinCount = document.getElementById('spinCount');
const nextSpin = document.getElementById('nextSpin');
const redeemButtons = document.querySelectorAll('.btn-redeem');
const couponsList = document.getElementById('couponsList');
const resultModal = document.getElementById('resultModal');
const modalClose = document.getElementById('modalClose');
const copyCoupon = document.getElementById('copyCoupon');
const dropdowns = document.querySelectorAll('.dropdown');

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);

    // Show theme change notification
    showNotification(`Switched to ${newTheme} mode`, 'info');
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile Navigation
function initMobileMenu() {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mainMenu.classList.toggle('active');
        document.body.style.overflow = mainMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mainMenu.classList.contains('active') &&
            !e.target.closest('.main-menu') &&
            !e.target.closest('.mobile-toggle')) {
            mobileToggle.classList.remove('active');
            mainMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Dropdown handling for mobile
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
}

// Search Functionality
function initSearch() {
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        searchOverlay.querySelector('.search-input').focus();
    });

    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Search input handling
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        if (query.length > 2) {
            // In a real app, you would make an API call here
            console.log('Searching for:', query);
        }
    }, 300));
}

// Product Filtering
function initProductFilter() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter products
            const category = btn.dataset.category;
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Trade-In Calculator
function initTradeInCalculator() {
    if (!tradeinForm) return;

    // Load saved trade-in data
    loadTradeInData();

    tradeinForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = document.getElementById('applianceType').value;
        const age = parseInt(document.getElementById('applianceAge').value);
        const condition = document.getElementById('condition').value;
        const brand = document.getElementById('brand').value;

        if (!type || !age || !condition || !brand) {
            showTradeInResult('Please fill all fields', 'error');
            return;
        }

        // Calculate value
        const result = calculateTradeInValue(type, age, condition, brand);

        // Save to local storage
        saveTradeInData({ type, age, condition, brand, value: result.total });

        // Display result
        showTradeInResult(`
            <div class="result-success">
                <div class="result-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Estimated Trade-In Value</h3>
                <div class="result-value">₹${result.total.toLocaleString()}</div>
                <div class="result-breakdown">
                    <p>Base Value: ₹${result.base.toLocaleString()}</p>
                    <p>Age Adjustment: ${result.ageAdjustment > 0 ? '+' : ''}${result.ageAdjustment}%</p>
                    <p>Condition Factor: ${result.conditionFactor}x</p>
                    ${brand === 'videcon' ? '<p class="legacy-bonus">Legacy Bonus: +10%</p>' : ''}
                    <p class="result-total">Total: ₹${result.total.toLocaleString()}</p>
                </div>
                <button class="btn btn-primary" onclick="scheduleTradeIn()">
                    Schedule Pickup <i class="fas fa-calendar-alt"></i>
                </button>
            </div>
        `, 'success');
    });
}

function calculateTradeInValue(type, age, condition, brand) {
    // Base values by type
    const baseValues = {
        tv: 2000,
        fridge: 3000,
        washer: 2500,
        ac: 3500
    };

    let base = baseValues[type] || 2000;

    // Age adjustment (up to 50% reduction for old appliances)
    const ageAdjustment = Math.max(-50, -((age - 1) * 5));

    // Condition factors
    const conditionFactors = {
        working: 1.0,
        needs_repair: 0.5,
        not_working: 0.2
    };

    const conditionFactor = conditionFactors[condition] || 0.5;

    // Calculate total
    let total = base * (1 + ageAdjustment / 100) * conditionFactor;

    // Add legacy bonus for Videcon appliances
    if (brand === 'videcon') {
        total *= 1.1; // 10% bonus
    }

    // Round to nearest 100
    total = Math.round(total / 100) * 100;

    return {
        base,
        ageAdjustment,
        conditionFactor,
        total
    };
}

function showTradeInResult(content, type) {
    tradeinResult.innerHTML = content;
    tradeinResult.classList.add('result-show');

    // Add animation
    setTimeout(() => {
        tradeinResult.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            tradeinResult.style.animation = '';
        }, 500);
    }, 10);
}

function saveTradeInData(data) {
    const history = JSON.parse(localStorage.getItem('tradeinHistory') || '[]');
    history.push({
        ...data,
        date: new Date().toISOString()
    });
    localStorage.setItem('tradeinHistory', JSON.stringify(history));
}

function loadTradeInData() {
    const history = JSON.parse(localStorage.getItem('tradeinHistory') || '[]');
    if (history.length > 0) {
        // Populate last used values
        const last = history[history.length - 1];
        document.getElementById('applianceType').value = last.type;
        document.getElementById('applianceAge').value = last.age;
        document.getElementById('condition').value = last.condition;
        document.getElementById('brand').value = last.brand;
    }
}

function scheduleTradeIn() {
    showNotification('Trade-in pickup scheduling would be integrated here!', 'info');
}

// Fun Zone - Spin the Wheel
function initFunZone() {
    // Load user data
    loadUserData();

    // Initialize wheel sections
    initWheelSections();

    // Spin button
    spinBtn.addEventListener('click', spinWheel);

    // Redeem buttons
    redeemButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const reward = e.target.closest('.btn-redeem').dataset.reward;
            redeemReward(reward);
        });
    });

    // Modal close
    modalClose.addEventListener('click', () => {
        resultModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Copy coupon
    if (copyCoupon) {
        copyCoupon.addEventListener('click', copyCouponCode);
    }

    // Update spin count timer
    updateSpinTimer();
}

function initWheelSections() {
    const sections = prizeWheel.querySelectorAll('.wheel-section');
    sections.forEach((section, i) => {
        section.style.setProperty('--i', i);
    });
}

function spinWheel() {
    if (prizeWheel.style.transform || isSpinning) return;

    // Check if user has spins left
    const spinsLeft = parseInt(spinCount.textContent.split('/')[0]);
    if (spinsLeft <= 0) {
        showNotification('No spins left today. Come back tomorrow!', 'warning');
        return;
    }

    // Disable spin button
    spinBtn.disabled = true;
    isSpinning = true;

    // Update spin count
    updateSpinCount(-1);

    // Generate random spin
    const spins = 5 + Math.random() * 3; // 5-8 full spins
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalDegrees = spins * 360 + extraDegrees;

    // Animate wheel
    prizeWheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
    prizeWheel.style.transform = `rotate(${totalDegrees}deg)`;

    // Determine winning prize
    setTimeout(() => {
        const normalizedDegrees = totalDegrees % 360;
        const sectionAngle = 45; // 8 sections = 45° each
        const winningIndex = Math.floor(normalizedDegrees / sectionAngle);

        const sections = prizeWheel.querySelectorAll('.wheel-section');
        const winningSection = sections[winningIndex];
        const prize = winningSection.dataset.value;

        // Award prize
        awardPrize(prize);

        // Enable spin button
        setTimeout(() => {
            spinBtn.disabled = false;
            isSpinning = false;

            // Reset wheel after delay
            setTimeout(() => {
                prizeWheel.style.transition = 'none';
                prizeWheel.style.transform = 'rotate(0deg)';
            }, 1000);
        }, 1000);
    }, 4000);
}

function awardPrize(prize) {
    let points = parseInt(localStorage.getItem('userPoints')) || 0;
    let message = '';
    let couponCode = '';

    switch (prize) {
        case '10%':
            couponCode = generateCouponCode('10%');
            message = '10% Off Coupon';
            break;
        case '15%':
            couponCode = generateCouponCode('15%');
            message = '15% Off Coupon';
            break;
        case '5%':
            couponCode = generateCouponCode('5%');
            message = '5% Off Coupon';
            break;
        case 'free':
            couponCode = generateCouponCode('FREE');
            message = 'Free Gift Voucher';
            break;
        case 'spin':
            updateSpinCount(1); // Add back the spin
            message = 'Free Spin!';
            break;
        default:
            // Points prize
            const pointsWon = parseInt(prize);
            points += pointsWon;
            localStorage.setItem('userPoints', points);
            updatePointsDisplay();
            message = `${pointsWon} Points`;
    }

    // Save coupon if won
    if (couponCode) {
        saveCoupon(couponCode, message);
        showPrizeModal(message, couponCode);
    } else {
        showNotification(`Congratulations! You won ${message}`, 'success');
    }
}

function generateCouponCode(type) {
    const prefix = type.includes('%') ? 'VIDECON' : 'VFREE';
    const random = Math.random().toString(36).substr(2, 8).toUpperCase();
    return `${prefix}${random}`;
}

function saveCoupon(code, type) {
    const coupons = JSON.parse(localStorage.getItem('userCoupons') || '[]');
    coupons.push({
        code,
        type,
        date: new Date().toISOString(),
        used: false
    });
    localStorage.setItem('userCoupons', JSON.stringify(coupons));
    updateCouponsList();
}

function updateCouponsList() {
    const coupons = JSON.parse(localStorage.getItem('userCoupons') || '[]');
    const activeCoupons = coupons.filter(c => !c.used);

    if (activeCoupons.length === 0) {
        couponsList.innerHTML = `
            <div class="coupon-placeholder">
                <i class="fas fa-ticket-alt"></i>
                <p>Win coupons by spinning the wheel!</p>
            </div>
        `;
        return;
    }

    couponsList.innerHTML = activeCoupons.map(coupon => `
        <div class="coupon-item">
            <div class="coupon-code">${coupon.code}</div>
            <div class="coupon-type">${coupon.type}</div>
            <button class="btn-copy" data-code="${coupon.code}">
                <i class="fas fa-copy"></i>
            </button>
        </div>
    `).join('');

    // Add copy functionality
    couponsList.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const code = e.target.closest('.btn-copy').dataset.code;
            navigator.clipboard.writeText(code).then(() => {
                showNotification('Coupon code copied!', 'success');
            });
        });
    });
}

function showPrizeModal(prize, code) {
    document.getElementById('wonPrize').textContent = prize;
    document.getElementById('couponCode').textContent = code;
    resultModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function copyCouponCode() {
    const code = document.getElementById('couponCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Coupon code copied to clipboard!', 'success');
    });
}

function redeemReward(reward) {
    let points = parseInt(localStorage.getItem('userPoints')) || 0;
    const rewardCosts = {
        '10%': 500,
        'install': 300,
        'warranty': 1000
    };

    const cost = rewardCosts[reward];

    if (!cost) {
        showNotification('Invalid reward', 'error');
        return;
    }

    if (points >= cost) {
        points -= cost;
        localStorage.setItem('userPoints', points);
        updatePointsDisplay();

        // Generate coupon for redeemed reward
        const couponCode = generateCouponCode(reward);
        saveCoupon(couponCode, reward === '10%' ? '10% Off' :
            reward === 'install' ? 'Free Installation' : 'Extended Warranty');

        showNotification('Reward redeemed successfully! Check your coupons.', 'success');
    } else {
        showNotification(`Need ${cost - points} more points`, 'warning');
    }
}

function loadUserData() {
    // Load points
    const points = parseInt(localStorage.getItem('userPoints')) || 0;
    updatePointsDisplay();

    // Load spin count
    const lastSpin = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();

    if (lastSpin !== today) {
        // Reset spins for new day
        localStorage.setItem('spinCount', 3);
        localStorage.setItem('lastSpinDate', today);
        updateSpinCount(0);
    } else {
        const spins = parseInt(localStorage.getItem('spinCount')) || 3;
        updateSpinCount(0, spins);
    }

    // Load coupons
    updateCouponsList();
}

function updatePointsDisplay() {
    const points = parseInt(localStorage.getItem('userPoints')) || 0;
    if (userPoints) {
        userPoints.textContent = points.toLocaleString();
    }
}

function updateSpinCount(change, specificValue = null) {
    let spins = specificValue !== null ? specificValue : parseInt(localStorage.getItem('spinCount')) || 3;

    if (change !== 0) {
        spins = Math.max(0, spins + change);
        localStorage.setItem('spinCount', spins);
    }

    if (spinCount) {
        spinCount.textContent = `${spins}/3`;
    }

    // Update spin button state
    if (spinBtn) {
        spinBtn.disabled = spins <= 0;
    }
}

function updateSpinTimer() {
    // Calculate time until next day
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (nextSpin) {
        nextSpin.textContent = `${hours}h ${minutes}m`;
    }

    // Update every minute
    setTimeout(updateSpinTimer, 60000);
}

// Utility Functions
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

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' :
            type === 'error' ? 'exclamation-circle' :
                type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto-remove after 5 seconds
    const autoRemove = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Add notification styles
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            box-shadow: var(--shadow-lg);
            z-index: 4000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--spacing-md);
            max-width: 400px;
            min-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid var(--success);
        }
        
        .notification-error {
            border-left: 4px solid var(--error);
        }
        
        .notification-warning {
            border-left: 4px solid var(--warning);
        }
        
        .notification-info {
            border-left: 4px solid var(--info);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            flex: 1;
        }
        
        .notification-content i {
            color: var(--success);
        }
        
        .notification-error .notification-content i {
            color: var(--error);
        }
        
        .notification-warning .notification-content i {
            color: var(--warning);
        }
        
        .notification-info .notification-content i {
            color: var(--info);
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-tertiary);
            cursor: pointer;
            padding: 0.25rem;
        }
        
        .notification-close:hover {
            color: var(--text-primary);
        }
        
        .coupon-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--spacing-sm);
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            margin-bottom: var(--spacing-sm);
        }
        
        .coupon-code {
            font-family: monospace;
            font-weight: 600;
            color: var(--primary);
        }
        
        .coupon-type {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        
        .btn-copy {
            padding: 0.5rem;
            background: var(--bg-tertiary);
            border: none;
            border-radius: var(--radius-sm);
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-copy:hover {
            background: var(--primary);
            color: white;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mainMenu.classList.contains('active')) {
                    mobileToggle.classList.remove('active');
                    mainMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize Everything
function init() {
    // Theme
    initTheme();
    themeToggle.addEventListener('click', toggleTheme);

    // Navigation
    initMobileMenu();

    // Search
    initSearch();

    // Product filtering
    initProductFilter();

    // Trade-in calculator
    initTradeInCalculator();

    // Fun Zone
    initFunZone();

    // Smooth scrolling
    initSmoothScroll();

    // Add notification styles
    addNotificationStyles();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close modals and overlays
            if (searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (resultModal.classList.contains('active')) {
                resultModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (mainMenu.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                mainMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // Ctrl+K for search
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            searchOverlay.querySelector('.search-input').focus();
        }
    });
}

// Global variables
let isSpinning = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);