function ValidateUser(socket) {
	const ACCEPTED_COLORS = [
		'red',
		'blue',
		'green',
		'pink',
		'orange',
		'yellow',
		'gray',
		'white',
		'purple',
		'brown',
		'cyan',
		'lime'
	]

	const chat = require('./Chat')

	console.log(`[CONEXÃO] Usuário tentando conectar: ${socket.id}; IP: ${socket.handshake.headers['x-forwarded-for']}`)

	let { userID, userName, userColor } = socket.handshake.query
	const userIP = socket.handshake.headers['x-forwarded-for']

	console.log(`[DADOS] ID: ${userID}; Nome: ${userName}; Cor: ${userColor}`)

	const blockedUserID = chat.blockedUserIDs.filter(e => e.userID === userID)
	const blockedUserIP = chat.blockedIPs.filter(e => e.userIP === userIP)

	if (userID && userID.length === 30 && (blockedUserID.length || blockedUserIP.length)) {
		if (blockedUserID.length) var reason = blockedUserID[0].reason || ''
		if (blockedUserIP.length) var reason = blockedUserIP[0].reason || ''

		socket.emit('error', {
			errorCode: 'USER_BLOCKED',
			description: `Você foi banido pelo administrador! Motivo: ${reason}`
		})
		return false
	}

	if (!userID || userID.length !== 30) {
		console.log(`[ERRO] ID do usuário inválido!`)

		const generatedUserID = helpers.randomString(30)
		socket.emit('setID', generatedUserID)
		userID = generatedUserID

		console.log(`[GERAÇÃO] Novo ID gerado: ${generatedUserID}`)
	}

	if (!userName) {
		console.log(`[ERRO] Nome do usuário inválido!`)

		socket.emit('error', {
			errorCode: 'INVALID_USER_NAME',
			description: 'Nome de usuário inválido!'
		})
		return false
	}

	// if (chat.onlineUsers.filter(u => u.userName == userName).length > 0) {
	// 	console.log(`[ERRO] Já existe um usuário com este nome!`)
	// 	socket.emit('error', {
	// 		errorCode: 'USER_NAME_USED',
	// 		description: 'Já existe um usuário online com este nome!'
	// 	})
	// 	return false
	// }

	userName = userName.trim().slice(0, 10)
	if (!ACCEPTED_COLORS.includes(userColor)) {
		console.log(`[ERRO] Cor inválida!`)
		userColor = ACCEPTED_COLORS[Math.floor(Math.random() * 12)]
		console.log(`[GERAÇÃO] Nova cor gerada: ${userColor}`)
	}

	return {
		socket,
		userID: userID,
		userName: userName,
		userColor: userColor
	}
}

module.exports = ValidateUser