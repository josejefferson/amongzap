const MESSAGES_DATABASE = 'https://amongzap-450e.restdb.io/rest/data/600f23ecf564f0050002e587'
const BLOCKED_USERS_DATABASE = 'https://amongzap-450e.restdb.io/rest/data/600f23fcf564f0050002e58b'
const USER_HISTORY_DATABASE = 'https://amongzap-450e.restdb.io/rest/data/60215f397fdeb446000037b0'
const SEND_ENABLED_DATABASE = 'https://amongzap-450e.restdb.io/rest/data/603bf02161889c220000d797'
const API_KEY = '600f25861346a1524ff12e04'
const MAX_ATTEMPTS = 3

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

	for (let i = 0; i < MAX_ATTEMPTS; i++) {
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

	for (let i = 0; i < MAX_ATTEMPTS; i++) {
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