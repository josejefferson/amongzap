angular.module('amongZap', ['ngAnimate', 'ngSanitize', 'ngInlineFmt', 'ngEnter', 'ngRightClick'])
angular.module('amongZap').controller('amongZap-chatCtrl', ['$scope', '$timeout', '$filter', ($scope, $timeout, $filter) => {
	const $sendText = document.querySelector('.sendText')
	const $openSettings = document.querySelector('.openSettings')
	const $updateBadge = document.querySelector('.updateBadge')
	const { userIDHash, userName } = UserData()

	// Compartilhamento de texto de outros apps
	const query = new URLSearchParams(location.search)
	const share = [query.get('share_title'), query.get('share_text'), query.get('share_url')].filter(e => e).join(' ')

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
	$scope.iamtyping = false
	$scope.sendText = share
	$scope.sendEnabled = true
	$scope.update = false

	// Funções
	$scope.send = text => {
		text = text.trim()
		$sendText.focus()
		if (text.trim() === '') return
		$scope.socket.sendChat({ text })
		$scope.sendText = ''
	}
	$scope.sendCode = (text, code) => {
		modals.sendCode(text, code).then(r => {
			if (!r.isConfirmed) return
			const { text, code } = r.value
			$scope.socket.sendChat({ text, code })
			$scope.sendText = ''
			$sendText.focus()
		})
	}
	$scope.previewChat = (text) => {
		$sendText.focus()
		if (!text.trim()) return
		modals.previewChat(text, $filter)
	}
	$scope.copy = text => {
		helpers.copy(text)
		$scope.successes.push({ msg: 'Código copiado' })
	}

	// Funções de renderização
	$scope.isTyping = () => !$scope.typingUsersList.filter(e => e.userIDHash !== userIDHash).length
	$scope.isSent = c => c.sender.userName === userName && c.sender.userIDHash === userIDHash
	$scope.timeout = (group) => $timeout(() => group.splice(0, 1), 5000)
	$scope.typingUsers = () => {
		const { userIDHash, userName, typingUsersList: t } = $scope
		const me = t.findIndex(e => e.userIDHash === userIDHash && e.userName === userName)
		if (me !== -1) t.splice(me, 1)

		switch (t.length) {
			case 0: return $scope.typing
			case 1: return `${t[0].userName} está digitando`
			case 2: return `${t[0].userName} e ${t[1].userName} estão digitando`
			case 3: return `${t[0].userName}, ${t[1].userName} e ${t[2].userName} estão digitando`
			default: return `${t[0].userName}, ${t[1].userName}, ${t[2].userName} e outros estão digitando`
		}
	}

	// Watchers
	$scope.$watch('typingUsers()', () => { $scope.typing = $scope.typingUsers() })
	$scope.$watch('sendText', (val) => {
		if (val === '') $scope.iamtyping = false
		else $scope.iamtyping = true
	})
	$scope.$watch('iamtyping', (val) => $scope.socket.sendTyping(val))


	// Modal de configurações
	$openSettings.onclick = () => modals.settings($scope).then(r => {
		if (!r.isConfirmed) return
		helpers.setOptions(r.value)
	})

	// Atualizações do Service Worker
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.addEventListener('message', m => {
			if (m.data === 'update') {
				$updateBadge.classList.remove('hidden')
				$scope.update = true
			}
		})
	}

	// Atualiza os horários das mensagens
	window.setInterval(() => {
		document.querySelectorAll('.dateTime').forEach(e => {
			e.innerText = moment(parseInt(e.dataset.time)).fromNow()
		})
	}, 5000)

	// Foco na barra de mensagens ao abrir o site
	$sendText.focus()
}])

///////////////// DEBUG ///////////////////
let $scope
window.onload = () => $scope = angular.element(document.body).scope()