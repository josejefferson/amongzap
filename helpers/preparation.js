const BACKUP_TIME = 10 * 60 * 1000

const chat = require('./chat')
const { downloadData, uploadData } = require('./fetchData')
const { validateMessage, validateBlockedUser } = require('./validators')

async function preparation() {
	let messages = downloadData('MESSAGES')
	let blockedUsers = downloadData('BLOCKED_USERS')
	let userHistory = downloadData('USER_HISTORY')
	let sendEnabled = downloadData('SEND_ENABLED')

	await Promise.all([messages, blockedUsers, userHistory, sendEnabled]).then(v => {
		messages = v[0]
		blockedUsers = v[1]
		userHistory = v[2]
		sendEnabled = v[3]
	})

	if (messages && Array.isArray(messages)) {
		messages.forEach((m, i) => { if (!validateMessage(m)) messages.splice(i, 1) })
		chat.messages = messages
	}
	if (blockedUsers && Array.isArray(blockedUsers)) {
		blockedUsers.forEach((b, i) => { if (!validateBlockedUser(b)) blockedUsers.splice(i, 1) })
		chat.blockedUsers = blockedUsers
	}
	if (userHistory) {
		chat.userHistory = userHistory
	}
	if (sendEnabled) {
		chat.sendEnabled = sendEnabled.sendEnabled
	}

	setInterval(() => {
		uploadData('MESSAGES', chat.messages)
		uploadData('BLOCKED_USERS', chat.blockedUsers)
		uploadData('USER_HISTORY', chat.userHistory)
		uploadData('SEND_ENABLED', {sendEnabled:chat.sendEnabled})
	}, BACKUP_TIME)
	// uploadData('MESSAGES', [])
}

module.exports = preparation()