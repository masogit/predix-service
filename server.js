const express = require('express')
const server = express()
const port = process.env.PORT || 3000

server.use('*', (req, res) => {
  res.json({
    test: 'abc'
  })
})

server.listen(port, () => console.log(`Express Server started on ${port}`))