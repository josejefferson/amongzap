function Socket(chat) {
	const observers = []
	const subscribe = f => observers.push(f)
	const notifyAll = (...p) => observers.forEach(f => f(...p)) // TODO: remover observers

	const { userID, userName, userColor } = UserData()

	const socket = io(`${window.location.origin}/chat`, {
		query: {
			userID,
			userName,
			userColor
		}
	})

	socket.on('connect', () => console.log('Conectado'))
	socket.on('disconnect', () => console.log('Desconectado'))

	socket.on('error', chat.error)
	socket.on('banned', chat.banned)
	socket.on('initialChat', chat.initialChat)
	socket.on('chat', chat.chat)
	socket.on('userConnected', chat.userConnect)
	socket.on('userDisconnected', chat.userDisconnect)

	function sendChat(data) {
		socket.emit('chat', data)
	}

	return {
		subscribe,
		chat: sendChat,
		socket // temp
	}
}