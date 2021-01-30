const socket = io(`${window.location.origin}/admin`)

socket.on('error', err => alert(err))
socket.on('connect', () => console.log('Conectado'))
socket.on('disconnect', () => console.log('Desconectado'))
socket.onevent = e => {
	if (freeze) return
	const [event, data] = e.data
	const special = event.startsWith('+') || event.startsWith('-') || event.startsWith('*')

	try {
		if (special) var ev = event.substr(1)
		if (event.startsWith('+')) state[ev].push(data)
		else if (event.startsWith('-')) {
			const i = state[ev].findIndex(o => compareObjs(o, data))
			if (i >= 0) state[ev].splice(i, 1)
		}
		else if (event.startsWith('*')) state[ev] = data
		else if (event === 'initialData') {
			Object.assign(state, data)

			onlineUsersTable.setData(state.onlineUsers)
			userHistoryTable.setData(state.userHistory)
			messagesTable.setData(state.messages)
			typingUsersTable.setData(state.typingUsers)
			blockedUsersTable.setData(state.blockedUsers)

			$onlineUsersCount.innerText = state.onlineUsers.length
			$userHistoryCount.innerText = state.userHistory.length
			$messagesCount.innerText = state.messages.length
			$typingUsersCount.innerText = state.typingUsers.length
			$blockedUsersCount.innerText = state.blockedUsers.length
		}

		if (special) {
			window[ev + 'Table'].setData(state[ev])
			window['$' + ev + 'Count'].innerText = state[ev].length
		}

		logs.push(data)
		const $log = document.createElement('div')
		$log.innerText = `[${event}] ${JSON.stringify(data)}`
		$logs.prepend($log)
		$logsCount.innerText = logs.length
	} catch (err) { console.log(err) }
}