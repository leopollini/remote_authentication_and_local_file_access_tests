const path = require('path')

// Sample Module. Plase copy-paste this file into new module's main folder
class WindowSetup extends require('../../BaseModule')
{
	CONF_FILE_PATH = path.join(__dirname, '..', 'conf.json');
	MODULE_NAME = "window-setup";    // Does not have to be the same as parent folder

	//// Constructor trace, please leave commented, unless necessary.
	// constructor(window, tab) { super(window, tab); }

	// Setup code here. This function is called in BaseModule's constructor.
	setup()
	{
        this.window.on('resize', () => {
            this.tab.setBounds({x: 0, y: 0  , height: this.window.getContentBounds().height, width: this.window.getContentBounds().width});
        });
	}
}

module.exports = WindowSetup;
