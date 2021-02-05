const staticCacheName = 'amongZap-static'

self.addEventListener('install', e => {
	console.log('[SW] Install')
	self.skipWaiting()

	e.waitUntil(
		caches.open(staticCacheName).then(cache => {
			return cache.addAll(filesToCache)
		})
	)
})

self.addEventListener('activate', e => {
	console.log('[SW] Activate')
})

self.addEventListener('fetch', e => {
	console.log('[SW] Fetch')

	e.respondWith(
		caches.match(e.request, { ignoreSearch: true })
			.then(response => {
				return response || fetch(e.request)
			})
			.catch(() => {
				return caches.match('/404')
			})
	)
})