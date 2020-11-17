const chatArea = document.querySelector('.chat')
const sendTextArea = document.querySelector('.sendText')
const sendButton = document.querySelector('.sendButton')

username = 'josé'
const socket = io()

socket.on('initial chat', data => {
	chatArea.innerHTML = ''

	for (i of data) {
		console.log(data);

		chatArea.innerHTML += `
			<div class="message${i.sender == username ? ' sent' : ''}">
				<div class="sender">${i.sender}</div>
				<div class="content">${i.text}</div>
				<div class="dateTime">${i.dateTime}</div>
			</div>
		`
	}
})

socket.on('chat', i => {
	chatArea.innerHTML += `
			<div class="messageArea${i.sender == username ? ' sent' : ''}">
				<div class="message">
					<div class="sender">${i.sender}</div>
					<div class="content">${i.text}</div>
					<div class="dateTime">${i.dateTime}</div>
				</div>
			</div>
		`
})

sendButton.onclick = () => {
	socket.emit('chat', { text: sendTextArea.value })
}