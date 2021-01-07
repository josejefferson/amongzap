const socket = io(`${window.location.origin}/admin`)

socket.on('error', err => alert(err.description))
socket.on('connect', () => console.log('Conectado'))
socket.on('disconnect', () => console.log('Desconectado'))
// socket.on('userConnected', data => {onlineUsers.push(data); onlineUsersTable.setData(onlineUsers)})
//socket.on('chat')
socket.onevent = e => {
	const [event, data] = e.data
	try { window[event](data) } catch { }

	logs.push(data)
	const $log = document.createElement('div')
	$log.innerText = `[${event}] ${JSON.stringify(data)}`
	$logs.prepend($log)
}


function typing(users) {
	typingUsers = users
	typingUsersTable.setData(users)
	$typingUsersCount.innerText = typingUsers.length
}

function userConnected(user) {
	onlineUsers.push(user)
	onlineUsersTable.setData(onlineUsers)
	$onlineUsersCount.innerText = onlineUsers.length
}

function userDisconnected(user) {
	const onlineUser = onlineUsers.filter(e => e.userID === user.userID && e.userColor === user.userColor)
	const index = onlineUsers.indexOf(onlineUser[0])
	if (index !== -1) onlineUsers.splice(index, 1)
	onlineUsersTable.setData(onlineUsers)
	$onlineUsersCount.innerText = onlineUsers.length
}

function chat(msg) {
	messages.push(msg)
	messagesTable.setData(messages)
	$messagesCount.innerText = messages.length
}

function ban(user) {
	bannedUsers.push(user)
	bannedUsersTable.setData(bannedUsers)
	$bannedUsersCount.innerText = bannedUsers.length
}

function unban(user) {
	let bannedUser
	if (user.type === 'ID') bannedUser = bannedUsers.filter(e => e.user.id === user.user)
	if (user.type === 'IP') bannedUser = bannedUsers.filter(e => e.user.ip === user.user)
	const index = bannedUsers.indexOf(bannedUser[0])
	if (index !== -1) bannedUsers.splice(index, 1)
	bannedUsersTable.setData(bannedUsers)
	$bannedUsersCount.innerText = bannedUsers.length
}