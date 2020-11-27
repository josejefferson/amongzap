const fs = require('fs')
const DEFAULT_BLOCKED_WORDS = fs.readFileSync('./helpers/blockedWords.txt', {encoding: 'utf8', flag: 'r'}).split('\n')

module.exports = {
	messages: [],
	onlineUsers: [],
	blockedUsers: [],
	adminUserName: 'Seu José', // TODO
	blackListUserNames: [], // TODO
	blackListWords: DEFAULT_BLOCKED_WORDS, // TODO
	userHistory: [], // TODO
	typingUsers: [],
	logs: []
}