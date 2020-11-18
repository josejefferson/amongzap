const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
// const fs = require('fs')
// const bodyParser = require('body-parser')
// const expressLayouts = require('express-ejs-layouts')
// const session = require('express-session')
// const passport = require('passport')
// require('./config/auth')(passport)

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/pages/home.html')
})

app.get('/chat', (req, res) => {
	res.sendFile(__dirname + '/pages/chat.html')
})

messages = []

io.on('connection', function (socket) {
	socket.on('username', name => {
		socket.username = name
		// onlineUsers.push(name)
		// socket.broadcast.emit('user connected', name)
		// io.emit('online users', onlineUsers)
		// console.log(`Usuário conectado => ${socket.id} (${socket.username})`)
	})

	socket.on('usercolor', color => {
		socket.usercolor = color
	})

	socket.emit('initial chat', messages)

	socket.on('chat', msg => {
		msg.dateTime = Date.now()
		msg.sender = {
			name: socket.username,
			color: socket.usercolor
		}
		messages.push(msg)
		// console.log(messages)

		io.emit('chat', msg)

		// console.log(socket.username)
		// console.log(msg.data)
		// if (socket.username == 'admin' && msg.data == 'deleteAll') {
		// 	messages = []
		// 	io.emit('command', 'deleteAll')
		// }
		// fs.writeFile('messages.txt', JSON.stringify(messages), err => console.log(err))
	})

	// socket.on('disconnect', function () {
	// 	console.log(`Usuário desconectado => ${socket.id} (${socket.username})`)
	// 	if (onlineUsers.indexOf(socket.username) != -1) onlineUsers.splice(onlineUsers.indexOf(socket.username), 1)
	// 	socket.broadcast.emit('user disconnected', socket.username)
	// 	io.emit('online users', onlineUsers)
	// })
})

http.listen(3000, () => {
	console.log('[Server] Started at port 3000')
})