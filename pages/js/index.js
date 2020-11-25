//define some sample data
var tabledata = [
	{
		userName: 'José',
		userColor: 'red',
		userID: 't39pehwueowe3',
		userIP: '123.345.234.745',
		socketID: 'sfis98oe983oeise',
		onlineTime: 1606332084009
	},
	{
		userName: 'Jeff',
		userColor: 'green',
		userID: 't39pehwueowe3',
		userIP: '123.345.234.745',
		socketID: 'sfis98oe983oeise',
		onlineTime: 1606332084009
	},
	{
		userName: 'José',
		userColor: 'blue',
		userID: 't39pehwueowe3',
		userIP: '123.345.234.745',
		socketID: 'sfis98oe983oeise',
		onlineTime: 1606332084009
	},
	{
		userName: 'José',
		userColor: 'red',
		userID: 't39pehwueowe3',
		userIP: '123.345.234.745',
		socketID: 'sfis98oe983oeise',
		onlineTime: 1606332084010
	},
]

var table = new Tabulator('#example-table', {
	data: tabledata,
	resizableColumns: false,
	selectablePersistence: true,
	columns: [
		{ headerSort: false, formatter: 'rowSelection', titleFormatter: 'rowSelection', cellClick: (e, cell) => cell.getRow().toggleSelect(), headerClick: (e, column) => console.log(column.getTable().selectRow('visible')) },
		{ title: 'Nome', field: 'userName', headerFilter:'input' },
		{ title: 'Cor', field: 'userColor', formatter: 'color', headerFilter:"input" },
		{ title: 'ID', field: 'userID', headerFilter:"input" },
		{ title: 'IP', field: 'userIP', headerFilter:"input" },
		{ title: 'Socket ID', field: 'socketID', headerFilter:"input" },
		{
			title: 'Online desde', field: 'onlineTime', formatter: cell => moment(cell.getValue()).format('HH:MM:SS DD/MM/YYYY') },
		{
			title: 'Ações', headerSort: false, formatter: function (cell, formatterParams, onRendered) {
				button = document.createElement('button')
				button.innerText = 'CLICK'
				button.onclick = () => alert(cell.getData().userName)
				return button
			}
		},
	]
})