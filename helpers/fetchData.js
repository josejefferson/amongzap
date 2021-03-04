const MESSAGES_DATABASE = process.env.MESSAGES_DATABASE
const BLOCKED_USERS_DATABASE = process.env.BLOCKED_USERS_DATABASE
const USER_HISTORY_DATABASE = process.env.USER_HISTORY_DATABASE
const SEND_ENABLED_DATABASE = process.env.SEND_ENABLED_DATABASE
const API_KEY = process.env.API_KEY

const fetch = require('node-fetch')

async function downloadData(type) {
	let URL
	let result = false
	switch (type) {
		case 'MESSAGES': URL = MESSAGES_DATABASE; break
		case 'BLOCKED_USERS': URL = BLOCKED_USERS_DATABASE; break
		case 'USER_HISTORY': URL = USER_HISTORY_DATABASE; break
		case 'SEND_ENABLED': URL = SEND_ENABLED_DATABASE; break
		default: return false
	}

	for (let i = 0; i < 3; i++) {
		result = await fetch(URL, {
			headers: { 'x-apikey': API_KEY }
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
	let URL
	let result = false
	switch (type) {
		case 'MESSAGES': URL = MESSAGES_DATABASE; break
		case 'BLOCKED_USERS': URL = BLOCKED_USERS_DATABASE; break
		case 'USER_HISTORY': URL = USER_HISTORY_DATABASE; break
		case 'SEND_ENABLED': URL = SEND_ENABLED_DATABASE; break
		default: return false
	}

	for (let i = 0; i < 3; i++) {
		result = await fetch(URL, {
			headers: {
				'content-type': 'application/json; charset=UTF-8',
				'x-apikey': API_KEY
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

module.exports = {
	downloadData,
	uploadData
}