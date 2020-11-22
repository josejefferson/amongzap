const helpers = require('../public/js/Helpers')
const bcrypt = require('bcryptjs')

const admins = {
	'Jefferson': '$2a$10$dmzDGy7bn163uXvhkTYnx.xm6D9S4znDcz.tHT6YNQo6n5qtPikb2'
}
// const tokens = []

function authenticate(authorization) {
	const b64auth = (authorization || '').split(' ')[1] || ''
	const auth = Buffer.from(b64auth, 'base64').toString().split(':')
	const [login, password] = auth

	if (login && password && admins[login] && bcrypt.compareSync(password, admins[login])) return true

	return false
}

// function generateToken(req, res) {
// 	if (authenticate(req, res)) {
// 		const token = helpers.randomString(30)
// 		tokens.push(token)
// 		return token
// 	}
// }

module.exports = {
	authenticate,
	// tokens,
	// generateToken
}