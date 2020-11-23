function Sounds() {
	const audios = {
		EJECT_TEXT: new Audio('/sounds/eject_text.wav'),
		NEW_MESSAGE_01: new Audio('/sounds/new_message_01.wav'),
		NEW_MESSAGE_02: new Audio('/sounds/new_message_02.wav'),
		PLAYER_LEFT: new Audio('/sounds/player_left.wav'),
		PLAYER_SPAWN: new Audio('/sounds/player_spawn.wav'),
		UI_SELECT: new Audio('/sounds/ui_select.wav'),
	}

	function play(audioName) {
		if (true /* COLOCAR CONDIÇÃO PARA AUDIO NAS OPÇÕES */) {
			audios[audioName].pause()
			audios[audioName].currentTime = 0
			audios[audioName].play()
		}
	}

	return {
		play
	}
}