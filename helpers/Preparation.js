const BACKUP_TIME = 10 * 60 * 1000

const chat = require('./Chat')
const { downloadData, uploadData } = require('./FetchData')
const { validateMessage, validateBlockedUser } = require('./Validators')

async function preparation() {
	let messages = downloadData('MESSAGES')
	let blockedUsers = downloadData('BLOCKED_USERS')
	let adminUserNames = downloadData('ADMIN_USERNAMES')

	await Promise.all([messages, blockedUsers, adminUserNames]).then(v => {
		messages = v[0]
		blockedUsers = v[1]
		adminUserNames = v[2]
	})

	if (messages && Array.isArray(messages)) {
		messages.forEach((m, i) => { if (!validateMessage(m)) messages.splice(i, 1) })
		chat.messages = messages
	}
	if (blockedUsers && Array.isArray(blockedUsers)) {
		blockedUsers.forEach((b, i) => { if (!validateBlockedUser(b)) blockedUsers.splice(i, 1) })
		chat.blockedUsers = blockedUsers
	}
	if (adminUserNames && Array.isArray(adminUserNames)) {
		// blockedUsers.forEach((b, i) => { if (!validateBlockedUser(b)) blockedUsers.splice(i, 1) })
		chat.adminUserNames = adminUserNames
	}

	setInterval(() => {
		uploadData('MESSAGES', chat.messages)
		uploadData('BLOCKED_USERS', chat.blockedUsers)
	}, BACKUP_TIME)
}

module.exports = preparation()