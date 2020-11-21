function Sockets(http, chat) {
	const MAX_MESSAGES = 300

	const io = require('socket.io')(http)
	const helpers = require('../public/js/Helpers')
	const helpers2 = require('./Helpers')
	const validateUser = require('./ValidateUser')
	const sha1 = require('js-sha1')

	io.of('/chat').on('connection', function (socket) {

		const user = validateUser(socket, chat)
		if (!user) return

		console.log(`[INFO] Dados do usuário:`, user)

		Object.assign(socket, user)
		chat.onlineUsers.push(user)

		console.log(`[INFO] Usuários online:`, chat.onlineUsers)

		socket.emit('initialChat', helpers2.messages(chat.messages))
		io.of('/chat').emit('userConnected', helpers2.user(user))

		socket.on('chat', msg => {
			msg.text = msg.text.trim()
			if (msg.text === '') {
				// socket.emit('error',)
				return
			}
			msg.id = helpers.randomString(50)
			msg.dateTime = Date.now()
			msg.sender = {
				userID: socket.userID,
				userName: socket.userName,
				userColor: socket.userColor
			}
			chat.messages.push(msg)
			if (chat.messages.length > MAX_MESSAGES) chat.messages.splice(0, 1)
			io.of('/chat').emit('chat', helpers2.message(msg))
		})

		socket.on('disconnect', () => {
			console.log(`[INFO] Usuário desconectado: ${socket.id}`)
			delete chat.onlineUsers[chat.onlineUsers.indexOf(user)]
			console.log(`[INFO] Usuários online`, chat.onlineUsers)
			io.of('/chat').emit('userDisconnected', helpers2.user(user))
		})
	})
}

module.exports = Sockets