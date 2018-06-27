const CACHE_NAME_PREFIX = "DICTIONARY-PWA";
const cacheName = `${CACHE_NAME_PREFIX}-0`;
const filesToCache = ["/", "/index.html", "/app.js"];

self.addEventListener("install", e => {
  console.log("%c[ServiceWorker] Install", "color: green;");
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("%c[ServiceWorker] Caching app shell", "color: green;");
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", e => {
  console.log("%c[ServiceWorker] Activate", "color: green;");

  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          // Clear out old versions of dictionary cache
          // Don't touch other caches that don't belong to us.
          if (key.indexOf(CACHE_NAME_PREFIX) === -1 && key !== cacheName) {
            console.log(
              "%c[ServiceWorker] Removing old cache " + key,
              "color: green;"
            );
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", e => {
  console.log("%c[ServiceWorker] Fetch: " + e.request.url, "color: green;");

  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
