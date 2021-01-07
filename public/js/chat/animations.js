angular.module('amongUsChat').animation('.error', () => ({ enter: anim.open, leave: anim.close }))
angular.module('amongUsChat').animation('.success', () => ({ enter: anim.open, leave: anim.close }))
angular.module('amongUsChat').animation('.status', () => ({ addClass: anim.statusChange }))
angular.module('amongUsChat').animation('.loadingMessages', () => ({ addClass: anim.hide, removeClass: anim.show }))
angular.module('amongUsChat').animation('.log', () => ({ enter: anim.fadeIn, leave: anim.slideClose }))

const anim = {
	open: (el, done) => {
		el.stop(true, false).css({ display: 'none', opacity: 0 }).slideDown(100).fadeTo(300, 1, done)
		return done
	},

	close: (el, done) => {
		el.stop(true, false).fadeTo(500, 0).slideUp(100, done)
		return done
	},

	statusChange: (el, className, done) => {
		el.stop(true, false).slideDown(100).fadeTo(300, 1, done)
		if (className === 'connected') el.delay(2000).fadeTo(500, 0).slideUp(100, done)
		return done
	},

	show: (el, className, done) => {
		if (className === 'ng-hide') el.stop(true, false).slideDown(100).fadeTo(300, 1, done)
		return done
	},

	hide: (el, className, done) => {
		if (className === 'ng-hide') el.stop(true, false).fadeTo(500, 0).slideUp(100, done)
		return done
	},

	fadeIn: (el, done) => {
		el.stop(true, false).css({ opacity: 0 }).fadeTo(300, 1, done)
		return done
	},

	slideClose: (el, done) => {
		el.stop(true, false).animate({ left: '-200px' }).slideUp(100, done)
		return done
	}
}