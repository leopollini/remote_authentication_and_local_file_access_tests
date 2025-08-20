const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	selectFile: () => ipcRenderer.invoke('select-file'),
	readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
	getLocalKey: () => ipcRenderer.invoke('get-key')
});

const LONG_PRESS_DELAY = 500; // longpress duration in ms
var lastTouchedObject = null;
var touchTime = 0;
	
// detect touched item for events sent from main
document.addEventListener('pointerdown', function (e, pos) {
	lastTouchedObject = e.target;
	touchTime = Date.now();
	// console.log("ASASD");
});

// radial double-click signal forward
ipcRenderer.on('double-click2', function (e, pos)
{
	const dblClickEvent = new createMouseEvent('dblclick', pos, lastTouchedObject);
	// console.log("###lastItem:", lastTouchedObject);
	if (lastTouchedObject && Date.now() < touchTime + 1000)
		lastTouchedObject.dispatchEvent(dblClickEvent);
	else
		document.dispatchEvent(dblClickEvent);
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

var longPressTimer = null;

// detect long press (trigger left-click + contextmenu)
window.addEventListener('pointerdown', (event, input) => {
	// Start timer on mouse down
	if (!longPressTimer)
		longPressTimer = setTimeout(() => {
			// Trigger long press event after delay
			console.log("long pressss!!!");
			sendMouseEvent('contextmenu', {x: event.clientX, y: event.clientY}, event.target, 2);
			sendMouseEvent('pointerdown', {x: event.clientX, y: event.clientY}, event.target, 2);
		}, LONG_PRESS_DELAY);
});

// same
window.addEventListener('pointerup', (event) => {
	// Cancel timer on mouseup
	if (longPressTimer) {
		clearTimeout(longPressTimer);
		longPressTimer = null;
	}
});