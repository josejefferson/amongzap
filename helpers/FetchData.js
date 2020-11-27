const MESSAGES_DATABASE = 'https://jsonstorage.net/api/items/059b742b-adfd-47d6-92b6-6d91aed5e6bb'
const BLOCKED_USERS_DATABASE = 'https://jsonstorage.net/api/items/82b20039-1695-422a-af20-1d3149d806fc'
const ADMIN_USERNAMES_DATABASE = 'https://jsonstorage.net/api/items/9c3a875e-b1b5-46ab-87dc-af880a5bcdb2'
const BLACKLIST_USERNAMES_DATABASE = ''
const BLACKLIST_WORDS_DATABASE = ''
const USERS_HISTORY_DATABASE = 'https://jsonstorage.net/api/items/faa65f13-e124-4adc-980f-dd399cc5e159'
const MAX_ATTEMPTS = 3

const fetch = require('node-fetch')

async function downloadData(type) {
	let URL
	let result = false
	switch (type) {
		case 'MESSAGES': URL = MESSAGES_DATABASE; break
		case 'BLOCKED_USERS': URL = BLOCKED_USERS_DATABASE; break
		case 'ADMIN_USERNAMES': URL = ADMIN_USERNAMES_DATABASE; break
		case 'BLACKLIST_USERNAMES': URL = BLACKLIST_USERNAMES_DATABASE; break
		case 'BLACKLIST_WORDS': URL = BLACKLIST_WORDS_DATABASE; break
		case 'USERS_HISTORY': URL = USERS_HISTORY_DATABASE; break
		default: return false
	}

	console.log(`Downloading ${type}...`)

	for (let i = 0; i < MAX_ATTEMPTS; i++) {
		console.log(`Attempt ${i}`)
		result = await fetch(URL)
			.then(async r => await r.json())
			.catch(() => false)
		if (result) break
	}

	console.log(`Done!`, result)
	return result
}

async function uploadData(type, data) {
	let URL
	let result = false
	switch (type) {
		case 'MESSAGES': URL = MESSAGES_DATABASE; break
		case 'BLOCKED_USERS': URL = BLOCKED_USERS_DATABASE; break
		case 'ADMIN_USERNAMES': URL = ADMIN_USERNAMES_DATABASE; break
		case 'BLACKLIST_USERNAMES': URL = BLACKLIST_USERNAMES_DATABASE; break
		case 'BLACKLIST_WORDS': URL = BLACKLIST_WORDS_DATABASE; break
		case 'USERS_HISTORY': URL = USERS_HISTORY_DATABASE; break
		default: return false
	}

	console.log(`Uploading ${type}:`, data)

	for (let i = 0; i < MAX_ATTEMPTS; i++) {
		console.log(`Attempt ${i}`)
		result = await fetch(URL, {
			headers: {
				'content-type': 'application/json; charset=UTF-8'
			},
			body: JSON.stringify(data),
			method: 'PUT'
		})
			.then(async r => await r.json())
			.catch(() => false)
		if (result) break
	}

	console.log(`Done!`, result)
	return result
}

module.exports = {
	downloadData,
	uploadData
}