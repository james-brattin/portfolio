const PRECACHE = 'precache-v4';
const RUNTIME = 'runtime-v1';
const NETWORK_FIRST_THEN_CACHE = 'network_first_then_cache-v1';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'index.html',
  './', // Alias for index.html
  'main.js',
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
    .then(cache => cache.addAll(PRECACHE_URLS))
    .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME, NETWORK_FIRST_THEN_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', async (event) => {
  const url = new URL(event.request.url);

  // ignore chrome extensions
  if (!url.protocol.startsWith('http')) return;

  // cache first
  const isPrecachedRequest = PRECACHE_URLS.includes(url.pathname);
  if (isPrecachedRequest) {
    event.respondWith(async () => {
      try {
        const cache = await caches.open(PRECACHE)
        return cache.match(event.request.url);
      } catch (error) {
        return caches.match(event.request);
      }
    });
  }

  // network first
  event.respondWith(async () => {
    try {
      const fetchedResponse = await fetch(event.request.url);
      const cache = await caches.open(NETWORK_FIRST_THEN_CACHE);
      cache.put(event.request, fetchedResponse.clone());
      return fetchedResponse;
    } catch (error) {
      return await caches.match(event.request);
    }
  })
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
// self.addEventListener('fetch', event => {
  //   // Skip cross-origin requests, like those for Google Analytics.
//   if (event.request.url.startsWith(self.location.origin)) {
//     event.respondWith(
//       caches.match(event.request).then(cachedResponse => {
//         if (cachedResponse) {
//           return cachedResponse;
//         }

//         return caches.open(RUNTIME).then(cache => {
//           return fetch(event.request).then(response => {
//             // Put a copy of the response in the runtime cache.
//             return cache.put(event.request, response.clone()).then(() => {
//               return response;
//             });
//           });
//         });
//       })
//     );
//   }
// });
