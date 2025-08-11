
const path = require('path');
const {app, BrowserWindow, globalShortcut, WebContentsView, BaseWindow } = require('electron');
const url = require('url');
const FileAccessSetup = require('./electronAPIs.js');

const PAGE_URL = url.format({
		pathname: path.join(__dirname, "index.html"),
		// pathname: path.join("reception.parchotels.it"),
		// protocol: 'http'
		protocol: 'file'
	});

async function createMainWindow()
{
	// new FileAccessSetup();
	const mainWindow = new BaseWindow({
		tabbingIdentifier: "myTabs",
		title: "Electron",
		width: 1920,
		height: 1080
	});
	const mainTab = new WebContentsView({
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'), // Secure bridge
			contextIsolation: true,
			nodeIntegration: false
		}});
	mainWindow.contentView.addChildView(mainTab);

    mainWindow.on('resize', () => {
        mainTab.setBounds({x: 0, y: 0  , height: mainWindow.getContentBounds().height, width: mainWindow.getContentBounds().width});
    });
    mainTab.setBounds({x: 0, y: 0  , height: mainWindow.getContentBounds().height, width: mainWindow.getContentBounds().width});

	mainTab.webContents.loadURL(PAGE_URL);

	
	// globalShortcut.register('f12', () => {
	mainTab.webContents.toggleDevTools();

	// });
}

function createTab(url) {
  const view = new WebContentsView();
  view.webContents.loadURL(url);
  return view;
}

app.whenReady().then(createMainWindow);

