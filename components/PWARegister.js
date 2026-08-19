'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Scroll to the top on page refresh
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // In development mode (localhost), unregister any active Service Worker so code edits update instantly without hard refresh
      if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let registration of registrations) {
            registration.unregister();
            console.log('[PWA] Service Worker unregistered for local development');
          }
        });
        return;
      }

      const registerSW = () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered with scope:', registration.scope);
            // Check for Service Worker updates on every page load
            registration.update();
          })
          .catch((error) => {
            console.error('[PWA] Service Worker registration failed:', error);
          });
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
        return () => window.removeEventListener('load', registerSW);
      }
    }
  }, []);

  return null;
}
