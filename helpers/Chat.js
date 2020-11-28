const fs = require('fs')
const DEFAULT_BLOCKED_WORDS = fs.readFileSync('./helpers/blockedWords.txt', {encoding: 'utf8', flag: 'r'}).split('\n')

module.exports = {
	messages: [],
	onlineUsers: [],
	typingUsers: [],
	blockedUsers: [],
	adminUserName: 'Seu José',
	blackListWords: DEFAULT_BLOCKED_WORDS,
	userHistory: [],
	logs: []
}