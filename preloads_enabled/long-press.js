const { contextBridge, ipcRenderer } = require('electron');
const { sendMouseEvent } = require('./utils.js')

const LONG_PRESS_DELAY = 500; // longpress duration in ms
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