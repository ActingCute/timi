const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

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

const showToast = (title, icon) => {
  wx.hideToast();
  wx.showToast({
    title,
    icon,
    duration: 2000
  });
}

//http
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

module.exports = {
  formatTime,
  HttpGet,
  HttpPost,
  showToast
}
