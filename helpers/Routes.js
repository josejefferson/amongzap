const express = require('express')
const routes = express.Router()

routes.use(express.static('public'))

routes.get('/', (req, res) => {
	res.sendFile('pages/home.html', { root: './' })
})

routes.get('/chat', (req, res) => {
	// VERIFICAR SE USERNAME É DO ADMIN
	res.sendFile('pages/chat.html', { root: './' })
})

routes.get('/banned', (req, res) => {
	res.sendFile('pages/banned.html', { root: './' })
})

module.exports = routes
