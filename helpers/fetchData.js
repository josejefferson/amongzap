const fetch = require('node-fetch')

async function downloadData(type) {
	if (
		!process.env.MESSAGES_DATABASE ||
		!process.env.BLOCKED_USERS_DATABASE ||
		!process.env.USER_HISTORY_DATABASE ||
		!process.env.SEND_ENABLED_DATABASE
	) {
		return Promise.resolve(false)
	}

	let URL
	let result = false
	switch (type) {
		case 'MESSAGES': URL = process.env.MESSAGES_DATABASE; break
		case 'BLOCKED_USERS': URL = process.env.BLOCKED_USERS_DATABASE; break
		case 'USER_HISTORY': URL = process.env.USER_HISTORY_DATABASE; break
		case 'SEND_ENABLED': URL = process.env.SEND_ENABLED_DATABASE; break
		default: return false
	}

	for (let i = 0; i < 3; i++) {
		result = await fetch(URL, {
			headers: { 'x-apikey': process.env.API_KEY }
		})
			.then(r => { if (!r.ok) throw r; return r.json() })
			.then(r => r.data)
			.catch(err => {
				console.error(err)
				return false
			})
		if (result) break
	}

	return result
}

async function uploadData(type, data) {
	if (
		!process.env.MESSAGES_DATABASE ||
		!process.env.BLOCKED_USERS_DATABASE ||
		!process.env.USER_HISTORY_DATABASE ||
		!process.env.SEND_ENABLED_DATABASE
	) {
		return Promise.resolve(false)
	}

	let URL
	let result = false
	switch (type) {
		case 'MESSAGES': URL = process.env.MESSAGES_DATABASE; break
		case 'BLOCKED_USERS': URL = process.env.BLOCKED_USERS_DATABASE; break
		case 'USER_HISTORY': URL = process.env.USER_HISTORY_DATABASE; break
		case 'SEND_ENABLED': URL = process.env.SEND_ENABLED_DATABASE; break
		default: return false
	}

	for (let i = 0; i < 3; i++) {
		result = await fetch(URL, {
			headers: {
				'content-type': 'application/json; charset=UTF-8',
				'x-apikey': process.env.API_KEY
			},
			body: JSON.stringify({ data }),
			method: 'PUT'
		})
			.then(r => { if (!r.ok) throw r; return r.json() })
			.catch(err => {
				console.error(err)
				return false
			})
		if (result) break
	}

	return result
}

function notify(title, text, template, icon, topic, signal, segments) {
	fetch('https://onesignal.com/api/v1/notifications', {
		signal: signal || undefined,
		method: 'POST',
		headers: {
			'Authorization': 'Basic ' + process.env.NOTIFICATION_AUTH,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'included_segments': segments || [production ? 'Subscribed Users' : 'Test Users'],
			'app_id': process.env.NOTIFICATION_APP_ID,
			'template_id': template || undefined,
			'web_push_topic': topic || undefined,
			'headings': { en: title || undefined },
			'contents': { en: text || undefined },
			'chrome_web_icon': icon || undefined
		})
	})
}

module.exports = {
	downloadData,
	uploadData,
	notify
}