Component({
  properties: {
    tops: {
      type: String  //外部传入数据 content高度值为百分比例如60%
    },
    isShowSheet: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.__showMaster();
        }
      }
    }
  },
  data: {
    openSheet: '',
    contentAnimate: null,
    masterAnimate: null,
  },
  methods: {
    __closeMaster() {
      var that = this;
      this.data.contentAnimate.top("0%").step();
      this.data.masterAnimate.opacity(0).step();
      this.setData({
        contentAnimate: this.data.contentAnimate.export(),
        masterAnimate: this.data.masterAnimate.export(),
      });
      setTimeout(function () {
        that.setData({
          isShowSheet: false,
        })
      }, 200)
    },
    __showMaster() {
      //创建动画  展开
      this.setData({
        isShowSheet: true,
      });
      // 容器上弹
      var contentAnimate = wx.createAnimation({
        duration: 100,
      })
      contentAnimate.top(`-${this.properties.tops}`).step();
      //master透明度
      var masterAnimate = wx.createAnimation({
        duration: 200,
      })
      masterAnimate.opacity(.5).step();

      this.setData({
        contentAnimate,
        masterAnimate
      })
    }
  }
})