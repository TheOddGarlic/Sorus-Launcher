var http = require('http');
var https = require('https');
var fs = require('fs');
const { app } = require('electron');

async function downloadCoreJar(cb) {
    var dest = app.getPath("userData") + "/mc/Sorus/client/"

    let url = 'https://raw.githubusercontent.com/SorusClient/Sorus-Resources/master/client/Core.jar';
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
};

