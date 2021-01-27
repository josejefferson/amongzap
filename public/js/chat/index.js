const helpers = Helpers()
const sounds = Sounds()
const { userIDHash, userName } = UserData()

window.setInterval(() => {
	$('.dateTime').each(function () {
		$(this).text(moment(parseInt($(this).data('time'))).fromNow())
	})
}, 5000)

angular.module('amongUsChat', ['ngAnimate'])
angular.module('amongUsChat').controller('amongUsChat-chatCtrl', ['$scope', '$timeout', ($scope, $timeout) => {
	// Variáveis
	$scope.userName = userName
	$scope.userIDHash = userIDHash
	$scope.moment = window.moment
	$scope.socket = Socket($scope)

	$scope.loadingMessages = false
	$scope.status = 'connecting'
	$scope.typing = 'Ninguém está digitando'
	$scope.typingUsersList = []
	$scope.successes = []
	$scope.errors = []
	$scope.usersLog = []
	$scope.chats = []
	$scope.sendText = ''
	$scope.iamtyping = false

	// Funções
	$scope.send = text => {
		text = text.trim()
		$('.sendText').focus()
		if (text.trim() === '') return
		$scope.socket.sendChat({ text })
		$scope.sendText = ''
	}
	$scope.sendCode = (text, code) => {
		code = code || prompt('Digite ou cole o código da sala...')
		$('.sendText').focus()
		if (code === null) return
		else code = code.trim()

		if (code.length !== 6 || !/^[a-zA-Z]+$/.test(code))
			return $scope.errors.push({ description: 'Código inválido!' })
		$scope.socket.sendChat({ text, code })
		$scope.sendText = ''
	}
	$scope.copy = text => {
		helpers.copy(text)
		$scope.successes.push({ description: 'Código copiado' })
	}

	// Funções de renderização
	$scope.isTyping = () => !$scope.typingUsersList.filter(e => e.userIDHash !== userIDHash).length
	$scope.isSent = c => c.sender.userName === userName && c.sender.userIDHash === userIDHash
	$scope.timeout = (group) => $timeout(() => group.splice(0, 1), 5000)
	$scope.typingUsers = () => {
		const { userIDHash, userName, typingUsersList: typ } = $scope
		const me = typ.findIndex(e => e.userIDHash === userIDHash && e.userName === userName)
		if (me !== -1) typ.splice(me, 1)

		switch (typ.length) {
			case 0: return $scope.typing
			case 1: return `${typ[0].userName} está digitando`
			case 2: return `${typ[0].userName} e ${typ[1].userName} estão digitando`
			case 3: return `${typ[0].userName}, ${typ[1].userName} e ${typ[2].userName} estão digitando`
			default: return `${typ[0].userName}, ${typ[1].userName}, ${typ[2].userName} e outros estão digitando`
		}
	}

	// Watchers
	$scope.$watch('typingUsers()', () => { $scope.typing = $scope.typingUsers() })
	$scope.$watch('sendText', (val) => {
		if (val === '') $scope.iamtyping = false
		else $scope.iamtyping = true
	})
	$scope.$watch('iamtyping', (val) => $scope.socket.sendTyping(val))

	// Compartilhamento de texto de outros apps
	const params = new URLSearchParams(location.search)
	if (params.get('share_title') || params.get('share_text') || params.get('share_url')) {
		$scope.sendText = `${params.get('share_title') || ''} ${params.get('share_text') || ''} ${params.get('share_url') || ''}`
	}

	// Foco na barra de mensagens ao abrir o site
	$('.sendText').focus()
}])

///////////////// DEBUG ///////////////////
let $scope
window.onload = () => $scope = angular.element(document.body).scope()