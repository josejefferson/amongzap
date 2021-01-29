if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js')
}

window.OneSignal = window.OneSignal || []
OneSignal.push(function () {
	OneSignal.init({
		appId: "816dc5a8-149a-4f41-a2e8-2bb933c59e56",
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