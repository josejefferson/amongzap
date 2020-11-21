function Sockets(http, chat) {
	const MAX_MESSAGES = 300

	const io = require('socket.io')(http)
	const helpers = require('../public/js/Helpers')
	const validateUser = require('./ValidateUser')
	const sha1 = require('js-sha1')

	io.of('/chat').on('connection', function (socket) {

		const user = validateUser(socket, chat)
		if (!user) return

		console.log(`[INFO] Dados do usuário:`, user)

		Object.assign(socket, user)
		chat.onlineUsers.push(user)

		console.log(`[INFO] Usuários online:`, chat.onlineUsers)

		// let messages = Object.assign([], chat.getMessages()) // ERRO! Ele está modificando as mensagens originais
		// for (m of messages) {
		// 	const i = messages.indexOf(m)
		// 	messages[i].sender.userIDHash = sha1(m.sender.userID)
		// 	// delete messages[i].sender.userID
		// 	// delete messages[i].id
		// }
		// messages[0] = {test:1}
		// messages.forEach(m => {
		// })
		socket.emit('initialChat', messages)
		io.of('/chat').emit('userConnected', user) /** Ocultar user ID */
		console.log(chat.getMessages())

		socket.on('chat', msg => {
			msg.id = helpers.randomString(50)
			msg.dateTime = Date.now()
			msg.sender = {
				userID: socket.userID,
				userName: socket.userName,
				userColor: socket.userColor
			}
			chat.messages.push(msg)
			if (chat.messages.length > MAX_MESSAGES) chat.messages.splice(0, 1)
			io.of('/chat').emit('chat', {
				dateTime: msg.dateTime,
				text: msg.text,
				sender: {
					userIDHash: sha1(msg.sender.userID),
					userName: msg.sender.userName,
					userColor: msg.sender.userColor
				}
			})
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