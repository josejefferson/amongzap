const authenticate = require('./AdminAuth')

module.exports = io => {
	const actions = require('./AdminActions')(io)

	io.of('/admin').on('connection', function (socket) {
		if (!authenticate(socket.handshake.headers.authorization)) {
			socket.emit('error', {
				code: 'UNAUTHENTICATED_USER',
				description: 'Usuário não autenticado'
			})
			return
		}

		socket.on('ban', actions.ban)
		socket.on('unban', actions.unBan)
		socket.on('sendEnabled', actions.sendEnabled)
		socket.on('deleteMsg', actions.deleteMsg)
	})
}