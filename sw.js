// Service Worker for Amit's Terminal Portfolio PWA
const CACHE_NAME = 'amit-terminal-portfolio-v1.0.0';
const STATIC_CACHE_NAME = 'amit-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'amit-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/terminal.css',
  '/css/retro-theme.css',
  '/assets/fonts/terminal-font.css',
  '/js/terminal.js',
  '/js/commands.js',
  '/js/typewriter.js',
  '/data/skills.json',
  '/data/projects.json',
  '/data/experience.json',
  '/data/AmitJ_CV.pdf',
  '/manifest.json',
  '/content/ArchMentor.html',
  '/archmentor/index.html',
  // Updated icon paths - all available icons
  '/icons/favicon.ico',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-180x180.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Network-first resources (always try to fetch fresh)
const NETWORK_FIRST = [
  '/data/',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

// Cache-first resources (serve from cache, fallback to network)
const CACHE_FIRST = [
  '/css/',
  '/js/',
  '/assets/',
  '/icons/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated successfully');
        return self.clients.claim(); // Take control of all pages
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  const requestPath = requestUrl.pathname;

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external domains (except fonts)
  if (requestUrl.origin !== location.origin && 
      !requestUrl.hostname.includes('fonts.googleapis.com') &&
      !requestUrl.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    handleRequest(event.request, requestPath)
  );
});

// Request handling with different caching strategies
async function handleRequest(request, requestPath) {
  // Strategy 1: Network First (for JSON data and external fonts)
  if (isNetworkFirst(requestPath)) {
    return networkFirst(request);
  }
  
  // Strategy 2: Cache First (for static assets)
  if (isCacheFirst(requestPath)) {
    return cacheFirst(request);
  }
  
  // Strategy 3: Stale While Revalidate (for HTML and main resources)
  return staleWhileRevalidate(request);
}

// Check if resource should use network-first strategy
function isNetworkFirst(path) {
  return NETWORK_FIRST.some(pattern => path.includes(pattern));
}

// Check if resource should use cache-first strategy
function isCacheFirst(path) {
  return CACHE_FIRST.some(pattern => path.includes(pattern));
}

// Network First strategy - try network, fallback to cache
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the fresh response
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for JSON data
    if (request.url.includes('.json')) {
      return new Response(
        JSON.stringify({ error: 'Offline - Data unavailable' }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 503
        }
      );
    }
    
    throw error;
  }
}

// Cache First strategy - serve from cache, update cache in background
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Serve from cache immediately
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first failed for:', request.url);
    throw error;
  }
}

// Stale While Revalidate - serve cached version, update in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse); // Fallback to cache if network fails
  
  // Return cached version immediately if available
  return cachedResponse || fetchPromise;
}

// Update cache in background (for cache-first strategy)
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      await cache.put(request, networkResponse);
      console.log('[SW] Updated cache in background:', request.url);
    }
  } catch (error) {
    console.log('[SW] Background update failed:', request.url);
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    });
  }
});

// Background sync for future enhancement
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    // Handle contact form submission when back online
    event.waitUntil(handleContactFormSync());
  }
});

async function handleContactFormSync() {
  // Implementation for handling queued form submissions
  console.log('[SW] Background sync triggered');
}

// Push notifications (for future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New update available!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: 'portfolio-update',
      requireInteraction: false,
      actions: [
        {
          action: 'view',
          title: 'View Portfolio',
          icon: '/icons/view-icon.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/dismiss-icon.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Portfolio Update', options)
    );
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
