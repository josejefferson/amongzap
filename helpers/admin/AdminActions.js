const chat = require('../Chat')

module.exports = io => ({
	ban: data => {
		const { type, user, reason } = data

		switch (type) {
			case 'ID': chat.blockedUsers.push({ userID: user.id, reason }); break
			case 'IP': chat.blockedUsers.push({ userIP: user.ip, reason }); break
		}

		if (user && user.id)
			chat.onlineUsers
				.filter(e => e.userID === user.id)
				.forEach(e => {
					e.socket.emit('banned', { reason })
					e.socket.disconnect()
				})

		io.of('/admin').emit('ban', data)
	},

	unBan: data => {
		const { type, user } = data
		switch (type) {
			case 'ID': chat.blockedUsers.splice(chat.blockedUsers.findIndex(el => el.userID === user), 1); break
			case 'IP': chat.blockedUsers.splice(chat.blockedUsers.findIndex(el => el.userIP === user), 1); break
		}
		io.of('/admin').emit('unban', data)
	},

	sendEnabled: data => {
		chat.sendEnabled = data
		io.of('/chat').emit('sendEnabled', data)
		io.of('/admin').emit('sendEnabled', data)
	},

	deleteMsg: data => {
		const index = chat.messages.findIndex(m => m.id === data)
		if (index >= 0) chat.messages.splice(index, 1)
		io.of('/chat').emit('deleteMsg', data)
		io.of('/admin').emit('deleteMsg', data)
	}
})