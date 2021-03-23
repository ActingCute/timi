const app = getApp()
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

console.log("BASE_URL", BASE_URL);

Component({
  data: {
    sContent: "",
    sTitle: "",
    sIdxTime: ""
  },
  properties: {
    dataUrl: String
  },
  attached: function () {
    this.getData();
  },
  methods: {
    getData(url) {
      let that = this;
      wx.request({
        url: BASE_URL + url,
        data: {
          sContent: "",
          sTitle: "",
          sIdxTime: ""
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          if (res.statusCode == 200 && res.data.Code == CODE.Success) {
            let { sContent, sTitle, sIdxTime } = res.data.Data.data;
            that.setData({
              sContent, sTitle, sIdxTime
            });
            console.log(res.data.Data);
          }
        }
      })
    }
  }
})