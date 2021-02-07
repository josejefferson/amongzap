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

	self.clients.matchAll().then(clients => {
		clients.forEach(client => client.postMessage('update'))
	})
})

self.addEventListener('fetch', e => {
	console.log('[SW] Fetch')
	const path = new URL(e.request.url).pathname
	if (path === '/auth' || path === '/admin') return

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