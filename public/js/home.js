const nameEl = document.querySelector('.input')
const colorEls = document.querySelectorAll('.color')
colorEls.forEach(e => e.onchange = e => Cookies.set('test', e.target.value))

// if (Cookies.get('test')) {
// 	document.querySelectorAll('.color')[Math.floor(Math.random() * 12)].checked = true
// 	Cookies.set('test', )
// }

const userIDCookie = Cookies.get('userID')
const userID = (!userIDCookie || (userIDCookie && userIDCookie.length !== 30)) ? generateID(30) : Cookies.get('userID')

function generateID(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	let result = ''
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	Cookies.set('userID', result)
	return result
}