const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow } = require('electron');
const https = require('https');
const path = require('path');
const fs = require('fs');

function createMainWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false,
      //contextIsolation: true,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  })

  function getRemoteFileSizeInBytes(url) {
    var fileSizeInBytes = 0;
    https.request(url, { method: 'HEAD' }, res => {
      fileSizeInBytes = res.headers['content-length'];
    });
    return fileSizeInBytes;
  }
  
  function getFileSizeInBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
  }

  win.loadFile('loading.html')
  win.resizable = false
  win.setFullScreenable = false

  const {ipcMain} = require('electron');
  const userData = app.getPath('userData');

  ipcMain.on('log', (_, args) => {
    console.log(args)
  })

  ipcMain.on('check-update', (event, url, jar) => {
    // FIXME: Always update??? GitHub Content-Length wrong??? Fix this later.
    var remoteBytes = getRemoteFileSizeInBytes(url);
    var localBytes = getFileSizeInBytes(userData + '/mc/Sorus/client/' + jar + '.jar');

    console.log(`${jar} update checked from ${url}`);
    event.returnValue = remoteBytes == localBytes ? false : true;
  })

  ipcMain.on('get-userdata-path', event => {
    event.returnValue = userData;
  })

  ipcMain.on('resize-me-please', () => {
    console.log("resized and centered")
    win.setSize(1200,800)
    win.center();
  })

  ipcMain.on('close-app', () => {
    console.log("exit")
    app.exit();
  })

  ipcMain.on('minimize-app', () => {
    win.minimize();
    console.log("minimized")
  })

  ipcMain.on('hide-app', () => {
    win.hide();
    console.log("hidden")
  })

  ipcMain.on('show-app', () => {
    win.show();
    console.log("shown")
  })

  ipcMain.on('auth-success', () => {
    console.log("auth-success")
    win.loadFile('index.html')
    win.resizable = false
    win.setFullScreenable = false
  })

  ipcMain.on('showLogin', () => {
    win.loadFile('loading.html')
    win.setSize(500, 500);
    win.center();
    win.resizable = false
    win.setFullScreenable = false
  })

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('checking-for-update', () => {
      console.log('Checking for updates')
  })
  
  autoUpdater.on('update-available', () => {
      console.log("Update is available")
      console.log("updateLauncher")
      win.loadFile("updater.html")
      win.resizable = false
      win.setFullScreenable = false
      win.center();
  })

  autoUpdater.on('update-not-available', () => {
      console.log("No updates found")
  })
}

app.whenReady().then(createMainWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// const client = require('discord-rich-presence')('777578659216097312'); // idc

// var fs = require("fs")
// var detail = JSON.parse(fs.readFileSync(app.getPath("userData") + "/details.json"))


// client.updatePresence({
//   details: "Using Sorus Launcher",
//   state: "IGN: " + detail.username,
//   largeImageKey: 'sorus_dark',
//   largeImageText: "Sorus Client Launcher",
//   smallImageKey: 'sorus_dark',
//   smallImageText: "Version 0.3",
//   instance: true,
// });