var $manualBan = document.querySelector('.manualBan')

function compareObjs(obj1, obj2) {
	function replacer(key, value) {
		if (key === undefined) return undefined
		if (key.startsWith('$')) return undefined
		else return value
	}
	return JSON.stringify(obj1, replacer) === JSON.stringify(obj2, replacer)
}

angular.module('amongZap', []).controller('adminCtrl', ['$scope', ($scope) => {
	$scope.Date = window.Date
	$scope.state = {
		messages: [],
		onlineUsers: [],
		typingUsers: [],
		blockedUsers: [],
		adminUserName: '',
		userHistory: [],
		sendEnabled: true,
	}
	$scope.logs = []
	$scope.freeze = false
	$scope.pending = []

	$scope.socket = socket($scope)
	$scope.actions = actions($scope.socket)
	$scope.acts = (items, act) => items.filter(i => i.$selected).forEach($scope.actions[act])
	$scope.selectAll = (group) => {
		if (group.some(e => !e.$selected)) group.map(e => e.$selected = true)
		else group.map(e => e.$selected = false)
	}
}]).filter('mm', () => {
	return input => moment(input).format('HH:mm:ss DD/MM/YYYY')
})