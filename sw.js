// SSDK Tools Hub Service Worker - Coordinates offline caching and instant asset delivery

const CACHE_NAME = "ssdk-cache-v3";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/css/design-tokens.css",
  "./assets/css/ssdk-style.css",
  "./assets/css/content-presentation.css",
  "./assets/css/tool-workspace.css",
  "./assets/images/logo.png",
  "./core/core.js",
  "./core/bootstrap.js",
  "./components/glass-components.js",
  "./pages/offline.html",
  "./pages/404.html"
];

// Install Event - Pre-cache core files
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching static app shell and offline page");
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up expired cache buckets
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing expired cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache-first with Network fallback for assets & Offline Fallback for html pages
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  
  if (url.origin.includes("supabase") || url.origin.includes("firebase") || url.origin.includes("googleapis") || url.origin.includes("onrender.com")) {
    return;
  }

  const isConfigJson = url.pathname.includes("/json/") || url.pathname.includes("/registry/") || url.pathname.includes("/configs/");

  if (isConfigJson) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(e.request);
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(e.request).then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseToCache);
            });
          }
          return response;
        }).catch(() => {
          if (e.request.mode === "navigate") {
            return caches.match("./pages/offline.html");
          }
        });
      })
    );
  }
});
