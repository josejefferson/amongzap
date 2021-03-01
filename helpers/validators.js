const ACCEPTED_COLORS = [
	'red', 'blue', 'green', 'pink', 'orange', 'yellow', 'gray', 'white', 'purple', 'brown', 'cyan', 'lime'
]

const { randomString } = require('./helpers')
const Validator = require('jsonschema').Validator
const v = new Validator()
const chat = require('./chat')
const { adminUserName } = require('./chat')
const authenticate = require('./admin/adminAuth')
const cons = {
	blockedUser: require('./validators/blockedUser'),
	message: require('./validators/message'),
	messageSend: require('./validators/messageSend')
}

function ip(ipAddress) {
	if (!ipAddress) return false
	if (ipAddress === '::1') return false
	return ipAddress
}

function validateUser(socket) {
	let { userID, userName, userColor } = socket.handshake.query
	const userIP = ip(socket?.handshake?.headers?.['x-forwarded-for']) ||
		ip(socket?.handshake?.headers?.['x-real-ip']) ||
		ip(socket?.handshake?.address) ||
		ip(socket?.conn?.remoteAddress) ||
		ip(socket?.request?.connection?.remoteAddress) ||
		ip(socket?.request?.connection?._peername?.address) ||
		'0.0.0.0'
	const userAgent = socket?.handshake?.headers?.['user-agent']
	console.log(userIP)
	console.log(userAgent)

	const blockedUser = chat.blockedUsers.filter(e =>
		(e.type === 'ID' && e.user === userID) ||
		(e.type === 'IP' && e.user === userIP))

	if (!userID || userID.length !== 30) {
		socket.emit('setID', userID = randomString(30))
	}

	if (blockedUser.length) {
		socket.emit('banned', blockedUser[0].reason)
		socket.disconnect()
		return false
	}

	if (!/^[A-Za-z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/.test(userName)) {
		socket.emit('error', 'Nome de usuário inválido!')
		socket.disconnect()
		return false
	}

	userName = userName.trim().slice(0, 10)
	if (userName.toLowerCase() === adminUserName.toLowerCase()) {
		if (!authenticate(socket.handshake.headers.authorization)) {
			socket.emit('error', 'Este nome de usuário já é usado pelo administrador!')
			socket.disconnect()
			return false
		}
	}

	if (!ACCEPTED_COLORS.includes(userColor)) {
		socket.emit('setColor', userColor = ACCEPTED_COLORS[Math.floor(Math.random() * 12)])
	}

	return {
		__proto__: { socket },
		userID: userID,
		userIP: userIP,
		userAgent: userAgent,
		userName: userName,
		userColor: userColor,
		socketID: socket.id,
		onlineTime: Date.now()
	}
}


function validateMessageText(socket, data) {
	if (!chat.sendEnabled) {
		socket.emit('error', 'O envio de mensagens foi desativado temporariamente pelo administrador')
		return false
	}

	if (!v.validate(data, cons.messageSend).valid) {
		socket.emit('error', 'Mensagem inválida!')
		return false
	}

	// ===== Não é função do validador =====
	return {
		text: data.text.trim() || '',
		...(data.code && { code: data.code.toUpperCase() }),
		id: randomString(50),
		dateTime: Date.now(),
		sender: {
			userID: socket.userID,
			userName: socket.userName,
			userColor: socket.userColor
		},
		...(chat.adminUserName === socket.userName && {
			badge: {
				icon: 'crown',
				text: 'Admin',
				color: 'goldenrod'
			}
		})
	}
	// =====================================
}


function validateMessage(data) {
	if (v.validate(data, cons.message).valid) return true
	return false
}


function validateBlockedUser(data) {
	if (v.validate(data, cons.blockedUser).valid) return true
	return false
}

module.exports = {
	validateUser,
	validateMessageText,
	validateMessage,
	validateBlockedUser
}