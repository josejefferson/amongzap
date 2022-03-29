(async function () {
	console.clear()
	require('dotenv/config')
	global.production = process.env.NODE_ENV !== 'development'
	console.log(global.production)
	const express = require('express')
	const app = express()
	const http = require('http').Server(app)
	const helmet = require('helmet')
	const io = require('socket.io')(http)
	const routes = require('./helpers/routes')
	production && await require('./helpers/preparation')
	require('./helpers/sockets')(io)
	require('./helpers/admin/adminSockets')(io)

	app.use(helmet({ contentSecurityPolicy: false }))
	app.use('/', routes)
	app.use((req, res) => {
		res.status(404).sendFile('pages/404.html', { root: './' })
	})
	app.use((err, req, res, next) => {
		if (err) return res.status(500)
			.send('<h1>Erro do servidor</h1>')
		next()
	})

	http.listen(process.env.PORT || 3000, () => {
		console.log('[SERVIDOR] Iniciado na porta 3000')
	})
})()

process.on('uncaughtException', console.error)