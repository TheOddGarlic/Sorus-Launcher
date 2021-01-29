const { /*contextBridge,*/ ipcRenderer: ipc } = require('electron')

// contextBridge.exposeInMainWorld('SorusNative', {
//   // snip
// });

window.SorusNative = {
  log: (...args) => ipc.sendSync('log', ...args),
  checkUpdate: (...args) => ipc.sendSync('check-update', ...args),
}