const { app, BrowserWindow } = require('electron')
const path = require('path');

function createMainWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  win.loadFile('loading.html')
  win.resizable = false
  win.setFullScreenable = false

  const {ipcMain} = require('electron');

  ipcMain.on('test', (event, arg) => {
    console.log('test')
  })

  ipcMain.on('resize-me-please', (event, arg) => {
    console.log("resized and centered")
    win.setSize(1200,800)
    win.center();
    
  })

  ipcMain.on('close-app', (event, arg) => {
    console.log("exit")
    app.exit();
    
  })

  ipcMain.on('minimize-app', (event, arg) => {
    win.minimize();
    console.log("minimized")
  })

  ipcMain.on('hide-app', (event, arg) => {
    win.hide();
    console.log("hidden")
  })

  ipcMain.on('show-app', (event, arg) => {
    win.show();
    console.log("shown")
  })

  ipcMain.on('auth-success', (event, args) => {
    console.log("auth-success")
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


