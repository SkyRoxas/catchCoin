const express = require('express')
const path = require('path')
const app = express()

const destFolder = __dirname + '/dest/'

app.use('/static', express.static(destFolder + 'public'))
app.get('/', function (req, res) {
  res.sendFile(path.join(destFolder + '/index.html'))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
