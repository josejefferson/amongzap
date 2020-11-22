const helpers = Helpers()
const chat = Chat()
const socket = Socket(chat)

socket.subscribe(f => chat[f.type](f.data))
chat.subscribe(f => socket[f.type](f.data))

window.setInterval(() => {
	const dateTimes = document.querySelectorAll('.dateTime')
	dateTimes.forEach(e => e.innerText = moment(parseInt(e.dataset.time)).fromNow())
}, 5000)