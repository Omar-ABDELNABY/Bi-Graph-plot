const { ipcRenderer } = require('electron');

const fileInput: HTMLInputElement = document.querySelector('input');
fileInput.addEventListener('change', (event: Event) => {
	if (!fileInput.files || !fileInput.files[0]) {
		return;
	}
	const filePath = fileInput.files[0]['path'];
	ipcRenderer.sendSync('read-excel', filePath);
});

