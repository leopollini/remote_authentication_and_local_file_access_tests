
const {app, BrowserWindow, globalShortcut} = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { start } = require('repl');

const localKeysPath = "./local_keys.json"

function createMainWindow()
{
    const mainWindow = new BrowserWindow({
        title: "Electron",
        width: 1920,
        height: 1080
    });

    startUrl = url.format({
        pathname: path.join("/localhost", "terminal_access.php"),
        protocol: 'http'
    });

    
    
    console.log(startUrl);
    
    file_content = JSON.parse(fs.readFileSync(localKeysPath, 'utf-8'))
    
    uri = startUrl + "?" + (new URLSearchParams(file_content)).toString()

    console.log(file_content);
    console.log((new URLSearchParams(file_content)).toString());
    console.log("Looking for " + uri);

    mainWindow.loadURL(uri);

    
    globalShortcut.register('f12', () => {
        mainWindow.webContents.openDevTools();
    });
}



app.whenReady().then(createMainWindow);