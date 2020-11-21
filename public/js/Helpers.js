function Helpers() {
	const randomString = function (length = 10, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
		const charactersLength = characters.length
		let result = ''
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	const randomNumber = function (min = 0, max = 10) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	const replaceLinks = function (text) {
		const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
		return text.replace(urlRegex, (url) => {
			return '<a href="' + url + '" target="_blank">' + url + '</a>'
		})
	}

	const escapeHTML = function (text) {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;')
	}

	return {
		randomString,
		randomNumber,
		replaceLinks,
		escapeHTML
	}
}

if (typeof module !== 'undefined') module.exports = Helpers()