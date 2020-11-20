function Chat() {
	const observers = []
	const subscribe = f => observers.push(f)
	const notifyAll = (...p) => observers.forEach(f => f(...p))

	const username = new URLSearchParams(window.location.search).get('user')
	const chatArea = document.querySelector('.chat')
	const sendTextArea = document.querySelector('.sendText')
	const sendButton = document.querySelector('.sendButton')

	sendButton.onclick = () => {
		notifyAll({ type: 'chat', data: { text: sendTextArea.value } })
		sendTextArea.value = ''
		sendTextArea.focus()
	}

	function chat(data) {
		chatArea.append(message(data))
	}
	
	function initialChat(data) {
		chatArea.innerHTML = ''
		data.forEach(chat)
	}

	function message(msg) {
		const { sender, text, dateTime } = msg
		const { name, color } = sender

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

		if (name == username) {
			message.classList.add('sent')
		}

		picEl.style.backgroundImage = `url(/img/players/${color}.png)`
		senderEl.innerText = name
		textEl.innerHTML = linkify(escapeHtml(text))
		dateTimeEl.innerText = moment(dateTime).fromNow()

		pictureEl.append(picEl)
		messageDataEl.append(senderEl, dateTimeEl)
		contentEl.append(messageDataEl, textEl)
		messageEl.append(contentEl)
		messageEl.prepend(pictureEl)

		message.append(messageEl)

		return message
	}

	function linkify(text) {
		var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		return text.replace(urlRegex, function (url) {
			return '<a href="' + url + '" target="blank">' + url + '</a>';
		});
	}

	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	return {
		subscribe,
		chat,
		initialChat
	}
}