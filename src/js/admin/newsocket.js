function socket($scope) {
	const socket = io(`${window.location.origin}/admin`)

	socket.on('error', err => alert(err))
	socket.on('connect', () => Swal.fire({
		title: 'Conectado',
		icon: 'success',
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		showCloseButton: true,
		timer: 2000
	}))
	socket.on('disconnect', () => Swal.fire({
		title: 'Desconectado',
		icon: 'warning',
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		showCloseButton: true
	}))
	socket.onevent = e => {
		const [event, data] = e.data
		if ($scope.freeze) return $scope.pending.push({ event, data })
		$scope.pending.forEach(ev)
		$scope.pending = []
		ev({ event, data })
		$scope.$apply()
	}

	function ev({ event, data }) {
		const special = event.startsWith('+') || event.startsWith('-') || event.startsWith('*')

		try {
			if (special) var ev = event.substr(1)
			if (event.startsWith('+')) $scope.state[ev].push(data)
			else if (event.startsWith('-')) {
				const i = $scope.state[ev].findIndex(o => compareObjs(o, data))
				if (i >= 0) $scope.state[ev].splice(i, 1)
			}
			else if (event.startsWith('*')) $scope.state[ev] = data
			else if (event === 'initialData') Object.assign($scope.state, data)
			else if (event === 'backupDone') alert('Backup concluído!')
			else if (event === 'userHistory') {
				const uidx = $scope.state.userHistory.findIndex(u => data.userIPBase.startsWith(u.userIPBase))
				if (uidx < 0) $scope.state.userHistory.push(data)
				else $scope.state.userHistory[uidx] = data
			}

			$scope.logs.push({ text: `[${event}] ${JSON.stringify(data)}` })
		} catch (err) { console.error(err) }
	}

	return socket
}