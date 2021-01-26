const ADMIN_NAME = 'Seu José'
const NAME_LS = 'amongZap.name'
const COLOR_LS = 'amongZap.color'
const $name = document.querySelector('.input')
const $colors = document.querySelectorAll('.color')
const $form = document.querySelector('.playerData')
const helpers = Helpers()

$form.onsubmit = e => {
	localStorage.setItem(NAME_LS, $name.value)
	localStorage.setItem(COLOR_LS, document.querySelector('.color:checked').value)
	if ($name.value === ADMIN_NAME) {
		e.preventDefault()
		return window.location.href = '/auth'
	}
	window.location.href = '/chat'
}

if (!localStorage.getItem(COLOR_LS)) {
	const generatedColor = $colors[helpers.randomNumber(0, 11)]
	generatedColor.checked = true
} else {
	document.querySelector(`#${localStorage.getItem(COLOR_LS)}`).checked = true
}

$name.value = localStorage.getItem(NAME_LS) || `Player${helpers.randomNumber(1000, 9999)}`