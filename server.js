const express = require('express')
const server = express()

server.use('*', (req, res) => {
  res.json({
    test: 'abc'
  })
})

server.listen(8088, () => console.log('Express Server started on 8088'))