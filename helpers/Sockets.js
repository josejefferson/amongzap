const chat = require('./Chat')
const repairUser = require('./RepairUser')
const { validateMessageText } = require('./Validators')
const { randomString } = require('./Helpers')


module.exports = io => {
	const MAX_MESSAGES = 300
	const admin = require('./admin/AdminActions')(io)

	io.of('/chat').on('connection', socket => {
		const user = repairUser(socket)
		if (!user) { socket.disconnect(); return }
		admin.userConnected(socket, user)

		socket.on('chat', msg => {
			if (!validateMessageText(msg)) {
				socket.emit('error', {
					code: 'INVALID_MESSAGE_TEXT',
					description: 'Mensagem inválida!'
				})
				return
			}

			const message = { // tentar colocar em um arquivo de reparar
				text: msg.text.trim(),
				id: randomString(50),
				dateTime: Date.now(),
				sender: {
					userID: socket.userID,
					userName: socket.userName,
					userColor: socket.userColor
				}
			}
			admin.message(socket, message)
		})

		socket.on('disconnect', () => admin.userDisconnected(socket, user))
	})
}