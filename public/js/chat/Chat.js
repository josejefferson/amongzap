function Chat() {
	const { userIDHash, userName } = UserData()

	const $root = document.documentElement
	const $chat = document.querySelector('.chat')
	const $usersLog = document.querySelector('.usersLog')
	const $status = document.querySelector('.status')
	const $loadingMessages = document.querySelector('.loadingMessages')
	const $errors = document.querySelector('.errors')
	const $sendText = document.querySelector('.sendText')
	const $sendBtn = document.querySelector('.sendButton')
	let statusTime

	$sendText.focus()
	$sendBtn.onclick = sendMsg
	$sendText.onkeyup = e => (e.key === 'Enter') && sendMsg()

	function chat(data, initial = false) {
		$chat.append(genMsgEl(data))
		$root.scrollTop = $root.scrollHeight
		if (!initial && data.sender.userIDHash !== userIDHash)
			sounds.play(`NEW_MESSAGE_0${1 + Math.floor(Math.random() * 2)}`)
	}

	function initialChat(data) {
		$chat.innerHTML = ''
		data.forEach(d => chat(d, true))
		$loadingMessages.classList.add('hidden')
	}

	function userConnect(data) {
		const a = document.createElement('div')
		a.innerText = data.userName + ' entrou'
		$usersLog.appendChild(a)
		sounds.play('PLAYER_SPAWN')
		setTimeout(() => a.remove(), 5000)
	}

	function userDisconnect(data) {
		const a = document.createElement('div')
		a.innerText = data.userName + ' saiu'
		$usersLog.appendChild(a)
		sounds.play('PLAYER_LEFT')
		setTimeout(() => a.remove(), 5000)
	}

	function error(data, noRemove = false) {
		const error = document.createElement('div')
		error.classList.add('alert', 'error')
		error.innerText = data.description
		$errors.appendChild(error)
		!noRemove && setTimeout(() => error.remove(), 5000)
	}

	function connected() {
		clearTimeout(statusTime)
		$status.classList.remove('hidden', 'connected', 'disconnected')
		$status.classList.add('connected')
		$status.innerText = 'Conectado'
		statusTime = setTimeout(() => $status.classList.add('hidden'), 5000)
	}
	
	function disconnected() {
		clearTimeout(statusTime)
		$status.classList.remove('hidden', 'connected', 'disconnected')
		$status.classList.add('disconnected')
		$status.innerText = 'Desconectado'
	}

	function banned(data) {
		const error = document.createElement('div')
		error.classList.add('error')
		error.innerText = data.reason || 'Não especificado'
		$errors.appendChild(error)

		const urlParams = new URLSearchParams()
		urlParams.set('reason', data.reason || '')
		window.location.href = `/banned?${urlParams.toString()}`
	}

	function sendMsg() {
		if ($sendText.value.trim() === '') return
		socket.sendChat({ text: $sendText.value })
		$sendText.value = ''
		$sendText.focus()
	}

	function genMsgEl(msg) {
		const { sender, text, dateTime } = msg

		const message = document.createElement('div')
		const messageEl = document.createElement('div')
		const pictureEl = document.createElement('div')
		const picEl = document.createElement('div')
		const contentEl = document.createElement('div')
		const messageDataEl = document.createElement('div')
		const senderEl = document.createElement('div')
		const textEl = document.createElement('div')
		const dateTimeEl = document.createElement('div')

		message.classList.add('messageArea')
		messageEl.classList.add('message')
		pictureEl.classList.add('picture')
		picEl.classList.add('pic')
		contentEl.classList.add('content')
		messageDataEl.classList.add('messageData')
		senderEl.classList.add('sender')
		textEl.classList.add('text')
		dateTimeEl.classList.add('dateTime')
		dateTimeEl.dataset.time = dateTime

		if (userIDHash == sender.userIDHash && userName == sender.userName) {
			message.classList.add('sent')
		}

		picEl.style.backgroundImage = `url(/img/players/${sender.userColor}.png)`
		senderEl.innerText = sender.userName
		textEl.innerHTML = helpers.replaceLinks(helpers.escapeHTML(text))
		dateTimeEl.innerText = moment(dateTime).fromNow()

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
		disconnected
	}
}