const MESSAGES_DATABASE = 'https://amongzap-450e.restdb.io/rest/data/600f23ecf564f0050002e587'
const BLOCKED_USERS_DATABASE = 'https://amongzap-450e.restdb.io/rest/data/600f23fcf564f0050002e58b'
//const USERS_HISTORY_DATABASE = 'https://jsonstorage.net/api/items/faa65f13-e124-4adc-980f-dd399cc5e159'
const API_KEY = '600f25861346a1524ff12e04'
const MAX_ATTEMPTS = 3

const fetch = require('node-fetch')

async function downloadData(type) {
	let URL
	let result = false
	switch (type) {
		case 'MESSAGES': URL = MESSAGES_DATABASE; break
		case 'BLOCKED_USERS': URL = BLOCKED_USERS_DATABASE; break
		//case 'USERS_HISTORY': URL = USERS_HISTORY_DATABASE; break
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
		//case 'USERS_HISTORY': URL = USERS_HISTORY_DATABASE; break
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