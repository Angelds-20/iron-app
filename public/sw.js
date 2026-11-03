const CACHE_NAME = 'iron-pwa-v2'
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png'
]

// Instalar service worker y cachear assets base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
  self.skipWaiting()
})

// Activar y limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Interceptar peticiones (Network First con fallback a Cache para estar siempre actualizado)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  // Ignorar peticiones de extensiones o protocolos no soportados
  if (!event.request.url.startsWith('http')) return

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clonar y guardar en cache dinámicamente si es válido
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return networkResponse
      })
      .catch(() => {
        // Si no hay red, responder desde cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html')
          }
        })
      })
  )
})
