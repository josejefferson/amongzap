const helpers = Helpers()
const { userIDHash, userName } = UserData()
const sounds = Sounds()
// const chat = Chat()
let socket
// window.onload = () => socket = Socket()

window.setInterval(() => {
	const dateTimes = $('.dateTime')
	dateTimes.each(function () {
		$(this).text(moment(parseInt($(this).data('time'))).fromNow())
	})
}, 5000)

angular.module('amongUsChat', ['ngAnimate'])
angular.module('amongUsChat').controller('amongUsChat-chatCtrl', ['$scope', '$timeout', ($scope, $timeout) => {
	$scope.userName = UserData().userName
	$scope.userIDHash = UserData().userIDHash
	$scope.moment = window.moment
	$scope.chats = [{
		"id": "Sh40MaKLDM1ZA3B8iRVZDzNHGN5F7QgqVREqN81RkJTWSL5Z1U",
		"dateTime": 1609935322771,
		"text": "Oi",
		"sender": {
			"userIDHash": "5dda3343a8b6b50b5c322ed34f428930bcf690c9",
			"userName": "BSOD",
			"userColor": "blue"
		}
	}, {
		"id": "Sh40MaKLDM1ZA3B8hiRVZDzNHGN5F7QgqVREqN81RkJTWSL5Z1U",
		"dateTime": 1609935322771,
		"text": "Oi",
		"sender": {
			"userIDHash": "5dda3s343a8b6b50b5c322ed34f428930bcf690c9",
			"userName": "BSOD",
			"userColor": "red"
		},
		"badge": {
			"color": "goldenrod",
			"icon": "crown",
			"text": "Admin"
		}
	}, {
		"id": "Sh410MaKLDM1ZA3B8hiRVZDzNHGN5F7QgqVREqN81RkJTWSL5Z1U",
		"dateTime": 1609935322771,
		"code": "ABCDEF",
		"text": "Oi",
		"sender": {
			"userIDHash": "5dda3s343a8b6b50b5c322ed34f428930bcf690c9",
			"userName": "BSOD",
			"userColor": "green"
		},
		"badge": {
			"color": "goldenrod",
			"icon": "crown",
			"text": "Admin"
		}
	}, {
		"id": "Sh4a10MaKLDM1ZA3B8hiRVZDzNHGN5F7QgqVREqN81RkJTWSL5Z1U",
		"dateTime": 1609935322771,
		"code": "ABCDEF",
		"sender": {
			"userIDHash": "5dda3s343a8b6b50b5c322ed34f428930bcf690c9",
			"userName": "BSOD",
			"userColor": "yellow"
		},
		"badge": {
			"color": "goldenrod",
			"icon": "crown",
			"text": "Admin"
		}
	}]
	$scope.status = 'connecting'
	$scope.typingUsers = []
	$scope.loadingMessages = false
	$scope.successes = []
	$scope.errors = []
	$scope.usersLog = []
	$scope.sendText = ''

	$scope.test = () => { console.log('test'); return 0 } ///////////////////////////////////////////////
	$scope.typing = () => {
		const { userIDHash, userName, typingUsers } = $scope
		const me = typingUsers.findIndex(e => e.userIDHash === userIDHash && e.userName === userName)
		if (me !== -1) typingUsers.splice(me, 1)

		let text
		switch (typingUsers.length) {
			case 0: break
			case 1: text = `${typingUsers[0].userName} está digitando`; break
			case 2: text = `${typingUsers[0].userName} e ${typingUsers[1].userName} estão digitando`; break
			case 3: text = `${typingUsers[0].userName}, ${typingUsers[1].userName} e ${typingUsers[2].userName} estão digitando`; break
			default: text = `${typingUsers[0].userName}, ${typingUsers[1].userName}, ${typingUsers[2].userName} e outros estão digitando`; break
		}
		return text
	}
	$scope.send = (text) => {
		text = text.trim()
		$scope.sendText = ''
		$('.sendText').focus()
		if (text.trim() === '') return
		socket.sendChat({ text })
		typing = false
	}

	$scope.sendCode = (text, code) => {
		code = code || prompt('Digite ou cole o código da sala...')
		if (code === null) return
		else code = code.trim()
		if (code.length === 6 && /^[a-zA-Z]+$/.test(code)) socket.sendChat({ text, code })
		else $scope.errors.push({ description: 'Código inválido!' })
	}

	const socket = Socket($scope)
	$scope.socket = socket

	$scope.connectionAnimation
	$scope.timeout = (msg, group) => $timeout(() => group.splice(group.indexOf(msg), 1), 5000)
}])

angular.module('amongUsChat').animation('.error', animation)
angular.module('amongUsChat').animation('.success', animation)
angular.module('amongUsChat').animation('.status', animation)
angular.module('amongUsChat').animation('.loadingMessages', animation)

function animation() {
	return {
		enter: (el, done) => {
			el.stop(true, false).css({ opacity: 0, display: 'none' }).slideDown(100).fadeTo(500, 1, done)
			return done
		},
		leave: (el, done) => {
			el.stop(true, false).fadeTo(500, 0).slideUp(100, done)
			return done
		},
		addClass: (el, className, done) => {
			console.log([el, className, done])
				el.stop(true, false).slideDown(100).fadeTo(500, 1, done)
			
			if (className === 'connected')
				el.delay(3000).fadeTo(500, 0).slideUp(100, done)
		}
	}
}

let $scope
window.onload = () => $scope = angular.element(document.body).scope()