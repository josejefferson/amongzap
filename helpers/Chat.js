function Chat() {
	let messages = []
	let onlineUsers = []

	function getMessages() {return messages}

	return {
		messages,
		onlineUsers,
		getMessages
	}
}

module.exports = Chat()