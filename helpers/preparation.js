const BACKUP_TIME = 10 * 60 * 1000

const chat = require('./chat')
const { downloadData, uploadData } = require('./fetchData')
const { validateMessage, validateBlockedUser } = require('./validators')

async function preparation() {
	let messages = downloadData('MESSAGES')
	let blockedUsers = downloadData('BLOCKED_USERS')

	await Promise.all([messages, blockedUsers]).then(v => {
		messages = v[0]
		blockedUsers = v[1]
	})

	if (messages && Array.isArray(messages)) {
		messages.forEach((m, i) => { if (!validateMessage(m)) messages.splice(i, 1) })
		chat.messages = messages
	}
	if (blockedUsers && Array.isArray(blockedUsers)) {
		blockedUsers.forEach((b, i) => { if (!validateBlockedUser(b)) blockedUsers.splice(i, 1) })
		chat.blockedUsers = blockedUsers
	}

	setInterval(() => {
		// TODO: ativar o backup
		uploadData('MESSAGES', chat.messages)
		uploadData('BLOCKED_USERS', chat.blockedUsers)
	}, BACKUP_TIME)
	
	// uploadData('MESSAGES', [])
}

module.exports = preparation()