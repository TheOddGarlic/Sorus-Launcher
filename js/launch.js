const http = require('https');

var playbtn_text = document.getElementById("playbtn-text");
var playbtn_status = document.getElementById("playbtn-status");
var playbtn = document.getElementById('playbtn');
var playbtn_ver = document.getElementById('playbtn_ver')

function changePlayButtonStatus(string) {
    playbtn_status.innerText = string;
}

var options = JSON.parse(fs.readFileSync(app.getPath("userData") + "/settings.json"));

function downloadSorus(url, name) {
    // var https = require('https');
    // try {
    //     var dest = app.getPath("userData") + "/mc/Sorus/client/"
    //     let url = jarFileName;
    //     console.log(url)
    //     var file = fs.createWriteStream(dest + name + ".jar");
    //     https.get(url, function(response) {
    //       response.pipe(file);
    //       file.on('finish', function() {
    //         file.close(console.log(name + ".jar finished downloading"));
    //         // playbtn_status.innerHTML = "Extracting " + name + ".jar " + process
    //         // extractJarFiles(name);
    //         // console.log("Extracted " + name)
    //       });
    //     }).on('error', function(err) {
    //          fs.unlink(dest);
    //     });
    // } catch (error) {
    //     console.error(error)
    // }
  
  var dest = app.getPath("userData") + "/mc/Sorus/client/" + name + '.jar';
  var file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    var responseSent = false;
    http.get(url, response => {
      response.pipe(file);
      file.on('finish', () =>{ // gaiwjgiaigj ajiwjig
        file.close(() => {
          if(responseSent)  return;
          responseSent = true;
          resolve(dest);
        });
      });
    }).on('error', err => {
        if(responseSent)  return;
        responseSent = true;
        reject(err);
    });
  });
}

async function extractAll() {
  await extractJarFiles('Core');
  await extractJarFiles(options.mc_ver);
  await extractJarFiles('JavaAgent');
}

function checkAndDownloadSorus() {
  // if(!fs.existsSync(app.getPath("userData") + "/mc/Sorus/client/Core.jar")) {
  //     try {
  //         playbtn_status.innerHTML = "Downloading Core.jar 1/3"
  //         downloadSorus("https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/Core.jar", "Core", "1/3");
  //         console.log("Downloaded Core.jar");
  //     } catch (error) {
  //         console.error(error);
  //     }
  // }
  // if(!fs.existsSync(app.getPath("userData") + "/mc/Sorus/client/" + options.mc_ver + ".jar")) {
  //     try {
  //         playbtn_status.innerHTML = "Downloading Sorus " + options.mc_ver + " 2/3"
  //         downloadSorus("https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/versions/" + options.mc_ver + ".jar", options.mc_ver, "2/3");
  //         console.log("Downloaded " + options.mc_ver + ".jar")
  //     } catch (error) {
  //         console.error(error);
  //     }
  // }
  // if(!fs.existsSync(app.getPath("userData") + "/mc/Sorus/client/JavaAgent.jar")) {
  //     try {
  //         playbtn_status.innerHTML = "Downloading JavaAgent.jar 3/3"
  //         downloadSorus("https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/environments/JavaAgent.jar", "JavaAgent", "3/3");
  //         console.log("Downloaded JavaAgent.jar");
  //     } catch (error) {
  //         console.error(error);
  //     }
  // }

  return new Promise((resolve, reject) => {
    let counter = 0;
    if (!fs.existsSync(app.getPath('userData') + '/mc/Sorus/updates.json') /* or it is not up to date */) {
      try {
        playbtn_status.innerHTML = "Downloading Core.jar"
        downloadSorus("https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/Core.jar", "Core").then((dest) => {
          console.log('Succesfully downloaded ' + dest);
          counter++;
          counter > 2 && resolve();
        }).catch(console.error);

        playbtn_status.innerHTML = "Downloading Sorus " + options.mc_ver
        downloadSorus("https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/versions/" + options.mc_ver + ".jar", options.mc_ver).then((dest) => {
          console.log('Succesfully downloaded ' + dest);
          counter++;
          counter > 2 && resolve();
        }).catch(console.error);

        playbtn_status.innerHTML = "Downloading JavaAgent.jar"
        downloadSorus("https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/environments/JavaAgent.jar", "JavaAgent").then((dest) => {
          console.log('Succesfully downloaded ' + dest);
          counter++;
          counter > 2 && resolve();
        }).catch(console.error);
      } catch (e) {
        reject(e);
      }
    }
  })
}

function launchMinecraft() {
    const { Client, Authenticator } = require('minecraft-launcher-core');
    const launcher = new Client();

    playbtn.style.backgroundColor = "#a13b3b";
    playbtn_ver.style.backgroundColor = "#a13b3b";
    playbtn_text.innerHTML = "STARTING"

    var max_ram_usage = options.client_settings.max_ram;
    var min_ram_usage = options.client_settings.min_ram;

    var details = JSON.parse(fs.readFileSync(app.getPath("userData") + "/details.json"));
    let user = {
       access_token: details.accessToken,
       client_token: details.clientToken,
       uuid: details.uuid,
       name: details.username,
       selected_profile: details.selectedProfile,
       user_properties: details.user_properties 
    }

    if(!fs.existsSync(app.getPath("userData") + "/mc/Sorus/client/")) {
        fs.mkdirSync(app.getPath("userData") + "/mc/Sorus/client/", {recursive: true}, err => console.error(err));
    }
    playbtn_status.innerHTML = "Checking for Sorus Installation"
    checkAndDownloadSorus().then(extractAll).catch(console.error);

    let opts = {
        clientPackage: null,
        authorization: user,
        root: app.getPath("userData") + "/mc/",
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
        customArgs: `-javaagent:`+ app.getPath("userData") +`/mc/Sorus/client/` + options.mc_ver + `_compiled.jar=version=` + options.mc_ver
    }
    
    if(fs.existsSync(app.getPath("userData") + "/mc/Sorus/client/" + options.mc_ver + "_compiled.jar")) {
        playbtn_text.innerHTML = "LAUNCHING"
        playbtn_status.innerHTML = "Launching"
        if(options.mc_ver == "1.7.10") {
            playbtn_text.innerHTML = "STOPPING"
            playbtn_status.innerHTML = "1.7.10 is currently broken"
        } else {
            setTimeout(launcher.launch(opts), 15000)
        }
    } else {
        playbtn_text.innerHTML = "STOPPING"
        playbtn_status.innerHTML = "Error Occured - Sorus jar not found"
        setTimeout(function() {
            playbtn.style.backgroundColor = "#3BA152";
            playbtn_ver.style.backgroundColor = "#3BA152";
            playbtn_text.innerHTML = "PLAY"
            playbtn_status.innerHTML = "Launch " + getSelectedVersion();
        }, 5000)
    }
    

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
    let data = JSON.parse(fs.readFileSync(app.getPath("userData") + '/settings.json'));

    if(data.launcher_settings.launcher_visibility_on_launch == "Close") {
        ipcRenderer.send("hide-app");
        
    } else if(data.launcher_settings.launcher_visibility_on_launch == "Hide") {
        ipcRenderer.send("hide-app");
    }
}
