const sha1 = require('js-sha1')

function message(msg) {
	return {
		id: msg.id,
		dateTime: msg.dateTime,
		text: msg.text,
		...(msg.code && { code: msg.code }),
		sender: {
			userIDHash: sha1(msg.sender.userID),
			userName: msg.sender.userName,
			userColor: msg.sender.userColor
		},
		...(msg.badge && {
			badge: msg.badge
		})
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

function users(uss) {
	const users = [...uss]
	for (i in users) {
		users[i] = user(users[i])
	}
	return users
}

module.exports = {
	message,
	messages,
	user,
	users
}