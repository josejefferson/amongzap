const ADMIN_NAME = 'Seu José'
const NAME_LS = 'amongZap.name'
const COLOR_LS = 'amongZap.color'
const $name = document.querySelector('.input')
const $colors = document.querySelectorAll('.color')
const $form = document.querySelector('.playerData')
const $refresh = document.querySelector('.refresh')
const $showRules = document.querySelector('.showRules')

$form.onsubmit = e => {
	e.preventDefault()
	localStorage.setItem(NAME_LS, $name.value)
	localStorage.setItem(COLOR_LS, document.querySelector('.color:checked').value)
	if ($name.value === ADMIN_NAME) {
		e.preventDefault()
		return window.location.href = '/auth'
	}
	window.location.href = '/chat'
	loading()
}

if (!localStorage.getItem(COLOR_LS)) {
	const generatedColor = $colors[helpers.randomNumber(0, 11)]
	generatedColor.checked = true
} else {
	document.querySelector(`#${localStorage.getItem(COLOR_LS)}`).checked = true
}

$name.value = localStorage.getItem(NAME_LS) || `Player${helpers.randomNumber(1000, 9999)}`

$refresh.onclick = () => {
	window.location.reload()
	loading()
}
$showRules.onclick = () => Swal.fire({
	title: 'Regras',
	padding: '1.25em 0',
	html: `
		<ul style="text-align:left;padding-left:10px">
			<li>Respeite os outros participantes</li>
			<li>Proibido <i>spam</i> e <i>flood</i></li>
			<li>Evitar palavrões excessivos ou que ofendam algum integrante</li>
			<li>Proibido divulgação de conteúdos sem autorização</li>
		</ul>`
})