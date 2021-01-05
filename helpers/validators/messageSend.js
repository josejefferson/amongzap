module.exports = {
	type: 'object',
	properties: {
		'text': { type: 'string', maxLength: 500 },
		'code': { type: 'string', pattern: '[A-Za-z]+', minLength: 6, maxLength: 6 }
	},
	if: {
		required: ['code']
	},
	then: {
		properties: { 'text': { minLength: 0 } },
	},
	else: {
		properties: { 'text': { minLength: 1 } }
	}
}