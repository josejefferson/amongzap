function Sockets(http, chat) {
	const MAX_MESSAGES = 300
	const MAX_LENGTH_MESSAGE = 500

	const io = require('socket.io')(http)
	const helpers = require('../public/js/Helpers')
	const safeData = require('./SafeData')
	const validateUser = require('./ValidateUser')
	const sha1 = require('js-sha1')

	io.of('/chat').on('connection', function (socket) {
		const user = validateUser(socket, chat)
		if (!user) return

		console.log(`[INFO] Dados do usuário:`, user)

		Object.assign(socket, user)
		chat.onlineUsers.push(user)

		console.log(`[INFO] Usuários online:`, chat.onlineUsers)

		socket.emit('initialChat', safeData.messages(chat.messages))
		socket.broadcast.emit('userConnected', safeData.user(user))

		socket.on('chat', msg => {
			const message = {}
			
			if (typeof msg.text == 'string' &&
				msg.text.trim !== '' &&
				msg.text.length <= MAX_LENGTH_MESSAGE
			) {
				message.text = msg.text.trim()
			} else {
				// socket.emit(error INVALID_MESSAGE_TEXT
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
			console.log(`[INFO] Usuário desconectado: ${socket.id}`)
			delete chat.onlineUsers[chat.onlineUsers.indexOf(user)]
			console.log(`[INFO] Usuários online`, chat.onlineUsers)
			socket.broadcast.emit('userDisconnected', safeData.user(user))
		})
	})
}

module.exports = Sockets