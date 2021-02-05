const buttons = {
	disconnect: (cell) => {
		const btn = document.createElement('button')
		btn.innerText = 'Desconectar'
		btn.classList.add('btn', 'btn-sm', 'btn-warning', 'mr-1')
		btn.onclick = () => actions.disconnect(cell.getData())
		return btn
	},

	banID: (cell) => {
		const btn = document.createElement('button')
		btn.innerText = 'Banir ID'
		btn.classList.add('btn', 'btn-sm', 'btn-danger', 'mr-1')
		btn.onclick = () => actions.banID(cell.getData())
		return btn
	},

	banIP: (cell) => {
		const btn = document.createElement('button')
		btn.innerText = 'Banir IP'
		btn.classList.add('btn', 'btn-sm', 'btn-danger')
		btn.onclick = () => actions.banID(cell.getData())
		return btn
	},

	delete: (cell) => {
		const btn = document.createElement('button')
		btn.innerText = 'Excluir'
		btn.classList.add('btn', 'btn-sm', 'btn-danger', 'mr-1')
		btn.onclick = () => actions.delete(cell.getData())
		return btn
	},

	stop: (cell) => {
		const btn = document.createElement('button')
		btn.innerText = 'Parar'
		btn.classList.add('btn', 'btn-sm', 'btn-primary', 'mr-1')
		btn.onclick = () => actions.stop(cell.getData())
		return btn
	},

	undoBan: (cell) => {
		const btn = document.createElement('button')
		btn.innerText = 'Desfazer'
		btn.classList.add('btn', 'btn-sm', 'btn-primary', 'mr-1')
		btn.onclick = () => actions.undoBan(cell.getData())
		return btn
	}
}