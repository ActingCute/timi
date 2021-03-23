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
            sContent = sContent.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
              .replace(/<p>/ig, '<p style="font-size: 19px;">')
              .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
              .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
              .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
              .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
              .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 100%;" $1');
            sContent = "<div style='width:95%;margin:0 auto'>" + sContent + "</div>";
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