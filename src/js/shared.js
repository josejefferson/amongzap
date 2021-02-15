if ('serviceWorker' in navigator &&
	location.hostname !== 'localhost' &&
	location.hostname !== '127.0.0.1' &&
	!location.hostname.startsWith('192.168.')
) {
	navigator.serviceWorker.register('/OneSignalSDKWorker.js')
	navigator.serviceWorker.addEventListener('message', m => {
		if (m.data === 'update') {
			document.querySelectorAll('.refresh').forEach(e => e.classList.remove('fa-spin'))
			document.querySelectorAll('.updateBadge').forEach(e => e.classList.remove('hidden'))
		} else if (m.data === 'updating') {
			document.querySelectorAll('.refresh').forEach(e => e.classList.add('fa-spin'))
		}
	})
}

window.OneSignal = window.OneSignal || []
OneSignal.push(function () {
	OneSignal.init({
		appId: '816dc5a8-149a-4f41-a2e8-2bb933c59e56',
		welcomeNotification: {
			disable: true
		},
		promptOptions: {
			customlink: {
				enabled: true,
				style: 'link',
				size: 'none',
				text: {
					subscribe: ' ',
					unsubscribe: ' '
				},
				unsubscribeEnabled: true
			}
		}
	})
})

function loading() {
	if (document.querySelector('.loadingScreen')) return
	const $loading = document.createElement('div')
	$loading.classList.add('loadingScreen')
	$loading.innerHTML = '<div class="loadingIcon"></div>'
	document.body.style.overflow = 'hidden'
	document.body.appendChild($loading)
	fadeIn($loading)
}

// https://gist.github.com/alirezas/c4f9f43e9fe1abba9a4824dd6fc60a55
function fadeIn(el) {
	el.style.opacity = 0;

	(function fade() {
		let val = parseFloat(el.style.opacity)
		if (!((val += .1) > 1)) {
			el.style.opacity = val
			requestAnimationFrame(fade)
		}
	})()
}