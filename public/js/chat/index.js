const helpers = Helpers()
const sounds = Sounds()
const chat = Chat()
const socket = Socket()

window.setInterval(() => {
	const dateTimes = $('.dateTime')
	dateTimes.each(function () {
		$(this).text(moment(parseInt($(this).data('time'))).fromNow())
	})
}, 5000)