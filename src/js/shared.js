if ('serviceWorker' in navigator &&
	location.hostname !== 'localhost' &&
	location.hostname !== '127.0.0.1' &&
	!location.hostname.startsWith('192.168.')
) {
	navigator.serviceWorker.register('/OneSignalSDKWorker.js')
	navigator.serviceWorker.addEventListener('message', m => {
		if (m.data === 'update') {
			document.querySelectorAll('.updateBadge').forEach(e => e.classList.remove('hidden'))
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