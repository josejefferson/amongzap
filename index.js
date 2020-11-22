console.clear()
const express = require('express')
const app = express()
const chat = require('./helpers/Chat')
const http = require('http').Server(app)
const routes = require('./helpers/Routes')
require('./helpers/Sockets')(http, chat)
require('./helpers/AdminSockets')(http, chat)

app.use('/', routes)

http.listen(3000, () => {
	console.log('[SERVIDOR] Iniciado na porta 3000')
})