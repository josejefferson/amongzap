function UserData() {
	const ADMIN_NAME = 'Seu José'
	const USER_ID_LS = 'amongZap.userID'
	const NAME_LS = 'amongZap.name'
	const COLOR_LS = 'amongZap.color'

	let userID
	const currentUserID = localStorage.getItem(USER_ID_LS)
	if (
		!currentUserID ||
		(currentUserID && currentUserID.length !== 30)
	) {
		userID = helpers.randomString(30)
		localStorage.setItem(USER_ID_LS, userID)
	} else {
		userID = currentUserID
	}

	let userIDHash = sha1(userID)

	let userName = localStorage.getItem(NAME_LS) ?
		localStorage.getItem(NAME_LS).trim().slice(0, 10) : ''
	let userColor = localStorage.getItem(COLOR_LS)
	if (!userName) window.location.href = '/'
	if (userName === ADMIN_NAME) window.location.href = '/auth'

	return {
		userID,
		userIDHash,
		userName,
		userColor
	}
}