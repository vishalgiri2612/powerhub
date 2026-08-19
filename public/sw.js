const CACHE_NAME = 'ravtron-cache-v4';
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/logo-192.png',
  '/logo-512.png',
  '/favicon.ico',
  '/images/logo.png'
];

// Install Event: Precache critical files & force skipWaiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline fallback and key assets');
      return Promise.all(
        PRECACHE_ASSETS.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.error(`[Service Worker] Failed to precache asset: ${asset}`, err);
          });
        })
      );
    })
  );
});

// Activate Event: Clear outdated caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Serve network-first for HTML/Page navigations, stale-while-revalidate for static assets
self.addEventListener('fetch', (event) => {
  // Only handle GET requests with HTTP/HTTPS schemes
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http://') && !event.request.url.startsWith('https://')) return;

  const url = new URL(event.request.url);

  // Skip developer hot-module reloading, dynamic API routes, Google OAuth, and extensions
  if (
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('google.com') ||
    url.hostname.includes('accounts.google.com')
  ) {
    return;
  }

  // 1. Network-First strategy for HTML page navigations & Next data requests
  if (event.request.mode === 'navigate' || url.pathname.startsWith('/_next/data/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fall back to cache or offline page when network is unavailable
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL) || caches.match('/');
          });
        })
    );
    return;
  }

  // 2. Stale-While-Revalidate strategy for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || url.origin === self.location.origin)
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache).catch((err) => {
                console.warn('[Service Worker] Cache put ignored:', err);
              });
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
