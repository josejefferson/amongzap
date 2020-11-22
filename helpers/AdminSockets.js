const { blockedUserIDs, blockedIPs, onlineUsers } = require('./Chat')
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

			if (type === 'IP' && user && user.ip) blockedIPs.push({ userIP: user.ip, reason })
			else if (type === 'ID' && user && user.id) blockedUserIDs.push({ userID: user.id, reason })

			if (user && user.id)
				onlineUsers
					.filter(e => e.userID === user.id)
					.forEach(e => {
						e.socket.emit('error', { 'description': `Você foi banido pelo administrador!\nMotivo: ${reason}` })
						e.socket.disconnect()
					})

			console.log(blockedIPs, blockedUserIDs)
		})
	})
}

module.exports = AdminSockets