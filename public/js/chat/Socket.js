function Socket() {
	const { userID, userName, userColor } = UserData()

	const socket = io(`${window.location.origin}/chat`, {
		query: {
			userID,
			userName,
			userColor
		}
	})

	socket.on('connect', chat.connected)
	socket.on('disconnect', chat.disconnected)

	socket.on('error', chat.error)
	socket.on('initialChat', chat.initialChat)
	socket.on('chat', chat.chat)
	socket.on('typing', chat.typingUsers)
	socket.on('userConnected', chat.userConnect)
	socket.on('userDisconnected', chat.userDisconnect)
	socket.on('setID', console.log) // todo:
	socket.on('setColor', console.log) // todo:
	socket.on('banned', chat.banned)

	const sendChat = data => {
		socket.emit('chat', data)
	}

	const typing = data => {
		socket.emit('typing', data)
	}

	return {
		sendChat,
		typing
	}
}