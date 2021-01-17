var fullscreen_chkbox = document.getElementById("fullscreen_chkbox");
var minslider = document.getElementById("min_ram_slider");
var minoutput = document.getElementById("minramusageslider");
var maxslider = document.getElementById("max_ram_slider");
var maxoutput = document.getElementById("maxramusageslider");

var autoupdateclient = document.getElementById("autoupdateclient");
var autoupdatelauncher = document.getElementById("autoupdatelauncher");
var launcher_visibility = document.getElementById("launcher_visibility");
var playbtn_text = document.getElementById("playbtn-text");
var playbtn_status = document.getElementById("playbtn-status");
const {remote} = require('electron');
const {app} = remote;

function getRadioVal(form, name) {
	var val;
	var radios = form.elements[name];
	for (var i=0, len=radios.length; i < len; i++) {
		if (radios[i].checked) {
			val = radios[i].value;
			break;
		}
	}
	return val;
}

function getSelectedVersion() {
	var version_radios = document.getElementsByName("version");
	let selected_version = "1";

	var val = getRadioVal( document.getElementById('ver_form'), 'version' );

	selected_version = val;
	console.log(selected_version);
	return(selected_version);
}

function setSelectedVersion(ver) {
	const form = document.forms.ver_form;
	const radios = form.elements.version;

	radios.value = ver;
}

function saveOptions() {

	let settings = {
		mc_ver: getSelectedVersion(),
		client_settings: {
			min_ram: minslider.value,
			max_ram: maxslider.value,
			fullscreen: fullscreen_chkbox.checked,
		},
		launcher_settings: {
			// autoupdate_client: autoupdateclient.value,
			// autoupdate_launcher: autoupdatelauncher.value,
			launcher_visibility_on_launch: launcher_visibility.value
		}
	}

	let fs = require('fs');
	let jsonData = JSON.stringify(settings, null, 4);
	fs.writeFileSync(app.getPath("userData") + "settings.json", jsonData, function(err) {
		if(err) {
			console.log(err);
		}
	});
}

/**
 * 
 * SETTINGS 
 * This is the main settings area, this is where all the values are set and loaded etc
 * 
 */

const os = require("os");

total_mem_mb = (os.totalmem() / 1024) / 1024;

window.onload = function() {
	const fs = require('fs');

	try {
		if(fs.existsSync(app.getPath("userData") + 'settings.json')) {
			let data = JSON.parse(fs.readFileSync(app.getPath("userData") + 'settings.json'));

			/**
			 * 
			 * CLIENT SETTINGS
			 * 
			 */

			min = data.client_settings.min_ram;
			max = data.client_settings.max_ram;

			minoutput.innerHTML = "Min RAM Usage: " + min + " MB";
			minslider.max = total_mem_mb;
			if(min <= 512) {
				minslider.value = 0.1 + min;
			} else {
				minslider.value = min;
			}

			var mc_ver = data.mc_ver;
			setSelectedVersion(mc_ver);

			maxoutput.innerHTML = "Max RAM Usage: " + max + " MB";
			maxslider.max = total_mem_mb;
			maxslider.value = max;

			fullscreen = data.client_settings.fullscreen;
			fullscreen_chkbox.checked = fullscreen;

			playbtn_status.innerText = "Launch " + data.mc_ver;

			/**
			 * 
			 * LAUNCHER SETTINGS
			 * 
			 */

			 var launcher_visibility_on_launch = data.launcher_settings.launcher_visibility_on_launch;
			 launcher_visibility.value = launcher_visibility_on_launch;

		} else {
			console.log('The file does not exist.');
			minoutput.innerHTML = "Min RAM Usage: 1024 MB";
			minslider.max = total_mem_mb;
			minslider.value = 1024;

			maxoutput.innerHTML = "Max RAM Usage: 2048 MB";
			maxslider.max = total_mem_mb;
			maxslider.value = 2048;

			setSelectedVersion("1");

			launcher_visibility.value = "Hide";

			let settings = {
				mc_ver: "1.8.9",
				client_settings: {
					min_ram: 1024,
					max_ram: 2048,
					fullscreen: false,
				},
				launcher_settings: {
					// autoupdate_client: autoupdateclient.value,
					// autoupdate_launcher: autoupdatelauncher.value,
					launcher_visibility_on_launch: "Close"
				}
			}
		
			let fs = require('fs');
			let jsonData = JSON.stringify(settings, null, 4);
			fs.writeFileSync(app.getPath("userData") + "settings.json", jsonData, function(err) {
				if(err) {
					console.log(err);
				}
			});
			
		}
	} catch (err) {
		console.error(err);
	}
}

maxslider.oninput = function() {
	maxoutput.innerText = "Max RAM Usage: " + maxslider.value + " MB";
}

minslider.oninput = function() {
	minoutput.innerText = "Min RAM Usage: " + minslider.value + " MB";
}