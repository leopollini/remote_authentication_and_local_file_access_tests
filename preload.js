const fs = require('fs');
const path = require('path');
const Env = require('./env');

const LOAD_DIR = path.join(__dirname, 'modules');

// Loads all active modules preload
fs.readdirSync(LOAD_DIR).forEach(function (dir) {
	const fullpath = path.join(LOAD_DIR, dir);
	const stat = fs.statSync(fullpath);
	if (stat.isDirectory())
	{
		const preload_path = path.join(fullpath, 'preload');
		const preload_stat = fs.statSync(preload_path);
		if (preload_stat.isDirectory())
		{
			const setup_file = path.join(preload_path, 'setup.js');
			if (fs.existsSync(setup_file))
			{
				try
				{
					require(setup_file);
				}
				catch (e)
				{
					console.log('Module', dir, 'not loaded:', e.message);
				}
				if (Env.DEBUG_MODE)
					console.log('preloaded', dir);
			}
		}
	}
});
