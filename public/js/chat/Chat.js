function Chat() {
	const { userIDHash, userName } = UserData()

	const $root = $('html')
	const $chat = $('.chat')
	const $usersLog = $('.usersLog')
	const $status = $('.status')
	const $loadingMessages = $('.loadingMessages')
	const $errors = $('.errors')
	const $sendText = $('.sendText')
	const $sendBtn = $('.sendButton')
	let statusTime

	$sendText.focus()
	$sendBtn.click(sendMsg)
	$sendText.keyup(e => (e.key === 'Enter') && sendMsg())

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
		$loadingMessages.addClass('hidden')
	}

	function userConnect(data) {
		const $el = $('<div>', { text: data.userName + ' entrou' })
		$usersLog.append($el)
		sounds.play('PLAYER_SPAWN')
		setTimeout(() => closeAnimation($el), 5000)
	}

	function closeAnimation(el, remove = true) {
		el
			.fadeTo(700, 0)
			.slideUp(200, function () {
				remove && $(this).remove()
			})
	}

	function openAnimation(el) {
		el
			.slideDown(200)
			.fadeIn(700)
	}

	function userDisconnect(data) {
		const $el = $('<div>', { text: data.userName + ' saiu' })
		$usersLog.append($el)
		sounds.play('PLAYER_LEFT')
		setTimeout(() => closeAnimation($el), 5000)
	}

	function error(data) {
		const $el = $('<div>', {
			'class': 'container alert error',
			text: data.description
		})
		$errors.append($el)
		openAnimation($el)
		setTimeout(() => closeAnimation($el), 5000)
	}

	function connected() {
		clearTimeout(statusTime)
		$status.removeClass('hidden connected disconnected')
		$status.addClass('connected')
		$status.text('Conectado')
		openAnimation($status)
		statusTime = setTimeout(() => closeAnimation($status, false), 5000)
	}

	function disconnected() {
		clearTimeout(statusTime)
		$status.removeClass('hidden connected disconnected')
		$status.addClass('disconnected')
		$status.text('Desconectado')
	}

	function banned(data) {
		const $el = $('<div>', {
			'class': 'container alert error',
			text: `Você foi banido! Motivo: ${data.description || 'Não especificado'}`
		})
		$errors.append($el)

		const urlParams = new URLSearchParams()
		urlParams.set('reason', data.reason || '')
		window.location.href = `/banned?${urlParams.toString()}`
	}

	function sendMsg() {
		if ($sendText.val().trim() === '') return
		socket.sendChat({ text: $sendText.val() })
		$sendText.val('')
		$sendText.focus()
	}

	function genMsgEl(msg) {
		const { sender, text, dateTime } = msg

		const message = $('<div>', { 'class': 'messageArea' })
		const messageEl = $('<div>', { 'class': 'message' })
		const pictureEl = $('<div>', { 'class': 'picture' })
		const picEl = $('<div>', { 'class': 'pic' })
		const contentEl = $('<div>', { 'class': 'content' })
		const messageDataEl = $('<div>', { 'class': 'messageData' })
		const senderEl = $('<div>', { 'class': 'sender' })
		const textEl = $('<div>', { 'class': 'text' })
		const dateTimeEl = $('<div>', { 'class': 'dateTime' })

		dateTimeEl.data('time', dateTime)

		if (userIDHash == sender.userIDHash && userName == sender.userName) {
			message.addClass('sent')
		}

		picEl.css('backgroundImage', `url(/img/players/${sender.userColor}.png)`)
		senderEl.text(sender.userName)
		textEl.html(helpers.replaceLinks(helpers.escapeHTML(text)))
		dateTimeEl.text(moment(dateTime).fromNow())

		pictureEl.append(picEl)
		messageDataEl.append(senderEl, dateTimeEl)
		contentEl.append(messageDataEl, textEl)
		messageEl.append(contentEl)
		messageEl.prepend(pictureEl)

		message.append(messageEl)

		return message
	}

	return {
		chat,
		initialChat,
		userConnect,
		userDisconnect,
		error,
		banned,
		connected,
		disconnected,
		$root
	}
}