const { app, ipcMain } = require('electron');
const fs = require('fs');

var KEYS_PATH = "local_key.json";

class FileAccessSetup
{
	constructor()
	{
		ipcMain.handle('select-file', async () => await this.selectFile());
		ipcMain.handle('read-file', async (event, path) => await this.readFile(path));
		ipcMain.handle('get-key', async () => await this.getLocalKey());
		
		app.commandLine.appendSwitch('touch-events', 'enabled');
		app.commandLine.appendSwitch('enable-pointer-events');
	}
	async selectFile()
	{

	}

	async readFile(path)
	{
		try {
			return fs.readFileSync(filePath, 'utf-8');
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getLocalKey()
	{
		try {
			return JSON.parse(fs.readFileSync(KEYS_PATH, 'utf-8'));
		} catch (err) {
			console.error(err);
			return null;
		}
	}

}

new FileAccessSetup();

module.exports = FileAccessSetup;