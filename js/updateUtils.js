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

function checkUpdate(url, jar) {
  var remoteBytes = getRemoteFileSizeInBytes(url);
  var localBytes = getFileSizeInBytes(userDataPath + '/mc/Sorus/client/' + jar + '.jar');

  return remoteBytes == localBytes ? false : true;
}