const sha1 = require('js-sha1')

module.exports = {
	message: function (msg) { // validar mensagens inválidas (colocar badge de erro)
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

	messages: function (msgs) {
		const messages = [...msgs]
		for (i in messages) {
			messages[i] = this.message(messages[i])
		}
		return messages
	},

	user: function (us) {
		return {
			userIDHash: sha1(us.userID),
			userName: us.userName,
			userColor: us.userColor
		}
	}
}