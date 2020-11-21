const DEFAULT_NAME_LS = 'amongUsChat.defaultName'
const DEFAULT_COLOR_LS = 'amongUsChat.defaultColor'
const $name = document.querySelector('.input')
const $colors = document.querySelectorAll('.color')
const $form = document.querySelector('.playerData')
const helpers = Helpers()

$form.onsubmit = () => {
	localStorage.setItem(DEFAULT_NAME_LS, $name.value)
	localStorage.setItem(DEFAULT_COLOR_LS, document.querySelector('.color:checked').value)
}

if (!localStorage.getItem(DEFAULT_COLOR_LS)) {
	const generatedColor = $colors[helpers.randomNumber(0, 11)]
	generatedColor.checked = true
} else {
	document.querySelector(`#${localStorage.getItem(DEFAULT_COLOR_LS)}`).checked = true
}

$name.value = localStorage.getItem(DEFAULT_NAME_LS) || `Player${helpers.randomNumber(1000, 9999)}`