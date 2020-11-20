function Socket() {
	const observers = []
	const subscribe = f => observers.push(f)
	const notifyAll = (...p) => observers.forEach(f => f(...p))

	const username = new URLSearchParams(window.location.search).get('user')
	const usercolor = new URLSearchParams(window.location.search).get('color')
	const socket = io()
	socket.emit('username', username)
	socket.emit('usercolor', usercolor)

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