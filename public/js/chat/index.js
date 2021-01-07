const helpers = Helpers()
const { userIDHash, userName } = UserData()
const sounds = Sounds()
// const chat = Chat()
// let socket
// window.onload = () => socket = Socket()

window.setInterval(() => {
	const dateTimes = $('.dateTime')
	dateTimes.each(function () {
		$(this).text(moment(parseInt($(this).data('time'))).fromNow())
	})
}, 5000)

angular.module('amongUsChat', ['ngAnimate'])
angular.module('amongUsChat').controller('amongUsChat-chatCtrl', ['$scope', '$timeout', ($scope, $timeout) => {
	$scope.userName = userName
	$scope.userIDHash = userIDHash
	$scope.moment = window.moment

	$scope.loadingMessages = false
	$scope.status = 'connecting'
	$scope.typingUsers = []
	$scope.successes = []
	$scope.errors = []
	$scope.usersLog = []
	$scope.chats = []
	$scope.sendText = ''

	$scope.test = () => { console.log('test'); return 0 }
	$scope.oldtyping = 'Ninguém está digitando'
	$scope.$watch('typing()', () => { $scope.oldtyping = $scope.typing() })
	$scope.typing = () => {
		const { userIDHash, userName, typingUsers: typ } = $scope
		const me = typ.findIndex(e => e.userIDHash === userIDHash && e.userName === userName)
		if (me !== -1) typ.splice(me, 1)

		switch (typ.length) {
			case 0: return $scope.oldtyping
			case 1: return `${typ[0].userName} está digitando`
			case 2: return `${typ[0].userName} e ${typ[1].userName} estão digitando`
			case 3: return `${typ[0].userName}, ${typ[1].userName} e ${typ[2].userName} estão digitando`
			default: return `${typ[0].userName}, ${typ[1].userName}, ${typ[2].userName} e outros estão digitando`
		}
	}
	$scope.send = text => {
		text = text.trim()
		$('.sendText').focus()
		if (text.trim() === '') return
		socket.sendChat({ text })
		$scope.sendText = ''
	}
	$scope.sendCode = (text, code) => {
		code = code || prompt('Digite ou cole o código da sala...')
		$('.sendText').focus()
		if (code === null) return
		else code = code.trim()
		
		if (code.length !== 6 || !/^[a-zA-Z]+$/.test(code))
			return $scope.errors.push({ description: 'Código inválido!' })
		socket.sendChat({ text, code })
		$scope.sendText = ''
	}
	$scope.hasTyping = () => !$scope.typingUsers.filter(e => e.userIDHash !== userIDHash).length
	$scope.isSent = c => c.sender.userName === userName && c.sender.userIDHash === userIDHash
	$scope.timeout = (group) => $timeout(() => group.splice(0, 1), 5000)
	$scope.copy = text => {
		helpers.copy(text)
		$scope.successes.push({ description: 'Código copiado' })
	}

	const socket = Socket($scope)
	$scope.socket = socket


	$scope.imtyping = false
	$scope.$watch('sendText', (val) => {
		if (val === '') $scope.imtyping = false
		else $scope.imtyping = true
	})
	$scope.$watch('imtyping', (val) => socket.typing(val))
}])

let $scope
window.onload = () => $scope = angular.element(document.body).scope()