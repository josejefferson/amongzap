const sha1 = require('js-sha1')
function SafeData() {
	function message(msg) {
		return {
			id: msg.id,
			dateTime: msg.dateTime,
			text: msg.text,
			sender: {
				userIDHash: sha1(msg.sender.userID),
				userName: msg.sender.userName,
				userColor: msg.sender.userColor
			}
		}
	}

	function messages(msgs) {
		const messages = [...msgs]
		for (i in messages) {
			messages[i] = message(messages[i])
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

module.exports = SafeData()