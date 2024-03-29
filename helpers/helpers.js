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
	},
	
	removeFormatChars: input => input
		.replace(/\*(\**[^*\n]+\**)\*/g, '$1')
		.replace(/\|(\|*[^\|\n]+\|*)\|/g, '$1')
		.replace(/_(_*[^_\n]+_*)_/g, '$1')
		.replace(/~(~*[^~\n]+~*)~/g, '$1')
		.replace(/`{3}(`*[^`\n]+`*)`{3}/g, '$1')
		.replace(/-{2}(-*[^-\n]+-*)-{2}/g, '$1')
		.replace(/\^(\^*[^\^\n]+\^*)\^/g, '$1'),

	convertLetters: input => {
		const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		const modified = '🇦‌🇧‌🇨‌🇩‌🇪‌🇫‌🇬‌🇭‌🇮‌🇯‌🇰‌🇱‌🇲‌🇳‌🇴‌🇵‌🇶‌🇷‌🇸‌🇹‌🇺‌🇻‌🇼‌🇽‌🇾‌🇿‌'
		let output = ''
		for (i of input) {
			output += modified[normal.indexOf(i) * 3 + 0]
			output += modified[normal.indexOf(i) * 3 + 1]
			output += modified[normal.indexOf(i) * 3 + 2]
		}
		return output
	}
}