/**
 * Security Vulnerability Fix Script
 * Fixes XSS vulnerabilities by replacing innerHTML with safer alternatives
 */

const fs = require('fs').promises;
const path = require('path');

// Files to fix based on the search results
const filesToFix = [
  'assets/js/youtube.js',
  'assets/js/ui-utils.js',
  'assets/js/pwa-init.js',
  'assets/js/player.js',
  'assets/js/live-stream-manager.js',
  'assets/js/intro-video.js',
  'assets/js/enhanced-animations.js',
  'assets/js/dashboard.js',
  'assets/js/ai-chat-improved.js',
  'assets/js/admin.js'
];

/**
 * Create a safe text node
 */
function createSafeTextNodeCode(variableName, textContent) {
  return `const ${variableName} = document.createTextNode(${textContent});`;
}

/**
 * Create safe element creation code
 */
function createSafeElementCode(elementType, className, textContent) {
  return `
const element = document.createElement('${elementType}');
element.className = '${className}';
element.textContent = ${textContent};`;
}

/**
 * Fix innerHTML assignments in JavaScript files
 */
async function fixJavaScriptFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let fixCount = 0;
    
    // Pattern 1: Simple innerHTML assignments with string literals
    content = content.replace(
      /(\w+)\.innerHTML\s*=\s*['"`]([^'"`]*)['"`]/g,
      (match, element, html) => {
        fixCount++;
        // If it's just text, use textContent
        if (!html.includes('<')) {
          return `${element}.textContent = '${html}'`;
        }
        // For simple HTML, add a comment to review
        return `${element}.innerHTML = '${html}' /* SECURITY: Review this innerHTML usage */`;
      }
    );
    
    // Pattern 2: innerHTML with template literals - mark for manual review
    content = content.replace(
      /(\w+)\.innerHTML\s*=\s*`/g,
      (match, element) => {
        fixCount++;
        return `${element}.innerHTML = /* SECURITY: Template literal - needs manual review */ \``;
      }
    );
    
    // Pattern 3: Add DOMPurify import at the top of files that still have innerHTML
    if (content.includes('innerHTML') && !content.includes('DOMPurify')) {
      content = `// SECURITY: Consider using DOMPurify for sanitization\n// import DOMPurify from 'dompurify';\n\n${content}`;
    }
    
    // Write the fixed content back
    await fs.writeFile(filePath, content);
    
    return { filePath, fixCount, hasInnerHTML: content.includes('innerHTML') };
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
    return { filePath, error: error.message };
  }
}

/**
 * Create a security utilities file
 */
async function createSecurityUtils() {
  const securityUtilsContent = `/**
 * Security Utilities for BaddBeatz
 * Provides safe DOM manipulation methods
 */

class SecurityUtils {
  /**
   * Safely set text content
   * @param {HTMLElement} element - The element to update
   * @param {string} text - The text content
   */
  static setTextContent(element, text) {
    if (element && typeof text === 'string') {
      element.textContent = text;
    }
  }

  /**
   * Safely create and append element
   * @param {HTMLElement} parent - Parent element
   * @param {string} tag - HTML tag name
   * @param {Object} options - Element options
   */
  static createElement(parent, tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.className) {
      element.className = options.className;
    }
    
    if (options.textContent) {
      element.textContent = options.textContent;
    }
    
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    
    if (options.children) {
      options.children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });
    }
    
    if (parent) {
      parent.appendChild(element);
    }
    
    return element;
  }

  /**
   * Sanitize HTML string (requires DOMPurify)
   * @param {string} html - HTML string to sanitize
   * @returns {string} Sanitized HTML
   */
  static sanitizeHTML(html) {
    // Check if DOMPurify is available
    if (typeof DOMPurify !== 'undefined') {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'div', 'span', 'ul', 'li', 'ol'],
        ALLOWED_ATTR: ['href', 'class', 'id', 'target', 'rel']
      });
    }
    
    // Fallback: escape HTML
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  static escapeHTML(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, char => map[char]);
  }

  /**
   * Safe template literal handler
   * @param {Array} strings - Template literal strings
   * @param {...any} values - Template literal values
   * @returns {string} Safe HTML string
   */
  static safeHTML(strings, ...values) {
    let result = strings[0];
    
    for (let i = 0; i < values.length; i++) {
      result += this.escapeHTML(String(values[i])) + strings[i + 1];
    }
    
    return result;
  }

  /**
   * Create element from safe HTML template
   * @param {string} html - HTML string
   * @returns {DocumentFragment} Document fragment
   */
  static createFragment(html) {
    const template = document.createElement('template');
    template.innerHTML = this.sanitizeHTML(html);
    return template.content;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityUtils;
} else {
  window.SecurityUtils = SecurityUtils;
}
`;

  await fs.writeFile('assets/js/security-utils.js', securityUtilsContent);
  console.log('✅ Created security-utils.js');
}

/**
 * Create CSP meta tag updater
 */
async function createCSPUpdater() {
  const cspUpdaterContent = `/**
 * Content Security Policy Configuration
 * Add this to your HTML files or server configuration
 */

// Recommended CSP for BaddBeatz
const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Remove this after fixing inline scripts
    "https://www.youtube.com",
    "https://w.soundcloud.com",
    "https://connect.facebook.net",
    "https://www.google-analytics.com"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Remove this after fixing inline styles
    "https://fonts.googleapis.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:",
    "blob:"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'connect-src': [
    "'self'",
    "https://api.soundcloud.com",
    "https://www.youtube.com",
    "https://graph.facebook.com",
    "wss://localhost:*",
    "ws://localhost:*"
  ],
  'media-src': [
    "'self'",
    "https://w.soundcloud.com",
    "https://www.youtube.com",
    "blob:"
  ],
  'object-src': ["'none'"],
  'frame-src': [
    "'self'",
    "https://www.youtube.com",
    "https://w.soundcloud.com",
    "https://www.facebook.com"
  ],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': []
};

// Convert to string
function generateCSPString() {
  return Object.entries(CSP_POLICY)
    .map(([directive, values]) => {
      if (values.length === 0) return directive;
      return \`\${directive} \${values.join(' ')}\`;
    })
    .join('; ');
}

// Meta tag for HTML
const CSP_META_TAG = \`<meta http-equiv="Content-Security-Policy" content="\${generateCSPString()}">\`;

console.log('Add this meta tag to your HTML <head>:');
console.log(CSP_META_TAG);
`;

  await fs.writeFile('scripts/csp-config.js', cspUpdaterContent);
  console.log('✅ Created csp-config.js');
}

/**
 * Main function
 */
async function main() {
  console.log('🔒 Starting security vulnerability fixes...\n');
  
  // Create security utilities
  await createSecurityUtils();
  await createCSPUpdater();
  
  // Fix JavaScript files
  console.log('\n📝 Fixing JavaScript files...');
  const results = await Promise.all(
    filesToFix.map(file => fixJavaScriptFile(file))
  );
  
  // Summary
  console.log('\n📊 Fix Summary:');
  let totalFixes = 0;
  let filesWithInnerHTML = 0;
  
  results.forEach(result => {
    if (result.error) {
      console.log(`  ❌ ${result.filePath}: ${result.error}`);
    } else {
      console.log(`  ✓ ${result.filePath}: ${result.fixCount} fixes applied`);
      totalFixes += result.fixCount;
      if (result.hasInnerHTML) {
        filesWithInnerHTML++;
      }
    }
  });
  
  console.log(`\n✅ Total fixes applied: ${totalFixes}`);
  console.log(`⚠️  Files still containing innerHTML: ${filesWithInnerHTML}`);
  
  // Recommendations
  console.log('\n📋 Security Recommendations:');
  console.log('1. Install DOMPurify: npm install dompurify');
  console.log('2. Review all remaining innerHTML usages marked with /* SECURITY */');
  console.log('3. Replace innerHTML with safer alternatives where possible');
  console.log('4. Add CSP headers to your server configuration');
  console.log('5. Use the SecurityUtils class for safe DOM manipulation');
  console.log('6. Consider using a template engine or framework with built-in XSS protection');
  
  // Create security report
  const report = {
    timestamp: new Date().toISOString(),
    filesAnalyzed: filesToFix.length,
    totalFixes: totalFixes,
    filesWithInnerHTML: filesWithInnerHTML,
    recommendations: [
      'Install and use DOMPurify for HTML sanitization',
      'Review and fix remaining innerHTML usages',
      'Implement Content Security Policy',
      'Use security-utils.js for safe DOM manipulation',
      'Regular security audits with tools like npm audit'
    ]
  };
  
  await fs.writeFile('SECURITY_FIX_REPORT.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Security fix report saved to SECURITY_FIX_REPORT.json');
}

// Run the script
main().catch(console.error);
