const sha1 = require('js-sha1')

module.exports = {
	message: msg => {
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
	},

	messages: msgs => {
		const messages = [...msgs]
		for (i in messages) {
			messages[i] = this.message(messages[i])
		}
		return messages
	},

	user: us => {
		return {
			userIDHash: sha1(us.userID),
			userName: us.userName,
			userColor: us.userColor
		}
	}
}
