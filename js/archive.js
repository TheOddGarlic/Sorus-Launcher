
const extract = require('extract-zip')
 
async function extractJarFiles() {
  	try {
		await extract(app.getPath("userData") + "/mc/Sorus/client/Core.jar", { dir: app.getPath("userData") + "/mc/Sorus/client/temp" })
		console.log('Extraction complete')
  	} catch (err) {
		console.error(err)
  	}
}