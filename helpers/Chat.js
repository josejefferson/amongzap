function Chat() {
	const messages = []
	const onlineUsers = []
	const typingUsers = []
	
	const blockedUserIDs = []
	const blockedIPs = []

	return {
		messages,
		onlineUsers,
		typingUsers,
		blockedUserIDs,
		blockedIPs
	}
}

module.exports = Chat()