module.exports = {
	type: 'object',
	properties: {
		'text': { type: 'string', minLength: 1, maxLength: 500 },
		'code': { type: 'string', minLength: 6, maxLength: 6 },
		'dateTime': { type: 'number', minimum: 0 },
		'id': { type: 'string', minLength: 50, maxLength: 50 },
		'sender': {
			type: 'object',
			properties: {
				'userID': { type: 'string', minLength: 30, maxLength: 30 },
				'userIP': { type: 'string' },
				'userName': { type: 'string', minLength: 1, maxLength: 10 },
				'userColor': {
					type: 'string',
					enum: ['red', 'blue', 'green', 'pink', 'orange', 'yellow', 'gray', 'white', 'purple', 'brown', 'cyan', 'lime']
				}
			},
			additionalProperties: false,
			required: ['userID', 'userName', 'userColor']
		},
		'badge': {
			type: 'object',
			properties: {
				'icon': { type: 'string', minLength: 1 },
				'text': { type: 'string', minLength: 1 },
				'color': { type: 'string', minLength: 1 }
			},
			additionalProperties: false,
			required: ['icon', 'text', 'color']
		}
	},
	additionalProperties: false,
	required: ['dateTime', 'id', 'sender'],
	anyOf: [
		{ required: ['text'] },
		{ required: ['code'] },
	]
}