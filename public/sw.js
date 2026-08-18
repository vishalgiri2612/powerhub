const CACHE_NAME = 'ravtron-cache-v3';
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

// Install Event: Precache critical files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline fallback and key assets');
      // Using map to individually catch errors if any resource fails to load during development
      return Promise.all(
        PRECACHE_ASSETS.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.error(`[Service Worker] Failed to precache asset: ${asset}`, err);
          });
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clear outdated caches
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

// Fetch Event: Serve cached assets or fetch from network
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

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Cache the response if it's successful and basic (same origin)
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || url.origin === self.location.origin) &&
            (url.protocol === 'http:' || url.protocol === 'https:')
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
          console.log('[Service Worker] Fetch failed (possibly offline); check for fallback');
          // For page navigations, return the custom offline fallback page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL) || caches.match('/');
          }
          return cachedResponse;
        });

      // Return cached response instantly if present (Stale-While-Revalidate), 
      // falling back to network fetch otherwise.
      return cachedResponse || fetchPromise;
    })
  );
});
