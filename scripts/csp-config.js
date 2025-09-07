/**
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
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
}

// Meta tag for HTML
const CSP_META_TAG = `<meta http-equiv="Content-Security-Policy" content="${generateCSPString()}">`;

console.log('Add this meta tag to your HTML <head>:');
console.log(CSP_META_TAG);
