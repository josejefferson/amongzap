const path = require('path')
const fs = require('fs')

const random = Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000
function getAllFiles(dir, filelist = [
	'/',
	'/chat',
	'/401',
	'/404',
	'/banned',
	'/socket.io/socket.io.min.js'
]) {
	fs.readdirSync(dir).forEach(file => {
		filelist = fs.statSync(path.join(dir, file)).isDirectory()
			? getAllFiles(path.join(dir, file), filelist)
			: filelist.concat(path.join(dir, file))
	})
	return filelist
}

const files = getAllFiles('./public').map(i => i
	.replace(/\\/g, '/')
	.replace(/public\//g, '')
).filter(i =>
	i !== 'sw.js' &&
	!i.endsWith('.map') &&
	!i.endsWith('.scss') &&
	!i.includes('admin/') &&
	!i.startsWith('OneSignalSDK')
)
const swModel = `const BUILD_ID = ${random}
const staticCacheName = 'amongZap-static'
const filesToCache = ${JSON.stringify(files, null, '\t')}

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
})`

fs.writeFileSync('public/sw.js', swModel)