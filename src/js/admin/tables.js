var blockedUsersTable = new Tabulator('.blockedUsers', {
	data: state.blockedUsers,
	placeholder: 'Ninguém banido',
	cellVertAlign: 'middle',
	resizableColumns: false,
	selectablePersistence: true,
	columns: [
		columns.selection,
		columns.bannedBy,
		columns.user,
		columns.reason,
		columns.actions([
			'undoBan'
		])
	]
})

var onlineUsersTable = new Tabulator('.onlineUsers', {
	data: state.onlineUsers,
	placeholder: 'Nenhum usuário online',
	cellVertAlign: 'middle',
	resizableColumns: false,
	selectablePersistence: true,
	columns: [
		columns.selection,
		columns.userName,
		columns.userID,
		columns.userIP,
		columns.socketID,
		columns.onlineTime,
		columns.actions([
			'disconnect',
			'banID',
			'banIP'
		])
	]
})

var messagesTable = new Tabulator('.messages', {
	data: state.messages,
	placeholder: 'Nenhuma mensagem',
	cellVertAlign: 'middle',
	resizableColumns: false,
	selectablePersistence: true,
	columns: [
		columns.selection,
		columns.msgText,
		columns.msgDateTime,
		columns.msgID,
		columns.msgSenderName,
		columns.msgSenderID,
		columns.msgSenderIP,
		columns.actions([
			'delete',
			'banID',
			'banIP'
		])
	]
})

var typingUsersTable = new Tabulator('.typingUsers', {
	data: state.typingUsers,
	placeholder: 'Ninguém digitando',
	cellVertAlign: 'middle',
	resizableColumns: false,
	selectablePersistence: true,
	columns: [
		columns.selection,
		columns.userName,
		columns.userID,
		columns.userIP,
		columns.typingTime,
		columns.actions([
			'stop',
			'banID',
			'banIP'
		])
	]
})

var userHistoryTable = new Tabulator('.userHistory', {
	data: state.userHistory,
	placeholder: 'Nenhum usuário',
	cellVertAlign: 'middle',
	resizableColumns: false,
	selectablePersistence: true,
	columns: [
		columns.selection,
		columns.userName,
		columns.userID,
		columns.userIP,
		columns.onlineTimes,
		columns.actions([
			'banID',
			'banIP'
		])
	]
})