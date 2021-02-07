const columns = {
	// Seleção
	selection: {
		headerSort: false,
		formatter: 'rowSelection',
		titleFormatter: 'rowSelection',
		cellClick: (e, cell) => cell.getRow().toggleSelect(),
		headerClick: (e, column) => column.getTable().selectRow('visible')
	},

	// Dados
	userName: {
		title: 'Nome',
		field: 'userName',
		headerFilter: 'input',
		formatter: cell => {
			cell.getElement().style.color = cell.getRow().getData().userColor
			return cell.getValue()
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
	socketID: {
		title: 'Socket ID',
		field: 'socketID',
		headerFilter: 'input'
	},

	// Banimento
	bannedBy: {
		title: 'Banido pelo',
		field: 'type',
		headerFilter: 'input'
	},
	user: {
		title: 'Usuário',
		field: 'user',
		headerFilter: 'input'
	},
	reason: {
		title: 'Motivo',
		field: 'reason',
		headerFilter: 'input'
	},

	// Hora/data
	typingTime: {
		title: 'Digitando desde',
		field: 'onlineTime',
		formatter: cell => moment(cell.getValue()).format('HH:mm:ss DD/MM/YYYY')
	},
	onlineTime: {
		title: 'Online desde',
		field: 'onlineTime',
		formatter: cell => moment(cell.getValue()).format('HH:mm:ss DD/MM/YYYY')
	},
	onlineTimes: {
		title: 'Tempos online',
		field: 'onlineTime',
		formatter: cell => {
			if (Array.isArray(cell.getValue()))
				return cell.getValue().map(i => moment(i).format('HH:mm:ss DD/MM/YYYY')).join('<br>')
			else
				return moment(cell.getValue()).format('HH:mm:ss DD/MM/YYYY')
		}
	},

	// Mensagens
	msgText: {
		title: 'Texto',
		field: 'text',
		headerFilter: 'input',
	},
	msgDateTime: {
		title: 'Tempo',
		field: 'dateTime',
		headerFilter: 'input',
		formatter: cell => moment(cell.getValue()).format('HH:mm:ss DD/MM/YYYY')
	},
	msgID: {
		title: 'ID',
		field: 'id',
		headerFilter: 'input',
	},
	msgSenderName: {
		title: 'Nome do remetente',
		field: 'sender.userName',
		headerFilter: 'input',
		formatter: cell => {
			cell.getElement().style.color = cell.getRow().getData().sender.userColor
			return cell.getValue()
		}
	},
	msgSenderID: {
		title: 'ID do remetente',
		field: 'sender.userID',
		headerFilter: 'input'
	},
	msgSenderIP: {
		title: 'IP do remetente',
		field: 'sender.userIP',
		headerFilter: 'input'
	},

	// Ações
	actions: (acts) => ({
		title: 'Ações',
		headerSort: false,
		formatter: (cell) => {
			const el = document.createElement('div')
			acts.forEach(a => el.appendChild(buttons[a](cell)))
			return el
		}
	})
}