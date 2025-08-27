/*
  Minimal service worker for offline caching.
  Caches app shell and serves /offline as fallback.
*/
const CACHE_NAME = 'portfolio-cache-v1'
const OFFLINE_URL = '/offline'

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(['/', OFFLINE_URL])
      await self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request)
        const cache = await caches.open(CACHE_NAME)
        cache.put(request, networkResponse.clone())
        return networkResponse
      } catch {
        const cache = await caches.open(CACHE_NAME)
        const cached = await cache.match(request)
        if (cached) return cached
        return cache.match(OFFLINE_URL)
      }
    })()
  )
})
