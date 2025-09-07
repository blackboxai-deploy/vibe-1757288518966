// SECURITY: Consider using DOMPurify for sanitization
// import DOMPurify from 'dompurify';

/**
 * UI Utilities for BaddBeatz Website
 * Enhanced user experience components and interactions
 */

(function() {
  'use strict';

  // Safe sanitize helper (graceful fallback if DOMPurify is not available)
  const sanitize = (html) => (window.DOMPurify ? window.DOMPurify.sanitize(html) : html);

  // Global UI utilities object
  window.UIUtils = {
    // Notification system
    notifications: {
      container: null,
      
      init() {
        if (!this.container) {
          this.container = document.createElement('div');
          this.container.id = 'notification-container';
          this.container.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 1000;
            pointer-events: none;
          `;
          document.body.appendChild(this.container);
        }
      },
      
      show(message, type = 'info', duration = 5000) {
        this.init();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.pointerEvents = 'auto';
        
        const icon = this.getIcon(type);
        notification.innerHTML = sanitize(`
          <span class="notification-icon">${icon}</span>
          <span class="notification-message">${message}</span>
          <button class="notification-close" aria-label="Close notification">&times;</button>
        `);
        
        this.container.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
          notification.classList.add('show');
        });
        
        // Auto remove
        const autoRemove = setTimeout(() => {
          this.remove(notification);
        }, duration);
        
        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
          clearTimeout(autoRemove);
          this.remove(notification);
        });
        
        return notification;
      },
      
      remove(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      },
      
      getIcon(type) {
        const icons = {
          success: '✅',
          error: '❌',
          warning: '⚠️',
          info: 'ℹ️'
        };
        return icons[type] || icons.info;
      },
      
      success(message, duration) {
        return this.show(message, 'success', duration);
      },
      
      error(message, duration) {
        return this.show(message, 'error', duration);
      },
      
      warning(message, duration) {
        return this.show(message, 'warning', duration);
      },
      
      info(message, duration) {
        return this.show(message, 'info', duration);
      }
    },

    // Modal system
    modal: {
      overlay: null,
      
      create(title, content, options = {}) {
        this.close(); // Close any existing modal
        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('aria-modal', 'true');
        
        modal.innerHTML = sanitize(`
          <div class="modal-header">
            <h2 id="modal-title" class="modal-title">${title}</h2>
            <button class="modal-close" aria-label="Close modal">&times;</button>
          </div>
          <div class="modal-content">
            ${content}
          </div>
          ${options.showFooter !== false ? `
            <div class="modal-footer">
              ${options.footerContent || ''}
            </div>
          ` : ''}
        `);
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Show modal
        requestAnimationFrame(() => {
          overlay.classList.add('show');
        });
        
        // Close handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.close());
        
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            this.close();
          }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown);
        
        // Focus management
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
        
        this.overlay = overlay;
        return overlay;
      },
      
      close() {
        if (this.overlay) {
          this.overlay.classList.remove('show');
          document.body.style.overflow = '';
          document.removeEventListener('keydown', this.handleKeydown);
          
          setTimeout(() => {
            if (this.overlay && this.overlay.parentNode) {
              this.overlay.parentNode.removeChild(this.overlay);
            }
            this.overlay = null;
          }, 300);
        }
      },
      
      handleKeydown(e) {
        if (e.key === 'Escape') {
          UIUtils.modal.close();
        }
      }
    },

    // Loading states
    loading: {
      show(element, text = 'Loading...') {
        if (typeof element === 'string') {
          element = document.querySelector(element);
        }
        
        if (!element) return;
        
        element.classList.add('loading');
        element.setAttribute('aria-busy', 'true');
        
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-overlay';
        loadingEl.innerHTML = sanitize(`
          <div class="loading-spinner"></div>
          <div class="loading-text">${text}</div>
        `);
        
        element.style.position = 'relative';
        element.appendChild(loadingEl);
      },
      
      hide(element) {
        if (typeof element === 'string') {
          element = document.querySelector(element);
        }
        
        if (!element) return;
        
        element.classList.remove('loading');
        element.removeAttribute('aria-busy');
        
        const loadingEl = element.querySelector('.loading-overlay');
        if (loadingEl) {
          loadingEl.remove();
        }
      },
      
      skeleton(container, count = 3) {
        if (typeof container === 'string') {
          container = document.querySelector(container);
        }
        
        if (!container) return;
        
        container.textContent = '';
        
        for (let i = 0; i < count; i++) {
          const skeleton = document.createElement('div');
          skeleton.className = 'loading-skeleton video-skeleton';
          container.appendChild(skeleton);
        }
      }
    },

    // Form validation
    forms: {
      validate(form) {
        if (typeof form === 'string') {
          form = document.querySelector(form);
        }
        
        if (!form) return false;
        
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
          const isFieldValid = this.validateField(input);
          if (!isFieldValid) {
            isValid = false;
          }
        });
        
        return isValid;
      },
      
      validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (required && !value) {
          isValid = false;
          errorMessage = 'This field is required';
        }
        
        // Type-specific validation
        if (value && type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
          }
        }
        
        if (value && type === 'url') {
          try {
            new URL(value);
          } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
          }
        }
        
        // Length validation
        const minLength = field.getAttribute('minlength');
        const maxLength = field.getAttribute('maxlength');
        
        if (minLength && value.length < parseInt(minLength)) {
          isValid = false;
          errorMessage = `Minimum ${minLength} characters required`;
        }
        
        if (maxLength && value.length > parseInt(maxLength)) {
          isValid = false;
          errorMessage = `Maximum ${maxLength} characters allowed`;
        }
        
        // Update field appearance
        field.classList.remove('valid', 'invalid');
        field.classList.add(isValid ? 'valid' : 'invalid');
        
        // Show/hide error message
        this.showFieldError(field, isValid ? null : errorMessage);
        
        return isValid;
      },
      
      showFieldError(field, message) {
        let errorEl = field.parentNode.querySelector('.form-error');
        
        if (message) {
          if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            field.parentNode.appendChild(errorEl);
          }
          errorEl.innerHTML = sanitize(`<span>⚠️</span> ${message}`);
          errorEl.classList.add('show');
        } else if (errorEl) {
          errorEl.classList.remove('show');
        }
      },
      
      showFieldSuccess(field, message = 'Valid') {
        let successEl = field.parentNode.querySelector('.form-success');
        
        if (!successEl) {
          successEl = document.createElement('div');
          successEl.className = 'form-success';
          field.parentNode.appendChild(successEl);
        }
        
        successEl.innerHTML = sanitize(`<span>✅</span> ${message}`);
        successEl.classList.add('show');
      }
    },

    // Progress indicators
    progress: {
      create(container, value = 0, max = 100) {
        if (typeof container === 'string') {
          container = document.querySelector(container);
        }
        
        if (!container) return null;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', max.toString());
        progressBar.setAttribute('aria-valuenow', value.toString());
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${(value / max) * 100}%`;
        
        progressBar.appendChild(progressFill);
        container.appendChild(progressBar);
        
        return {
          update(newValue) {
            const percentage = Math.min(100, Math.max(0, (newValue / max) * 100));
            progressFill.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', newValue.toString());
          },
          
          remove() {
            if (progressBar.parentNode) {
              progressBar.parentNode.removeChild(progressBar);
            }
          }
        };
      }
    },

    // Utility functions
    utils: {
      debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      },
      
      throttle(func, limit) {
        let inThrottle;
        return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
          }
        };
      },
      
      copyToClipboard(text) {
        if (navigator.clipboard) {
          return navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          return Promise.resolve();
        }
      },
      
      formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      },
      
      formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
          return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
      }
    }
  };

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          UIUtils.forms.validateField(input);
        });
        
        input.addEventListener('input', UIUtils.utils.debounce(() => {
          if (input.classList.contains('invalid')) {
            UIUtils.forms.validateField(input);
          }
        }, 300));
      });
      
      form.addEventListener('submit', (e) => {
        if (!UIUtils.forms.validate(form)) {
          e.preventDefault();
          UIUtils.notifications.error('Please fix the errors in the form');
        }
      });
    });

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip-content';
      tooltip.textContent = element.getAttribute('data-tooltip');
      element.classList.add('tooltip');
      element.appendChild(tooltip);
    });

    // Initialize lazy loading for images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy-load');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.classList.add('lazy-load');
        imageObserver.observe(img);
      });
    }

    // Keyboard navigation improvements
    document.addEventListener('keydown', (e) => {
      // Skip to main content with Alt+M
      if (e.altKey && e.key === 'm') {
        const main = document.querySelector('main') || document.querySelector('#main');
        if (main) {
          main.focus();
          main.scrollIntoView();
        }
      }
    });
  });

  // Export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIUtils;
  }

})();
