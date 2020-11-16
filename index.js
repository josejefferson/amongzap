const express = require('express')
const app = express()
const http = require(http).Server(app)
const io = require('socket.io')(http)
const fs = require('fs')

app.use(express.static('public'))

