const code = require("./utils/code");
let base_url = "";

(() => {
  const version = __wxConfig.envVersion;
  console.log("version:", version)
  switch (version) {
    case "develop": //开发预览版
      base_url = "http://106.12.116.12:5000";
      break;
    case 'trial': //体验版
      base_url = "http://106.12.116.12:5000";
      break;
    // break;
    case 'release': //正式版
      base_url = "http://haibarai.com:5000";
      break;
    default: //未知,默认调用正式版
      base_url = "http://106.12.116.12:5000";
      break;
  }

})()


//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    CODE: code.Code,
    MSG: code.Msg,
    BASE_URL: base_url
  }
})