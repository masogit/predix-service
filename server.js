const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');
const server = express();
const port = process.env.PORT || 8080
const remote = "https://apmgw.ittun.com"

const proxy = httpProxy.createProxyServer({secure: false});
proxy.on('error', function(e) {
  console.log(e);
});
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  console.log('proxyReq');
  console.log(options);
});

server.use(express.static(path.join(__dirname, '/dist')));

server.use('/gateway', (req, res) => {
  proxy.web(req, res, { target: remote, pathRewrite: {'^/gateway' : ''}, changeOrigin: true });
})

server.use('*', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/dist/index.html'))
});


server.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});