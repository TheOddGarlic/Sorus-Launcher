var http = require('http');
var https = require('https');
var fs = require('fs');
const { app } = require('electron');

function downloadSorus(version, cb) {
    var dest = app.getPath("userData") + "mc/Sorus/"
    var url = 'https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/versions/' + version +'.jar'
    var file = fs.createWriteStream(dest);
    var request = https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
};