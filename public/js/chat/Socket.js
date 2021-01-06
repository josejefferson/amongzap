function Socket($scope) {
	const { userID, userName, userColor } = UserData()

	const socket = io(`${window.location.origin}/chat`, {
		query: {
			userID,
			userName,
			userColor
		}
	})

	socket.on('connect', () => { $scope.status = 'connected'; $scope.loadingMessages = true; $scope.$apply() })
	socket.on('disconnect', () => { $scope.status = 'disconnected'; $scope.loadingMessages = false; $scope.$apply() })
	socket.on('error', error => { $scope.errors.push(error); $scope.$apply() })
	socket.on('initialChat', chats => { $scope.chats = chats; $scope.loadingMessages = false; $scope.$apply(); $('html, body').scrollTop($(document).height()) })
	socket.on('chat', chat => {
		$scope.chats.push(chat); $scope.$apply();
		if (chat.sender.userIDHash !== userIDHash || chat.sender.userName !== userName)
			sounds.play(`NEW_MESSAGE_0${1 + Math.floor(Math.random() * 2)}`)
		$('html, body').scrollTop($(document).height())
	})
	socket.on('typing', users => { $scope.typingUsers = users; $scope.$apply() })
	socket.on('userConnected', user => { $scope.usersLog.push(user + ' entrou'); $scope.$apply(); sounds.play('PLAYER_SPAWN') })
	socket.on('userDisconnected', user => { $scope.usersLog.push(user + ' saiu'); $scope.$apply(); sounds.play('PLAYER_LEFT') })
	socket.on('setID', console.log) // todo:
	socket.on('setColor', console.log) // todo:
	// socket.on('banned', chat.banned)

	const sendChat = data => {
		socket.emit('chat', data)
	}

	const typing = data => {
		socket.emit('typing', data)
	}

	return {
		sendChat,
		typing
	}
}