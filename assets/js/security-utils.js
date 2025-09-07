/**
 * Security Utilities for BaddBeatz
 * Provides safe DOM manipulation methods to prevent XSS attacks
 */

class SecurityUtils {
    /**
     * Safely set text content (prevents XSS)
     * @param {HTMLElement} element - Target element
     * @param {string} text - Text content to set
     */
    static setTextContent(element, text) {
        if (!element || typeof text !== 'string') return;
        element.textContent = text;
    }

    /**
     * Safely create element with text content
     * @param {string} tagName - HTML tag name
     * @param {string} textContent - Text content
     * @param {Object} attributes - Element attributes
     * @returns {HTMLElement} Created element
     */
    static createElement(tagName, textContent = '', attributes = {}) {
        const element = document.createElement(tagName);
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        // Set attributes safely
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'id') {
                element.id = value;
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else if (key === 'href' && this.isValidURL(value)) {
                element.setAttribute(key, value);
            } else if (key === 'src' && this.isValidURL(value)) {
                element.setAttribute(key, value);
            }
        });
        
        return element;
    }

    /**
     * Escape HTML characters to prevent XSS
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    static escapeHTML(str) {
        if (typeof str !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Sanitize HTML using DOMPurify (if available)
     * @param {string} html - HTML to sanitize
     * @returns {string} Sanitized HTML
     */
    static sanitizeHTML(html) {
        if (typeof html !== 'string') return '';
        
        // Use DOMPurify if available
        if (window.DOMPurify) {
            return window.DOMPurify.sanitize(html, {
                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'span'],
                ALLOWED_ATTR: ['class']
            });
        }
        
        // Fallback: escape HTML
        return this.escapeHTML(html);
    }

    /**
     * Safe template literal handler
     * @param {Array} strings - Template strings
     * @param {...any} values - Template values
     * @returns {string} Safe HTML string
     */
    static safeHTML(strings, ...values) {
        let result = strings[0];
        
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            const escapedValue = typeof value === 'string' ? this.escapeHTML(value) : String(value);
            result += escapedValue + strings[i + 1];
        }
        
        return result;
    }

    /**
     * Validate URL to prevent javascript: and data: URLs
     * @param {string} url - URL to validate
     * @returns {boolean} True if URL is safe
     */
    static isValidURL(url) {
        if (typeof url !== 'string') return false;
        
        try {
            const urlObj = new URL(url, window.location.origin);
            const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
            return allowedProtocols.includes(urlObj.protocol);
        } catch {
            return false;
        }
    }

    /**
     * Safely set innerHTML with sanitization
     * @param {HTMLElement} element - Target element
     * @param {string} html - HTML content
     */
    static setInnerHTML(element, html) {
        if (!element) return;
        element.innerHTML = this.sanitizeHTML(html);
    }

    /**
     * Create safe notification element
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info, warning)
     * @returns {HTMLElement} Notification element
     */
    static createNotification(message, type = 'info') {
        const notification = this.createElement('div', '', {
            className: `notification notification-${type}`,
            'data-type': type
        });
        
        const messageEl = this.createElement('span', message, {
            className: 'notification-message'
        });
        
        const closeBtn = this.createElement('button', '×', {
            className: 'notification-close',
            'data-action': 'close'
        });
        
        notification.appendChild(messageEl);
        notification.appendChild(closeBtn);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        return notification;
    }

    /**
     * Validate and sanitize form input
     * @param {string} input - Input value
     * @param {string} type - Input type (email, text, number, etc.)
     * @returns {Object} Validation result
     */
    static validateInput(input, type) {
        const result = {
            isValid: false,
            sanitized: '',
            error: ''
        };
        
        if (typeof input !== 'string') {
            result.error = 'Invalid input type';
            return result;
        }
        
        // Basic sanitization
        const sanitized = input.trim().replace(/[<>]/g, '');
        result.sanitized = sanitized;
        
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                result.isValid = emailRegex.test(sanitized);
                if (!result.isValid) result.error = 'Invalid email format';
                break;
                
            case 'url':
                result.isValid = this.isValidURL(sanitized);
                if (!result.isValid) result.error = 'Invalid URL format';
                break;
                
            case 'text':
                result.isValid = sanitized.length > 0 && sanitized.length <= 1000;
                if (!result.isValid) result.error = 'Text must be 1-1000 characters';
                break;
                
            case 'number':
                const num = parseFloat(sanitized);
                result.isValid = !isNaN(num) && isFinite(num);
                if (!result.isValid) result.error = 'Invalid number format';
                break;
                
            default:
                result.isValid = sanitized.length > 0;
                if (!result.isValid) result.error = 'Input cannot be empty';
        }
        
        return result;
    }

    /**
     * Generate secure random string
     * @param {number} length - String length
     * @returns {string} Random string
     */
    static generateSecureId(length = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint8Array(length);
            window.crypto.getRandomValues(array);
            
            for (let i = 0; i < length; i++) {
                result += chars[array[i] % chars.length];
            }
        } else {
            // Fallback for older browsers
            for (let i = 0; i < length; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        
        return result;
    }

    /**
     * Safe event listener attachment
     * @param {HTMLElement} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    static addEventListener(element, event, handler, options = {}) {
        if (!element || typeof handler !== 'function') return;
        
        // Wrap handler to prevent errors from breaking the app
        const safeHandler = (e) => {
            try {
                handler(e);
            } catch (error) {
                console.error('Event handler error:', error);
            }
        };
        
        element.addEventListener(event, safeHandler, options);
    }

    /**
     * Safe localStorage operations
     * @param {string} key - Storage key
     * @param {any} value - Value to store (optional, for get operation)
     * @param {string} operation - 'get', 'set', or 'remove'
     * @returns {any} Retrieved value for get operation
     */
    static safeStorage(key, value = null, operation = 'get') {
        if (typeof key !== 'string') return null;
        
        try {
            switch (operation) {
                case 'get':
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : null;
                    
                case 'set':
                    if (value !== null) {
                        localStorage.setItem(key, JSON.stringify(value));
                    }
                    break;
                    
                case 'remove':
                    localStorage.removeItem(key);
                    break;
            }
        } catch (error) {
            console.error('Storage operation failed:', error);
            return null;
        }
    }
}

// Export for use in other modules
window.SecurityUtils = SecurityUtils;

// Also export as module if supported
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityUtils;
}
