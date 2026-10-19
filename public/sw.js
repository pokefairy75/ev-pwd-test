const CACHE_NAME = 'personal-pwa-v2'
const APP_BASE = self.registration.scope
const APP_SHELL = ['', 'manifest.webmanifest', 'icon.svg'].map((path) => new URL(path, APP_BASE).href)

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok && request.destination !== 'document') {
          const copy = response.clone()
          void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return response
      }).catch(async () => {
        if (request.mode === 'navigate') {
          const shell = await caches.match(new URL('', APP_BASE).href)
          if (shell) return shell
        }
        throw new Error(`Offline and no cached response for ${request.url}`)
      })
    }),
  )
})
