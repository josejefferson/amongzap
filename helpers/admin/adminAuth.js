const ADMINS = JSON.parse(process.env.ADMINS)

const bcrypt = require('bcryptjs')

module.exports = authorization => {
	const b64auth = (authorization || '').split(' ')[1] || ''
	const auth = Buffer.from(b64auth, 'base64').toString().split(':')
	const [login, password] = auth

	if (login && password && ADMINS[login] && bcrypt.compareSync(password, ADMINS[login])) return true

	return false
}