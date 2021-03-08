function compareObjs(obj1, obj2) {
	function replacer(key, value) {
		if (key === undefined) return undefined
		else return value
	}
	return JSON.stringify(obj1, replacer) === JSON.stringify(obj2, replacer)	
}

function freezeFn() {
	freeze = !freeze
	if (!freeze) pending.forEach(ev)
}

var $logs = document.querySelector('.logs')
var $logsCount = document.querySelector('.logsCount')
var $sendEnabled = document.querySelector('.sendEnabled')
var $onlineUsersCount = document.querySelector('.onlineUsersCount')
var $userHistoryCount = document.querySelector('.userHistoryCount')
var $messagesCount = document.querySelector('.messagesCount')
var $typingUsersCount = document.querySelector('.typingUsersCount')
var $blockedUsersCount = document.querySelector('.blockedUsersCount')
var $manualBan = document.querySelector('.manualBan')
// importante verificar se existe linhas selecionadas antes de atualizar (colocar botão para atualizar)
let freeze = false
const pending = []
const state = {
	messages: [],
	onlineUsers: [],
	typingUsers: [],
	blockedUsers: [],
	adminUserName: '',
	userHistory: [],
	sendEnabled: true
}
const logs = []