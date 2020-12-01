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
	},
	
	unBan: (socket, data) => {
		const { type, user } = data
		switch (type) {
			case 'ID': blockedUsers.splice(blockedUsers.findIndex(el => el.userID === user), 1); break
			case 'IP': blockedUsers.splice(blockedUsers.findIndex(el => el.userIP === user), 1); break
		}
	}
})