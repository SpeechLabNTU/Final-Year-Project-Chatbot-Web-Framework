var http = require("http")

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

var options = {
  host: "localhost",
  port: normalizePort(process.env.PORT || 3001),
  timeout: 2000
}

var request = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`)
  if (res.statusCode == 200) {
    process.exit(0)
  }
  else {
    process.exit(1)
  }
})

request.on('error', err => {
  console.log("ERROR")
  process.exit(1)
})

request.end()
