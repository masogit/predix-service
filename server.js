const express = require('express')
const compression = require('compression')
const httpProxy = require('http-proxy')
const path = require('path')
const server = express()
const port = process.env.PORT || 8080
const remote = "http://apm-uat.hcdigital.com.cn:8090"

// const auth = require('./server/auth')
const wx = require('./server/wx')

const proxy = httpProxy.createProxyServer({secure: false})
proxy.on('error', function(e) {
  console.log(e)
})
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  console.log('proxyReq')
  console.log(options)
})

server.use(compression())
server.use(express.static(path.join(__dirname, '/dist')))

// server.use('/auth', auth.validateToken)
server.use('/gateway', (req, res) => {
  proxy.web(req, res, { target: remote, pathRewrite: {'^/gateway' : ''}, changeOrigin: true })
})

server.use('*', function (req, res, next) {
  if(req.query && req.query.state && req.query.code && req.query.state === 'wechat_redirect') {
    wx.getOpenId(req, res, next).then(
    response => {   // if get APM token successfully
      if (response && response.body) {
        res.cookie('hc-apm-token', response.body.data.id_token)
        res.sendFile(path.join(__dirname + '/dist/index.html'))
      }
    },
    err => {        // if get APM token failed
      if (err.message) {
        console.log(err.message)
      }
      if (err.response) {
        console.log(err.response.body.message)
        console.log('openid: ' + err.response.request._data.weChatId)
        res.cookie('hc-apm-openid', err.response.request._data.weChatId)
      }
      res.sendFile(path.join(__dirname + '/dist/index.html'))
    })
  } else {
    res.sendFile(path.join(__dirname + '/dist/index.html'))
  }
})


server.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})

// connect to wx server
wx.connect().then(token => console.log('create menu: ' + JSON.stringify(token)))
