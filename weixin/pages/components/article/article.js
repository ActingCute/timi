const app = getApp()
const helper = require("../../../utils/util");
app.globalData.SET_TITLE("嘤嘤嘤~");

Component({
  data: {
    sContent: "",
    sTitle: "",
    sIdxTime: "",
    animated: true,
    loading: true,
    isVideo: false,
    sVID: 0,
    sAuthor: "小可爱"
  },
  properties: {
    dataUrl: String
  },
  attached: function () {
    this.getData();
  },
  methods: {
    getData(url) {
      if (!url) return;
      let that = this;
      // url, data, success_msg, err_msg, callBack, completeFunc
      helper.HttpGet(url, {
        sContent: "",
        sTitle: "",
        sIdxTime: ""
      }, "", "页面数据获取失败", (data) => {
        console.log(data)
        //callBack
        let isVideo = data.isVideo;
        let sVID = data.sVID || 0;
        console.log("sVID -- ", sVID)
        let { sContent, sTitle, sIdxTime, sAuthor } = data.data;
        //标题
        app.globalData.SET_TITLE(sTitle);

        if (!isVideo) {
          //视频攻略
          sContent = sContent.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
            .replace(/<p>/ig, '<p style="font-size: 19px;">')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 100%;" $1');
          sContent = "<div style='width:95%;margin:0 auto;padding-top:20px;padding-bottom:20px'>" + sContent + "</div>";
        } else {
          sContent = "";
          sIdxTime = data.sIdxTime;
          sTitle = data.sTitle;
          sAuthor = data.sAuthor;
        }

        that.setData({
          sContent, sTitle, sIdxTime, isVideo, sVID, sAuthor
        });
      }, () => {
        //completeFunc
        that.setData({
          animated: false,
          loading: false
        });
      });
    }
  }
})