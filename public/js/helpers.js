const helpers = (() => {
	function randomString(length = 10, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
		const charactersLength = characters.length
		let result = ''
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}
		return result
	}

	function randomNumber(min = 0, max = 10) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	function copy(text) {
		const el = document.createElement('textarea')
		el.value = text
		document.body.appendChild(el)
		el.select()
		document.execCommand('copy')
		document.body.removeChild(el)
	}

	function getOption(name, def = true) {
		const opt = localStorage.getItem('amongZap.settings.' + name)
		if (opt === 'true') return true
		else if (opt === 'false') return false
		else return def
	}

	function setOptions(opts) {
		for (const i in opts) {
			localStorage.setItem('amongZap.settings.' + i, opts[i])
		}
	}

	// Créditos: https://github.com/Robbendebiene/Sliding-Scroll
	function scrollToY(y, duration = 0, element = document.scrollingElement) {
		if (element.scrollTop === y) return

		const cosParameter = (element.scrollTop - y) / 2
		let scrollCount = 0, oldTimestamp = null

		function step(newTimestamp) {
			if (oldTimestamp !== null) {
				scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration
				if (scrollCount >= Math.PI) return element.scrollTop = y
				element.scrollTop = cosParameter + y + cosParameter * Math.cos(scrollCount)
			}
			oldTimestamp = newTimestamp
			window.requestAnimationFrame(step)
		}
		window.requestAnimationFrame(step)
	}

	function scrollBottom() {
		if (!getOption('autoScroll')) return
		scrollToY(document.body.scrollHeight, 400)
	}

	return {
		randomString,
		randomNumber,
		copy,
		getOption,
		setOptions,
		scrollBottom
	}
})()