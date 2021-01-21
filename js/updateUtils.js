const { ElectronHttpExecutor } = require("electron-updater/out/electronHttpExecutor");

function getRemoteFileSizeInBytes(url) {
  var fileSizeInBytes = 0;
  http.request(url, { method: 'HEAD' }, res => {
    fileSizeInBytes = res.headers['content-length'];
  });
  return fileSizeInBytes;
}

function getFileSizeInBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

function checkUpdate(url, file) {
  var remoteBytes = getRemoteFileSizeInBytes(url);
  var localBytes = getFileSizeInBytes(file);

  return remoteBytes == localBytes ? false : true;
}