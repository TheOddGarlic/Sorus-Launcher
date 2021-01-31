const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow } = require('electron');
const https = require('https');
const { join } = require('path');
const fs = require('fs');

class HTTPError extends Error {
  constructor (message, res) {
    super(message);
    Object.assign(this, res);
    this.name = this.constructor.name;
  }
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Sorus-Launcher (https://github.com/SorusClient/Sorus-Launcher)'
      }
    }, (res) => {
      const data = [];

      res.on('data', (chunk) => {
        data.push(chunk);
      });

      res.once('error', reject);

      res.once('end', () => {
        const raw = Buffer.concat(data);

        const result = {
          raw,
          body: (() => {
            if ((/application\/json/).test(res.headers['content-type'])) {
              try {
                return JSON.parse(raw);
              } catch (_) {
                // fall through to raw
              }
            }

            return raw;
          })(),
          ok: res.statusCode >= 200 && res.statusCode < 400,
          statusCode: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers
        };

        if (result.ok) {
          resolve(result);
        } else {
          reject(new HTTPError(`${res.statusCode} ${res.statusMessage}`, result));
        }
      });
    });

    req.once('error', reject);

    req.end();
  });
}

function createMainWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false,
      //contextIsolation: true,
      preload: join(app.getAppPath(), 'preload.js')
    }
  })

  async function getRemoteFileSizeInBytes(url) {
    return (await get(url)).body.size;
  }
  
  function getFileSizeInBytes(filename) {
    let stats;
    try {
      stats = fs.statSync(filename);
    } catch {
      // ignore and set 0 as size, probably file doesn't exist
      stats = {
        size: 0
      }
    }
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
  }

  win.loadFile('loading.html')
  win.resizable = false
  win.setFullScreenable = false

  const {ipcMain} = require('electron');
  const userData = app.getPath('userData');

  ipcMain.handle('log', async (_, ...args) => {
    console.log(...args)
    return args;
  })

  ipcMain.handle('check-update', async (_, url, jar) => {
    var remoteBytes = await getRemoteFileSizeInBytes(url);
    console.log(remoteBytes)
    var localBytes = getFileSizeInBytes(join(userData, 'mc', 'Sorus', 'client', jar + '.jar'));
    console.log(localBytes)

    console.log(`${jar} update checked from ${url}`);
    return remoteBytes == localBytes ? false : true;
  })

  ipcMain.on('get-options', event => {
    event.returnValue = JSON.parse(fs.readFileSync(join(userData, "settings.json")));
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