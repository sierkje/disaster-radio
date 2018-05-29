#!/usr/bin/env node

/* eslint-env node */
/* eslint-disable no-console */

const path = require('path')
const http = require('http')
const minimist = require('minimist')
const ecstatic = require('ecstatic')
const WebSocket = require('ws')

const settings = (function ensureWebServerSettings() {
  const argv = minimist(process.argv.slice(2), {
    alias: {
      d: 'debug',
      p: 'port',
      s: 'settings',
    },
    boolean: [
      'debug',
    ],
    default: {
      settings: '../settings.js',
      serverRoot: path.dirname(__dirname),
      port: 8000,
      isSimulator: true,
    },
  })
  /* eslint-disable-next-line */
  const settings = require(argv.settings)
  settings.serverRoot = argv.serverRoot || settings.serverRoot
  settings.port = argv.port || settings.port

  return settings
}())

const server = http.createServer()
const wsServer = new WebSocket.Server({ server, path: '/ws' })
const generateId = (currentId) => {
  const buffer = Buffer.alloc(2)
  buffer.writeUInt16LE(currentId)

  return {
    // id: buffer,
    id: buffer,
    nextId: (currentId >= ((2 ** 16) - 1)) ? 0 : currentId + 1,
  }
}
const send = (ws, message, currentId) => {
  const { id, nextId } = (!Buffer.isBuffer(currentId))
    ? generateId(currentId)
    : { id: undefined, nextId: undefined }
  ws.send(Buffer.concat([(id || currentId), message]), {
    compress: false,
    binary: true,
  })

  return nextId
}
const sendMessage = (ws, message, currentId) => send(ws, Buffer.concat([
  Buffer.from('@|', 'utf8'),
  (!Buffer.isBuffer(message)) ? Buffer.from(message, 'utf8') : message,
]), currentId)
const sendACK = (ws, msg) => send(ws, Buffer.from('!', 'utf8'), msg.slice(0, 2))
const startWebServer = (hostname, port) => {
  console.log(`Starting disaster.radio simulator on ${(hostname || '*')} port ${port}`)
  server.listen(port, hostname)
}

server.on('request', (req, res) => {
  const reqUrl = String(req.url)
  const reqDir = reqUrl.replace(/^\/+/, '').split(/\/+/, 1)[0]
  switch (reqDir) {
    case 'build':
    case 'index.html':
      break
    default:
      req.url = '/'
  }
  ecstatic({
    root: path.join(settings.serverRoot, 'static'),
    baseDir: '',
    gzip: true,
    cache: 0,
    autoIndex: true,
    handleError: true,
  })(req, res)
})

wsServer.on('connection', (ws) => {
  let currentId = 0
  const sendFakeMessages = (settings.isSimulator)
    ? setInterval(() => {
      // send fake messages every so often
      console.log('sending message with ID:', currentId)
      currentId = sendMessage(ws, '<cookie_cat> hello apocalypse!', currentId)
    }, 5000)
    : undefined

  ws.on('close', () => {
    console.log('client disconnected')
    if (sendFakeMessages) clearInterval(sendFakeMessages)
  })

  ws.on('message', (message) => {
    console.log('received: %s', message.toString('utf8'))

    // send ACK
    setTimeout(() => sendACK(ws, message), 500)
  })
})

// Start the webserver.
startWebServer(settings.hostname, settings.port)
