const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	selectFile: () => ipcRenderer.invoke('select-file'),
	readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
	getLocalKey: () => ipcRenderer.invoke('get-key')
});
