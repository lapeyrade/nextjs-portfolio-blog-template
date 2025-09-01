/// <reference lib="webworker" />

/*
  Minimal service worker for offline caching.
  Caches app shell and serves /offline as fallback.
*/
const CACHE_NAME: string = "portfolio-cache-v1";
const OFFLINE_URL: string = "/offline";

(self as unknown as ServiceWorkerGlobalScope).addEventListener(
    "install",
    (event: ExtendableEvent) => {
        event.waitUntil(
            (async (): Promise<void> => {
                const cache: Cache = await caches.open(CACHE_NAME);
                await cache.addAll(["/", OFFLINE_URL]);
                await (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
            })(),
        );
    },
);

(self as unknown as ServiceWorkerGlobalScope).addEventListener(
    "activate",
    (event: ExtendableEvent) => {
        event.waitUntil(
            (self as unknown as ServiceWorkerGlobalScope).clients.claim(),
        );
    },
);

(self as unknown as ServiceWorkerGlobalScope).addEventListener(
    "fetch",
    (event: FetchEvent) => {
        const { request }: { request: Request } = event;
        if (request.method !== "GET") return;

        event.respondWith(
            (async (): Promise<Response> => {
                try {
                    const networkResponse: Response = await fetch(request);
                    const cache: Cache = await caches.open(CACHE_NAME);
                    cache.put(request, networkResponse.clone());
                    return networkResponse;
                } catch {
                    const cache: Cache = await caches.open(CACHE_NAME);
                    const cached: Response | undefined = await cache.match(request);
                    if (cached) return cached;
                    const offline = await cache.match(OFFLINE_URL);
                    return offline || new Response("Offline", { status: 503 });
                }
            })(),
        );
    },
);
