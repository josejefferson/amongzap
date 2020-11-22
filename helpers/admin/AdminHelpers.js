const ADMINS = {
	'Jefferson': '$2a$10$dmzDGy7bn163uXvhkTYnx.xm6D9S4znDcz.tHT6YNQo6n5qtPikb2'
}

const bcrypt = require('bcryptjs')

module.exports = {
	authenticate: function (authorization) {
		const b64auth = (authorization || '').split(' ')[1] || ''
		const auth = Buffer.from(b64auth, 'base64').toString().split(':')
		const [login, password] = auth

		if (login && password && ADMINS[login] && bcrypt.compareSync(password, ADMINS[login])) return true

		return false
	}
}