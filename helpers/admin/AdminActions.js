const { blockedUsers, onlineUsers } = require('../Chat')

module.exports = io => ({
	ban: (socket, data) => {
		const { type, user, reason } = data

		switch (type) {
			case 'ID': blockedUsers.push({ userID: user.id, reason }); break
			case 'IP': blockedUsers.push({ userIP: user.ip, reason }); break
		}

		if (user && user.id)
			onlineUsers
				.filter(e => e.userID === user.id)
				.forEach(e => {
					e.socket.emit('banned', { reason })
					e.socket.disconnect()
				})
	}
})