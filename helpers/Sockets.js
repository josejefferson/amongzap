function Sockets(http, chat) {
	const io = require('socket.io')(http)
	const helpers = require('../public/js/Helpers')
	const validateUser = require('./ValidateUser')

	io.of('/chat').on('connection', function (socket) {

		const user = validateUser(socket, chat)
		if (!user) return

		console.log(`[INFO] Dados do usuário:`, user)

		Object.assign(socket, user)
		chat.onlineUsers.push(user)

		console.log(`[INFO] Usuários online:`, chat.onlineUsers)

		socket.emit('initialChat', chat.messages)
		io.of('/chat').emit('userConnected', user) /** Ocultar user ID */

		socket.on('chat', msg => {
			msg.id = helpers.randomString(50)
			msg.dateTime = Date.now()
			msg.sender = {
				userID: socket.userID,
				userName: socket.userName,
				userColor: socket.userColor
			}
			chat.messages.push(msg)
			console.log(chat.messages)

			io.of('/chat').emit('chat', msg)
		})

		socket.on('disconnect', () => {
			console.log(`[INFO] Usuário desconectado: ${socket.id}`)
			delete chat.onlineUsers[chat.onlineUsers.indexOf(user)]
			console.log(`[INFO] Usuários online`, chat.onlineUsers)
			io.of('/chat').emit('userDisconnected', user)
		})
	})
}

module.exports = Sockets