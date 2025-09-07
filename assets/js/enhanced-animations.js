// SECURITY: Consider using DOMPurify for sanitization
// import DOMPurify from 'dompurify';

/**
 * Enhanced Animations for BaddBeatz Website
 * Advanced visual effects and interactive animations
 */

(function() {
  'use strict';

  const sanitize = (html) => (window.DOMPurify ? window.DOMPurify.sanitize(html) : html);

  // Animation utilities
  window.AnimationUtils = {
    // Particle system for cyberpunk effects
    particles: {
      canvas: null,
      ctx: null,
      particles: [],
      animationId: null,
      
      init(containerId = 'particle-container') {
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
          `;
          document.body.appendChild(container);
        }
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
      },
      
      resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      },
      
      createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
          this.particles.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? '#ff0033' : '#00ffff'
          });
        }
      },
      
      animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Wrap around edges
          if (particle.x < 0) particle.x = this.canvas.width;
          if (particle.x > this.canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = this.canvas.height;
          if (particle.y > this.canvas.height) particle.y = 0;
          
          // Draw particle
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          this.ctx.fillStyle = particle.color;
          this.ctx.globalAlpha = particle.opacity;
          this.ctx.fill();
          
          // Draw connections
          this.particles.forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              this.ctx.beginPath();
              this.ctx.moveTo(particle.x, particle.y);
              this.ctx.lineTo(otherParticle.x, otherParticle.y);
              this.ctx.strokeStyle = particle.color;
              this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
              this.ctx.lineWidth = 0.5;
              this.ctx.stroke();
            }
          });
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
      },
      
      destroy() {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
          this.canvas.parentNode.removeChild(this.canvas);
        }
      }
    },

    // Scroll-triggered animations
    scrollAnimations: {
      observers: [],
      
      init() {
        if (!('IntersectionObserver' in window)) return;
        
        // Fade in animations
        this.createObserver('.fade-in', (element) => {
          element.style.opacity = '0';
          element.style.transform = 'translateY(30px)';
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }, (element) => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
        
        // Slide in from left
        this.createObserver('.slide-in-left', (element) => {
          element.style.opacity = '0';
          element.style.transform = 'translateX(-50px)';
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }, (element) => {
          element.style.opacity = '1';
          element.style.transform = 'translateX(0)';
        });
        
        // Slide in from right
        this.createObserver('.slide-in-right', (element) => {
          element.style.opacity = '0';
          element.style.transform = 'translateX(50px)';
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }, (element) => {
          element.style.opacity = '1';
          element.style.transform = 'translateX(0)';
        });
        
        // Scale in
        this.createObserver('.scale-in', (element) => {
          element.style.opacity = '0';
          element.style.transform = 'scale(0.8)';
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }, (element) => {
          element.style.opacity = '1';
          element.style.transform = 'scale(1)';
        });
        
        // Stagger animations for lists
        this.createStaggerObserver('.stagger-item', 100);
      },
      
      createObserver(selector, setupFn, animateFn) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;
        
        elements.forEach(setupFn);
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateFn(entry.target);
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        elements.forEach(element => observer.observe(element));
        this.observers.push(observer);
      },
      
      createStaggerObserver(selector, delay = 100) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;
        
        elements.forEach((element, index) => {
          element.style.opacity = '0';
          element.style.transform = 'translateY(20px)';
          element.style.transition = `opacity 0.6s ease ${index * delay}ms, transform 0.6s ease ${index * delay}ms`;
        });
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const elements = entry.target.querySelectorAll(selector);
              elements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
              });
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        
        const container = elements[0].closest('.stagger-container') || document.body;
        observer.observe(container);
        this.observers.push(observer);
      },
      
      destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
      }
    },

    // Interactive hover effects
    hoverEffects: {
      init() {
        // Magnetic effect for buttons
        this.initMagneticEffect('.btn, .nav__link');
        
        // Tilt effect for cards
        this.initTiltEffect('.card, .about-image, .gallery-item');
        
        // Glow effect for interactive elements
        this.initGlowEffect('.btn--primary, .contact-link');
      },
      
      initMagneticEffect(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
          element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
          });
          
          element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
          });
        });
      },
      
      initTiltEffect(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
          element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
          });
          
          element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
          });
        });
      },
      
      initGlowEffect(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
          element.addEventListener('mouseenter', () => {
            element.style.boxShadow = '0 0 20px rgba(255, 0, 51, 0.6), 0 0 40px rgba(255, 0, 51, 0.4)';
          });
          
          element.addEventListener('mouseleave', () => {
            element.style.boxShadow = '';
          });
        });
      }
    },

    // Text animations
    textAnimations: {
      init() {
        this.initTypewriter('.typewriter');
        this.initGlitchText('.glitch-text');
        this.initCountUp('.count-up');
      },
      
      initTypewriter(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
          const text = element.textContent;
          const speed = parseInt(element.dataset.speed) || 50;
          
          element.textContent = '';
          element.style.borderRight = '2px solid #ff0033';
          
          let i = 0;
          const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
              clearInterval(typeInterval);
              setTimeout(() => {
                element.style.borderRight = 'none';
              }, 1000);
            }
          }, speed);
        });
      },
      
      initGlitchText(selector) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
          const originalText = element.textContent;
          const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
          
          element.addEventListener('mouseenter', () => {
            let iterations = 0;
            const maxIterations = 10;
            
            const glitchInterval = setInterval(() => {
              element.textContent = originalText
                .split('')
                .map((char, index) => {
                  if (index < iterations) {
                    return originalText[index];
                  }
                  return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
              
              iterations += 1/3;
              
              if (iterations >= maxIterations) {
                clearInterval(glitchInterval);
                element.textContent = originalText;
              }
            }, 30);
          });
        });
      },
      
      initCountUp(selector) {
        const elements = document.querySelectorAll(selector);
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target;
              const target = parseInt(element.dataset.target) || 100;
              const duration = parseInt(element.dataset.duration) || 2000;
              
              let current = 0;
              const increment = target / (duration / 16);
              
              const countInterval = setInterval(() => {
                current += increment;
                element.textContent = Math.floor(current);
                
                if (current >= target) {
                  element.textContent = target;
                  clearInterval(countInterval);
                }
              }, 16);
              
              observer.unobserve(element);
            }
          });
        });
        
        elements.forEach(element => observer.observe(element));
      }
    },

    // Loading animations
    loadingAnimations: {
      createSpinner(container, type = 'default') {
        if (typeof container === 'string') {
          container = document.querySelector(container);
        }
        
        const spinner = document.createElement('div');
        spinner.className = `loading-spinner loading-spinner--${type}`;
        
        switch (type) {
          case 'dots':
            spinner.innerHTML = sanitize('<div></div><div></div><div></div>');
            break;
          case 'pulse':
            spinner.innerHTML = sanitize('<div class="pulse-ring"></div>');
            break;
          case 'cyberpunk':
            spinner.innerHTML = sanitize(`
              <div class="cyber-ring"></div>
              <div class="cyber-ring cyber-ring--delay"></div>
            `);
            break;
          default:
            spinner.innerHTML = sanitize('<div class="spinner-circle"></div>');
        }
        
        container.appendChild(spinner);
        return spinner;
      },
      
      createProgressBar(container, options = {}) {
        if (typeof container === 'string') {
          container = document.querySelector(container);
        }
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = '0%';
        
        if (options.animated) {
          progressFill.classList.add('progress-fill--animated');
        }
        
        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);
        
        if (options.label) {
          const label = document.createElement('div');
          label.className = 'progress-label';
          label.textContent = options.label;
          progressContainer.appendChild(label);
        }
        
        container.appendChild(progressContainer);
        
        return {
          update(percentage) {
            progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
          },
          
          complete() {
            progressFill.style.width = '100%';
            setTimeout(() => {
              progressContainer.classList.add('progress-complete');
            }, 300);
          },
          
          remove() {
            if (progressContainer.parentNode) {
              progressContainer.parentNode.removeChild(progressContainer);
            }
          }
        };
      }
    },

    // Initialize all animations
    init() {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (!prefersReducedMotion) {
        this.particles.init();
        this.scrollAnimations.init();
        this.hoverEffects.init();
        this.textAnimations.init();
      }
      
      // Always initialize loading animations (they're functional)
      // this.loadingAnimations is used on-demand
    },

    // Cleanup function
    destroy() {
      this.particles.destroy();
      this.scrollAnimations.destroy();
    }
  };

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    AnimationUtils.init();
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    AnimationUtils.destroy();
  });

  // Export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationUtils;
  }

})();
