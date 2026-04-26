const CACHE_NAME = "urc-ncc-pwa-v2";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip dev server requests
  if (request.url.includes("localhost") || request.url.includes("127.0.0.1")) {
    return;
  }

  // Network first for API calls
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response?.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache first for static assets
  event.respondWith(
    caches.match(request)
      .then((cached) => cached || fetch(request))
      .catch(() => null)
  );
});

