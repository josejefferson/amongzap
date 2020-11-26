function Socket() {
	const { userID, userName, userColor } = UserData()

	const socket = io(`${window.location.origin}/chat`, {
		query: {
			userID,
			userName,
			userColor
		}
	})

	socket.on('connect', () => console.log('Conectado'))
	socket.on('disconnect', () => chat.error({code: 'DISCONNECTED', description: 'Desconectado'}, true)) // ao invés de error set status

	socket.on('error', chat.error)
	socket.on('banned', chat.banned)
	socket.on('initialChat', chat.initialChat)
	socket.on('chat', chat.chat)
	socket.on('userConnected', chat.userConnect)
	socket.on('userDisconnected', chat.userDisconnect)
	socket.on('setID', console.log)
	socket.on('setColor', console.log)

	const sendChat = data => {
		socket.emit('chat', data)
	}

	return {
		sendChat
	}
}