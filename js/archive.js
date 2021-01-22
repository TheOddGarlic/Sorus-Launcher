const extract = require('extract-zip')

var playbtn_text = document.getElementById("playbtn-text");
var playbtn_status = document.getElementById("playbtn-status");

function changePlayButtonStatus(string) {
    playbtn_status.innerText = string;
}
 
function extractJarFiles(name) {
  return new Promise(async (resolve, reject) => {
    try {
      changePlayButtonStatus("Extracting " + name + ".jar")
      await extract(app.getPath("userData") + "/mc/Sorus/client/" + name + ".jar", { dir: app.getPath("userData") + "/mc/Sorus/client/temp" })
      changePlayButtonStatus("Finished extracting " + name + ".jar")
      console.log(name + ' extraction complete')
      fs.writeFileSync(app.getPath("userData") + "/mc/Sorus/updates.json", "{}");
      resolve();
    } catch (err) {
      console.error(err)
      reject();
    }
  });
}

// async function archiveDir(name) {
// 	var archiver = require('archiver');

// 	var output = fs.createWriteStream(app.getPath("userData") + "/mc/Sorus/client/" + name + "_compiled.jar");
// 	var archive = archiver('zip');

// 	output.on('close', function () {
// 		console.log(archive.pointer() + ' total bytes');
// 		console.log('archiver has been finalized and the output file descriptor has closed.');
// 	});

// 	archive.on('error', function(err){
// 		throw err;
// 	});

// 	await archive.pipe(output);

// 	await archive.directory(app.getPath("userData") + '/mc/Sorus/client/temp', false);

// 	await archive.finalize();
// 	fs.rmdirSync(app.getPath("userData") + "/mc/Sorus/client/temp", { recursive: true });
// }