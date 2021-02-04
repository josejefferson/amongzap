function Socket($scope) {
	const { userID, userName, userColor } = UserData()

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
		$('html, body').animate({
			scrollTop: $(document).height()
		})
	}

	function chat(chat) {
		$scope.chats.push(chat)
		$scope.$apply()
		$('html, body').stop().animate({
			scrollTop: $(document).height()
		})
		if (chat.sender.userIDHash !== userIDHash || chat.sender.userName !== userName)
			sounds.play(`NEW_MESSAGE_0${1 + Math.floor(Math.random() * 2)}`)
	}

	function typing(users) {
		$scope.typingUsersList = users
		$scope.$apply()
	}

	function userConnected(user) {
		$scope.usersLog.push({ text: user.userName + ' entrou' })
		$scope.$apply()
		sounds.play('PLAYER_SPAWN')
	}

	function userDisconnected(user) {
		$scope.usersLog.push({ text: user.userName + ' saiu' })
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
	}

	function sendEnabled(enabled) {
		if (!enabled) error('O envio de mensagens foi desativado temporariamente pelo administrador')
		$scope.sendEnabled = enabled
		$scope.$apply()
	}

	function reload() {
		window.location.reload()
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
