(async function () {

	console.clear()
	const express = require('express')
	const app = express()
	const http = require('http').Server(app)
	const io = require('socket.io')(http)
	const routes = require('./helpers/Routes')
	const adminRoutes = require('./helpers/AdminRoutes')
	require('./helpers/Sockets')(io)
	require('./helpers/AdminSockets')(io)
	
	const chat = require('./helpers/Chat')
	const db = require('./helpers/Databases')
	const messages = await db.getMessages()
	const blockedUsers = await db.getBlockedUsers()
	if (messages) chat.messages = messages
	if (blockedUsers) chat.blockedUserIDs = blockedUsers
	console.log(chat.messages)
	
	app.use('/', routes)
	app.use('/', adminRoutes)

	http.listen(3000, () => {
		console.log('[SERVIDOR] Iniciado na porta 3000')
	})
})()