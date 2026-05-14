/**
 * Scroll Animation Controller
 * Gerencia animações baseadas em scroll usando Intersection Observer
 */

class ScrollAnimationController {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      animationClass: 'is-visible',
      ...options
    };
    
    this.observer = null;
    this.elements = [];
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  init() {
    if (this.prefersReducedMotion) {
      this.showAllElements();
      return;
    }

    if (!('IntersectionObserver' in window)) {
      this.showAllElements();
      return;
    }

    this.setupObserver();
    this.observeElements();
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: this.options.threshold,
      rootMargin: this.options.rootMargin
    });
  }

  observeElements() {
    this.elements = document.querySelectorAll('[data-animate]');
    
    this.elements.forEach((el, index) => {
      const delay = el.dataset.animateDelay || (index % 3) * 100;
      el.style.transitionDelay = `${delay}ms`;
      
      this.observer.observe(el);
    });
  }

  animateElement(element) {
    element.classList.add(this.options.animationClass);
  }

  showAllElements() {
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add(this.options.animationClass);
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

function initAnimations() {
  const controller = new ScrollAnimationController();
  controller.init();
}
