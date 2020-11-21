function Helpers() { // mudar nome para algo como corrigidores
	const sha1 = require('js-sha1')

	function message(msg) {
		let message = { ...msg }
		message.sender = { ...message.sender }
		message.sender.userIDHash = sha1(message.sender.userID)
		delete message.sender.userID
		delete message.id

		return message
	}

	function messages(msgs) {
		let messages = [...msgs]
		for (m in messages) {
			messages[m] = message(messages[m])
		}

		return messages
	}

	function user(us) {
		return {
			userIDHash: sha1(us.userID),
			userName: us.userName,
			userColor: us.userColor
		}
	}

	return {
		message,
		messages,
		user
	}
}

module.exports = Helpers()