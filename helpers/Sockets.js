const chat = require('./Chat')

module.exports = function (socketio) {
	const MAX_MESSAGES = 300
	const MAX_LENGTH_MESSAGE = 500

	const io = socketio
	const helpers = require('./Helpers')
	const safeData = require('./SafeData')
	const validateUser = require('./ValidateUser')

	io.of('/chat').on('connection', function (socket) {
		const user = validateUser(socket, chat)
		if (!user) { socket.disconnect(); return }
		Object.assign(socket, user)
		chat.onlineUsers.push(user)
		socket.emit('initialChat', safeData.messages(chat.messages))
		socket.broadcast.emit('userConnected', safeData.user(user))

		socket.on('chat', msg => {
			const message = {}
			
			if (typeof msg === 'object' &&
				typeof msg.text === 'string' &&
				msg.text.trim() !== '' &&
				msg.text.length <= MAX_LENGTH_MESSAGE
			) {
				message.text = msg.text.trim()
			} else {
				socket.emit('error', {
					code: 'INVALID_MESSAGE_TEXT',
					description: 'Mensagem inválida!'
				})
				return
			}
	
			message.id = helpers.randomString(50)
			message.dateTime = Date.now()
			message.sender = {
				userID: socket.userID,
				userName: socket.userName,
				userColor: socket.userColor
			}
			chat.messages.push(message)
			if (chat.messages.length > MAX_MESSAGES) chat.messages.splice(0, 1)
			io.of('/chat').emit('chat', safeData.message(message))
		})

		socket.on('disconnect', () => {
			delete chat.onlineUsers[chat.onlineUsers.indexOf(user)]
			socket.broadcast.emit('userDisconnected', safeData.user(user))
		})
	})
}