const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fs = require('fs')
const bodyParser = require('body-parser')
// const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
// const passport = require('passport')
// require('./config/auth')(passport)

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile('pages/home.html')
})

app.get('/chat', (req, res) => {
	res.sendFile('pages/chat.html')
})

http.listen(3000, () => {
	console.log('[Server] Started at port 3000')
})