/**
 * Package dependencies
 */
const bodyParser  = require('body-parser');
const express     = require('express');
const ws          = require('ws');
const path        = require('path');
const fs          = require('fs')
require('express-async-errors');

/**
 * Local dependencies
 */
const { server }  = require('../config.json');
const routes      = require('./routes');
const { handleStartRecording, handleStopRecording, handleRecording } = require('./services/recordService');

const app = express();

const wsServer  = new ws.Server({ noServer: true });
const clients   = {}

const generateId = (length) => {
  var result           = ''
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result
}

wsServer.on('connection', (socket) => {
  socket.id = generateId(10)
  clients[socket.id] = {}

  socket.on('message', message => {
    if (typeof message === 'object') {
      return handleRecording(clients[socket.id], message)
    }

    setInterval(() => {
      console.log(clients)
    }, 1000);

    const json = JSON.parse(message);

    switch(json.action) {
      case 'start':
        return handleStartRecording(socket.id, json, clients)
      case 'stop':
        return handleStopRecording(socket.id, clients)
    }
  });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')))

/**
 * Middleware
 */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

const port = process.env.PORT || server.port;

const httpServer = app.listen(port, () => {
  console.log(`Server is up & running on port ${port}`);
});

httpServer.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});
