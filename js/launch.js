
var playbtn_text = document.getElementById("playbtn-text");
var playbtn_status = document.getElementById("playbtn-status");

function changePlayButtonStatus(string) {
    playbtn_status.innerText = string;
}

var fs = require("fs");

function launchMinecraft() {
    const { Client, Authenticator } = require('minecraft-launcher-core');
    const launcher = new Client();

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

    console.log(options);
    console.log(details)

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
        // customArgs: "-javaagent:Sorus/client/1.8.9.jar=version=1.8.9"
    }

    launcher.launch(opts);

    // changePlayButtonStatus("Starting Sorus " + options.mc_ver)

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));

    launcher_visibility_controller();

    const {ipcRenderer, app} = require('electron');
    launcher.on('close', (e) => {
        if(options.launcher_settings.launcher_visibility_on_launch == "Close") {
            ipcRenderer.send('close-app');
        } else {
            ipcRenderer.send("show-app");
        }
    });

}

function launcher_visibility_controller() {
    let data = JSON.parse(fs.readFileSync(app.getPath("userData") + 'settings.json'));
    const {ipcRenderer} = require('electron');

    if(data.launcher_settings.launcher_visibility_on_launch == "Close") {
        ipcRenderer.send("hide-app");
        
    } else if(data.launcher_settings.launcher_visibility_on_launch == "Hide") {
        ipcRenderer.send("hide-app");
    } else {
        // Nothing lol
    }
}