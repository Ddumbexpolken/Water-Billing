const CACHE_NAME = 'water-billing-v1';
const ASSETS = [
  './',
  './index.html',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request).catch(function() {
        return new Response(
          '<h2 style="font-family:sans-serif;padding:30px;color:#0a1628">💧 Water Billing System<br><small>You are offline. The app will load once you reconnect.</small></h2>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      });
    })
  );
});
