const MAX_MESSAGES = 300
const { removeFormatChars, convertLetters } = require('./Helpers')
const { typingUsers } = require('./Chat')
const chat = require('./Chat')
const safeData = require('./SafeData')
const fetch = require('node-fetch')
const AbortController = require('abort-controller')
let controller = new AbortController()
let codeController = new AbortController()

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
		if (production && chat.messages.length) notify(message)
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

	function notify(message) {
		let text = ''
		chat.messages.slice(-4).forEach((m, i) => {
			if (i !== 0) text += '\n'
			text += `"${m.sender.userName}": ${removeFormatChars(m.text || '')} ${m.code || ''}`
		})
		controller.abort()
		controller = new AbortController()
		fetch('https://onesignal.com/api/v1/notifications', {
			signal: controller.signal,
			method: 'POST',
			headers: {
				'Authorization': 'Basic YWZjNjQ0ZDYtNzg5MC00ZWJiLWIxZDEtZjg2ZjkwMTliMjk4',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'included_segments': ['Subscribed Users'],
				'app_id': '816dc5a8-149a-4f41-a2e8-2bb933c59e56',
				'contents': { en: text },
				'template_id': '7ccaaaf9-1183-4d8f-aa42-413319e4cd6d'
			})
	})
	}

	if (message.code) {
		let text = `"${message.sender.userName}" convidou para jogar AmongUs!\n` +
			`🔵 Código da sala:\n` +
			`${message.code.split('').join('   ')}\n` +
			`${convertLetters(message.code)}`
		codeController.abort()
		codeController = new AbortController()
		fetch('https://onesignal.com/api/v1/notifications', {
			signal: codeController.signal,
			method: 'POST',
			headers: {
				'Authorization': 'Basic YWZjNjQ0ZDYtNzg5MC00ZWJiLWIxZDEtZjg2ZjkwMTliMjk4',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'included_segments': ['Subscribed Users'],
				'app_id': '816dc5a8-149a-4f41-a2e8-2bb933c59e56',
				'contents': { en: text },
				'template_id': '1859dd1c-5949-4c86-a4cf-c52cbbd1c6f4',
				'web_push_topic': 'codes'
			})
		})
	}

	return {
		userConnected,
		userDisconnected,
		message,
		typing
	}
}

module.exports = Actions