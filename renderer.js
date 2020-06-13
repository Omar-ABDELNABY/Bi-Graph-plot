const {
	ipcRenderer
} = require('electron');

const fileInput = document.querySelector('input');
fileInput.addEventListener('change', (event) => {
	if (!fileInput.files || !fileInput.files[0]) {
		return;
	}
	const filePath = fileInput.files[0]['path'];
	console.log(filePath);
	ipcRenderer.sendSync('read-excel', filePath);
});