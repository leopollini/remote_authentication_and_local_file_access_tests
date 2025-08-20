const fs = require('fs');
const path = require('path');

const LOAD_DIR = __dirname;

// Loads all standalone modules
fs.readdirSync(__dirname).forEach(file => {
  if (file !== 'preload.js' && file !== 'utils.js' && file[0] !== '.' && file.endsWith('.js')) {
	console.log("loading ", file);
    require(path.join(__dirname, file));
  }
});

// Loads all nested modules
fs.readdirSync(LOAD_DIR).forEach(function (dir) {
	const fullpath = path.join(LOAD_DIR, dir);
	const stat = fs.statSync(fullpath);
	if (stat.isDirectory())
	{
		fs.readdirSync(fullpath).forEach(function (file) {
			console.log("loading ", file);
			if (file[0] !== '.' && file.endsWith('.js')) {
				require(path.join(fullpath, file));
			}
		});
	}
});
