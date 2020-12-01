const MAX_MESSAGES = 300
const { typingUsers } = require('./Chat')
const chat = require('./Chat')
const safeData = require('./SafeData')

function Actions(io) {
	function userConnected(socket, user) {
		Object.assign(socket, user)
		chat.onlineUsers.push(user)
		socket.emit('initialChat', safeData.messages(chat.messages))
		socket.emit('typing', safeData.users(typingUsers))
		socket.broadcast.emit('userConnected', safeData.user(user))
		io.of('/admin').emit('userConnected', {
			userID: user.userID,
			userIP: socket.handshake.headers['x-forwarded-for'],
			userName: user.userName,
			userColor: user.userColor,
		})
	}

	function userDisconnected(socket, user) {
		delete chat.onlineUsers[chat.onlineUsers.indexOf(user)]
		socket.broadcast.emit('userDisconnected', safeData.user(user))
		io.of('/admin').emit('userDisconnected', {
			userID: user.userID,
			userName: user.userName,
			userColor: user.userColor
		})
		typing(socket, user, false)
	}

	function message(socket, message) {
		chat.messages.push(message)
		if (chat.messages.length > MAX_MESSAGES) chat.messages.splice(0, 1)
		io.of('/chat').emit('chat', safeData.message(message))
		io.of('/admin').emit('chat', message)
		typing(socket, message.sender, false)
	}

	function typing(socket, user, typing) {
		const userInfo = {
			userID: user.userID,
			userName: user.userName,
			userColor: user.userColor
		}

		if (typing && typingUsers.findIndex(e => e.userID === userInfo.userID) === -1) typingUsers.push(userInfo)
		else if (typingUsers.findIndex(e => e.userID === userInfo.userID) !== -1)
			typingUsers.splice(typingUsers.findIndex(e => e.userID === userInfo.userID), 1)
		io.of('/chat').emit('typing', safeData.users(typingUsers))
		io.of('/admin').emit('typing', typingUsers)
	}

	return {
		userConnected,
		userDisconnected,
		message,
		typing
	}
}

module.exports = Actions