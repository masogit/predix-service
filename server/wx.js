const request = require('superagent')

const param = {
  appid: 'wxb855b69b5462a7c1',
  secret: '82a1a06c8383e14f878fdda9789bd288',
  state: 'wechat_redirect',
  const: {
    accessToken: 'access_token',
    scope: 'snsapi_base'
  }
}

const url = {
  openId: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${param.appid}&secret=${param.secret}&grant_type=authorization_code&code=`,
  // openId: `https://api.weixin.qq.com/sns/jscode2session?appid=${param.appid}&secret=${param.secret}&grant_type=authorization_code&js_code=`,
  accessToken: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${param.appid}&secret=${param.secret}`,
  message: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=`,
  createMenu: `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=`,
  apm: `http://maso.tunnel.2bdata.com`,
  authorize: `https://open.weixin.qq.com/connect/oauth2/authorize`,
  weChatAuth: `http://120.132.8.152:8090/api/apm/security/userAccounts/authenticateWeChat`
}

const genUrl = (path) => {
  const menuUrl = `${url.authorize}?appid=${param.appid}&redirect_uri=${url.apm+path}&response_type=code&scope=${param.const.scope}&state=${param.state}`
  console.log(menuUrl)
  return menuUrl
}

const menu = {
  button: [
    {
      name: '设备',
      'sub_button': [
        {
          type: 'view',
          name: '扫码',
          url: genUrl('/wx/device/scan')
        },
        {
          type: 'view',
          name: '检索',
          url: genUrl('/wx/device')
        },
        {
          type: 'view',
          name: '创建',
          url: genUrl('/wx/device/uploader')
        }
      ]
    },
    {
      name: '工单',
      'sub_button': [
        {
          type: 'view',
          name: '维修',
          url: genUrl('/wx/workorder/a')
        },
        {
          type: 'view',
          name: '保养',
          url: genUrl('/wx/workorder/b')
        },
        {
          type: 'view',
          name: '巡检',
          url: genUrl('/wx/workorder/c')
        }
      ]
    },
    {
      name: '用户',
      'sub_button': [
        {
          type: 'view',
          name: '绑定',
          url: genUrl('/login')
        },
        {
          type: 'view',
          name: '消息',
          url: genUrl('/wx/user/messages')
        }
      ]
    }
  ]
}

const getOpenId = (req, res, next) => {
  if (req.query && req.query.code) {
    return request.get(url.openId + req.query.code)
                  .then(res => JSON.parse(res.text))
                  .then(data => data.openid)
                  .then(
                    openid => { // then get APM token
                      if (openid)
                        return request.post(url.weChatAuth, { weChatId: openid })
                    })
  }
}

const connect = () => {
  return request.get(url.accessToken)
                .then(res => res.body[param.const.accessToken])
                .then(createMenu)
}

const createMenu = (token) => {
  return request.post(url.createMenu + token, menu)
                .then(res => res.body)
}

exports.connect = connect
exports.getOpenId = getOpenId
// const saveToken = function () {
//   const strAccessToken = 'access_token'
//   getAccessToken().then(res => {
//     let token = res[strAccessToken]
//     fs.writeFile('./token', token, function (err) {

//     })
//   })
// }

// const refreshToken = function () {
//   saveToken()
//   setInterval(function () {
//     saveToken()
//   }, 7000*1000)
// }

// const connect = () => {
//   getAccessToken().then(res => {
//     console.log(res)

//     refreshToken()
//   })
// }
