
const path = require('path');
const {app, BrowserWindow, globalShortcut } = require('electron');
const Terminal = require("./Terminal");
const url = require('url');

const PAGE_URL = url.format({
        pathname: path.join("/localhost", "file_access_tests", "thepage.php"),
        protocol: 'http'
    });

var term = new Terminal();

async function createMainWindow()
{
    const mainWindow = new BrowserWindow({
        title: "Electron",
        width: 1920,
        height: 1080
    });

    const REQ_URI = PAGE_URL + "?" + (await term.create_qs());

    console.log("###Uri here: " + REQ_URI);

    mainWindow.loadURL(REQ_URI);
    
    globalShortcut.register('f12', () => {
        mainWindow.webContents.openDevTools();
    });
}

app.whenReady().then(createMainWindow);