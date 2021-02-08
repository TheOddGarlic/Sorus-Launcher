const { ipcMain: ipc, app } = require('electron')

const { join } = require('path')
const https = require('https')
const fs = require('fs')

const userData = app.getPath('userData');

ipc.handle('check-update', async (_, url, jar) => {
  var remoteBytes = await getRemoteFileSizeInBytes(url)
  var localBytes = getFileSizeInBytes(join(userData, 'mc', 'Sorus', 'client', jar + '.jar'))

  console.log(`${jar} update checked from ${url}, local bytes: ${localBytes}, remote bytes: ${remoteBytes}`)
  return remoteBytes == localBytes ? false : true
})

ipc.on('get-options', event => {
  event.returnValue = JSON.parse(fs.readFileSync(join(userData, "settings.json")));
})

ipc.on('get-userdata-path', event => {
  event.returnValue = userData;
})

ipc.on('does-details-exist', event => {
  event.returnValue = fs.existsSync(join(userData, "details.json"));
})

ipc.handle('log', async (_, ...args) => {
  console.log(...args)
  return args
})

ipc.handle('save-details', async (_, details) => {
  fs.writeFileSync(join(userData, "details.json"), JSON.stringify(details, null, 4));
})

async function getRemoteFileSizeInBytes(url) {
  return (await get(url)).body.size
}

function getFileSizeInBytes(filename) {
  let stats
  try {
    stats = fs.statSync(filename)
  } catch {
    // ignore and set 0 as size, probably file doesn't exist
    stats = {
      size: 0
    }
  }
  var fileSizeInBytes = stats.size
  return fileSizeInBytes
}

class HTTPError extends Error {
  constructor (message, res) {
    super(message)
    Object.assign(this, res)
    this.name = this.constructor.name
  }
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Sorus-Launcher (https://github.com/SorusClient/Sorus-Launcher)'
      }
    }, (res) => {
      const data = []

      res.on('data', (chunk) => {
        data.push(chunk)
      })

      res.once('error', reject)

      res.once('end', () => {
        const raw = Buffer.concat(data)

        const result = {
          raw,
          body: (() => {
            if ((/application\/json/).test(res.headers['content-type'])) {
              try {
                return JSON.parse(raw)
              } catch {
                // fall through to raw
              }
            }

            return raw
          })(),
          ok: res.statusCode >= 200 && res.statusCode < 400,
          statusCode: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers
        };

        if (result.ok) {
          resolve(result);
        } else {
          reject(new HTTPError(`${res.statusCode} ${res.statusMessage}`, result))
        }
      });
    });

    req.once('error', reject)

    req.end()
  });
}