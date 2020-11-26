const chat = require('./Chat')
const fetchData = require('./FetchData')
const { validateMessage, validateBlockedUser, /*validateBlockedUserID, validadeBlockedIP*/ } = require('./Validators')

async function preparation() {
	const messages = await fetchData('MESSAGES')
	const blockedUsers = await fetchData('BLOCKED_USERS')
	// const blockedUsersIDs = await fetchData('BLOCKED_USERIDS')
	// const blockedIPs = await fetchData('BLOCKED_IPS')

	if (messages && Array.isArray(messages)) {
		messages.forEach((m, i) => { if (!validateMessage(m)) messages.splice(i, 1) })
		chat.messages = messages
	}
	if (blockedUsers && Array.isArray(blockedUsers)) {
		blockedUsers.forEach((b, i) => { if (!validateBlockedUser(b)) blockedUsers.splice(i, 1) })
		chat.blockedUsers = blockedUsers
	}
	// if (blockedUsersIDs && Array.isArray(blockedUsersIDs)) {
	// 	blockedUsersIDs.forEach((b, i) => { if (!validateBlockedUserID(b)) blockedUsersIDs.splice(i, 1) })
	// 	chat.blockedUsersIDs = blockedUsersIDs
	// }
	// if (blockedIPs && Array.isArray(blockedIPs)) {
	// 	blockedIPs.forEach((b, i) => { if (!validadeBlockedIP(b)) blockedIPs.splice(i, 1) })
	// 	chat.blockedIPs = blockedIPs
	// }
}

module.exports = preparation()