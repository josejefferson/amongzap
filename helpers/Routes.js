const express = require('express')
const routes = express.Router()
const { adminUserName } = require('./Chat')
const authenticate = require('./admin/AdminAuth')

routes.use(express.static('public'))

routes.get('/', (req, res) => {
	res.sendFile('pages/home.html', { root: './' })
})

routes.get('/chat', (req, res) => {
	if (req.query.user.toLowerCase() === adminUserName.toLowerCase()) {
		if (!authenticate(req.headers.authorization)) {
			res.set('WWW-Authenticate', 'Basic realm="É necessária uma autenticação para acessar esta página"')
			return res.status(401).sendFile('pages/adminUserName.html', { root: './' })
		}
	}

	res.sendFile('pages/chat.html', { root: './' })
})

routes.get('/banned', (req, res) => {
	res.sendFile('pages/banned.html', { root: './' })
})

module.exports = routes
