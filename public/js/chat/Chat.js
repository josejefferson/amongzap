function Chat() {
	const { userIDHash, userName } = UserData()
	let typing = false

	const $chat = $('.chat')
	const $usersLog = $('.usersLog')
	const $typing = $('.typing')
	const $status = $('.status')
	const $loadingMessages = $('.loadingMessages')
	const $errors = $('.errors')
	const $successes = $('.successes')
	const $sendText = $('.sendText')
	const $sendBtn = $('.sendButton')
	const $sendCodeBtn = $('.sendCodeButton')

	$sendText.focus()
	$sendBtn.click(sendMsg)
	$sendCodeBtn.click(sendCode)
	$sendText.keyup(e => {
		(e.key === 'Enter') && sendMsg()
		if (typing && $sendText.val().trim() === '') {
			socket.typing(false)
			typing = false
		} else if (!typing && $sendText.val().trim() !== '') {
			socket.typing(true)
			typing = true
		}
	})

	function chat(data, initial = false) {
		const scroll = $(window).scrollTop() + $(window).height() >= $(document).height() - 100
		$chat.append(genMsgEl(data))
		if (scroll) $('html, body').scrollTop($(document).height())
		if (!initial && (data.sender.userIDHash !== userIDHash || data.sender.userName !== userName))
			sounds.play(`NEW_MESSAGE_0${1 + Math.floor(Math.random() * 2)}`)
	}

	function initialChat(data) {
		$chat.html('')
		data.forEach(d => chat(d, true))
		animation($loadingMessages, false, true, true)
	}

	function userConnect(data) {
		const $el = $('<div>', {
			text: data.userName + ' entrou',
			css: { display: 'none', opacity: 0 }
		})

		$usersLog.append($el)
		animation($el, true, true)
		sounds.play('PLAYER_SPAWN')
	}

	function userDisconnect(data) {
		const $el = $('<div>', {
			text: data.userName + ' saiu',
			css: { display: 'none', opacity: 0 }
		})

		$usersLog.append($el)
		animation($el, true, true)
		sounds.play('PLAYER_LEFT')
	}

	function error(data) {
		const $el = $('<div>', {
			'class': 'container alert error',
			text: data.description,
			css: { display: 'none', opacity: 0 }
		})

		$errors.append($el)
		animation($el, true, true, true)
	}

	function success(data) {
		const $el = $('<div>', {
			'class': 'container alert success',
			text: data.description,
			css: {display: 'none', opacity: 0}
		})

		$successes.append($el)
		animation($el, true, true, true)
	}

	function typingUsers(data) {
		const me = data.findIndex(e => e.userIDHash === userIDHash && e.userName === userName)
		if (me !== -1) data.splice(me, 1)

		let text
		switch (data.length) {
			case 0: break
			case 1: text = `${data[0].userName} está digitando`; break
			case 2: text = `${data[0].userName} e ${data[1].userName} estão digitando`; break
			case 3: text = `${data[0].userName}, ${data[1].userName} e ${data[2].userName} estão digitando`; break
			default: text = `${data[0].userName}, ${data[1].userName}, ${data[2].userName} e outros estão digitando`; break
		}
		if (data.length) $typing.removeClass('noOne').text(text)
		else $typing.addClass('noOne')
	}

	function connected() {
		$status.removeClass('disconnected').addClass('connected').text('Conectado')
		animation($status, true, true)
		animation($loadingMessages, true, false)
	}

	function disconnected() {
		$status.removeClass('connected').addClass('disconnected').text('Desconectado')
		animation($status, true, false)
	}

	function banned(data) {
		const $el = $('<div>', {
			'class': 'container alert error',
			text: `Você foi banido! Motivo: ${data.description || 'Não especificado'}`,
			css: { display: 'none', opacity: 0 }
		})

		$errors.append($el)
		animation($el, true, false)

		const urlParams = new URLSearchParams()
		urlParams.set('reason', data.reason || '')
		window.location.href = `/banned?${urlParams.toString()}`
	}

	function sendMsg() {
		if ($sendText.val().trim() === '') return
		socket.sendChat({ text: $sendText.val() })
		$sendText.val('')
		$sendText.focus()
		typing = false
	}

	function sendCode() {
		const code = prompt('Digite ou cole o código da sala...')
		if (code && code.trim().length === 6 && /^[a-zA-Z]+$/.test(code.trim())) {
			socket.sendChat({ text: $sendText.val(), code: code.trim() })
		} else {
			if (code !== null) error({description: 'Código inválido!'})
		}
	}

	function genMsgEl(msg) {
		const { sender, badge, code, text, dateTime } = msg

		const $messageArea = $('<div>', { 'class': 'messageArea' })
		const $message = $('<div>', { 'class': 'message' })
		const $picture = $('<div>', { 'class': 'picture' })
		const $pic = $('<div>', { 'class': 'pic' })
		const $content = $('<div>', { 'class': 'content' })
		const $messageData = $('<div>', { 'class': 'messageData' })
		const $sender = $('<div>', { 'class': 'sender' })
		const $badge = $('<div>', { 'class': 'badge' })
		const $dateTime = $('<div>', { 'class': 'dateTime' })
		const $text = $('<div>', { 'class': 'text' })
		const $code = $('<div>', { 'class': 'code' })
		const $codeCaption = $('<div>', { 'class': 'codeCaption' })

		$dateTime.data('time', dateTime)

		if (userIDHash == sender.userIDHash && userName == sender.userName) {
			$messageArea.addClass('sent')
		}

		$pic.css('backgroundImage', `url(/img/players/${sender.userColor}.png)`)
		$sender.text(sender.userName)
		$text.html(helpers.replaceLinks(helpers.escapeHTML(text)))
		$dateTime.text(moment(dateTime).fromNow())
		if (badge) { $badge.html(`<i class="fas fa-${badge.icon}"></i> ${helpers.escapeHTML(badge.text)}`).css('color', badge.color) }
		if (code) {
			$code.text(code).click(function () { helpers.copy($(this).text()) })
			$codeCaption.text('Código da sala')
		}

		$picture.append($pic)
		$messageData.append($sender, $badge, $dateTime)
		$content.append($messageData, $code, $codeCaption, $text)
		$message.append($content)
		$message.prepend($picture)

		$messageArea.append($message)

		return $messageArea
	}

	function animation(el, open = false, close = false, remove = false) {
		if (open && close)
			el
				.stop(true, false)
				.slideDown(100)
				.fadeTo(500, 1)
				.delay(5000)
				.fadeTo(500, 0)
				.slideUp(100, function () {
					remove && $(this).remove()
				})

		else if (open)
			el
				.stop(true, false)
				.slideDown(100)
				.fadeTo(500, 1)

		else if (close)
			el
				.stop(true, false)
				.fadeTo(500, 0)
				.slideUp(100, function () {
					remove && $(this).remove()
				})
	}

	return {
		chat,
		initialChat,
		userConnect,
		userDisconnect,
		error,
		success,
		banned,
		connected,
		disconnected,
		typingUsers
	}
}