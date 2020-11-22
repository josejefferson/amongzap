const MESSAGES_DATABASE = 'https://jsonstorage.net/api/items/059b742b-adfd-47d6-92b6-6d91aed5e6bb'
const BLOCKED_USERS_DATABASE = 'https://jsonstorage.net/api/items/82b20039-1695-422a-af20-1d3149d806fc'
const LOG_DATABASE = 'https://jsonstorage.net/api/items/9c3a875e-b1b5-46ab-87dc-af880a5bcdb2'
const USERS_LOG = 'https://jsonstorage.net/api/items/faa65f13-e124-4adc-980f-dd399cc5e159'
const MAX_ATTEMPTS = 3

const fetch = require('node-fetch')

function Databases() {
	async function getMessages() {
		let result = false
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			await fetch(MESSAGES_DATABASE)
				.then(async r => {
					return result = await r.json()
				})
				.catch((err) => console.log('[ERRO] Falha ao baixar mensagens',err))
		}
		console.log(result)
		if (!Array.isArray(result)) return false
		return result
	}

	async function getBlockedUsers() {
		let result = false
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			await fetch(BLOCKED_USERS_DATABASE)
				.then(r => result = r.json())
				.catch(() => console.log('[ERRO] Falha ao baixar mensagens'))
		}
		if (!Array.isArray(result)) return false
		return result
	}

	return {
		getMessages,
		getBlockedUsers
	}
}

module.exports = Databases()