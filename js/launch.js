var playbtn_text = document.getElementById("playbtn-text");
var playbtn_status = document.getElementById("playbtn-status");
var playbtn = document.getElementById('playbtn');
var playbtn_ver = document.getElementById('playbtn_ver')

function changePlayButtonStatus(string) {
    playbtn_status.innerText = string;
}

const { remote } = require("electron");
const app = remote.app;

var fs = require("fs");

function downloadSorus(jarFileName) {
    var https = require('https');
    try {
        if(!fs.existsSync(app.getPath("userData") + "/mc/Sorus/client/")) {
            fs.mkdirSync(app.getPath("userData") + "/mc/Sorus/client/");
        }
        var dest = app.getPath("userData") + "/mc/Sorus/client/"

        let url;

        if(jarFileName.toLowerCase() == "javaagent") { 
            url = 'https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/environments/JavaAgent.jar'
            console.log(url)
            var file = fs.createWriteStream(dest);
            var request = https.get(url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    file.close(cb);
                });
            }).on('error', function(err) {
                fs.unlink(dest);
                if (cb) cb(err.message);
            });
        } else if(jarFileName.toLowerCase() == "core") {
            url = 'https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/Core.jar'
            console.log(url)
            var file = fs.createWriteStream(dest);
            var request = https.get(url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    file.close(cb);
                });
            }).on('error', function(err) {
                fs.unlink(dest);
                if (cb) cb(err.message);
            });
        } else {
            url = jarFileName;
            console.log(url)
            var file = fs.createWriteStream(dest);
            var request = https.get(url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    file.close(cb);
                });
            }).on('error', function(err) {
                fs.unlink(dest);
                if (cb) cb(err.message);
            });
        }
    } catch (error) {
        console.error(error)
    }
    
}

async function launchMinecraft() {
    const { Client, Authenticator } = require('minecraft-launcher-core');
    const launcher = new Client();

    playbtn.style.backgroundColor = "#a13b3b";
    playbtn_ver.style.backgroundColor = "#a13b3b";
    playbtn_text.innerHTML = "STARTING"

    var options = JSON.parse(fs.readFileSync(app.getPath("userData") + "settings.json"));

    var max_ram_usage = options.client_settings.max_ram;
    var min_ram_usage = options.client_settings.min_ram;

    var details = JSON.parse(fs.readFileSync(app.getPath("userData") + "details.json"));
    let user = {
       access_token: details.accessToken,
       client_token: details.clientToken,
       uuid: details.uuid,
       name: details.username,
       selected_profile: details.selectedProfile,
       user_properties: details.user_properties 
    }

    let opts = {
        clientPackage: null,
        authorization: user,
        root: "mc/",
        version: {
            number: options.mc_ver,
            type: "release",
        },
        memory: {
            max: options.client_settings.max_ram,
            min: options.client_settings.min_ram
        },
        window: {
            fullscreen: options.client_settings.fullscreen,
            width: 900,
            height: 500
        },
        // customArgs: "-javaagent:Sorus/client/" + options.mc_ver + ".jar=version=" + options.mc_ver
    }

    if(!fs.existsSync(app.getPath("userData") + "/mc/Sorus/client/Core.jar")) {
        try {
            await downloadSorus("core");
            console.log("Downloaded Core.jar")
        } catch (error) {
            console.error(error)
        }
    }
    if(!fs.existsSync(app.getPath("userData") + "/mc/Sorus/client/JavaAgent.jar")) {
        try {
            await downloadSorus("javaagent");
            console.log("Downloaded JavaAgent.jar")
        } catch (error) {
            console.error(error)
        }
    }
    if(!fs.existsSync(app.getPath("userData") + "/mc/Sorus/client/" + options.mc_ver + ".jar")) {
        try {
            await downloadSorus("https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/versions/" + options.mc_ver + ".jar");
            console.log("Downloaded " + options.mc_ver + ".jar")
        } catch (error) {
            console.error(error)
        }
    }

    // await extractJarFiles();

    playbtn_text.innerHTML = "LAUNCHING"
    playbtn_status.innerHTML = "Launching"
    launcher.launch(opts);

    launcher.on('download-status', (e) => {
        playbtn_status.innerHTML = "Starting to download assets"
    })
    launcher.on('progress', (e) => {
        playbtn_status.innerHTML = "Downloading assets"
    })

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));

    playbtn_text.innerHTML = "PLAYING"
    playbtn_status.innerHTML = getSelectedVersion();

    launcher_visibility_controller();

    launcher.on('close', (e) => {
        playbtn.style.backgroundColor = "#3BA152";
        playbtn_ver.style.backgroundColor = "#3BA152";
        playbtn_text.innerHTML = "PLAY"
        playbtn_status.innerHTML = "Launch " + getSelectedVersion();
        if(options.launcher_settings.launcher_visibility_on_launch == "Close") {
            ipcRenderer.send('close-app');
        } else {
            ipcRenderer.send("show-app");
        }
    });

}

function launcher_visibility_controller() {
    let data = JSON.parse(fs.readFileSync(app.getPath("userData") + 'settings.json'));

    if(data.launcher_settings.launcher_visibility_on_launch == "Close") {
        ipcRenderer.send("hide-app");
        
    } else if(data.launcher_settings.launcher_visibility_on_launch == "Hide") {
        ipcRenderer.send("hide-app");
    }
}