const modals = {
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
			</ul>
		`,
		confirmButtonText: 'Salvar',
		cancelButtonText: 'Cancelar',
		showCloseButton: true,
		showCancelButton: true,
		padding: '1.25em 0',
		preConfirm: () => {
			return {
				sound: document.querySelector('#settings-sound').checked,
				autoScroll: document.querySelector('#settings-autoScroll').checked
			}
		}
	})
}