const generateId = (length) => {
  var result           = ''
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result
}

const state = {
  id              : generateId(50),
  recording       : false,
  recordingStream : null,
  recordName      : generateId(10),
  buttons         : {
    startRecordingButton: null,
    stopRecordingButton: null,
  }
}

const onRecordingDataAvailable = async (blob) => {
  console.log('Received recording data..', blob.type)

  if (!blob.size) {
    return
  }

  return client.send(blob)

  // const raw = await blob.text()

  // client.send(JSON.stringify({
  //   action : 'blob',
  //   blob   : raw,
  //   client : state.id,
  //   record : state.recordName,
  // }))
}

const onRecordingStream = (stream) => {
  state.recordingStream = RecordRTC(stream, {
    type                  : 'audio',
    mimeType              : 'audio/webm',
    sampleRate            : 44100,
    desiredSampRate       : 16000, 
    recorderType          : StereoAudioRecorder,
    numberOfAudioChannels : 1,
    timeSlice             : 1000,
    ondataavailable       : onRecordingDataAvailable,
  })

  // Now actually start recording
  state.recordingStream.startRecording()
}

const onStartRecording = () => {
  console.log('Start recording clicked')
  client.send(JSON.stringify({
    action : 'start',
    client : state.id,
    record : state.recordName,
  }))

  // Manage the buttons first and the recording state
  state.recording = true
  state.buttons.startRecordingButton.disabled = true
  state.buttons.stopRecordingButton.disabled  = false

  // Start recording
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(onRecordingStream);
}

const onStopRecording = () => {
  console.log('Stop recording clicked')

  // Manage the buttons first and the recording state
  state.recording = false
  state.buttons.startRecordingButton.disabled = false
  state.buttons.stopRecordingButton.disabled  = true
  state.recordingStream.stopRecording()

  setTimeout(() => {
    client.send(JSON.stringify({
      action : 'stop',
      client : state.id,
      record : state.recordName,
    }))

    state.recordName = generateId(10)
    state.recordingStream = null
  }, 500);
}

const recorder = () => {
  const startRecordingButton  = document.getElementById('start-recording')
  const stopRecordingButton   = document.getElementById('stop-recording')
  
  // Add buttons to the state
  state.buttons.startRecordingButton  = startRecordingButton
  state.buttons.stopRecordingButton   = stopRecordingButton

  // Bind the events
  startRecordingButton.onclick  = onStartRecording
  stopRecordingButton.onclick   = onStopRecording
}

window.onload = recorder