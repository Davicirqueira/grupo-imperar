/**
 * Scroll Animation Controller
 * Manages scroll-triggered animations using Intersection Observer API.
 * 
 * Features:
 * - Observes elements with [data-animate] attribute
 * - Triggers one-time fade-in/slide-up animations on viewport entry
 * - Supports staggered delays via data-animate-delay attribute
 * - Graceful degradation for unsupported browsers
 * - Respects prefers-reduced-motion user preference
 * 
 * @see Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 20.8, 20.9
 */

class ScrollAnimationController {
  /**
   * @param {Object} options - Configuration options
   * @param {number} options.threshold - Intersection threshold (0-1)
   * @param {string} options.rootMargin - Observer root margin
   * @param {string} options.animationClass - Class to add when element is visible
   */
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px',
      animationClass: 'is-visible',
      ...options
    };

    this.observer = null;
    this.elements = [];
  }

  /**
   * Initialize the animation controller.
   * Checks for browser support and user preferences before setting up observer.
   */
  init() {
    // Check prefers-reduced-motion preference (Requirement 20.9)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.showAllElements();
      return;
    }

    // Check for IntersectionObserver support (Requirement 20.8)
    if (!('IntersectionObserver' in window)) {
      this.showAllElements();
      return;
    }

    this.setupObserver();
    this.observeElements();
  }

  /**
   * Create the IntersectionObserver instance.
   * Uses threshold 0.1 and rootMargin "-50px 0px -50px 0px" per spec.
   * (Requirements 9.7, 9.8)
   */
  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.triggerAnimation(entry.target);
          // Unobserve after triggering - one-time animation (Requirement 9.3)
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: this.options.threshold,
      rootMargin: this.options.rootMargin
    });
  }

  /**
   * Query and observe all elements with [data-animate] attribute.
   * (Requirement 9.1)
   */
  observeElements() {
    this.elements = document.querySelectorAll('[data-animate]');

    this.elements.forEach((el) => {
      this.observer.observe(el);
    });
  }

  /**
   * Trigger animation on an element.
   * Respects data-animate-delay for staggered animations.
   * (Requirements 9.2, 9.6)
   * 
   * @param {HTMLElement} element - The element to animate
   */
  triggerAnimation(element) {
    const delay = element.getAttribute('data-animate-delay');

    if (delay) {
      // Apply delay via inline transition-delay style
      element.style.transitionDelay = `${delay}ms`;
    }

    // Add visible class to trigger CSS transition (Requirement 9.2)
    element.classList.add(this.options.animationClass);
  }

  /**
   * Show all animated elements immediately without animation.
   * Used as fallback when IntersectionObserver is not supported
   * or when user prefers reduced motion.
   * (Requirements 20.8, 20.9)
   */
  showAllElements() {
    document.querySelectorAll('[data-animate]').forEach((el) => {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add(this.options.animationClass);
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

function initAnimations() {
  const controller = new ScrollAnimationController();
  controller.init();
}
