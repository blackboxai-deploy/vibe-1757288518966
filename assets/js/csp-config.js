/**
 * Content Security Policy Configuration for BaddBeatz
 * Provides secure CSP headers to prevent XSS and other attacks
 */

const CSPConfig = {
    // Base CSP directives
    directives: {
        'default-src': ["'self'"],
        
        // Script sources - gradually remove 'unsafe-inline' and 'unsafe-eval'
        'script-src': [
            "'self'",
            "'unsafe-inline'", // TODO: Remove after fixing inline scripts
            "'unsafe-eval'",   // TODO: Remove after fixing eval usage
            'https://www.youtube.com',
            'https://w.soundcloud.com',
            'https://connect.facebook.net',
            'https://www.google-analytics.com',
            'https://cdnjs.cloudflare.com' // For DOMPurify and other libraries
        ],
        
        // Style sources
        'style-src': [
            "'self'",
            "'unsafe-inline'", // TODO: Remove after moving inline styles to CSS files
            'https://fonts.googleapis.com',
            'https://cdnjs.cloudflare.com'
        ],
        
        // Image sources
        'img-src': [
            "'self'",
            'data:',
            'https:',
            'blob:'
        ],
        
        // Font sources
        'font-src': [
            "'self'",
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com'
        ],
        
        // Connection sources for AJAX/WebSocket
        'connect-src': [
            "'self'",
            'https://api.soundcloud.com',
            'https://www.youtube.com',
            'https://graph.facebook.com',
            'wss://localhost:*',
            'ws://localhost:*',
            'https://api.baddbeatz.com'
        ],
        
        // Media sources
        'media-src': [
            "'self'",
            'https://w.soundcloud.com',
            'https://www.youtube.com',
            'blob:'
        ],
        
        // Object sources (disable for security)
        'object-src': ["'none'"],
        
        // Frame sources
        'frame-src': [
            "'self'",
            'https://www.youtube.com',
            'https://w.soundcloud.com',
            'https://www.facebook.com'
        ],
        
        // Frame ancestors (prevent clickjacking)
        'frame-ancestors': ["'none'"],
        
        // Base URI restriction
        'base-uri': ["'self'"],
        
        // Form action restriction
        'form-action': ["'self'"],
        
        // Upgrade insecure requests
        'upgrade-insecure-requests': []
    },

    // Generate CSP header string
    generateHeader() {
        const directives = [];
        
        for (const [directive, sources] of Object.entries(this.directives)) {
            if (sources.length === 0) {
                directives.push(directive);
            } else {
                directives.push(`${directive} ${sources.join(' ')}`);
            }
        }
        
        return directives.join('; ');
    },

    // Development mode CSP (more permissive)
    getDevelopmentCSP() {
        const devDirectives = { ...this.directives };
        
        // Add localhost for development
        devDirectives['connect-src'].push('http://localhost:*', 'ws://localhost:*');
        devDirectives['script-src'].push('http://localhost:*');
        
        const directives = [];
        for (const [directive, sources] of Object.entries(devDirectives)) {
            if (sources.length === 0) {
                directives.push(directive);
            } else {
                directives.push(`${directive} ${sources.join(' ')}`);
            }
        }
        
        return directives.join('; ');
    },

    // Production mode CSP (strict)
    getProductionCSP() {
        const prodDirectives = { ...this.directives };
        
        // Remove unsafe directives in production
        prodDirectives['script-src'] = prodDirectives['script-src'].filter(
            src => !src.includes('unsafe')
        );
        
        const directives = [];
        for (const [directive, sources] of Object.entries(prodDirectives)) {
            if (sources.length === 0) {
                directives.push(directive);
            } else {
                directives.push(`${directive} ${sources.join(' ')}`);
            }
        }
        
        return directives.join('; ');
    },

    // Apply CSP to current page
    apply() {
        const isDevelopment = window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1';
        
        const cspHeader = isDevelopment ? this.getDevelopmentCSP() : this.getProductionCSP();
        
        // Create meta tag for CSP
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = cspHeader;
        
        // Add to head if not already present
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            document.head.appendChild(meta);
        }
        
        console.log('CSP Applied:', cspHeader);
    },

    // Report CSP violations
    setupViolationReporting() {
        document.addEventListener('securitypolicyviolation', (e) => {
            console.warn('CSP Violation:', {
                blockedURI: e.blockedURI,
                violatedDirective: e.violatedDirective,
                originalPolicy: e.originalPolicy,
                sourceFile: e.sourceFile,
                lineNumber: e.lineNumber
            });
            
            // In production, you might want to send this to your logging service
            if (window.location.hostname !== 'localhost') {
                // Example: send to logging service
                // fetch('/api/csp-violation', { method: 'POST', body: JSON.stringify(violationData) });
            }
        });
    },

    // Nonce generation for inline scripts (future improvement)
    generateNonce() {
        const array = new Uint8Array(16);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(array);
        } else {
            // Fallback for older browsers
            for (let i = 0; i < array.length; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
        }
        return btoa(String.fromCharCode.apply(null, array));
    },

    // Validate external resource URLs
    isAllowedSource(url, directive) {
        try {
            const urlObj = new URL(url);
            const allowedSources = this.directives[directive] || [];
            
            return allowedSources.some(source => {
                if (source === "'self'") {
                    return urlObj.origin === window.location.origin;
                }
                if (source === 'https:') {
                    return urlObj.protocol === 'https:';
                }
                if (source === 'data:') {
                    return urlObj.protocol === 'data:';
                }
                if (source.startsWith('https://')) {
                    return url.startsWith(source);
                }
                return false;
            });
        } catch {
            return false;
        }
    }
};

// Auto-apply CSP on page load
document.addEventListener('DOMContentLoaded', () => {
    CSPConfig.apply();
    CSPConfig.setupViolationReporting();
});

// Export for use in other modules
window.CSPConfig = CSPConfig;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSPConfig;
}
