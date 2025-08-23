
const path = require('path');
const {app, BrowserWindow, globalShortcut, WebContentsView, BaseWindow, screen, contentTracing } = require('electron');
const url = require('url');
const fs = require('fs');
const Env = require('./env');

const LOAD_DIR = path.join(__dirname, 'modules');
const PAGE_URL = url.format({
		pathname: path.join(__dirname, "index.html"),
		// pathname: path.join("reception.parchotels.it"),
		// protocol: 'http'
		protocol: 'file'
	});

var enabled_modules = [];

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
			preload: path.join(__dirname, 'preload.js'), // Secure bridge
			contextIsolation: true,
			nodeIntegration: false,
		    experimentalFeatures: true,
			sandbox: false,         // 🔑 disable sandbox so preload gets Node
		}});


	mainWindow.contentView.addChildView(mainTab);

	mainTab.setBounds({x: 0, y: 0  , height: mainWindow.getContentBounds().height, width: mainWindow.getContentBounds().width});

	mainTab.webContents.loadURL(PAGE_URL);


	// Loads all active modules preload
	fs.readdirSync(LOAD_DIR).forEach(function (dir)
	{
		const fullpath = path.join(LOAD_DIR, dir);
		const stat = fs.statSync(fullpath);
		if (stat.isDirectory())
		{
			const main_path = path.join(fullpath, 'main');
			const main_stat = fs.statSync(main_path);
			if (main_stat.isDirectory())
			{
				const setup_file = path.join(main_path, 'setup.js');
				if (fs.existsSync(setup_file))
				{
					if (Env.DEBUG_MODE)
						console.log("loading", dir);
					try
					{
						const ModuleClass = require(setup_file);
						const t = new ModuleClass()
						enabled_modules.push(t);
						t.__start(mainWindow, mainTab);
					}
					catch (e)
					{
						console.log("Module not loaded:", e.message);
					}
				}
			}
		}
	});


	// globalShortcut.register('f12', () => {
	mainTab.webContents.toggleDevTools(); // }

	if (Env.DEBUG_MODE)
	{
		console.log('CHECKING ACTIVE MODULES:');
		checkActiveModules();
	}

	// mainWindow.maximize();
}

// Only main-side!!! Check app console for preload fails
function checkActiveModules()
{
	enabled_modules.forEach(function (e) {
		e.log(e.isActive());
	});
}

app.whenReady().then(createMainWindow);
