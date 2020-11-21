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

	socket.on('initialChat', data => notifyAll({ type: 'initialChat', data }))
	socket.on('chat', data => notifyAll({ type: 'chat', data }))
	socket.on('userConnected', console.log)
	socket.on('userDisconnected', console.log)

	function chat(data) {
		socket.emit('chat', data)
	}

	return {
		subscribe,
		chat
	}
}