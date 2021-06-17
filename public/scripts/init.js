const isProd    = location.origin.includes('https://')
const domain    = isProd ? location.origin.replace('https://', '') : location.origin.replace('http://', '')
const protocol  = isProd ? 'wss://' : 'ws://'
const client    = new WebSocket(`${protocol}${domain}`);

client.onmessage = (event) => {
  var message = event.data
  var json = JSON.parse(message);
  console.log(json);
}

client.onopen = () => {
  client.send(JSON.stringify({
    action: 'init'
  }))
}