function signoutofaccount() {
	fs.unlink(userDataPath + "/details.json", (err) => {
		if (err) {
			console.error(err)
			return
		}
	})
	ipcRenderer.send("showLogin")
}

const fs = require("fs")
var ac_name = document.getElementById("ac-name");
var ac_pfp = document.getElementById("ac-pfp");
var ac_signout = document.getElementById("ac-signout");
var ac_useac = document.getElementById("ac-useac");
var details = JSON.parse(fs.readFileSync(userDataPath + "/details.json"));
var ac_loggedinas = document.getElementById("ac-loggedinas");


ac_name.innerHTML = details.username;
console.log(details.username)
document.getElementById("ac-pfp").src = "https://crafatar.com/avatars/" + details.uuid;
ac_loggedinas.innerHTML = "Logged in as <b>" + details.username + "<b>"

// active account color #00ff0052

// E Time to make accounts work