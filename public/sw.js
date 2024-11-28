const CACHE_NAME = 'nn-simulator-v1';
const DYNAMIC_CACHE = 'nn-simulator-dynamic-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/file.svg',
  '/globe.svg',
  '/next.svg',
  '/vercel.svg',
  '/window.svg',
  '/_next/static/css/app.css',
  '/_next/static/js/main.js',
  '/offline.html'
];

// Helper function to determine if a request is an API call
const isApiRequest = (request) => {
  return request.url.includes('/api/');
};

// Helper function to determine if a request is for a static asset
const isStaticAsset = (url) => {
  return ASSETS_TO_CACHE.some(asset => url.endsWith(asset));
};

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Chrome extension requests and other non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse && isStaticAsset(event.request.url)) {
        // Return cached response for static assets
        return cachedResponse;
      }

      // For API requests and dynamic content, try network first
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            throw new Error('Network error');
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache API responses in the dynamic cache
          if (isApiRequest(event.request)) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // If network fails, try to return cached response
          return cachedResponse || caches.match('/offline.html');
        });
    })
  );
});

// Handle sync events for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-neural-networks') {
    event.waitUntil(syncNeuralNetworks());
  }
});

// Periodic sync for background updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-neural-networks') {
    event.waitUntil(updateNeuralNetworks());
  }
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
