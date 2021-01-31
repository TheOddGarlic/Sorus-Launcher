const { /*contextBridge,*/ ipcRenderer: ipc } = require('electron')
const { existsSync } = require('fs')

// contextBridge.exposeInMainWorld('SorusNative', {
//   // snip
// });

window.SorusNative = {
  log: (...args) => {
    ipc.invoke('log', ...args)
      .then(args => console.log(...args))
  },

  shouldUpdate: false,
  userData: ipc.sendSync('get-userdata-path'),
  options: ipc.sendSync('get-options'),
}

// FIXME: GitHub doesn't return the file (or even metadata) for files larger than 1 MB. Also nice spaghetti.

if (!existsSync(SorusNative.userData + '/mc/Sorus/client/Core.jar') || 
    !existsSync(SorusNative.userData + '/mc/Sorus/client/' + SorusNative.options.mc_ver + '.jar') || 
    !existsSync(SorusNative.userData + '/mc/Sorus/client/JavaAgent.jar'))
  SorusNative.shouldUpdate = true;
else {
  ipc.invoke('check-update', "https://api.github.com/repos/SorusClient/Sorus-Resources/contents/client/versions/" + SorusNative.options.mc_ver + ".jar", SorusNative.options.mc_ver)
    .then(value => {
      if (value)
        return SorusNative.shouldUpdate = true;
      ipc.invoke('check-update', "https://api.github.com/repos/SorusClient/Sorus-Resources/contents/client/environments/JavaAgent.jar", "JavaAgent")
        .then(value => {
          if (value)
            return SorusNative.shouldUpdate = true;
        })
    })
}