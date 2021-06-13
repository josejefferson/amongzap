function Socket($scope) {
	const { userID, userIDHash, userName, userColor } = UserData()

	const socket = io(`${window.location.origin}/chat`, {
		query: {
			userID,
			userName,
			userColor
		}
	})

	socket.on('connect', connect)
	socket.on('disconnect', disconnect)
	socket.on('error', error)
	socket.on('initialChat', initialChat)
	socket.on('onlineUsers', onlineUsers)
	socket.on('chat', chat)
	socket.on('typing', typing)
	socket.on('userConnected', userConnected)
	socket.on('userDisconnected', userDisconnected)
	socket.on('setID', setID)
	socket.on('setColor', setColor)
	socket.on('deleteMsg', deleteMsg)
	socket.on('clearMsgs', clearMsgs)
	socket.on('banned', banned)
	socket.on('sendEnabled', sendEnabled)
	socket.on('reload', reload)


	function connect() {
		$scope.status = 'connected'
		$scope.loadingMessages = true
		$scope.$apply()
	}

	function disconnect() {
		$scope.status = 'disconnected'
		$scope.loadingMessages = false
		$scope.$apply()
	}

	function error(msg) {
		$scope.errors.push({ msg })
		$scope.$apply()
	}

	function initialChat(chats) {
		$scope.chats = chats
		$scope.loadingMessages = false
		$scope.$apply()
		helpers.scrollBottom()
	}

	function onlineUsers(users) {
		$scope.onlineUsers = users
		$scope.$apply()
	}

	function chat(chat) {
		$scope.chats.push(chat)
		$scope.$apply()
		helpers.scrollBottom()
		if (chat.sender.userIDHash !== userIDHash || chat.sender.userName !== userName)
			sounds.play(`NEW_MESSAGE_0${1 + Math.floor(Math.random() * 2)}`)
	}

	function typing(users) {
		$scope.typingUsersList = users
		$scope.$apply()
	}

	function userConnected(user) {
		$scope.onlineUsers.push(user)
		$scope.usersLog.push({ text: user.userName + ' entrou' })
		$scope.$apply()
		sounds.play('PLAYER_SPAWN')
	}

	function userDisconnected(user) {
		const i = $scope.onlineUsers.findIndex(u =>
			u.userIDHash === user.userIDHash &&
			u.userName === user.userName &&
			u.userColor === user.userColor
		)
		if (i > -1) $scope.onlineUsers.splice(i, 1)
		$scope.usersLog.push({ text: user.userName + (user.internetProblem ? ' caiu' : ' saiu') })
		$scope.$apply()
		sounds.play('PLAYER_LEFT')
	}

	function setID(id) {
		localStorage.setItem('amongZap.userID', id)
	}

	function setColor(color) {
		localStorage.setItem('amongZap.color', color)
	}

	function deleteMsg(msgId) {
		const index = $scope.chats.findIndex(m => m.id === msgId)
		if (index >= 0) $scope.chats.splice(index, 1)
		$scope.$apply()
	}

	function clearMsgs() {
		$scope.chats = []
		$scope.$apply()
	}

	function banned(reason) {
		error('Você foi banido! Motivo: ' + reason || 'Não especificado')
		$scope.$apply()
		const urlParams = new URLSearchParams()
		urlParams.set('reason', reason || '')
		OneSignal.setSubscription(false)
		window.location.href = `/banned?${urlParams.toString()}`
		loading()
	}

	function sendEnabled(enabled) {
		if (!enabled) error('O envio de mensagens foi desativado temporariamente pelo administrador')
		$scope.sendEnabled = enabled
		$scope.$apply()
	}

	function reload() {
		window.location.reload()
		loading()
	}


	function sendChat(data) {
		socket.emit('chat', data)
	}

	function sendTyping(data) {
		socket.emit('typing', data)
	}

	return {
		sendChat,
		sendTyping
	}
}
