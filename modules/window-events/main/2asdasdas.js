const BaseModule = require('../../BaseModule');
const path = require('path');

const CONF_FILE_PATH = path.join(__dirname, '..', 'conf.json');
const MODULE_NAME = "window-setup"; // Does not have to be the same as parent folder

// Sample Module. Plase copy-paste this file into new module's main folder
class WindowSetup extends BaseModule
{
	// Leave constructor as-is please, unless necessary.
	constructor(window, tab)
	{
		super(window, tab, CONF_FILE_PATH, MODULE_NAME);
		if (!this.__conf)
			return ;
		
		console.log('Setting up', this.module_name, "'config:", this.__conf, '...');
		try
		{
			this.setup();
			this.is_active = true;
			console.log('done');
		}
		catch (e)
		{
			console.log('Could not setup', this.module_name, ':', e.message);
			this.is_active = false;
		}
	}

	// Setup code here
	setup()
	{
        this.window.on('resize', () => {
            this.tab.setBounds({x: 0, y: 0  , height: this.window.getContentBounds().height, width: this.window.getContentBounds().width});
        });
	}
}

module.exports = WindowSetup;
