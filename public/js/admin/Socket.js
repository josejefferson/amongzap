const socket = io(`${window.location.origin}/admin`)

socket.on('error', err => alert(err.description))
socket.on('connect', () => console.log('Conectado'))
socket.on('disconnect', () => console.log('Desconectado'))
//socket.on('chat')
socket.onevent = data => {
	const log = document.createElement('div')
	log.innerText = `[${data.data[0]}] ${JSON.stringify(data.data[1])}`
	$logs.prepend(log)
	logs.push(data)
	console.log(data)
}