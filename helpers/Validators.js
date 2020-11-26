const ACCEPTED_COLORS = [
	'red', 'blue', 'green', 'pink', 'orange', 'yellow', 'gray', 'white', 'purple', 'brown', 'cyan', 'lime'
]
const MAX_LENGTH_MESSAGE = 500
const MESSAGE_ID_LENGTH = 30
const USER_ID_LENGTH = 30

const { randomString } = require('./Helpers')
const validate = require('validate.js')
const chat = require('./Chat')

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
	const CONSTRAINTS = {
		'text': { presence: { allowEmpty: false }, type: 'string', length: { maximum: MAX_LENGTH_MESSAGE } }
	}

	if (validate(data, CONSTRAINTS) !== undefined) {
		socket.emit('error', {
			code: 'INVALID_MESSAGE_TEXT',
			description: 'Mensagem inválida!'
		})
		return false
	}

	return {
		text: data.text.trim(),
		id: randomString(50),
		dateTime: Date.now(),
		sender: {
			userID: socket.userID,
			userName: socket.userName,
			userColor: socket.userColor
		}
	}
}


function validateMessage(data) {
	const ACCEPTED_COLORS = [
		'red',
		'blue',
		'green',
		'pink',
		'orange',
		'yellow',
		'gray',
		'white',
		'purple',
		'brown',
		'cyan',
		'lime'
	]

	const constraints = {
		'text': { presence: { allowEmpty: false }, type: 'string' },
		'dateTime': { presence: { allowEmpty: false }, type: 'number' },
		'id': { presence: { allowEmpty: false }, type: 'string', length: { is: MESSAGE_ID_LENGTH } },
		'sender': { presence: { allowEmpty: false } },
		'sender.userID': { presence: { allowEmpty: false }, type: 'string', length: { is: USER_ID_LENGTH } },
		'sender.userName': { presence: { allowEmpty: false }, type: 'string' },
		'sender.userColor': { presence: { allowEmpty: false }, type: 'string', inclusion: ACCEPTED_COLORS },
		'badge.icon': { type: 'string' },
		'badge.text': { type: 'string' },
		'badge.color:': { type: 'string' }
	}

	if (validate(data, constraints) === undefined) return true
	else return false
}


function validateBlockedUser(data) {
	let constraints

	if (data && data.type && data.type === 'ID') {
		constraints = {
			'userID': { presence: { allowEmpty: false }, type: 'string', length: { is: USER_ID_LENGTH } },
			'userIP': { type: 'string' },
			'reason': { type: 'string' }
		}
	} else if (data && data.type && data.type === 'IP') {
		constraints = {
			'userIP': { presence: { allowEmpty: false }, type: 'string' },
			'userID': { type: 'string', length: { is: USER_ID_LENGTH } },
			'reason': { type: 'string' }
		}
	} else { return false }

	if (validate(data, constraints) === undefined) return true
	else return false
}

module.exports = {
	validateUser,
	validateMessageText,
	validateMessage,
	validateBlockedUser
}