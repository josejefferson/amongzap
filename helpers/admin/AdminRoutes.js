const express = require('express')
const routes = express.Router()
const authenticate = require('./AdminAuth')

routes.use(express.static('public'))

routes.get('/admin', (req, res) => {
	if (authenticate(req.headers.authorization)) {
		res.sendFile('pages/admin.html', { root: './' })
	} else {
		res.set('WWW-Authenticate', 'Basic realm="É necessária uma autenticação para acessar esta página"')
		res.status(401).sendFile('pages/401.html', { root: './' })
	}
})

module.exports = routes