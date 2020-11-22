const express = require('express')
const routes = express.Router()
const adminHelpers = require('./AdminHelpers')

routes.use(express.static('public'))

routes.get('/', (req, res) => {
	res.sendFile('pages/home.html', {root: './'})
})

routes.get('/chat', (req, res) => {
	res.sendFile('pages/chat.html', { root: './' })
})

routes.get('/admin', (req, res) => {
	if (adminHelpers.authenticate(req.headers.authorization)) {
		res.sendFile('pages/admin.html', { root: './' })
	} else {
		res.set('WWW-Authenticate', 'Basic realm="É necessária uma autenticação para acessar esta página"')
		res.status(401).sendFile('pages/401.html', { root: './' })
	}
})

module.exports = routes