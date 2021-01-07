angular.module('amongUsChat').directive('ngEnter', function () {
	return function (scope, el, attrs) {
		el.bind('keydown keypress', function (e) {
			if (e.key === 'Enter') {
				scope.$apply(function () {
					scope.$eval(attrs.ngEnter)
				})
				e.preventDefault()
			}
		})
	}
})