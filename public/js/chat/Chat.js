function Chat() {
	const observers = []
	const subscribe = f => observers.push(f)
	const notifyAll = (...p) => observers.forEach(f => f(...p))

	const { userID, userName, userColor } = UserData()

	const $chat = document.querySelector('.chat')
	const $sendText = document.querySelector('.sendText')
	const $sendBtn = document.querySelector('.sendButton')

	$sendBtn.onclick = sendMsg
	$sendText.onkeyup = e => (e.key === 'Enter') && sendMsg() // TEMP
	
	function sendMsg() {
		notifyAll({ type: 'chat', data: { text: $sendText.value } })
		$sendText.value = ''
		$sendText.focus()
	}

	function chat(data) {
		$chat.append(genMsgEl(data))
	}
	
	function initialChat(data) {
		$chat.innerHTML = ''
		data.forEach(chat)
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

		if (userName == sender.userName) {
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
		initialChat
	}
}