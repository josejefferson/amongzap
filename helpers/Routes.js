const express = require('express')
const routes = express.Router()

routes.use(express.static('public'))

routes.get('/', (req, res) => {
	res.sendFile(__dirname + '/pages/home.html')
})

routes.get('/chat', (req, res) => {
	res.sendFile(__dirname + '/pages/chat.html')
})

module.exports = routes