if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js')
}

console.log('test')
window.OneSignal = window.OneSignal || []
OneSignal.push(function() {
	OneSignal.init({
		appId: "816dc5a8-149a-4f41-a2e8-2bb933c59e56",
		promptOptions: {
  customlink: {
    enabled: true, /* Required to use the Custom Link */
    style: "button", /* Has value of 'button' or 'link' */
    size: "medium", /* One of 'small', 'medium', or 'large' */
    color: {
      button: '#E12D30', /* Color of the button background if style = "button" */
      text: '#FFFFFF', /* Color of the prompt's text */
    },
    text: {
      subscribe: "Subscribe to push notifications", /* Prompt's text when not subscribed */
      unsubscribe: "Unsubscribe from push notifications", /* Prompt's text when subscribed */
      explanation: "Get updates from all sorts of things that matter to you", /* Optional text appearing before the prompt button */
    },
    unsubscribeEnabled: true, /* Controls whether the prompt is visible after subscription */
  }
}
	})
})