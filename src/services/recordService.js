const fs      = require('fs')
const path    = require('path')
const logger  = require('./logger')
let count     = 0

const handleStartRecording = (clientId, { record, client }, clientsBlobs) => {
  if (!clientsBlobs[clientId]) {
    clientsBlobs[clientId] = {}
  }

  // Add this as a record that the client is currently recording
  clientsBlobs[clientId].record   = record
  clientsBlobs[clientId].client   = client
  clientsBlobs[clientId].started  = true

  const directory = path.join(__dirname, `../../public/records/${record}/`)

  if (!fs.existsSync(directory)){
    fs.mkdirSync(directory);
  }

  count = 0
  // Now create an empty record file
  fs.openSync(path.join(__dirname, `../../public/records/${record}/${record}${count}.wav`), 'w')
}

const handleStopRecording = (clientId, clientsBlobs) => {
  if (!clientsBlobs[clientId]) {
    return
  }

  // Now just remove the item for our clients state
  clientsBlobs[clientId] = {}
}

const handleRecording = (client, blob) => {
  const fileName    = path.join(__dirname, `../../public/records/${client.record}/${client.record}${count}.wav`)
  fs.appendFileSync(fileName, blob)
  count++
}

module.exports = {
  handleStartRecording,
  handleStopRecording,
  handleRecording,
}