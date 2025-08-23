const fs = require('fs');
const chalk = require('chalk');
const Env = require('../env');

class BaseModule
{
	__conf = null;
	window = null;
	tab = null;
	module_name = "";
	is_active = false;

	constructor() {}

	__start(window, tab)
	{
		this.window = window;
		this.tab = tab;
		this.module_name = this.MODULE_NAME || 'BaseModule (not assigned)';
		try { this.__conf = JSON.parse(fs.readFileSync(this.CONF_FILE_PATH, 'utf-8')); }
		catch (e) { console.log('Could not load conf file for', this.module_name, ':', e.message, '.'); }

		if (!this.__conf)
		{
			console.log('__conf not defined.');
			return ;
		}
		
		this.log('Setting up', this.module_name, "'config:", this.__conf, '...');
		// try
		{
			this.setup();
			this.is_active = true;
			console.log('done');
		}
		// catch (e)
		// {
		// 	console.log('Could not setup', this.module_name, ':', e.message);
		// 	this.is_active = false;
		// }
	}

    log(...message)
	{
		if (Env.DEBUG_MODE) console.log('[ ' + chalk.green(this.module_name) + ' ]:', ...message);
	}

	setActive(active = true) {this.is_active = active;}

	isActive() {return this.is_active;}
}

module.exports = BaseModule;