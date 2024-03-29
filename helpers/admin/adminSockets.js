const authenticate = require('./adminAuth')
const chat = require('../chat')

module.exports = io => {
	const actions = require('./adminActions')(io)

	io.of('/admin').on('connection', function (socket) {
		if (!authenticate(socket.handshake.headers.authorization)) return socket.disconnect()

		socket.emit('initialData', chat)
		socket.on('ban', actions.ban)
		socket.on('unban', actions.unBan)
		socket.on('disconnectUser', actions.disconnect)
		socket.on('sendEnabled', actions.sendEnabled)
		socket.on('deleteMsg', actions.deleteMsg)
		socket.on('stopTyping', actions.stopTyping)
		socket.on('backup', actions.backup)
	})
}