const app = getApp()
const globalData = app.globalData;
const { NAV_DATA, TITIE_TEXT } = globalData;
let headHand = null;
Component({
  data: {
    need_back: false,
    titleText: "TIMI"
  },
  properties: {
    titleBackground: {
      type: String,
      value: 'rgba(255, 255, 255, 1)'
    },
    titleColor: {
      type: String,
      value: 'rgba(0, 0, 0, 1)'
    },
    titleImg: {
      type: String,
      value: ''
    },
    titleBackIcon: {
      type: String,
      value: ''
    },
    titleHomeIcon: {
      type: String,
      value: ''
    },
    titleFontSize: {
      type: Number,
      value: 16
    },
    titleIconHeight: {
      type: Number,
      value: 19
    },
    titleIconWidth: {
      type: Number,
      value: 58
    }
  },
  pageLifetimes: {
    show: function () {
      var that = this;
      that.setBackBnt();
    }
  },
  attached: function () {
    var that = this;
    headHand = that;
    that.setNavSize();
    that.setStyle();
    app.globalData.SET_TITLE = that.setTitle;
  },
  data: {
  },
  methods: {
    setTitle(titleText) {
      console.log("titleText-", titleText);
      headHand.setData({
        titleText
      })
    },
    setBackBnt() {
      let route_list = getCurrentPages();
      let current_route = route_list[route_list.length - 1].route;

      let url_list = [
        "pages/index/index",
        "pages/hero/hero",
        "pages/arms/arms",
        "pages/ming/ming",
        "pages/summoner/summoner",
        "pages/logs/logs"
      ];

      this.setData({
        need_back: url_list.indexOf(current_route) == -1
      });

    },
    // 通过获取系统信息计算导航栏高度        
    setNavSize: function () {
      this.setData({
        status: NAV_DATA.status,
        navHeight: NAV_DATA.height
      })
    },
    setStyle: function () {
      var that = this
        , containerStyle
        , textStyle
        , iconStyle;
      containerStyle = [
        'background:' + that.data.titleBackground
      ].join(';');
      textStyle = [
        'color:' + that.data.titleColor,
        'font-size:' + that.data.titleFontSize + 'px'
      ].join(';');
      iconStyle = [
        'width: ' + that.data.titleIconWidth + 'px',
        'height: ' + that.data.titleIconHeight + 'px'
      ].join(';');
      that.setData({
        containerStyle: containerStyle,
        textStyle: textStyle,
        iconStyle: iconStyle
      })
    },
    // 返回事件        
    back: function () {
      wx.navigateBack({
        delta: 1
      })
      this.triggerEvent('back', { back: 1 })
    },
    home: function () {
      this.triggerEvent('home', {});
    }
  }
})


