const chat = require('../chat')
const safeData = require('../safeData')
const { uploadData } = require('../fetchData')

module.exports = io => ({
	ban: data => {
		chat.blockedUsers.push(data)
		
		function banned(e) {
			e.socket.emit('banned', data.reason)
			e.socket.disconnect()
		}
		if (data.type === 'ID') chat.onlineUsers.filter(u => u.userID === data.user).forEach(banned)
		if (data.type === 'IP') chat.onlineUsers.filter(u => u.userIP === data.user).forEach(banned)
		io.of('/admin').emit('+blockedUsers', data)
	},

	unBan: data => {
		const i = chat.blockedUsers.findIndex(u => u.type === data.type && u.user === data.user)
		if (i > -1) { 
			const del = chat.blockedUsers.splice(i, 1)
			io.of('/admin').emit('-blockedUsers', del[0])
		}
	},

	sendEnabled: data => {
		chat.sendEnabled = data
		io.of('/chat').emit('sendEnabled', data)
		io.of('/admin').emit('*sendEnabled', data)
	},

	deleteMsg: data => {
		const i = chat.messages.findIndex(m => m.id === data)
		if (i > -1) msg = chat.messages.splice(index, 1)
		io.of('/chat').emit('deleteMsg', data)
		io.of('/admin').emit('-messages', msg[0])
	},
	
	disconnect: user => {
		const users = chat.onlineUsers.filter(u => u.socketID === user)
		users.forEach(u => u.socket.disconnect())
	},
	
	stopTyping: userID => {
		const i = chat.typingUsers.findIndex(u => u.userID === userID)
		if (i > -1) chat.typingUsers.splice(i, 1)
		io.of('/chat').emit('typing', safeData.users(chat.typingUsers))
		io.of('/admin').emit('*typingUsers', chat.typingUsers)
	},
	
	backup: () => {
		uploadData('MESSAGES', chat.messages)
		uploadData('BLOCKED_USERS', chat.blockedUsers)
	}
})