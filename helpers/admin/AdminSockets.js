const { blockedUsers, onlineUsers } = require('../Chat')
function AdminSockets(socketio) {
	const io = socketio
	const { authenticate } = require('./AdminHelpers')

	io.of('/admin').on('connection', function (socket) {
		if (!authenticate(socket.handshake.headers.authorization)) {
			// socket error
			return
		}

		socket.on('ban', data => {
			const { type, user, reason } = data

			switch (type) {
				case 'ID': blockedUsers.push({ userID: user.id, reason }); break
				case 'IP': blockedUsers.push({ userIP: user.ip, reason }); break
			}

			if (user && user.id)
				onlineUsers
					.filter(e => e.userID === user.id)
					.forEach(e => {
						e.socket.emit('error', { 'description': `Você foi banido pelo administrador!\nMotivo: ${reason || 'Não especificado'}` })
						e.socket.disconnect()
					})
		})
	})
}

module.exports = AdminSockets