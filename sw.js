const CACHE = 'puufu-admin-v2';

// On install — skip waiting immediately, don't pre-cache
self.addEventListener('install', e => {
  self.skipWaiting();
});

// On activate — delete ALL old caches, take control
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network ALWAYS first, no cache serving
// This ensures updates are always picked up
self.addEventListener('fetch', e => {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .catch(() => {
        // Offline fallback — try cache
        return caches.match(e.request);
      })
  );
});
