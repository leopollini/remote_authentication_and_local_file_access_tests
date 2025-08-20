
const path = require('path');
const {app, BrowserWindow, globalShortcut, WebContentsView, BaseWindow, screen } = require('electron');
const url = require('url');
const setupCustomMouseEvents = require('./utils_modules/setupCustomMouseEvents');

require('./utils_modules/electronAPIs');

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
	mainWindow.maximize();
	const mainTab = new WebContentsView({
		webPreferences: {
			preload: path.join(__dirname, 'preloads_enabled', 'preload.js'), // Secure bridge
			contextIsolation: true,
			nodeIntegration: false,
		    experimentalFeatures: true,
			sandbox: false,         // 🔑 disable sandbox so preload gets Node
		}});


	mainWindow.contentView.addChildView(mainTab);
	mainWindow.on('resize', () => {
		mainTab.setBounds({x: 0, y: 0  , height: mainWindow.getContentBounds().height, width: mainWindow.getContentBounds().width});
	});
	mainTab.setBounds({x: 0, y: 0  , height: mainWindow.getContentBounds().height, width: mainWindow.getContentBounds().width});

	mainTab.webContents.loadURL(PAGE_URL);

	
	
	// globalShortcut.register('f12', () => {
	mainTab.webContents.toggleDevTools();
		
	new setupCustomMouseEvents(mainTab);
}

function createTab(url) {
  const view = new WebContentsView();
  view.webContents.loadURL(url);
  return view;
}

app.whenReady().then(createMainWindow);
