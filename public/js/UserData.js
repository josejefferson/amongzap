function UserData() {
	const USER_ID_LS = 'amongUsChat.userID'

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

	let userName = new URLSearchParams(window.location.search).get('user').trim().slice(0, 10)
	let userColor = new URLSearchParams(window.location.search).get('color')
	
	return {
		userID,
		userName,
		userColor
	}
}