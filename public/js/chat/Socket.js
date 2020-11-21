function Socket() {
	const observers = []
	const subscribe = f => observers.push(f)
	const notifyAll = (...p) => observers.forEach(f => f(...p))

	const userName = new URLSearchParams(window.location.search).get('user').trim().slice(0, 10)
	const userColor = new URLSearchParams(window.location.search).get('color')
	const socket = io('http://localhost:3000/chat', {
		query: {
			userName, userColor
		}
	})

	socket.on('error', console.error)
	// socket.emit('username', username)
	// socket.emit('usercolor', usercolor)

	socket.on('initialChat', data => notifyAll({ type: 'initialChat', data }))
	socket.on('chat', data => notifyAll({ type: 'chat', data }))

	function chat(data) {
		socket.emit('chat', data)
	}

	return {
		subscribe,
		chat
	}
}