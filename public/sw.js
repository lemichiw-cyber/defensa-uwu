/* Service Worker — PWA MiEvento
   Estrategia: network-first para navegación/API, cache-first para assets */
const CACHE = "mievento-v1"
const PRECACHE = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"]

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
})

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (e) => {
  const { request } = e
  if (request.method !== "GET") return

  /* API y videos: siempre red (sin cachear datos dinámicos ni 18MB de video) */
  const url = new URL(request.url)
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/videos/")) return

  /* Navegación: red primero, cache como respaldo offline */
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put("/", copy))
          return res
        })
        .catch(() => caches.match("/"))
    )
    return
  }

  /* Assets estáticos: cache-first con actualización en segundo plano */
  e.respondWith(
    caches.match(request).then((cached) => {
      const red = fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(request, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || red
    })
  )
})
