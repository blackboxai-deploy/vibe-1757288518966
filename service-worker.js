/**
 * BaddBeatz Service Worker
 * Provides offline functionality, caching, and performance improvements
 */

const CACHE_NAME = 'baddbeatz-v2';
const RUNTIME_CACHE = 'baddbeatz-runtime';
const ANALYTICS_CACHE = 'baddbeatz-analytics';

// Files to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/about.html',
  '/music.html',
  '/live.html',
  '/contact.html',
  '/offline.html',
  '/assets/css/style.css',
  '/assets/css/cyberpunk.css',
  '/assets/css/responsive.css',
  '/assets/js/main.js',
  '/assets/js/ui-utils.js',
  '/assets/images/Logo.png',
  '/assets/images/TBG-himself.jpeg',
  '/manifest.json'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Network first, fallback to cache
  networkFirst: [
    '/api/',
    '/live-stream/',
    '/chat/'
  ],
  // Cache first, fallback to network
  cacheFirst: [
    '/assets/images/',
    '/assets/fonts/',
    '/assets/css/',
    '/assets/js/'
  ],
  // Network only
  networkOnly: [
    '/admin/',
    '/dashboard/',
    '/login'
  ]
};

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Installation failed:', error);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('baddbeatz-') && 
                     cacheName !== CACHE_NAME &&
                     cacheName !== RUNTIME_CACHE &&
                     cacheName !== ANALYTICS_CACHE;
            })
            .map((cacheName) => {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP(S) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Skip cross-origin requests (except for allowed domains)
  const allowedOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://w.soundcloud.com',
    'https://www.youtube.com'
  ];
  
  if (url.origin !== self.location.origin && !allowedOrigins.includes(url.origin)) {
    return;
  }
  
  // Determine caching strategy
  const strategy = getCacheStrategy(url.pathname);
  
  switch (strategy) {
    case 'networkFirst':
      event.respondWith(networkFirst(request));
      break;
    case 'cacheFirst':
      event.respondWith(cacheFirst(request));
      break;
    case 'networkOnly':
      event.respondWith(networkOnly(request));
      break;
    default:
      event.respondWith(staleWhileRevalidate(request));
  }
});

/**
 * Get cache strategy for a given path
 */
function getCacheStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pathname.includes(pattern))) {
      return strategy;
    }
  }
  return 'staleWhileRevalidate';
}

/**
 * Network first strategy
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

/**
 * Cache first strategy
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetchAndCache(request);
    return cachedResponse;
  }
  
  return fetchAndCache(request);
}

/**
 * Network only strategy
 */
async function networkOnly(request) {
  return fetch(request);
}

/**
 * Stale while revalidate strategy
 */
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(RUNTIME_CACHE);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  });
  
  return cachedResponse || fetchPromise;
}

/**
 * Fetch and cache helper
 */
async function fetchAndCache(request) {
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

/**
 * Message event - handle messages from clients
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_URLS':
      cacheUrls(payload.urls);
      break;
      
    case 'CLEAR_CACHE':
      clearCache(payload.cacheName);
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
      });
      break;
  }
});

/**
 * Cache specific URLs
 */
async function cacheUrls(urls) {
  const cache = await caches.open(RUNTIME_CACHE);
  return cache.addAll(urls);
}

/**
 * Clear specific cache
 */
async function clearCache(cacheName) {
  if (cacheName) {
    return caches.delete(cacheName);
  }
  
  // Clear all caches
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(name => caches.delete(name))
  );
}

/**
 * Get total cache size
 */
async function getCacheSize() {
  if (!navigator.storage || !navigator.storage.estimate) {
    return 'Unknown';
  }
  
  const { usage, quota } = await navigator.storage.estimate();
  const usageMB = (usage / 1024 / 1024).toFixed(2);
  const quotaMB = (quota / 1024 / 1024).toFixed(2);
  
  return {
    usage: usageMB,
    quota: quotaMB,
    percentage: ((usage / quota) * 100).toFixed(2)
  };
}

/**
 * Push notification event
 */
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update from BaddBeatz!',
    icon: '/assets/images/icon-192x192.png',
    badge: '/assets/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Go to site',
        icon: '/assets/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close notification',
        icon: '/assets/images/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('BaddBeatz', options)
  );
});

/**
 * Notification click event
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('https://baddbeatz.com')
    );
  }
});

/**
 * Background sync event
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

/**
 * Sync analytics data
 */
async function syncAnalytics() {
  const cache = await caches.open(ANALYTICS_CACHE);
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      await fetch(request);
      await cache.delete(request);
    } catch (error) {
      console.error('[ServiceWorker] Failed to sync analytics:', error);
    }
  }
}

/**
 * Periodic background sync
 */
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

/**
 * Update cached content
 */
async function updateContent() {
  const cache = await caches.open(CACHE_NAME);
  
  for (const url of STATIC_CACHE_URLS) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.error(`[ServiceWorker] Failed to update ${url}:`, error);
    }
  }
}

console.log('[ServiceWorker] Loaded successfully');
