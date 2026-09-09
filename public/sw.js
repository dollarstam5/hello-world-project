/* Service worker: installable shell + reliable offline access.
 * Data never passes through here — Dexie owns local data and the sync worker
 * owns the network exchange with the backend.
 */
const VERSION = "eco-v2";
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;

/** Key screens kept warm so they open instantly, online or not. */
const SHELL_ROUTES = ["/", "/flash", "/radar", "/espace", "/talents"];
const SHELL_URLS = [
  ...SHELL_ROUTES,
  "/manifest.webmanifest",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(async (cache) => {
      // Never let a single missing URL abort the whole precache.
      await Promise.allSettled(SHELL_URLS.map((url) => cache.add(new Request(url, { cache: "reload" }))));
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)),
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable().catch(() => undefined);
      }
      await self.clients.claim();
    })(),
  );
});

/* The page asks for the new version to take over immediately. */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

function isHashedAsset(url) {
  return /\.(?:js|mjs|css|woff2?|png|jpe?g|svg|webp|avif|ico)$/.test(url.pathname);
}

function navigationKey(url) {
  const path = url.pathname.replace(/\/+$/, "") || "/";
  return SHELL_ROUTES.includes(path) ? path : "/";
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/_serverFn/")) return;

  // Pages: network first, fall back to the last good copy of that page.
  if (request.mode === "navigate") {
    const key = navigationKey(url);
    event.respondWith(
      (async () => {
        try {
          const preloaded = await event.preloadResponse;
          const response = preloaded || (await fetch(request));
          if (response && response.ok) {
            const copy = response.clone();
            event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.put(key, copy)));
          }
          return response;
        } catch {
          const cache = await caches.open(SHELL_CACHE);
          return (await cache.match(key)) ?? (await cache.match("/")) ?? Response.error();
        }
      })(),
    );
    return;
  }

  // Assets: serve instantly from cache, refresh in the background.
  if (isHashedAsset(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSET_CACHE);
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response && response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => undefined);
        if (cached) {
          event.waitUntil(network);
          return cached;
        }
        return (await network) ?? Response.error();
      })(),
    );
  }
});
