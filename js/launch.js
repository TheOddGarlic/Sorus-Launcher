const http = require('https');

var playbtn_text = document.getElementById("playbtn-text");
var playbtn_status = document.getElementById("playbtn-status");
var playbtn_container = document.getElementById('play-btn-container');
var playbtn = document.getElementById('playbtn');
var playbtn_ver = document.getElementById('playbtn_ver')

function changePlayButtonStatus(string) {
    playbtn_status.innerText = string;
}

var options = JSON.parse(fs.readFileSync(userDataPath + "/settings.json"));

function downloadSorus(url, name) {
  var dest = userDataPath + "/mc/Sorus/client/" + name + '.jar';
  var file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    var responseSent = false;
    changePlayButtonStatus("Downloading " + name)
    http.get(url, response => {
      response.pipe(file);
      file.on('finish', () =>{
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

async function archiveDir(name) {
  var archiver = require('archiver');
  
  changePlayButtonStatus("Combining JARS")

	var output = fs.createWriteStream(userDataPath + "/mc/Sorus/client/" + name + "_compiled.jar");
	var archive = archiver('zip');

	output.on('close', function () {
		console.log(archive.pointer() + ' total bytes');
		console.log('archiver has been finalized and the output file descriptor has closed.');
	});

	archive.on('error', function(err){
		throw err;
	});

	await archive.pipe(output);

	await archive.directory(userDataPath + '/mc/Sorus/client/temp', false);

  changePlayButtonStatus("Finished combining JARS")
	await archive.finalize();
	fs.rmdirSync(userDataPath + "/mc/Sorus/client/temp", { recursive: true });
}

async function archiveAll() {
  await archiveDir(options.mc_ver);
}

async function extractAll() {
  await extractJarFiles('Core');
  await extractJarFiles(options.mc_ver);
  await extractJarFiles('JavaAgent');
}

function checkAndDownloadSorus() {
  return new Promise((resolve, reject) => {
    let counter = 0;
    if (!fs.existsSync(userDataPath + '/mc/Sorus/client/Core.jar') || 
        !fs.existsSync(userDataPath + '/mc/Sorus/client/' + options.mc_ver + '.jar') || 
        !fs.existsSync(userDataPath + '/mc/Sorus/client/JavaAgent.jar') ||
        SorusNative.shouldUpdate) {
      try {
        playbtn_status.innerHTML = "Downloading Core.jar"
        downloadSorus("https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/Core.jar", "Core").then((dest) => {
          console.log('Successfully downloaded ' + dest);
          counter++;
          counter > 2 && resolve(true);
        })

        playbtn_status.innerHTML = "Downloading Sorus " + options.mc_ver
        downloadSorus("https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/versions/" + options.mc_ver + ".jar", options.mc_ver).then((dest) => {
          console.log('Successfully downloaded ' + dest);
          counter++;
          counter > 2 && resolve(true);
        })

        playbtn_status.innerHTML = "Downloading JavaAgent.jar"
        downloadSorus("https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/environments/JavaAgent.jar", "JavaAgent").then((dest) => {
          console.log('Successfully downloaded ' + dest);
          counter++;
          counter > 2 && resolve(true);
        })
      } catch (e) {
        reject(e);
      }
    }
    else resolve(false);
  })
}

async function launchMinecraft() {
    const { Client, Authenticator } = require('minecraft-launcher-core');
    const launcher = new Client();
    
    playbtn_container.classList.add('play-btn-container-launch');
    playbtn.style.backgroundColor = "#a13b3b";
    playbtn_ver.style.backgroundColor = "#a13b3b";
    playbtn_ver.classList.add('playbtn-ver-sel-launch');
    playbtn_text.innerHTML = "LAUNCHING"

    var max_ram_usage = options.client_settings.max_ram;
    var min_ram_usage = options.client_settings.min_ram;

    var details = JSON.parse(fs.readFileSync(userDataPath + "/details.json"));
    let user = {
       access_token: details.accessToken,
       client_token: details.clientToken,
       uuid: details.uuid,
       name: details.username,
       selected_profile: details.selectedProfile,
       user_properties: details.user_properties 
    }

    if(!fs.existsSync(userDataPath + "/mc/Sorus/client/")) {
        fs.mkdirSync(userDataPath + "/mc/Sorus/client/", {recursive: true}, err => console.error(err));
    }

    let opts = {
        clientPackage: null,
        authorization: user,
        root: userDataPath + "/mc/",
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
        customArgs: `-javaagent:${userDataPath}/mc/Sorus/client/${options.mc_ver}_compiled.jar`
    }

    playbtn_status.innerHTML = "Checking for Sorus Installation"
    await checkAndDownloadSorus().then(updated => updated && extractAll().then(archiveAll)).catch(console.error);
    launcher.launch(opts)
    

    launcher.on('download-status', (e) => {
        playbtn_status.innerHTML = "Starting to download assets"
    })
    launcher.on('progress', (e) => {
        playbtn_status.innerHTML = "Downloading assets"
    })

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => {
      changePlayButtonStatus("Playing " + options.mc_ver)
      console.log(e)
    });

    playbtn_text.innerHTML = "PLAYING"
    playbtn_status.innerHTML = getSelectedVersion();

    launcher_visibility_controller();

    launcher.on('close', (e) => {
        playbtn_container.classList.remove('play-btn-container-launch');
        playbtn.style.backgroundColor = "#3BA152";
        playbtn_ver.style.backgroundColor = "#3BA152";
        playbtn_ver.classList.remove('playbtn-ver-sel-launch');
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
    let data = JSON.parse(fs.readFileSync(userDataPath + '/settings.json'));

    if(data.launcher_settings.launcher_visibility_on_launch == "Close") {
        ipcRenderer.send("hide-app");
        
    } else if(data.launcher_settings.launcher_visibility_on_launch == "Hide") {
        ipcRenderer.send("hide-app");
    }
}
