const ACCEPTED_COLORS = [
	'red', 'blue', 'green', 'pink', 'orange', 'yellow', 'gray', 'white', 'purple', 'brown', 'cyan', 'lime'
]

const { randomString } = require('./Helpers')
const Validator = require('jsonschema').Validator
const v = new Validator()
const chat = require('./Chat')
const { adminUserName } = require('./Chat')
const authenticate = require('./admin/AdminAuth')
const cons = {
	blockedUser: require('./validators/blockedUser'),
	message: require('./validators/message'),
	messageSend: require('./validators/messageSend')
}

function validateUser(socket) {
	let { userID, userName, userColor } = socket.handshake.query
	const userIP = socket.handshake.headers['x-forwarded-for']
	const blockedUser = chat.blockedUsers.filter(e =>
		(e.userID && e.userID === userID) || (e.userIP && e.userIP === userIP))

	if (userID && userID.length === 30 && blockedUser.length) {
		socket.emit('banned', { reason: blockedUser[0].reason })
		socket.disconnect()
		return false
	}

	if (!userID || userID.length !== 30) {
		socket.emit('setID', userID = randomString(30))
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
		userName: userName,
		userColor: userColor,
		socketID: undefined,
		onlineTime: undefined
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