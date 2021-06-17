const fs      = require('fs')
const path    = require('path')
const wav     = require('wav')
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

  // Now create an empty record file
  fs.openSync(path.join(__dirname, `../../public/records/${record}.wav`), 'w')
}

const handleStopRecording = (clientId, clientsBlobs) => {
  if (!clientsBlobs[clientId]) {
    return
  }

  // Now just remove the item for our clients state
  clientsBlobs[clientId] = {}
}

const handleRecording = (client, blob) => {
  const fileName    = path.join(__dirname, `../../public/records/${client.record}${count}.wav`)
  const fileWriter  = new wav.FileWriter(fileName, {
    channels: 1,
    sampleRate: 44100,
    bitDepth: 16
  })

  fileWriter.write(blob)
  count++
}

module.exports = {
  handleStartRecording,
  handleStopRecording,
  handleRecording,
}