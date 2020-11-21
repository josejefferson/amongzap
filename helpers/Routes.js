const express = require('express')
const routes = express.Router()

routes.use(express.static('public'))

routes.get('/', (req, res) => {
	res.sendFile('pages/home.html', {root: './'})
})

routes.get('/chat', (req, res) => {
	res.sendFile('pages/chat.html', { root: './' })
})

module.exports = routes