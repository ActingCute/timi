const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

//时间格式化插件
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 消息弹窗
 * @param {string} title  标题
 * @param {string} icon   图标 success/error
 */

const showToast = (title, icon) => {
  wx.hideToast();
  wx.showToast({
    title,
    icon,
    duration: 2000
  });
}

//http

/**
 * 网络请求 get
 * @param {string} url            请求url
 * @param {object} data           请求参数
 * @param {string} success_msg    成功后弹出的消息
 * @param {string} err_msg        出现错误后弹出的消息
 * @param {function} callBack     回调函数
 * @param {function} completeFunc 无论成功失败都会执行完成后执行的函数
 */
const HttpGet = (url, data, success_msg, err_msg, callBack, completeFunc) => {
  let r_data = null;
  wx.request({
    url: BASE_URL + url,
    data,
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      if (res.statusCode == 200 && res.data.Code == CODE.Success) {
        if (success_msg) {
          showToast(success_msg, "success");
        }
        r_data = res.data.Data;
      } else {
        if (err_msg) {
          showToast(err_msg, "error");
        }
      }
    },
    fail(err) {
      console.error(err);
      if (err_msg) {
        showToast(err_msg, "error");
      }
    },
    complete(c) {
      callBack(r_data);
      if (completeFunc)
        completeFunc();
    }
  })
}

/**
 * 网络请求 post
 * @param {string} url            请求url
 * @param {object} data           请求参数
 * @param {string} success_msg    成功后弹出的消息
 * @param {string} err_msg        出现错误后弹出的消息
 * @param {function} callBack     回调函数
 * @param {function} completeFunc 无论成功失败都会执行完成后执行的函数
 */
const HttpPost = (url, data, success_msg, err_msg, callBack, completeFunc) => {
  let r_data = null;
  wx.request({
    url: BASE_URL + url,
    method: 'post',
    data: util.json2Form(data),
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success(res) {
      if (res.statusCode == 200 && res.data.Code == CODE.Success) {
        if (success_msg) {
          showToast(success_msg, "success");
        }
        r_data = res.data.Data;
      } else {
        if (err_msg) {
          showToast(err_msg, "error");
        }
      }
    },
    fail(err) {
      console.error(err);
      if (err_msg) {
        showToast(err_msg, "error");
      }
    },
    complete(c) {
      callBack(r_data);
      completeFunc();
    }
  })
}

//暴露函数
module.exports = {
  formatTime,
  HttpGet,
  HttpPost,
  showToast
}
