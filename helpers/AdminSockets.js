const { onlineUsers } = require('./Chat')

function AdminSockets(http, chat) {
	const io = require('socket.io')(http)
	const { authenticate } = require('./AdminHelpers')
	// const { tokens } = require('./AdminHelpers')

	io.of('/admin').on('connection', function (socket) {
		if (!authenticate(socket.handshake.headers.authorization)) {
			// socket error
			return
		}

		socket.on('test', console.log)
	})
}

module.exports = AdminSockets