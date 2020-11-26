const helpers = Helpers()
const sounds = Sounds()
const chat = Chat()
const socket = Socket()

window.setInterval(() => {
	const dateTimes = document.querySelectorAll('.dateTime')
	dateTimes.forEach(e => e.innerText = moment(parseInt(e.dataset.time)).fromNow())
}, 5000)