const extract = require('extract-zip')
 
async function extractJarFiles(name) {
  	try {
		await extract(app.getPath("userData") + "/mc/Sorus/client/" + name + ".jar", { dir: app.getPath("userData") + "/mc/Sorus/client/temp" })
		console.log(name + ' extraction complete')
  	} catch (err) {
		console.error(err)
  	}
}

async function archiveDir(name) {
	var archiver = require('archiver');

	var output = fs.createWriteStream(app.getPath("userData") + "/mc/Sorus/client/" + name + "_compiled.jar");
	var archive = archiver('zip');

	output.on('close', function () {
		console.log(archive.pointer() + ' total bytes');
		console.log('archiver has been finalized and the output file descriptor has closed.');
	});

	archive.on('error', function(err){
		throw err;
	});

	await archive.pipe(output);

	await archive.directory(app.getPath("userData") + '/mc/Sorus/client/temp', false);

	await archive.finalize();
	fs.rmdirSync(app.getPath("userData") + "/mc/Sorus/client/temp", { recursive: true });
}