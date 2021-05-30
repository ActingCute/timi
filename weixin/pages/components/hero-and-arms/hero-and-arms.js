const app = getApp()
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

Component({
  data: {
    current_type: 0,
    show_list: [],
    list: [],
    animated: true,
    loading: true
  },
  properties: {
    typeData: Array,
    dataUrl: String
  },
  attached: function () {
    this.getData();
  },
  methods: {
    getData() {
      let that = this;
      wx.request({
        url: BASE_URL + that.data.dataUrl,
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          if (res.statusCode == 200 && res.data.Code == CODE.Success) {
            that.setData({
              list: res.data.Data,
              show_list: res.data.Data
            })
          }
        },
        fail(err) {
          console.error(err);
          wx.hideToast();
          wx.showToast({
            title: err,
            icon: 'error',
            duration: 2000
          });
        },
        complete(c) {
          that.setData({
            animated: false,
            loading: false
          });
        }
      })
    },
    setHeroType(e) {
      //获取设置的类型
      let { index } = e.target.dataset;
      //重复点击
      if (index == this.data.current_type) return;
      //设置标识
      this.setData({
        current_type: index
      });
      //全部
      if (!index) {
        let that = this;
        this.setData({
          show_list: that.data.list
        });
        return;
      }
      //设置对应类型的英雄
      let show_list = [];
      this.data.list.forEach(ele => {
        if (ele.type == index)
          show_list.push(ele);
      });
      this.setData({
        show_list
      });
    },
    view(e) {
      let v_index = e.currentTarget.dataset.index || 0;
      let url = `info/info?id=${this.data.show_list[v_index].id}`;
      console.log("url - ", url);
      wx.navigateTo({
        url, fail(err) {
          wx.hideToast();
          wx.showToast({
            title: "跳转错误",
            icon: 'error',
            duration: 2000
          });
          console.log(err);
        }
      });

    }
  }
})