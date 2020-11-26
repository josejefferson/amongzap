const chat = require('./Chat')
const fetchData = require('./FetchData')
const { validateMessage, validateBlockedUser } = require('./Validators')

async function preparation() {
	const messages = await fetchData('MESSAGES')
	const blockedUsers = await fetchData('BLOCKED_USERS')

	if (messages && Array.isArray(messages)) {
		messages.forEach((m, i) => { if (!validateMessage(m)) messages.splice(i, 1) })
		chat.messages = messages
	}
	if (blockedUsers && Array.isArray(blockedUsers)) {
		blockedUsers.forEach((b, i) => { if (!validateBlockedUser(b)) blockedUsers.splice(i, 1) })
		chat.blockedUsers = blockedUsers
	}
}

module.exports = preparation()