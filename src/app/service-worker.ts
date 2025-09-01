/// <reference lib="webworker" />

/*
    Safer service worker caching strategy.
    - Precache a small, explicit app shell.
    - Use cache-first for same-origin static assets (CSS/JS/images/html)
    - Use network-first for API requests so fresh data is served
    - Avoid caching cross-origin/opaque responses
    - Limit runtime cache size and clean up old caches on activate
*/

const CACHE_VERSION: string = "v1";
const PRECACHE: string = `portfolio-precache-${CACHE_VERSION}`;
const RUNTIME: string = `portfolio-runtime-${CACHE_VERSION}`;
const OFFLINE_URL: string = "/offline";

// Explicit list of routes/assets to precache. Keep this small and versioned.
const PRECACHE_URLS: string[] = [
    "/",
    OFFLINE_URL,
    "/manifest.webmanifest",
    "/icon-192",
    "/icon-512",
];

// Utility: trim cache to max entries (simple FIFO)
async function trimCache(cacheName: string, maxItems: number): Promise<void> {
    const cache: Cache = await caches.open(cacheName);
    const keys: readonly Request[] = await cache.keys();
    if (keys.length <= maxItems) return;
    const toDelete = keys.slice(0, keys.length - maxItems);
    for (const key of toDelete) {
        await cache.delete(key);
    }
}

(self as unknown as ServiceWorkerGlobalScope).addEventListener("install", (event: ExtendableEvent) => {
    event.waitUntil(
        (async (): Promise<void> => {
            const cache: Cache = await caches.open(PRECACHE);
            // Use addAll but allow individual failures to avoid blocking install
            for (const url of PRECACHE_URLS) {
                try {
                    // use Request to ensure same-origin resolution
                    await cache.add(new Request(url, { credentials: "same-origin" }));
                } catch (err) {
                    // ignore - keep install resilient
                    console.warn("[SW] precache failed for", url, err);
                }
            }
            await (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
        })(),
    );
});

(self as unknown as ServiceWorkerGlobalScope).addEventListener("activate", (event: ExtendableEvent) => {
    event.waitUntil(
        (async (): Promise<void> => {
            // Delete old caches that don't match current version
            const expected: string[] = [PRECACHE, RUNTIME];
            const names: string[] = await caches.keys();
            await Promise.all(
                names.map((name: string): Promise<boolean> => {
                    if (!expected.includes(name)) return caches.delete(name);
                    return Promise.resolve(false);
                }),
            );
            await (self as unknown as ServiceWorkerGlobalScope).clients.claim();
        })(),
    );
});

(self as unknown as ServiceWorkerGlobalScope).addEventListener("fetch", (event: FetchEvent) => {
    const { request }: { request: Request } = event;
    // Only handle GET requests
    if (request.method !== "GET") return;

    const url: URL = new URL(request.url);

    // Don't interfere with browser devtools or non-http schemes
    if (!url.protocol.startsWith("http")) return;

    // Cross-origin requests (third-party): default to network, don't cache opaque responses
    if (url.origin !== (self as unknown as ServiceWorkerGlobalScope).location.origin) {
        event.respondWith(
            fetch(request).catch(async () => {
                const offline = await caches.match(OFFLINE_URL);
                return offline || new Response("Offline", { status: 503 });
            })
        );
        return;
    }

    // API routes: network-first to keep data fresh
    if (url.pathname.startsWith("/api/")) {
        event.respondWith(
            (async (): Promise<Response> => {
                try {
                    const networkResponse: Response = await fetch(request);
                    // Only cache successful same-origin responses that are not opaque
                    if (networkResponse?.ok && networkResponse.type === "basic") {
                        const cache: Cache = await caches.open(RUNTIME);
                        cache.put(request, networkResponse.clone());
                        // trim runtime cache to avoid uncontrolled growth
                        void trimCache(RUNTIME, 50);
                    }
                    return networkResponse;
                } catch {
                    const cache: Cache = await caches.open(RUNTIME);
                    const cached: Response | undefined = await cache.match(request);
                    if (cached) return cached;
                    const offline = await caches.match(OFFLINE_URL);
                    return offline || new Response("Offline", { status: 503 });
                }
            })(),
        );
        return;
    }

    // For navigation and same-origin static assets: cache-first with network fallback
    event.respondWith(
        (async (): Promise<Response> => {
            const cache: Cache = await caches.open(PRECACHE);
            const cached: Response | undefined = await cache.match(request);
            if (cached) return cached;

            try {
                const networkResponse: Response = await fetch(request);
                // Only cache basic same-origin responses
                if (networkResponse?.ok && networkResponse.type === "basic") {
                    const runtimeCache: Cache = await caches.open(RUNTIME);
                    runtimeCache.put(request, networkResponse.clone());
                    // keep runtime cache bounded
                    void trimCache(RUNTIME, 100);
                }
                return networkResponse;
            } catch {
                // fallback to runtime cache or offline page for navigation
                const runtimeCache: Cache = await caches.open(RUNTIME);
                const runtimeMatch: Response | undefined = await runtimeCache.match(request);
                if (runtimeMatch) return runtimeMatch;
                const offline = await caches.match(OFFLINE_URL);
                return offline || new Response("Offline", { status: 503 });
            }
        })(),
    );
});
