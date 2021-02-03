(async function () {
	console.clear()
	if (!('production' in global)) global.production = true
	const express = require('express')
	const app = express()
	const http = require('http').Server(app)
	const helmet = require('helmet')
	const io = require('socket.io')(http)
	const routes = require('./helpers/Routes')
	production && await require('./helpers/Preparation')
	require('./helpers/Sockets')(io)
	require('./helpers/admin/AdminSockets')(io)

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
