const MAX_MESSAGES = 300
const { typingUsers } = require('./Chat')
const chat = require('./Chat')
const safeData = require('./SafeData')
const fetch = require('node-fetch')

function Actions(io) {
	function userConnected(socket, user) {
		Object.assign(socket, user)
		chat.onlineUsers.push(user)
		chat.userHistory.push(user)
		socket.emit('initialChat', safeData.messages(chat.messages))
		socket.emit('sendEnabled', chat.sendEnabled)
		socket.emit('typing', safeData.users(typingUsers))
		socket.broadcast.emit('userConnected', safeData.user(user))
		io.of('/admin').emit('+onlineUsers', user)
		io.of('/admin').emit('+userHistory', user)
	}

	function userDisconnected(socket, user) {
		chat.onlineUsers.splice(chat.onlineUsers.indexOf(user), 1)
		socket.broadcast.emit('userDisconnected', safeData.user(user))
		io.of('/admin').emit('-onlineUsers', user)
		typing(socket, user, false)
	}

	function message(socket, message) {
		chat.messages.push(message)
		if (chat.messages.length > MAX_MESSAGES) chat.messages.splice(0, 1)
		io.of('/chat').emit('chat', safeData.message(message))
		io.of('/admin').emit('+messages', message)
		typing(socket, message.sender, false)

		// Notificação
		if (production && chat.messages.length) {
			let message = ''
			chat.messages.slice(-4).forEach((m, i) => {
				if (i !== 0) message += '\n'
				message += `"${m.sender.userName}": ${m.text}`
			})
			fetch('https://onesignal.com/api/v1/notifications', {
				method: 'POST',
				headers: {
					'Authorization': 'Basic YWZjNjQ0ZDYtNzg5MC00ZWJiLWIxZDEtZjg2ZjkwMTliMjk4',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					'included_segments': ['Subscribed Users'],
					'app_id': '816dc5a8-149a-4f41-a2e8-2bb933c59e56',
					'contents': { en: message },
					'template_id': '7ccaaaf9-1183-4d8f-aa42-413319e4cd6d'
				})
			})
		}
	}

	function typing(socket, user, typing) {
		const userInfo = {
			userID: user.userID,
			userName: user.userName,
			userColor: user.userColor
		}

		if (typing && typingUsers.findIndex(e => e.userID === userInfo.userID) === -1) typingUsers.push(userInfo)
		else if (typingUsers.findIndex(e => e.userID === userInfo.userID) !== -1)
			typingUsers.splice(typingUsers.findIndex(e => e.userID === userInfo.userID), 1)
		io.of('/chat').emit('typing', safeData.users(typingUsers))
		io.of('/admin').emit('*typingUsers', typingUsers)
	}

	return {
		userConnected,
		userDisconnected,
		message,
		typing
	}
}

module.exports = Actions