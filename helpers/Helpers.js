const RANDOM_STRING_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

module.exports = {
	randomString: (length = 10, characters = RANDOM_STRING_CHARACTERS) => {
		const charactersLength = characters.length
		let result = ''
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	},

	randomNumber: (min = 0, max = 10) => {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}
}