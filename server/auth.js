const url = require("url");
const crypto = require("crypto");

function sha1(str) {
  const md5sum = crypto.createHash("sha1")
  md5sum.update(str)
  str = md5sum.digest("hex")
  return str
}

exports.validateToken = (req, res, next) => {
  const { query } = url.parse(req.url,true)
  const { signature, echostr, timestamp, nonce } = query
  const oriArray = new Array()
  oriArray[0] = nonce
  oriArray[1] = timestamp
  oriArray[2] = "masosoft_ge_hc_apm_123"//这里是你在微信开发者中心页面里填的token，而不是****
  oriArray.sort()
  const original = oriArray.join('')
  console.log("Original str : " + original)
  console.log("Signature : " + signature )
  const scyptoString = sha1(original)
  if (signature === scyptoString) {
    res.end(echostr)
    // next()
    console.log("Confirm and send echo back: " + echostr)
  } else {
    // res.end("false")
    console.log("Failed!")
  }
}
