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
		target: target
	});
}

// utils
function sendMouseEvent(name, pos, target, bt = 0)
{
	target.dispatchEvent(createMouseEvent(name, pos, target, bt));
}

module.exports = { createMouseEvent, sendMouseEvent };