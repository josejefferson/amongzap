angular.module('amongUsChat').directive('ngEnter', () => {
	return (scope, el, attrs) => {
		el.bind('keydown keypress', e => {
			if (e.key === 'Enter') {
				scope.$apply(() => scope.$eval(attrs.ngEnter))
				e.preventDefault()
			}
		})
	}
})