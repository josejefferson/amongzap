const modals = {
	tips: () => Swal.fire({
		title: 'Dicas',
		html: `
			<ul style="text-align:left;padding-left:0;font-size:14px">
				<li style="margin-bottom:10px">Você pode ativar as notificações clicando sobre o ícone de sino <i class="fas fa-bell"></i>;</li>
				<li style="margin-bottom:10px">Você pode enviar um código de sala do AmongUs clicando no ícone de controle de videogame;</li>
				<li style="margin-bottom:10px">Você pode formatar o texto da sua mensagem digitando o texto inserindo certos caracteres antes e depois do texto:
					<ul>
						<li>*<b>Negrito</b>*</li>
						<li>|<i>Itálico</i>|</li>
						<li>_<u>Sublinhado</u>_</li>
						<li>~<s>Tachado</s>~</li>
						<li>--<small>Pequeno</small>--</li>
						<li>^<big>Grande</big>^</li>
						<li>\`\`\`<code>Código</code>\`\`\`</li>
					</ul>
				</li>
				<li>Você pode pré-visualizar este texto formatado mantendo pressionado o botão de enviar a mensagem.</li>
			</ul>
		`,
		showCloseButton: true,
		showConfirmButton: false,
		padding: '1.25em 10px'
	}),

	sendCode: (text = '', code = '') => Swal.fire({
		title: 'Enviar código',
		html: `
			<form id="sendCodeForm" class="mt-3">
				<input class="swal2-input my-1" type="text" id="sendCode" minlength="6" maxlength="6"
					style="font-size:26px;text-align:center;text-transform:uppercase" pattern="^[a-zA-Z]+$"
					value="${code}" placeholder="Código" autocomplete="off" required>
				<textarea class="swal2-input my-1" type="text" id="sendText" value="${text}"
					placeholder="Texto (opcional)" autocomplete="off" style="resize:none"></textarea>
			</form>
		`,
		confirmButtonText: 'Enviar',
		cancelButtonText: 'Cancelar',
		showCloseButton: true,
		showCancelButton: true,
		didOpen: popup => {
			popup.querySelector('#sendCodeForm').onsubmit = e => e.preventDefault()
			const $code = popup.querySelector('#sendCode')
			$code.onkeydown = e => { if (e.key === 'Enter') Swal.clickConfirm() }
			$code.focus()
		},
		didClose: () => document.querySelector('.sendText').focus(),
		preConfirm: () => {
			if (!document.querySelector('#sendCodeForm').checkValidity()) {
				Swal.showValidationMessage('Código inválido')
				document.querySelector('#sendCodeForm #sendCode').classList.add('validate')
				document.querySelector('#sendCodeForm #sendCode').focus()
			}

			return {
				code: document.querySelector('#sendCode').value,
				text: document.querySelector('#sendText').value.trim()
			}
		}
	}),

	previewChat: (text, $filter) => Swal.fire({
		title: 'Prévia da mensagem',
		html: $filter('inlineFmt')($filter('linky')(text, '_blank')),
		toast: true,
		position: 'top',
		showCloseButton: true,
		showConfirmButton: false,
		width: 'calc(100vw - 30px)',
		willClose: () => document.querySelector('.sendText').focus(),
		customClass: { content: 'messagePreview' }
	}),

	settings: ($scope) => Swal.fire({
		title: 'Opções',
		html: `
			<ul class="list">
				<li>
					<label>
						<i class="listIcon fas fa-volume-up"></i>
						<div class="listText">Sons</div>
						<input type="checkbox" class="listCheck" id="settings-sound"
							${helpers.getOption('sound') ? 'checked' : ''}>
					</label>
				</li>

				<li>
					<label>
						<i class="listIcon fas fa-chevron-circle-down"></i>
						<div class="listText">Rolagem automática</div>
						<input type="checkbox" class="listCheck" id="settings-autoScroll"
							${helpers.getOption('autoScroll') ? 'checked' : ''}>
					</label>
				</li>

				<li>
					<button class="openOnlineUsersModal">
						<i class="listIcon fas fa-users"></i>
						<div class="listText">Usuários online (${$scope.onlineUsers.length})</div>
					</button>	
				</li>

				<li>
					<a href="/" onclick="loading()">
						<i class="listIcon fas fa-pencil-alt"></i>
						<div class="listText">Editar dados</div>
					</a>
				</li>

				<li>
					<button onclick="window.location.reload();loading()">
						<i class="listIcon fas fa-redo"></i> 
						<span class="listBadge updateBadge ${$scope.update ? '' : 'hidden'}"></span>
						<div class="listText">Atualizar</div>
					</button>
				</li>

				<li>
					<button onclick="caches.keys().then(c=>c.filter(n=>n.startsWith('amongZap')).map(n=>caches.delete(n)))">
						<i class="listIcon fas fa-trash-alt"></i> 
						<div class="listText">Limpar cache</div>
					</button>
				</li>

				<li>
					<button onclick="modals.tips()">
						<i class="listIcon fas fa-info-circle"></i> 
						<div class="listText">Dicas</div>
					</button>
				</li>
			</ul>
		`,
		confirmButtonText: 'Salvar',
		cancelButtonText: 'Cancelar',
		showCloseButton: true,
		showCancelButton: true,
		padding: '1.25em 0',
		didOpen: (popup) => {
			popup.querySelector('.openOnlineUsersModal').onclick = () => modals.onlineUsers($scope.onlineUsers)
		},
		preConfirm: () => {
			return {
				sound: document.querySelector('#settings-sound').checked,
				autoScroll: document.querySelector('#settings-autoScroll').checked
			}
		}
	}),

	onlineUsers: (users) => Swal.fire({
		title: `Usuários online (${users.length})`,
		html: `
			<ul class="list">
				${users.length ? users.map(u => `
					<li>
						<i class="listIcon player ${'player-' + u.userColor}"></i>
						<div class="listText">${u.userName}</div>
					</li>
				`).join('') : '<li><b><i>Ninguém online</i></b></li>'}
			</ul>
		`,
		showCloseButton: true,
		showConfirmButton: false,
		padding: '1.25em 0'
	})
}