const fs = require("fs")

function launchMinecraft() {
    const { Client, Authenticator } = require('minecraft-launcher-core');
    const launcher = new Client();

    let options = JSON.parse(fs.readFileSync('./settings.json'));

    var max_ram_usage = options.client_settings.max_ram;
    var min_ram_usage = options.client_settings.min_ram;

    // var email = details.email;
    // var password = details.password;
    console.log(getSelectedVersion());
    console.log(options.client_settings.mc_ver)

    let opts = {
        clientPackage: null,
        authorization: Authenticator.getAuth("", ""),
        root: "./mc/",
        version: {
            number: options.client_settings.mc_ver,
            type: "release",
        },
        memory: {
            max: max_ram_usage,
            min: min_ram_usage
        },
        window: {
            fullscreen: options.client_settings.fullscreen,
            width: 900,
            height: 500
        },
        customArgs: "-javaagent:Sorus/client/1.8.9.jar=version=1.8.9"
    }

    launcher.launch(opts);

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
    launcher.on('close', (e) => console.log(e));

}

function launcher_visibility_controller() {
    let data = JSON.parse(fs.readFileSync('./settings.json'));
    const {ipcRenderer} = require('electron');

    if(data.launcher_settings.launcher_visibility_on_launch == "Close") {
        ipcRenderer.send("close-app");
    } else if(data.launcher_settings.launcher_visibility_on_launch == "Hide") {
        ipcRenderer.send("hide-app");
    } else {
        // Nothing lol
    }
}