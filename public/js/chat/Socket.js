function Socket() {
	const observers = []
	const subscribe = f => observers.push(f)
	const notifyAll = (...p) => observers.forEach(f => f(...p))

	const { userID, userName, userColor } = UserData()

	const socket = io(`${window.location.origin}/chat`, {
		query: {
			userID,
			userName,
			userColor
		}
	})

	socket.on('error', err => alert(err.description))
	socket.on('connect', () => console.log('Conectado'))
	socket.on('disconnect', () => console.log('Desconectado'))

	socket.on('initialChat', data => notifyAll({ type: 'initialChat', data }))
	socket.on('chat', data => notifyAll({ type: 'chat', data }))
	socket.on('userConnected', data => notifyAll({ type: 'userConnect', data }))
	socket.on('userDisconnected', data => notifyAll({ type: 'userDisconnect', data }))

	function chat(data) {
		socket.emit('chat', data)
	}

	return {
		subscribe,
		chat,
		socket // temp
	}
}