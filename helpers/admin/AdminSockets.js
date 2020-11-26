const { blockedUsers, onlineUsers } = require('../Chat')
module.exports = io => {
	const { authenticate } = require('./AdminAuth')

	io.of('/admin').on('connection', function (socket) {
		if (!authenticate(socket.handshake.headers.authorization)) {
			socket.emit('error', {
				code: 'UNAUTHENTICATED_USER',
				description: 'Usuário não autenticado'
			})
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
						e.socket.emit('error', {
							code: 'USER_BLOCKED',
							description: `Você foi banido pelo administrador!\nMotivo: ${reason || 'Não especificado'}`
						})
						e.socket.disconnect()
					})
		})
	})
}