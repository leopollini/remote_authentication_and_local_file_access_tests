// utils
function createMouseEvent(name, e)
{
	return new MouseEvent(name, e);
}

// utils
function sendMouseEvent(name, e)
{
	e.target.dispatchEvent(createMouseEvent(name, e));
}

module.exports = { createMouseEvent, sendMouseEvent };