const { contextBridge, ipcRenderer } = require('electron');
const { createMouseEvent } = require('./utils.js')

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