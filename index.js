console.clear()
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const ACCEPTED_COLORS = ['red', 'blue', 'green', 'pink', 'orange', 'yellow', 'gray', 'white', 'purple', 'brown', 'cyan', 'lime']

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/pages/home.html')
})

app.get('/chat', (req, res) => {
	res.sendFile(__dirname + '/pages/chat.html')
})

let messages = []
let onlineUsers = []

io.of('/chat').on('connection', function (socket) {
	let { /*userID, */userName, userColor } = socket.handshake.query

	if (!userName) {
		socket.emit('error', {
			errorCode: 'INVALID_USER_NAME',
			description: 'Nome de usuário inválido!'
		})
		return
	}

	userName = userName.trim().slice(0, 10)
	if (!ACCEPTED_COLORS.includes(userColor))
		userColor = ACCEPTED_COLORS[Math.floor(Math.random() * 12)]

	socket.userName = userName
	socket.userColor = userColor

	socket.emit('initialChat', messages)

	socket.on('chat', msg => {
		msg.dateTime = Date.now()
		msg.sender = {
			name: socket.userName,
			color: socket.userColor
		}
		messages.push(msg)

		io.of('/chat').emit('chat', msg)

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