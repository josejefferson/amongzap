(async function () {
	console.clear()
	const express = require('express')
	const app = express()
	const http = require('http').Server(app)
	const io = require('socket.io')(http)
	const routes = require('./helpers/Routes')
	const adminRoutes = require('./helpers/admin/AdminRoutes')
	await require('./helpers/Preparation')
	require('./helpers/Sockets')(io)
	require('./helpers/admin/AdminSockets')(io)

	app.use('/', routes)
	app.use('/', adminRoutes)

	http.listen(3000, () => {
		console.log('[SERVIDOR] Iniciado na porta 3000')
	})
})()