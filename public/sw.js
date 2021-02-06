const BUILD_ID = 444455718
const filesToCache = [
	"/",
	"/chat",
	"/401",
	"/404",
	"/banned",
	"/socket.io/socket.io.min.js",
	"css/admin.css",
	"css/chat.css",
	"css/home.css",
	"css/modal.css",
	"css/special.css",
	"favicon.png",
	"img/close.png",
	"img/codeIcon.svg",
	"img/launcher_512.png",
	"img/launcher_mask_512.png",
	"img/logo.png",
	"img/notificationIcon.png",
	"img/players/blue.png",
	"img/players/brown.png",
	"img/players/cyan.png",
	"img/players/gray.png",
	"img/players/green.png",
	"img/players/lime.png",
	"img/players/orange.png",
	"img/players/pink.png",
	"img/players/purple.png",
	"img/players/red.png",
	"img/players/white.png",
	"img/players/yellow.png",
	"img/selectedColor.png",
	"img/sendIcon.svg",
	"img/shortcut_edit.png",
	"img/stars.png",
	"img/start.png",
	"js/chat/animations.js",
	"js/chat/index.js",
	"js/chat/socket.js",
	"js/helpers.js",
	"js/home/index.js",
	"js/shared.js",
	"js/sounds.js",
	"js/user-data.js",
	"lib/css/bootstrap-grid.min.css",
	"lib/css/bootstrap.min.css",
	"lib/css/font-awesome.all.min.css",
	"lib/css/sweetalert2.min.css",
	"lib/css/tabulator.min.css",
	"lib/css/tabulator_bootstrap4.min.css",
	"lib/fonts/VCR_OSD_MONO.ttf",
	"lib/fonts/fa-brands-400.woff2",
	"lib/fonts/fa-regular-400.woff2",
	"lib/fonts/fa-solid-900.woff2",
	"lib/js/angular-animate.min.js",
	"lib/js/angular-sanitize.min.js",
	"lib/js/angular.min.js",
	"lib/js/bootstrap.min.js",
	"lib/js/jquery.min.js",
	"lib/js/moment.min.js",
	"lib/js/ngEnter.js",
	"lib/js/ngInlineFmt.js",
	"lib/js/ngRightClick.js",
	"lib/js/sha1.min.js",
	"lib/js/sweetalert2.min.js",
	"lib/js/tabulator.min.js",
	"manifest.json",
	"sounds/eject_text.wav",
	"sounds/new_message_01.wav",
	"sounds/new_message_02.wav",
	"sounds/player_left.wav",
	"sounds/player_spawn.wav",
	"sounds/ui_select.wav",
	"templates/chat.html",
	"templates/info.html",
	"templates/send.html"
]
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