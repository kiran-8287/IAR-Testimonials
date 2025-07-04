// Modern Slider Implementation - SAC Inspired
class ModernSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.totalSlides = this.slides.length;
        this.isTransitioning = false;
        this.autoSlideInterval = null;
        this.autoSlideDelay = 2000; // 2 seconds
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startAutoSlide();
        this.preloadImages();
        this.setupIntersectionObserver();
        // If indicators exist, ensure only the current is active
        if (this.indicators && this.indicators.length) {
            this.indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === this.currentSlide);
            });
        }
    }
    
    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch/swipe support
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        const sliderWrapper = document.querySelector('.slider-wrapper');
        if (!sliderWrapper) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        sliderWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        sliderWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX, startY, endY) {
        const swipeThreshold = 50;
        const swipeDistanceX = endX - startX;
        const swipeDistanceY = Math.abs(endY - startY);
        
        // Only handle horizontal swipes
        if (Math.abs(swipeDistanceX) > swipeThreshold && swipeDistanceY < 100) {
            if (swipeDistanceX > 0) {
                this.previousSlide();
            } else {
                this.nextSlide();
            }
        }
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ':
                if (e.target === document.body) {
                    e.preventDefault();
                    this.toggleAutoSlide();
                }
                break;
        }
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        this.isTransitioning = true;
        // Remove active classes
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');
        // Update current slide
        this.currentSlide = index;
        // Add active classes
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
        // Clean up transition classes after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 400); // match new animation duration
        this.resetAutoSlide();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideDelay);
    }
    
    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resumeAutoSlide() {
        if (!this.autoSlideInterval) {
            this.startAutoSlide();
        }
    }
    
    resetAutoSlide() {
        this.pauseAutoSlide();
        this.startAutoSlide();
    }
    
    toggleAutoSlide() {
        if (this.autoSlideInterval) {
            this.pauseAutoSlide();
        } else {
            this.startAutoSlide();
        }
    }
    
    preloadImages() {
        this.slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img && img.src) {
                const preloadImg = new Image();
                preloadImg.onload = () => {
                    img.setAttribute('data-loaded', 'true');
                };
                preloadImg.onerror = () => {
                    console.warn(`Failed to load slide image ${index + 1}:`, img.src);
                };
                preloadImg.src = img.src;
            }
        });
    }
    
    setupIntersectionObserver() {
        // Disabled observer so slider never pauses
    }
}

// Testimonials Animation Controller
class TestimonialsAnimator {
    constructor() {
        this.cards = document.querySelectorAll('.testimonial-card');
        this.init();
    }
    
    init() {
        this.setupScrollAnimation();
    }
    
    setupScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(card);
        });
    }
}

// Smooth Scroll Handler
class SmoothScrollHandler {
    constructor() {
        this.init();
    }
    
    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
    }
    
    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor loading performance
        window.addEventListener('load', () => {
            this.handlePageLoad();
        });
        
        // Monitor scroll performance
        this.setupScrollThrottling();
    }
    
    handlePageLoad() {
        document.body.classList.add('loaded');
        
        // Fade in page
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.6s ease';
        
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
        
        // Log performance metrics
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        }
    }
    
    setupScrollThrottling() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Handle scroll-based animations here if needed
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

// Global Functions for HTML onclick handlers
function changeSlide(direction) {
    if (window.modernSlider) {
        if (direction > 0) {
            window.modernSlider.nextSlide();
        } else {
            window.modernSlider.previousSlide();
        }
    }
}

function goToSlide(index) {
    if (window.modernSlider) {
        window.modernSlider.goToSlide(index);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    window.modernSlider = new ModernSlider();
    new TestimonialsAnimator();
    new SmoothScrollHandler();
    new PerformanceMonitor();
    
    // Add error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Failed to load image:', this.src);
            this.style.opacity = '0.5';
            this.style.filter = 'grayscale(100%)';
        });
    });
    
    // Add focus management for accessibility
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '3px solid #f1c40f';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
    
    // Patch: Ensure all slider images start with data-loaded="false" for fade-in effect
    document.querySelectorAll('.slide-image img').forEach(img => {
        if (!img.hasAttribute('data-loaded')) {
            img.setAttribute('data-loaded', 'false');
        }
    });
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        if (window.modernSlider) {
            // Reset slider state on resize
            window.modernSlider.slides[window.modernSlider.currentSlide].classList.add('active');
        }
    }, 250);
});

// Service Worker registration for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you want to add a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}