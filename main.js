
const path = require('path');
const {app, BrowserWindow, globalShortcut, WebContentsView, BaseWindow, screen } = require('electron');
const url = require('url');
const fs = require('fs')

const LOAD_DIR = path.join(__dirname, 'main_modules_enabled');
const PAGE_URL = url.format({
		pathname: path.join(__dirname, "index.html"),
		// pathname: path.join("reception.parchotels.it"),
		// protocol: 'http'
		protocol: 'file'
	});

async function createMainWindow()
{
	// new FileAccessSetup();
	const { height, width } = screen.getPrimaryDisplay().workAreaSize;
	const mainWindow = new BaseWindow({
		tabbingIdentifier: "myTabs",
		title: "Electron",
		width: width / 2,
		height: height / 2
	});
	const mainTab = new WebContentsView({
		webPreferences: {
			preload: path.join(__dirname, 'preloads_enabled', 'preload.js'), // Secure bridge
			contextIsolation: true,
			nodeIntegration: false,
		    experimentalFeatures: true,
			sandbox: false,         // 🔑 disable sandbox so preload gets Node
		}});


	mainWindow.contentView.addChildView(mainTab);

	mainTab.setBounds({x: 0, y: 0  , height: mainWindow.getContentBounds().height, width: mainWindow.getContentBounds().width});

	mainTab.webContents.loadURL(PAGE_URL);


	// Loads standalone scripts inside LOAD_DIR
	fs.readdirSync(LOAD_DIR).forEach(file => {
	if (file[0] !== '.' && file.endsWith('.js')) {
		console.log("loading ", file);
		const ModuleClass = require(path.join(LOAD_DIR, file));
		new ModuleClass(mainWindow, mainTab);
	}
	});

	// Loads nested scipts inside LOAD_DIR
	fs.readdirSync(LOAD_DIR).forEach(function (dir) {
		if (dir[0] === '.') return ;
		const fullpath = path.join(LOAD_DIR, dir);
		const stat = fs.statSync(fullpath);
		if (stat.isDirectory())
		{
			console.log("loagind ", fullpath);
			fs.readdirSync(fullpath).forEach(function (file)
			{
				if (file[0] !== '.' && file.endsWith('.js'))
				{
					console.log("loading ", file);
					const ModuleClass = require(path.join(fullpath, file));
					new ModuleClass(mainWindow, mainTab);
				}
			});
		}
	});


	// globalShortcut.register('f12', () => {
	mainTab.webContents.toggleDevTools(); // }

	// mainWindow.maximize();
}

app.whenReady().then(createMainWindow);
