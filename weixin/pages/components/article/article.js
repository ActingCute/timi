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
    formatRichImg(html) {
      let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
        match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
        match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
        match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
        return match;
      });
      newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
        match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
        return match;
      });
      newContent = newContent.replace(/<br[^>]*\/>/gi, '');
      newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;"');
      return newContent;
    },
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
          //内容
          sContent = that.formatRichImg(sContent)
          sContent = sContent.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
            .replace(/<p>/ig, '<p style="font-size: 19px;">')
            .replace(/<h1>/ig, '<div style="font-size: 22px;font-weight: bold;color:blue;">')
            .replace(/<\/h1>/ig, '</div>')
            .replace(/<h2>/ig, '<div style="font-size: 18px;font-weight: bold;color:blue;">')
            .replace(/<\/h2>/ig, '</div>')
            .replace(/<h3>/ig, '<div style="font-size: 16px;font-weight: bold;color:blue;">')
            .replace(/<\/h3>/ig, '</div>');
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