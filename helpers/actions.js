const MAX_MESSAGES = 300
const { removeFormatChars, convertLetters } = require('./helpers')
const { typingUsers } = require('./chat')
const fetchData = require('./fetchData')
const chat = require('./chat')
const safeData = require('./safeData')
const AbortController = require('abort-controller')
let controller = new AbortController()
let codeController = new AbortController()
let onlineController = new AbortController()

function Actions(io) {
	function userConnected(socket, user) {
		Object.assign(socket, user)
		chat.onlineUsers.push(user)
		userHistory(user)
		socket.emit('initialChat', safeData.messages(chat.messages))
		socket.emit('onlineUsers', safeData.users(chat.onlineUsers))
		socket.emit('sendEnabled', chat.sendEnabled)
		socket.emit('typing', safeData.users(typingUsers))
		socket.broadcast.emit('userConnected', safeData.user(user))
		io.of('/admin').emit('+onlineUsers', user)
		if (production) notifyOnline(user)
	}

	function userDisconnected(socket, user, reason) {
		const internetProblem = reason === 'ping timeout'
		const i = chat.onlineUsers.indexOf(user)
		if (i > -1) chat.onlineUsers.splice(i, 1)
		socket.broadcast.emit('userDisconnected', safeData.user(user, internetProblem))
		io.of('/admin').emit('-onlineUsers', user)
		typing(socket, user, false)
	}

	function message(socket, message) {
		chat.messages.push(message)
		if (chat.messages.length > MAX_MESSAGES) chat.messages.splice(0, 1)
		io.of('/chat').emit('chat', safeData.message(message))
		io.of('/admin').emit('+messages', message)
		typing(socket, message.sender, false)
		notify(message)
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

	function userHistory(user) {
		let { userID, userName, userColor, socketID, onlineTime, userIP, userAgent } = user
		const uidx = chat.userHistory.findIndex(u => userIP.startsWith(u.userIPBase))
		if (uidx < 0) {
			const newUser = {
				userIPBase: userIP.split('.').slice(0, 3).join('.'),
				userIPs: [userIP],
				userIDs: [userID],
				userNames: [userName],
				userColors: [userColor],
				socketIDs: [socketID],
				onlineTimes: [onlineTime],
				userAgents: [userAgent]
			}
			chat.userHistory.push(newUser)
			return io.of('/admin').emit('userHistory', newUser)
		}

		const { userIPs, userIDs, userNames, userColors, userAgents, socketIDs, onlineTimes } = chat.userHistory[uidx]
		userIPs.indexOf(userIP) === -1 && userIPs.push(userIP)
		userIDs.indexOf(userID) === -1 && userIDs.push(userID)
		userNames.indexOf(userName) === -1 && userNames.push(userName)
		userColors.indexOf(userColor) === -1 && userColors.push(userColor)
		userAgents.indexOf(userAgent) === -1 && userAgents.push(userAgent)
		socketIDs.indexOf(socketID) === -1 && socketIDs.push(socketID)
		onlineTimes.indexOf(onlineTime) === -1 && onlineTimes.push(onlineTime)

		/*chat.userHistory[uidx].userIPs = [...userIPs].reverse().splice(0, 5).reverse()
		chat.userHistory[uidx].userIDs = [...userIDs].reverse().splice(0, 5).reverse()
		chat.userHistory[uidx].userNames = [...userNames].reverse().splice(0, 5).reverse()
		chat.userHistory[uidx].userColors = [...userColors].reverse().splice(0, 5).reverse()
		chat.userHistory[uidx].userAgents = [...userAgents].reverse().splice(0, 5).reverse()
		chat.userHistory[uidx].socketIDs = [...socketIDs].reverse().splice(0, 5).reverse()
		chat.userHistory[uidx].onlineTimes = [...onlineTimes].reverse().splice(0, 5).reverse()*/

		io.of('/admin').emit('userHistory', chat.userHistory[uidx])
	}

	function notify(message) {
		if (!message.code) {
			controller.abort()
			controller = new AbortController()
			const title = message.sender.userName
			const text = removeFormatChars(message.text || '')
			const template = '7ccaaaf9-1183-4d8f-aa42-413319e4cd6d'
			const icon = `https://amongzap.herokuapp.com/img/players/${message.sender.userColor}.png`
			const topic = 'message'
			const signal = controller.signal

			fetchData.notify(title, text, template, icon, topic, signal)

		} else {
			codeController.abort()
			codeController = new AbortController()
			const title = `"${message.sender.userName}" está te chamando para jogar AmongUs!`
			const text = '🔵 Código da sala: ' +
				message.code.split('').join('') + '\n' +
				convertLetters(message.code) + '\n' +
				removeFormatChars(message.text || '')
			const template = '1859dd1c-5949-4c86-a4cf-c52cbbd1c6f4'
			const icon = `https://amongzap.herokuapp.com/img/players/${message.sender.userColor}.png`
			const topic = 'codes'
			const signal = codeController.signal

			fetchData.notify(title, text, template, icon, topic, signal)
		}
	}

	function notifyOnline(user) {
		onlineController.abort()
		onlineController = new AbortController()

		const title = `"${user.userName}" está online agora!`
		const text = 'Entre no AmongZap para conversarem'
		const template = 'add5428c-c16c-4030-981a-fbada1b06891'
		const icon = `https://amongzap.herokuapp.com/img/players/${user.userColor}.png`
		const topic = 'online'
		const signal = onlineController.signal
		const segments = ['Test Users']

		fetchData.notify(title, text, template, icon, topic, signal, segments)
	}

	return {
		userConnected,
		userDisconnected,
		message,
		typing
	}
}

module.exports = Actions