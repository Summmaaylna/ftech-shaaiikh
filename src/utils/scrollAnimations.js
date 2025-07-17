/**
 * Enhanced Scroll Animation System
 * Fixes issues with navigation and re-triggering animations
 */

class ScrollAnimationObserver {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      once: false, // Changed to false to allow re-animation
      selector: '.scroll-animate',
      animatedClass: 'animated',
      debug: false,
      resetOnNavigation: true, // New option to reset animations on navigation
      ...options
    };

    this.observer = null;
    this.animatedElements = new Set();
    this.isInitialized = false;
    this.currentPath = window.location.pathname;

    // Bind methods
    this.handleIntersection = this.handleIntersection.bind(this);
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.refresh = this.refresh.bind(this);
    this.resetAnimations = this.resetAnimations.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
  }

  /**
   * Initialize the scroll animation observer
   */
  init() {
    if (this.isInitialized) {
      this.refresh();
      return;
    }

    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported. Animations will be disabled.');
      this.fallbackToImmediate();
      return;
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.fallbackToImmediate();
      return;
    }

    // Create intersection observer
    this.observer = new IntersectionObserver(this.handleIntersection, {
      threshold: this.options.threshold,
      rootMargin: this.options.rootMargin
    });

    // Set up navigation listener
    this.setupNavigationListener();

    // Observe all elements
    this.observeElements();
    this.isInitialized = true;

    if (this.options.debug) {
      console.log('ScrollAnimationObserver initialized', {
        elementsCount: document.querySelectorAll(this.options.selector).length,
        options: this.options
      });
    }
  }

  /**
   * Set up navigation change detection
   */
  setupNavigationListener() {
    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', this.handleNavigation);
    
    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      setTimeout(this.handleNavigation, 0);
    };
    
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      setTimeout(this.handleNavigation, 0);
    };

    // Also listen for hash changes
    window.addEventListener('hashchange', this.handleNavigation);
  }

  /**
   * Handle navigation changes
   */
  handleNavigation() {
    const newPath = window.location.pathname;
    
    if (newPath !== this.currentPath) {
      this.currentPath = newPath;
      
      if (this.options.resetOnNavigation) {
        // Small delay to ensure new content is rendered
        setTimeout(() => {
          this.resetAnimations();
          this.refresh();
        }, 100);
      }
      
      if (this.options.debug) {
        console.log('Navigation detected, resetting animations for:', newPath);
      }
    }
  }

  /**
   * Reset all animations
   */
  resetAnimations() {
    // Remove animated class from all elements
    const elements = document.querySelectorAll(this.options.selector);
    elements.forEach(element => {
      element.classList.remove(this.options.animatedClass);
    });
    
    // Clear the animated elements set
    this.animatedElements.clear();
    
    if (this.options.debug) {
      console.log('Animations reset');
    }
  }

  /**
   * Handle intersection observer callback
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      const element = entry.target;
      
      if (entry.isIntersecting && !this.animatedElements.has(element)) {
        this.animateElement(element);
        
        // Only add to animated set if once is true
        if (this.options.once) {
          this.observer.unobserve(element);
          this.animatedElements.add(element);
        }
      } else if (!entry.isIntersecting && !this.options.once) {
        // Remove animation when element leaves viewport (for re-animation)
        element.classList.remove(this.options.animatedClass);
        this.animatedElements.delete(element);
      }
    });
  }

  /**
   * Animate a single element
   */
  animateElement(element) {
    // Add animated class
    element.classList.add(this.options.animatedClass);
    this.animatedElements.add(element);
    
    // Dispatch custom event
    element.dispatchEvent(new CustomEvent('scroll-animate', {
      detail: {
        element,
        animation: element.dataset.animation || 'fade-in'
      }
    }));

    if (this.options.debug) {
      console.log('Animated element:', element, element.dataset.animation);
    }
  }

  /**
   * Observe all elements with the selector
   */
  observeElements() {
    const elements = document.querySelectorAll(this.options.selector);
    
    elements.forEach(element => {
      // Skip if already being observed
      if (this.animatedElements.has(element) && this.options.once) {
        return;
      }

      // Check if element is already in viewport (page refresh case)
      const rect = element.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      // Only auto-animate if element is significantly visible
      if (isInViewport && rect.top < window.innerHeight * 0.3) {
        this.animateElement(element);
      } else {
        // Element is not visible, observe it
        this.observer.observe(element);
      }
    });
  }

  /**
   * Fallback for browsers without IntersectionObserver or reduced motion
   */
  fallbackToImmediate() {
    const elements = document.querySelectorAll(this.options.selector);
    elements.forEach(element => {
      element.classList.add(this.options.animatedClass);
    });
    
    if (this.options.debug) {
      console.log('Using fallback animation (immediate)');
    }
  }

  /**
   * Refresh observer (useful for dynamic content)
   */
  refresh() {
    if (!this.isInitialized) {
      return;
    }

    // Disconnect current observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Re-observe elements
    this.observeElements();

    if (this.options.debug) {
      console.log('ScrollAnimationObserver refreshed');
    }
  }

  /**
   * Add new elements to observe
   */
  addElements(elements) {
    if (!this.observer) {
      return;
    }

    const elementsArray = Array.isArray(elements) ? elements : [elements];
    
    elementsArray.forEach(element => {
      if (element.matches && element.matches(this.options.selector)) {
        this.observer.observe(element);
      }
    });
  }

  /**
   * Remove elements from observation
   */
  removeElements(elements) {
    if (!this.observer) {
      return;
    }

    const elementsArray = Array.isArray(elements) ? elements : [elements];
    
    elementsArray.forEach(element => {
      this.observer.unobserve(element);
      this.animatedElements.delete(element);
    });
  }

  /**
   * Destroy the observer
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    // Remove event listeners
    window.removeEventListener('popstate', this.handleNavigation);
    window.removeEventListener('hashchange', this.handleNavigation);
    
    this.animatedElements.clear();
    this.isInitialized = false;

    if (this.options.debug) {
      console.log('ScrollAnimationObserver destroyed');
    }
  }

  /**
   * Get animation statistics
   */
  getStats() {
    const totalElements = document.querySelectorAll(this.options.selector).length;
    const animatedCount = this.animatedElements.size;
    
    return {
      total: totalElements,
      animated: animatedCount,
      pending: totalElements - animatedCount,
      isInitialized: this.isInitialized
    };
  }
}

// Auto-initialize when DOM is ready
let scrollAnimationObserver = null;

function initScrollAnimations(options = {}) {
  // Destroy existing observer if any
  if (scrollAnimationObserver) {
    scrollAnimationObserver.destroy();
  }

  // Create new observer with enhanced options
  const defaultOptions = {
    once: false, // Allow re-animation
    resetOnNavigation: true, // Reset animations on navigation
    debug: process.env.NODE_ENV === 'development'
  };

  scrollAnimationObserver = new ScrollAnimationObserver({
    ...defaultOptions,
    ...options
  });
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      scrollAnimationObserver.init();
    });
  } else {
    scrollAnimationObserver.init();
  }

  return scrollAnimationObserver;
}

// Export for use in other modules
export { ScrollAnimationObserver, initScrollAnimations };

// Global initialization with default options
if (typeof window !== 'undefined') {
  // Auto-initialize with enhanced options
  const defaultObserver = initScrollAnimations({
    debug: process.env.NODE_ENV === 'development',
    once: false, // Allow re-animation
    resetOnNavigation: true
  });

  // Make available globally for debugging
  window.scrollAnimationObserver = defaultObserver;

  // Refresh on window resize (for responsive changes)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      defaultObserver?.refresh();
    }, 250);
  });
}