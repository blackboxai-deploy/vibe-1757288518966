/**
 * Security Headers Middleware for Cloudflare Workers
 * Implements comprehensive security headers to protect against common vulnerabilities
 */

/**
 * Security headers configuration
 */
const SECURITY_HEADERS = {
  // Content Security Policy - Strict policy with necessary exceptions
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://w.soundcloud.com https://connect.facebook.net https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.soundcloud.com https://www.youtube.com https://graph.facebook.com wss://localhost:* ws://localhost:*",
    "media-src 'self' https://w.soundcloud.com https://www.youtube.com blob:",
    "object-src 'none'",
    "frame-src 'self' https://www.youtube.com https://w.soundcloud.com https://www.facebook.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS filter in older browsers
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy for privacy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy (formerly Feature Policy)
  'Permissions-Policy': [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()',
    'interest-cohort=()'  // Opt out of FLoC
  ].join(', '),
  
  // HSTS - Enforce HTTPS for 1 year
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Prevent information leakage
  'X-Powered-By': 'BaddBeatz',
  
  // CORS headers for API endpoints
  'Access-Control-Allow-Origin': 'https://baddbeatz.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
  
  // Additional security headers
  'X-DNS-Prefetch-Control': 'on',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none'
};

/**
 * Apply security headers to response
 * @param {Response} response - Original response
 * @returns {Response} Response with security headers
 */
export function applySecurityHeaders(response) {
  const newHeaders = new Headers(response.headers);
  
  // Apply all security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  // Create new response with security headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

/**
 * Check if request is for a static asset
 * @param {Request} request - Incoming request
 * @returns {boolean} True if static asset
 */
export function isStaticAsset(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // List of static asset extensions
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg',
    '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp3', '.mp4',
    '.webm', '.ogg', '.wav', '.pdf', '.zip'
  ];
  
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

/**
 * Apply caching headers for static assets
 * @param {Response} response - Original response
 * @param {Request} request - Original request
 * @returns {Response} Response with caching headers
 */
export function applyCachingHeaders(response, request) {
  const newHeaders = new Headers(response.headers);
  
  if (isStaticAsset(request)) {
    // Cache static assets for 1 year
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    // Cache HTML for 1 hour, must revalidate
    newHeaders.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  }
  
  // Add ETag for cache validation
  const etag = generateETag(response.body);
  if (etag) {
    newHeaders.set('ETag', etag);
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

/**
 * Generate ETag for response body
 * @param {ReadableStream|string} body - Response body
 * @returns {string|null} ETag value
 */
function generateETag(body) {
  // Simple ETag generation - in production, use proper hashing
  if (typeof body === 'string') {
    return `"${btoa(body.substring(0, 100))}"`;
  }
  return null;
}

/**
 * Security middleware for Cloudflare Workers
 * @param {Request} request - Incoming request
 * @param {Function} handler - Request handler
 * @returns {Response} Response with security headers
 */
export async function withSecurity(request, handler) {
  try {
    // Get original response
    let response = await handler(request);
    
    // Apply security headers
    response = applySecurityHeaders(response);
    
    // Apply caching headers
    response = applyCachingHeaders(response, request);
    
    return response;
  } catch (error) {
    // Log error and return secure error response
    console.error('Security middleware error:', error);
    
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        ...SECURITY_HEADERS
      }
    });
  }
}

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  // Maximum requests per IP per minute
  maxRequests: 60,
  // Time window in seconds
  windowSeconds: 60,
  // Blocked duration in seconds
  blockDurationSeconds: 300
};

/**
 * Simple rate limiter using Cloudflare KV
 * @param {Request} request - Incoming request
 * @param {KVNamespace} rateLimitKV - KV namespace for rate limiting
 * @returns {boolean} True if request should be allowed
 */
export async function checkRateLimit(request, rateLimitKV) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `ratelimit:${ip}`;
  
  try {
    // Get current count
    const data = await rateLimitKV.get(key, 'json');
    const now = Date.now();
    
    if (!data) {
      // First request from this IP
      await rateLimitKV.put(key, JSON.stringify({
        count: 1,
        windowStart: now
      }), {
        expirationTtl: RATE_LIMIT_CONFIG.windowSeconds
      });
      return true;
    }
    
    // Check if we're still in the same window
    if (now - data.windowStart > RATE_LIMIT_CONFIG.windowSeconds * 1000) {
      // New window
      await rateLimitKV.put(key, JSON.stringify({
        count: 1,
        windowStart: now
      }), {
        expirationTtl: RATE_LIMIT_CONFIG.windowSeconds
      });
      return true;
    }
    
    // Check if limit exceeded
    if (data.count >= RATE_LIMIT_CONFIG.maxRequests) {
      return false;
    }
    
    // Increment count
    await rateLimitKV.put(key, JSON.stringify({
      count: data.count + 1,
      windowStart: data.windowStart
    }), {
      expirationTtl: RATE_LIMIT_CONFIG.windowSeconds
    });
    
    return true;
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow request on error to prevent blocking legitimate users
    return true;
  }
}

/**
 * Create rate limit exceeded response
 * @returns {Response} Rate limit response
 */
export function rateLimitExceededResponse() {
  return new Response('Too Many Requests', {
    status: 429,
    headers: {
      'Content-Type': 'text/plain',
      'Retry-After': RATE_LIMIT_CONFIG.blockDurationSeconds.toString(),
      ...SECURITY_HEADERS
    }
  });
}
