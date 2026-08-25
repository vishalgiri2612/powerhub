const CACHE_NAME = 'ravtron-cache-v5';
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/logo-192.png',
  '/logo-512.png',
  '/favicon.ico',
  '/logo.png'
];

// Install Event: Precache critical files & force skipWaiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker v5] Pre-caching offline fallback and key assets');
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
            console.log('[Service Worker v5] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Handle requests with optimized caching strategies
self.addEventListener('fetch', (event) => {
  // Only handle GET requests with HTTP/HTTPS schemes
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http://') && !event.request.url.startsWith('https://')) return;

  const url = new URL(event.request.url);

  // Skip developer HMR, auth endpoints, upload actions, and third-party auth
  if (
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.startsWith('/api/auth/') ||
    url.pathname.startsWith('/api/upload') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('google.com') ||
    url.hostname.includes('accounts.google.com')
  ) {
    return;
  }

  // 1. Cache-First strategy for static images (0ms load time)
  const isImage = 
    url.pathname.startsWith('/images/') || 
    /\.(png|jpg|jpeg|webp|svg|gif|ico|avif)$/i.test(url.pathname);

  if (isImage) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache).catch(() => {});
            });
          }
          return networkResponse;
        }).catch(() => {
          return caches.match('/logo.png');
        });
      })
    );
    return;
  }

  // 2. Stale-While-Revalidate strategy for read-only GET API endpoints
  const isReadOnlyApi = 
    url.pathname === '/api/products' || 
    url.pathname === '/api/categories' || 
    url.pathname === '/api/hero' ||
    url.pathname === '/api/coupons';

  if (isReadOnlyApi) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache).catch(() => {});
              });
            }
            return networkResponse;
          })
          .catch((err) => {
            console.warn('[Service Worker] API fetch failed, serving cache:', err);
            return cachedResponse;
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Network-First strategy for HTML page navigations & Next data requests
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
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL) || caches.match('/');
          });
        })
    );
    return;
  }

  // 4. Stale-While-Revalidate default fallback for remaining static assets (JS, CSS, Fonts)
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
              cache.put(event.request, responseToCache).catch(() => {});
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
