const {
	ipcMain
} = require('electron');
const XLSX = require('xlsx');

exports.init = () => {
	ipcMain.on('read-excel', (filePath) => {
		console.log(filePath);
		var workbook = XLSX.readFile(filePath);
		console.log(workbook);

	})
};