const { validateUser, validateMessageText } = require('./Validators')

module.exports = io => {
	const actions = require('./Actions')(io)

	io.of('/chat').on('connection', socket => {
		const user = validateUser(socket)
		if (!user) return
		actions.userConnected(socket, user)

		socket.on('chat', msg => {
			const message = validateMessageText(socket, msg)
			if (!message) return
			actions.message(socket, message)
		})

		socket.on('typing', typing => {
			if (![true, false].includes(typing)) return
			actions.typing(socket, user, typing)
		})

		socket.on('disconnect', () => actions.userDisconnected(socket, user))
	})
}