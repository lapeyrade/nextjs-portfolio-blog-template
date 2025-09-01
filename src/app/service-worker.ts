/// <reference lib="webworker" />

/*
  Service Worker (TypeScript source)
  - Precache a small app shell
  - Cache-first for same-origin static assets
  - Network-first for API requests
  - Avoid caching cross-origin opaque responses
  - Trim runtime cache to avoid unbounded growth
*/

const CACHE_VERSION: string = "v1";
const PRECACHE: string = `portfolio-precache-${CACHE_VERSION}`;
const RUNTIME: string = `portfolio-runtime-${CACHE_VERSION}`;
const OFFLINE_URL: string = "/offline";

const PRECACHE_URLS: string[] = [
	"/",
	OFFLINE_URL,
	"/manifest.webmanifest",
	"/icon-192",
	"/icon-512",
];

async function trimCache(cacheName: string, maxItems: number): Promise<void> {
	const cache: Cache = await caches.open(cacheName);
	const keys: readonly Request[] = await cache.keys();
	if (keys.length <= maxItems) return;
	const toDelete = keys.slice(0, keys.length - maxItems);
	for (const key of toDelete) {
		await cache.delete(key);
	}
}

(self as unknown as ServiceWorkerGlobalScope).addEventListener(
	"install",
	(event: ExtendableEvent) => {
		event.waitUntil(
			(async (): Promise<void> => {
				const cache: Cache = await caches.open(PRECACHE);
				for (const url of PRECACHE_URLS) {
					try {
						await cache.add(new Request(url, { credentials: "same-origin" }));
					} catch (err) {
						console.warn("[SW] precache failed for", url, err);
					}
				}
				await (self as unknown as ServiceWorkerGlobalScope).skipWaiting();
			})(),
		);
	},
);

(self as unknown as ServiceWorkerGlobalScope).addEventListener(
	"activate",
	(event: ExtendableEvent) => {
		event.waitUntil(
			(async (): Promise<void> => {
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
	},
);

(self as unknown as ServiceWorkerGlobalScope).addEventListener(
	"fetch",
	(event: FetchEvent) => {
		const { request }: { request: Request } = event;
		if (request.method !== "GET") return;

		const url: URL = new URL(request.url);
		if (!url.protocol.startsWith("http")) return;

		if (
			url.origin !==
			(self as unknown as ServiceWorkerGlobalScope).location.origin
		) {
			event.respondWith(
				fetch(request).catch(async () => {
					const offline = await caches.match(OFFLINE_URL);
					return offline || new Response("Offline", { status: 503 });
				}),
			);
			return;
		}

		if (url.pathname.startsWith("/api/")) {
			event.respondWith(
				(async (): Promise<Response> => {
					try {
						const networkResponse: Response = await fetch(request);
						if (networkResponse?.ok && networkResponse.type === "basic") {
							const cache: Cache = await caches.open(RUNTIME);
							cache.put(request, networkResponse.clone());
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

		event.respondWith(
			(async (): Promise<Response> => {
				const cache: Cache = await caches.open(PRECACHE);
				const cached: Response | undefined = await cache.match(request);
				if (cached) return cached;

				try {
					const networkResponse: Response = await fetch(request);
					if (networkResponse?.ok && networkResponse.type === "basic") {
						const runtimeCache: Cache = await caches.open(RUNTIME);
						runtimeCache.put(request, networkResponse.clone());
						void trimCache(RUNTIME, 100);
					}
					return networkResponse;
				} catch {
					const runtimeCache: Cache = await caches.open(RUNTIME);
					const runtimeMatch: Response | undefined =
						await runtimeCache.match(request);
					if (runtimeMatch) return runtimeMatch;
					const offline = await caches.match(OFFLINE_URL);
					return offline || new Response("Offline", { status: 503 });
				}
			})(),
		);
	},
);
