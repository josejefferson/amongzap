function Chat() {
	const observers = []
	const subscribe = f => observers.push(f)
	const notifyAll = (...p) => observers.forEach(f => f(...p))

	const { userID, userIDHash, userName, userColor } = UserData()

	const $root = document.documentElement
	const $chat = document.querySelector('.chat')
	const $logs = document.querySelector('.logs')
	const $errors = document.querySelector('.errors')
	const $sendText = document.querySelector('.sendText')
	const $sendBtn = document.querySelector('.sendButton')

	$sendText.focus()
	$sendBtn.onclick = sendMsg
	$sendText.onkeyup = e => (e.key === 'Enter') && sendMsg() // TEMP
	
	function sendMsg() {
		if ($sendText.value.trim() === '') return
		notifyAll({ type: 'chat', data: { text: $sendText.value } })
		$sendText.value = ''
		$sendText.focus()
	}

	function chat(data) {
		$chat.append(genMsgEl(data))
		$root.scrollTop = $root.scrollHeight
	}
	
	function initialChat(data) {
		$chat.innerHTML = ''
		data.forEach(chat)
	}

	function userConnect(data) {
		const a = document.createElement('div')
		a.innerText = data.userName + ' entrou'
		$logs.appendChild(a)
		setTimeout(() => a.remove(), 5000)
	}
	
	function userDisconnect(data) {
		const a = document.createElement('div')
		a.innerText = data.userName + ' saiu'
		$logs.appendChild(a)
		setTimeout(() => a.remove(), 5000)
	}

	function error(data) {
		console.log(data)
		const error = document.createElement('div')
		error.classList.add('error')
		error.innerText = data.description
		$errors.appendChild(error)
		setTimeout(() => error.remove(), 5000)
	}

	function banned(data) {
		
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
		subscribe,
		chat,
		initialChat,
		userConnect,
		userDisconnect,
		error,
		banned
	}
}