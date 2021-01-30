const express = require('express')
const routes = express.Router()
const authenticate = require('./admin/AdminAuth')
const chat = require('./Chat')

routes.use(express.static('public'))

routes.get('/', (req, res) => {
	res.sendFile('pages/home.html', { root: './' })
})

routes.get('/auth', auth, (req, res) => {
	res.redirect('/chat')
})

routes.get('/admin', auth, (req, res) => {
	res.sendFile('pages/admin.html', { root: './' })
})

routes.get('/debug', auth, (req, res) => {
	res.json(chat)
})

routes.get('/chat', (req, res) => {
	res.sendFile('pages/chat.html', { root: './' })
})

routes.get('/banned', (req, res) => {
	res.sendFile('pages/banned.html', { root: './' })
})

function auth(req, res, next) {
	if (!authenticate(req.headers.authorization)) {
		res.set('WWW-Authenticate', 'Basic realm="É necessária uma autenticação para acessar esta página"')
		return res.status(401).sendFile('pages/adminUserName.html', { root: './' })
	} else { return next() }
}

module.exports = routes