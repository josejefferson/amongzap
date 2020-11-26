const validate = require('validate.js')
function validateMessage(data) {
	const MESSAGE_ID_LENGTH = 30
	const USER_ID_LENGTH = 30
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

// function validateBlockedUserID(data) {
// 	const constraints = {
// 		'userID': { presence: { allowEmpty: false }, type: 'string', length: { is: USER_ID_LENGTH } },
// 		'reason': { type: 'string' }
// 	}

// 	if (validate(data, constraints) === undefined) return true
// 	else return false
// }

// function validateBlockedIP(data) {
// 	const constraints = {
// 		'userIP': { presence: { allowEmpty: false }, type: 'string' },
// 		'reason': { type: 'string' }
// 	}

// 	if (validate(data, constraints) === undefined) return true
// 	else return false
// }

module.exports = {
	validateMessage,
	validateBlockedUser,
	// validateBlockedUserID,
	// validateBlockedIP
}