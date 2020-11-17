const chatArea = document.querySelector('.chat')
const sendTextArea = document.querySelector('.sendText')
const sendButton = document.querySelector('.sendButton')

const username = 'josé'
const socket = io()

socket.on('initial chat', data => {
	chatArea.innerHTML = ''

	for (i of data) {
		console.log(data);
		chatArea.append(Message(i))
	}
})

socket.on('chat', i => {
	chatArea.append(Message(i))
})

sendButton.onclick = () => {
	socket.emit('chat', { text: sendTextArea.value })
}

function Message(msg) {
	const { sender, text, dateTime } = msg
	const { name, color } = sender

	const message = document.createElement('div')
	const messageEl = document.createElement('div')
	const pictureEl = document.createElement('div')
	const picEl = document.createElement('div')
	const contentEl = document.createElement('div')
	const senderEl = document.createElement('div')
	const textEl = document.createElement('div')
	const dateTimeEl = document.createElement('div')
	
	message.classList.add('messageArea')
	messageEl.classList.add('message')
	pictureEl.classList.add('picture')
	picEl.classList.add('pic')
	contentEl.classList.add('content')
	senderEl.classList.add('sender')
	textEl.classList.add('text')
	dateTimeEl.classList.add('dateTime')
	
	if (name == username) {
		messageEl.classList.add('sent')
	}
	
	picEl.style.backgroundImage = `url(/public/img/${color}.png)`
	senderEl.innerText = name
	textEl.innerText = text
	dateTimeEl.innerText = dateTime
	
	pictureEl.append(picEl)
	contentEl.append(senderEl, textEl, dateTimeEl)
	messageEl.append(contentEl)
	if (name == username) messageEl.append(pictureEl)
	else messageEl.prepend(pictureEl)

	message.append(messageEl)

	return message
}