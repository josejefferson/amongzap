function Socket() {
	const socket = io(`${window.location.origin}/admin`)

	socket.on('error', err => alert(err.description))
	socket.on('connect', () => console.log('Conectado'))
	socket.on('disconnect', () => console.log('Desconectado'))

	return {
		socket // temp
	}
}