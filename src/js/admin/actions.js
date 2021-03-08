const actions = {
	banID: (data, reason = prompt('Motivo:')) => {
		if (reason) socket.emit('ban', {
			type: 'ID',
			user: data.userID,
			reason: reason
		})
	},

	banIP: (data, reason = prompt('Motivo:')) => {
		if (reason) socket.emit('ban', {
			type: 'IP',
			user: data.userIP,
			reason: reason
		})
	},

	manualBan: (type) => {
		socket.emit('ban', {
			type,
			user: $manualBan.value,
			reason: prompt('Motivo:')
		})
		$manualBan.value = ''
		$manualBan.focus()
	},

	undoBan: (data) => {
		socket.emit('unban', {
			type: data.type,
			user: data.user
		})
	},

	disconnect: (data) => {
		socket.emit('disconnectUser', data.socketID)
	},

	delete: (data) => {
		socket.emit('deleteMsg', data.id)
	},

	stop: (data) => {
		socket.emit('stopTyping', data.userID)
	},

	backup: () => {
		if (confirm('Tem certeza?')) socket.emit('backup')
	},

	sendEnabled: (enabled) => {
		socket.emit('sendEnabled', enabled)
	},
	
	clear: (table) => {
		state[table] = []
		window[table + 'Table'].setData([])
		window['$' + table + 'Count'].innerText = 0
	},
	
	clearLogs: () => {
		$logs.innerHTML = ''
		$logsCount.innerText = 0
	}
}

function acts(table, action) {
	if (action.startsWith('ban')) {
		table.getSelectedData().forEach(p => actions[action](p, prompt('Motivo:')))
	} else {
		table.getSelectedData().forEach(p => actions[action](p))
	}
}