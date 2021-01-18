function signoutofaccount() {
	const { remote } = require('electron');
	const app = remote.app;
	fs.unlink(app.getPath("userData") + "details.json", (err) => {
		if (err) {
			console.error(err)
			return
		}
	})
	ipcRenderer.send("showLogin")
}