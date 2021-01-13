const { app, BrowserWindow } = require('electron')
const path = require('path');

function createMainWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  win.webContents.openDevTools()
  win.loadFile('loading.html')
  win.resizable = false
  win.setFullScreenable = false

  const {ipcMain} = require('electron');

  ipcMain.on('resize-me-please', (event, arg) => {
    win.setSize(1200,800)
    win.center();
  })

  ipcMain.on('close-app', (event, arg) => {
    app.exit();
  })

  ipcMain.on('minimize-app', (event, arg) => {
    win.minimize();
  })

  ipcMain.on('hide-app', (event, arg) => {
    win.hide();
  })

  ipcMain.on('show-app', (event, arg) => {
    win.show();
  })

  ipcMain.on('auth-success', (event, args) => {
    win.webContents.openDevTools()
    win.loadFile('index.html')
    win.resizable = false
    win.setFullScreenable = false
    
  })

}




app.whenReady().then(createMainWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


