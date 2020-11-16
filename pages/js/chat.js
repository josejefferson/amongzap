const chatArea = document.querySelector('.chat')
const sendTextArea = document.querySelector('.sendText')
const sendButton = document.querySelector('.sendButton')

const socket = io()

socket.on('initial chat', data => {
	chatArea.innerHTML = ''

	for (i of data) {
		console.log(data);

		chatArea.innerHTML += `
			<div class="message${i.sender == username && 'sent'}">
				<div class="sender">${i.sender}</div>
				<div class="content">${i.text}</div>
				<div class="dateTime">${i.dateTime}</div>
			</div>
		`
	}
})

socket.on('chat', data => {
	chatArea.innerHTML += `
			<div class="message${i.sender == username && 'sent'}">
				<div class="sender">${i.sender}</div>
				<div class="content">${i.text}</div>
				<div class="dateTime">${i.dateTime}</div>
			</div>
		`
})

sendButton.onclick = () => {
	socket.emit('chat', { text: sendTextArea.value })
}