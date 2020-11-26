const MESSAGES_DATABASE = 'https://jsonstorage.net/api/items/059b742b-adfd-47d6-92b6-6d91aed5e6bb'
const BLOCKED_USERS_DATABASE = 'https://jsonstorage.net/api/items/82b20039-1695-422a-af20-1d3149d806fc'
const LOG_DATABASE = 'https://jsonstorage.net/api/items/9c3a875e-b1b5-46ab-87dc-af880a5bcdb2'
const USERS_LOG = 'https://jsonstorage.net/api/items/faa65f13-e124-4adc-980f-dd399cc5e159'
const MAX_ATTEMPTS = 3

const fetch = require('node-fetch')

async function fetchData(type) {
	let URL
	let result = false
	switch (type) {
		case 'MESSAGES': URL = MESSAGES_DATABASE; break
		case 'BLOCKED_USERS': URL = BLOCKED_USERS_DATABASE; break
	}

	for (let i = 0; i < MAX_ATTEMPTS; i++) {
		result = await fetch(URL)
			.then(async r => await r.json())
			.catch(() => false)
		if (result) break
	}

	return result
}

module.exports = fetchData