module.exports = {
	type: 'object',
	properties: {
		'text': { type: 'string', minLength: 1, maxLength: 500 },
		'code': { type: 'string', pattern: '[A-Za-z]+', minLength: 6, maxLength: 6 }
	},
	anyOf: [
		{ required: ['text'] },
		{ required: ['code'] }
	]
}