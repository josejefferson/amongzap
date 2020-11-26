function Helpers() {
	const URL_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
	const RANDOM_STRING_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	const randomString = (length = 10, characters = RANDOM_STRING_CHARACTERS) => {
		const charactersLength = characters.length
		let result = ''
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	const randomNumber = (min = 0, max = 10) => {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	const replaceLinks = text => {
		return text.replace(URL_REGEX, url => '<a href="' + url + '" target="_blank">' + url + '</a>')
	}

	const escapeHTML = text => {
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