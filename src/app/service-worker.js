/*
    Safer service worker caching strategy.
    - Precache a small, explicit app shell.
    - Use cache-first for same-origin static assets (CSS/JS/images/html)
    - Use network-first for API requests so fresh data is served
    - Avoid caching cross-origin/opaque responses
    - Limit runtime cache size and clean up old caches on activate
*/

const CACHE_VERSION = 'v1'
const PRECACHE = `portfolio-precache-${CACHE_VERSION}`
const RUNTIME = `portfolio-runtime-${CACHE_VERSION}`
const OFFLINE_URL = '/offline'

// Explicit list of routes/assets to precache. Keep this small and versioned.
const PRECACHE_URLS = ['/', OFFLINE_URL, '/manifest.webmanifest', '/icon-192', '/icon-512']

// Utility: trim cache to max entries (simple FIFO)
async function trimCache(cacheName, maxItems) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    if (keys.length <= maxItems) return
    for (let i = 0; i < keys.length - maxItems; i++) {
        await cache.delete(keys[i])
    }
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(PRECACHE)
            // Use addAll but allow individual failures to avoid blocking install
            for (const url of PRECACHE_URLS) {
                try {
                    // use Request to ensure same-origin resolution
                    await cache.add(new Request(url, { credentials: 'same-origin' }))
                } catch (err) {
                    // ignore - keep install resilient
                    // eslint-disable-next-line no-console
                    console.warn('[SW] precache failed for', url, err)
                }
            }
            await self.skipWaiting()
        })()
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            // Delete old caches that don't match current version
            const expected = [PRECACHE, RUNTIME]
            const names = await caches.keys()
            await Promise.all(
                names.map((name) => {
                    if (!expected.includes(name)) return caches.delete(name)
                    return Promise.resolve()
                })
            )
            await self.clients.claim()
        })()
    )
})

self.addEventListener('fetch', (event) => {
    const { request } = event
    // Only handle GET requests
    if (request.method !== 'GET') return

    const url = new URL(request.url)

    // Don't interfere with browser devtools or non-http schemes
    if (!url.protocol.startsWith('http')) return

    // Cross-origin requests (third-party): default to network, don't cache opaque responses
    if (url.origin !== self.location.origin) {
        event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)))
        return
    }

    // API routes: network-first to keep data fresh
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            (async () => {
                try {
                    const networkResponse = await fetch(request)
                    // Only cache successful same-origin responses that are not opaque
                    if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
                        const cache = await caches.open(RUNTIME)
                        cache.put(request, networkResponse.clone())
                        // trim runtime cache to avoid uncontrolled growth
                        void trimCache(RUNTIME, 50)
                    }
                    return networkResponse
                } catch (err) {
                    const cache = await caches.open(RUNTIME)
                    const cached = await cache.match(request)
                    if (cached) return cached
                    return caches.match(OFFLINE_URL)
                }
            })()
        )
        return
    }

    // For navigation and same-origin static assets: cache-first with network fallback
    event.respondWith(
        (async () => {
            const cache = await caches.open(PRECACHE)
            const cached = await cache.match(request)
            if (cached) return cached

            try {
                const networkResponse = await fetch(request)
                // Only cache basic same-origin responses
                if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
                    const runtimeCache = await caches.open(RUNTIME)
                    runtimeCache.put(request, networkResponse.clone())
                    // keep runtime cache bounded
                    void trimCache(RUNTIME, 100)
                }
                return networkResponse
            } catch (err) {
                // fallback to runtime cache or offline page for navigation
                const runtimeCache = await caches.open(RUNTIME)
                const runtimeMatch = await runtimeCache.match(request)
                if (runtimeMatch) return runtimeMatch
                return caches.match(OFFLINE_URL)
            }
        })()
    )
})


