const sharedOptions = {
	cellVertAlign: 'middle',
	resizableColumns: false,
	selectablePersistence: true
}

const sharedColumns = {
	selection: {
		headerSort: false,
		formatter: 'rowSelection',
		titleFormatter: 'rowSelection',
		cellClick: (e, cell) => cell.getRow().toggleSelect(),
		headerClick: (e, column) => column.getTable().selectRow('visible')
	},
	userName: {
		title: 'Nome',
		field: 'userName',
		headerFilter: 'input',
		formatter: cell => {
			cell.getElement().style.color = cell.getRow().getData().userColor; return cell.getValue()
		}
	},
	userID: {
		title: 'ID',
		field: 'userID',
		headerFilter: 'input'
	},
	userIP: {
		title: 'IP',
		field: 'userIP',
		headerFilter: 'input'
	},
}

var onlineUsersTable = new Tabulator('.onlineUsers', {
	data: state.onlineUsers,
	placeholder: 'Nenhum usuário online',
	...sharedOptions,
	columns: [
		sharedColumns.selection,
		sharedColumns.userName,
		sharedColumns.userID,
		sharedColumns.userIP,
		{
			title: 'Socket ID',
			field: 'socketID',
			headerFilter: 'input'
		},
		{
			title: 'Online desde',
			field: 'onlineTime',
			formatter: cell => moment(cell.getValue()).format('HH:mm:ss DD/MM/YYYY')
		},
		{
			title: 'Ações',
			headerSort: false,
			formatter: (cell) => {
				const disconnectBtn = document.createElement('button')
				const banIDBtn = document.createElement('button')
				const banIPBtn = document.createElement('button')

				disconnectBtn.innerText = 'Desconectar'
				banIDBtn.innerText = 'Banir ID'
				banIPBtn.innerText = 'Banir IP'

				disconnectBtn.classList.add('btn', 'btn-sm', 'btn-warning', 'mr-1')
				banIDBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'mr-1')
				banIPBtn.classList.add('btn', 'btn-sm', 'btn-danger')

				disconnectBtn.onclick = () => alert(cell.getData().socketID)
				//banIDBtn.onclick = () => alert(cell.getData().userID)
				banIDBtn.onclick = () => {
					const reason = prompt('Motivo:')
					if (reason) socket.emit('ban', {
						type: 'ID',
						user: { id: cell.getData().userID },
						reason
					})
				}
				banIPBtn.onclick = () => alert(cell.getData().userIP)

				const el = document.createElement('div')
				el.appendChild(disconnectBtn)
				el.appendChild(banIDBtn)
				el.appendChild(banIPBtn)

				return el
			}
		}
	]
})

var userHistoryTable = new Tabulator('.userHistory', {
	data: state.userHistory,
	placeholder: 'Nenhum usuário',
	...sharedOptions,
	columns: [
		sharedColumns.selection,
		sharedColumns.userName,
		{
			title: 'ID',
			field: 'userID',
			headerFilter: 'input',
			formatter: cell => { cell.getRow().getElement().id = cell.getValue(); return cell.getValue() }
		},
		sharedColumns.userIP,
		{
			title: 'Tempos online',
			field: 'onlineTime',
			formatter: cell => {
				if (Array.isArray(cell.getValue()))
					return cell.getValue().map(i => moment(i).format('HH:mm:ss DD/MM/YYYY')).join('<br>')
				else
					return moment(cell.getValue()).format('HH:mm:ss DD/MM/YYYY')
			}
		},
		{
			title: 'Ações',
			headerSort: false,
			formatter: (cell) => {
				const banIDBtn = document.createElement('button')
				const banIPBtn = document.createElement('button')

				banIDBtn.innerText = 'Banir ID'
				banIPBtn.innerText = 'Banir IP'

				banIDBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'mr-1')
				banIPBtn.classList.add('btn', 'btn-sm', 'btn-danger')

				banIDBtn.onclick = () => {
					const reason = prompt('Motivo:')
					if (reason) socket.emit('ban', {
						type: 'ID',
						user: { id: cell.getData().userID },
						reason
					})
				}
				banIPBtn.onclick = () => alert(cell.getData().userIP)

				const el = document.createElement('div')
				el.appendChild(banIDBtn)
				el.appendChild(banIPBtn)

				return el
			}
		}
	]
})

var messagesTable = new Tabulator('.messages', {
	data: state.messages,
	placeholder: 'Nenhuma mensagem',
	...sharedOptions,
	columns: [
		sharedColumns.selection,
		{
			title: 'Texto',
			field: 'text',
			headerFilter: 'input',
		},
		{
			title: 'Tempo',
			field: 'dateTime',
			headerFilter: 'input',
		},
		{
			title: 'ID',
			field: 'id',
			headerFilter: 'input',
		},
		{
			title: 'Nome do remetente',
			field: 'sender.userName',
			headerFilter: 'input',
			formatter: cell => {
				cell.getElement().style.color = cell.getRow().getData().sender.userColor; return cell.getValue()
			}
		},
		{
			title: 'ID do remetente',
			field: 'sender.userID',
			headerFilter: 'input'
		},
		{
			title: 'IP do remetente',
			field: 'sender.userIP',
			headerFilter: 'input'
		},
		{
			title: 'Ações',
			headerSort: false,
			formatter: (cell) => {
				const deleteBtn = document.createElement('button')
				const banIDBtn = document.createElement('button')
				const banIPBtn = document.createElement('button')

				deleteBtn.innerText = 'Excluir'
				banIDBtn.innerText = 'Banir ID'
				banIPBtn.innerText = 'Banir IP'

				deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'mr-1')
				banIDBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'mr-1')
				banIPBtn.classList.add('btn', 'btn-sm', 'btn-danger')

				deleteBtn.onclick = () => socket.emit('deleteMsg', cell.getData().id)
				banIDBtn.onclick = () => {
					const reason = prompt('Motivo:')
					if (reason) socket.emit('ban', {
						type: 'ID',
						user: { id: cell.getData().sender.userID },
						reason
					})
				}
				banIPBtn.onclick = () => alert(cell.getData().sender.userIP)

				const el = document.createElement('div')
				el.appendChild(deleteBtn)
				el.appendChild(banIDBtn)
				el.appendChild(banIPBtn)

				return el
			}
		}
	]
})

var typingUsersTable = new Tabulator('.typingUsers', {
	data: state.typingUsers,
	placeholder: 'Ninguém digitando',
	...sharedOptions,
	columns: [
		sharedColumns.selection,
		sharedColumns.userName,
		sharedColumns.userID,
		sharedColumns.userIP,
		{
			title: 'Digitando desde',
			field: 'onlineTime',
			formatter: cell => moment(cell.getValue()).format('HH:mm:ss DD/MM/YYYY')
		},
		{
			title: 'Ações',
			headerSort: false,
			formatter: (cell) => {
				const stopBtn = document.createElement('button')
				const disconnectBtn = document.createElement('button')
				const banIDBtn = document.createElement('button')
				const banIPBtn = document.createElement('button')

				stopBtn.innerText = 'Parar'
				disconnectBtn.innerText = 'Desconectar'
				banIDBtn.innerText = 'Banir ID'
				banIPBtn.innerText = 'Banir IP'

				stopBtn.classList.add('btn', 'btn-sm', 'btn-primary', 'mr-1')
				disconnectBtn.classList.add('btn', 'btn-sm', 'btn-warning', 'mr-1')
				banIDBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'mr-1')
				banIPBtn.classList.add('btn', 'btn-sm', 'btn-danger')

				stopBtn.onclick = () => alert(cell.getData().userID)
				disconnectBtn.onclick = () => alert(cell.getData().socketID)
				banIDBtn.onclick = () => {
					const reason = prompt('Motivo:')
					if (reason) socket.emit('ban', {
						type: 'ID',
						user: { id: cell.getData().userID },
						reason
					})
				}
				banIPBtn.onclick = () => alert(cell.getData().userIP)

				const el = document.createElement('div')
				el.appendChild(stopBtn)
				el.appendChild(disconnectBtn)
				el.appendChild(banIDBtn)
				el.appendChild(banIPBtn)

				return el
			}
		}
	]
})

var blockedUsersTable = new Tabulator('.blockedUsers', {
	data: state.blockedUsers,
	placeholder: 'Ninguém banido',
	...sharedOptions,
	columns: [
		sharedColumns.selection,
		{
			title: 'Banido por',
			field: 'type',
			headerFilter: 'input'
		},
		{
			title: 'ID',
			field: 'user.id',
			headerFilter: 'input'
		},
		{
			title: 'IP',
			field: 'user.ip',
			headerFilter: 'input'
		},
		{
			title: 'Motivo',
			field: 'reason',
			headerFilter: 'input'
		},
		{
			title: 'Ações',
			headerSort: false,
			formatter: (cell) => {
				const undoBanBtn = document.createElement('button')

				undoBanBtn.innerText = 'Desfazer'

				undoBanBtn.classList.add('btn', 'btn-sm', 'btn-primary', 'mr-1')

				undoBanBtn.onclick = () => socket.emit('unban', {
					type: cell.getData().type || 'ID', // TODO:
					user: cell.getData().userID
				})

				const el = document.createElement('div')
				el.appendChild(undoBanBtn)

				return el
			}
		}
	]
})