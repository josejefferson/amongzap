const ACCEPTED_COLORS = [
	'red', 'blue', 'green', 'pink', 'orange', 'yellow', 'gray', 'white', 'purple', 'brown', 'cyan', 'lime'
]
const MAX_LENGTH_MESSAGE = 500
const MESSAGE_CODE_LENGTH = 6
const MESSAGE_ID_LENGTH = 50
const USER_ID_LENGTH = 30

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
	const blockedUser = chat.blockedUsers.filter(e => e.type === 'ID' ? userID === e.userID : userIP === e.userIP)

	if (userID && userID.length === 30 && blockedUser.length) {
		socket.emit('banned', { reason: blockedUser[0].reason })
		socket.disconnect()
		return false
	}

	if (!userID || userID.length !== 30) {
		userID = randomString(30)
		socket.emit('setID', userID)
	}

	if (!userName) {
		socket.emit('error', {
			errorCode: 'INVALID_USER_NAME',
			description: 'Nome de usuário inválido!'
		})
		socket.disconnect()
		return false
	}

	userName = userName.trim().slice(0, 10)

	if (userName.toLowerCase() === adminUserName.toLowerCase()) {
		if (!authenticate(socket.handshake.headers.authorization)) {
			socket.emit('error', {
				errorCode: 'ADMIN_USER_NAME',
				description: 'Nome de usuário já é usado pelo administrador!'
			})
			return false
		}
	}

	if (!ACCEPTED_COLORS.includes(userColor)) {
		userColor = ACCEPTED_COLORS[Math.floor(Math.random() * 12)]
	}

	return {
		socket,
		userID: userID,
		userName: userName,
		userColor: userColor
	}
}


function validateMessageText(socket, data) {
	if (!v.validate(data, cons.messageSend).valid) {
		socket.emit('error', {
			code: 'INVALID_MESSAGE_TEXT',
			description: 'Mensagem inválida!'
		})
		return false
	}

	// ===== Não é função do validador =====
	return {
		...(data.text && { text: data.text.trim() }),
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