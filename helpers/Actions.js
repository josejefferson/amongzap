const MAX_MESSAGES = 300
const chat = require('./Chat')
const safeData = require('./SafeData')

module.exports = io => ({
	userConnected: (socket, user) => {
		Object.assign(socket, user)
		chat.onlineUsers.push(user)
		socket.emit('initialChat', safeData.messages(chat.messages))
		socket.broadcast.emit('userConnected', safeData.user(user))
		io.of('/admin').emit('userConnected', {
			userID: user.userID,
			userIP: socket.handshake.headers['x-forwarded-for'],
			userName: user.userName,
			userColor: user.userColor,
		})
	},

	userDisconnected: (socket, user) => {
		delete chat.onlineUsers[chat.onlineUsers.indexOf(user)]
		socket.broadcast.emit('userDisconnected', safeData.user(user))
		io.of('/admin').emit('userDisconnected', {
			userID: user.userID,
			userName: user.userName,
			userColor: user.userColor
		})
	},

	message: (socket, message) => {
		chat.messages.push(message)
		if (chat.messages.length > MAX_MESSAGES) chat.messages.splice(0, 1)
		io.of('/chat').emit('chat', safeData.message(message))
		io.of('/admin').emit('chat', message)
	}
})