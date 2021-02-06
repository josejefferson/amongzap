const helpers = Helpers()
const sounds = Sounds()
const { userIDHash, userName } = UserData()

window.setInterval(() => {
	$('.dateTime').each(function () {
		$(this).text(moment(parseInt($(this).data('time'))).fromNow())
	})
}, 5000)

angular.module('amongZap', ['ngAnimate', 'ngSanitize', 'ngInlineFmt', 'ngEnter', 'ngRightClick'])
angular.module('amongZap').controller('amongZap-chatCtrl', ['$scope', '$timeout', '$filter', ($scope, $timeout, $filter) => {
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
		$('.sendText').focus()
		if (text.trim() === '') return
		$scope.socket.sendChat({ text })
		$scope.sendText = ''
	}
	$scope.sendCode = (text, code) => {
		Swal.fire({
			title: 'Enviar código',
			html: `
				<form id="sendCodeForm" class="mt-3">
					<input class="swal2-input my-1" type="text" id="sendCode" minlength="6" maxlength="6"
						style="font-size:26px;text-align:center;text-transform:uppercase" pattern="^[a-zA-Z]+$"
						value="${code || ''}" placeholder="Código" autocomplete="off" required>
					<textarea class="swal2-input my-1" type="text" id="sendText" value="${text || ''}"
						placeholder="Texto (opcional)" autocomplete="off" style="resize:none"></textarea>
				</form>
			`,
			confirmButtonText: 'Enviar',
			cancelButtonText: 'Cancelar',
			showCloseButton: true,
			showCancelButton: true,
			didOpen: popup => {
				popup.querySelector('#sendCodeForm').onsubmit = e => e.preventDefault()
				const $code = popup.querySelector('#sendCode')
				$code.onkeydown = e => { if (e.key === 'Enter') Swal.clickConfirm() }
				$code.focus()
			},
			didClose: () => $('.sendText').focus(),
			preConfirm: () => {
				if (!document.querySelector('#sendCodeForm').checkValidity()) {
					Swal.showValidationMessage('Código inválido')
					document.querySelector('#sendCodeForm #sendCode').classList.add('validate')
					document.querySelector('#sendCodeForm #sendCode').focus()
				}

				return {
					code: document.querySelector('#sendCode').value,
					text: document.querySelector('#sendText').value.trim()
				}
			}
		}).then(r => {
			if (!r.isConfirmed) return
			const { text, code } = r.value
			$scope.socket.sendChat({ text, code })
			$scope.sendText = ''
			$('.sendText').focus()
		})
	}
	$scope.previewChat = text => {
		$('.sendText').focus()
		if (!text.trim()) return
		Swal.fire({
			title: 'Prévia da mensagem',
			html: $filter('inlineFmt')($filter('linky')(text, '_blank')),
			toast: true,
			position: 'top',
			showCloseButton: true,
			showConfirmButton: false,
			width: 'calc(100vw - 30px)',
			willClose: () => $('.sendText').focus(),
			customClass: {content: 'messagePreview'}
		})
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

	// Foco na barra de mensagens ao abrir o site
	$('.sendText').focus()

	$('.openSettings').click(() => Swal.fire({
		title: 'Configurações',
		html: `
			<ul class="list">
				<li>
					<label for="setting-sound">Sons</label>
					<div><input type="checkbox" id="setting-sound" ${localStorage.getItem('amongZap.settings.sound') === 'false' ? '':'checked'}></div>
				</li>

				<li><a href="/">Editar dados</a></li>
				<li>
					<button onclick="window.location.reload()">
						<span class="badge ${$scope.update ? '':'hidden'}"></span> Atualizar
					</button>
				</li>
			</ul>
		`,
		confirmButtonText: 'Salvar',
		cancelButtonText: 'Cancelar',
		showCloseButton: true,
		showCancelButton: true,
		preConfirm: () => {
			return {
				sound: $('#setting-sound').prop('checked')
			}
		}
	}).then(r => {
		if (!r.isConfirmed) return
		localStorage.setItem('amongZap.settings.sound', r.value.sound)
	}))

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.addEventListener('message', m => {
			if (m.data === 'update') {
				$('.updateBadge').removeClass('hidden')
				$scope.update = true
			}
		})
	}
}])

///////////////// DEBUG ///////////////////
let $scope
window.onload = () => $scope = angular.element(document.body).scope()