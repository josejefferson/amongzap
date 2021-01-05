module.exports = {
	type: 'object',
	properties: {
		'type': { type: 'string', enum: ['ID', 'IP'] },
		'userID': { type: 'string', minLength: 30, maxLength: 30 },
		'userIP': { type: 'string', minLength: 1 },
		'reason': { type: 'string', minLength: 1 }
	},
	allOf: [
		{
			if: { properties: { 'type': { const: 'IP' } } },
			then: { required: ['userIP'] }
		},
		{
			if: { properties: { 'type': { const: 'ID' } } },
			then: { required: ['userID'] }
		}
	]
}