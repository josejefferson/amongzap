const fetch = require('node-fetch')

fetch('https://onesignal.com/api/v1/notifications', {
	method: 'POST',
	headers: {
		'Authorization': 'Basic YWZjNjQ0ZDYtNzg5MC00ZWJiLWIxZDEtZjg2ZjkwMTliMjk4',
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		'included_segments': ['Subscribed Users'],
		'app_id': '816dc5a8-149a-4f41-a2e8-2bb933c59e56',
		'contents': { en: '\nHello World\n' },
		'template_id': '7ccaaaf9-1183-4d8f-aa42-413319e4cd6d'
	})
}).then(r => r.json()).then(console.log).catch(console.error)