const helper = require("../../../utils/util");

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
      // url, data, success_msg, err_msg, callBack, completeFunc
      helper.HttpGet(that.data.dataUrl, {}, "", "列表数据获取失败", (data) => {
        //callBack
        that.setData({
          list: data,
          show_list: data
        })
      }, () => {
        //completeFunc
        that.setData({
          animated: false,
          loading: false
        });
      });
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
          helper.showToast("跳转错误", "error");
          console.log(err);
        }
      });

    }
  }
})