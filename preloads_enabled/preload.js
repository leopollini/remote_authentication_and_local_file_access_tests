const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
	selectFile: () => ipcRenderer.invoke('select-file'),
	readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
	getLocalKey: () => ipcRenderer.invoke('get-key')
});



fs.readdirSync(__dirname).forEach(file => {
  if (file !== 'preload.js' && file != 'utils.js' && file.endsWith('.js')) {
    require(path.join(__dirname, file));
  }
});

// utils
function createMouseEvent(name, pos, target, bt = 0)
{
	return new MouseEvent(name, {
		clientX: pos.x,
		clientY: pos.y,
		bubbles: true,
		cancelable: true,
		view: window,
		button: bt,
		detail: 1,
		target: lastTouchedObject
	});
}

// utils
function sendMouseEvent(name, pos, target, bt = 0)
{
	target.dispatchEvent(createMouseEvent(name, pos, target, bt));
}
