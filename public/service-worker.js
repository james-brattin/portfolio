const CACHE_NAME = 'my-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/style.css',
  '/vars.css',
  '/favicon.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// activate handler to clear out all previous caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ignore chrome extensions
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(url)
      .then(response => response || fetch(event.request))
  );
});