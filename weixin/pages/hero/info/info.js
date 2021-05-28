const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

Page({
    data: {
        info: {},
        loading: true,
        animated: true
    },
    onLoad: function (data) {
        let { id } = data;
        //标题
        app.globalData.SET_TITLE("英雄详情");
        this.getData(id);
    },
    getData(ename) {
        let that = this;
        wx.request({
            url: BASE_URL + '/timi/hero',
            data: { ename },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.setData({
                    animated: false,
                    loading: false
                });
                if (res.statusCode == 200 && res.data.Code == CODE.Success) {
                    that.setData({
                        info: res.data.Data
                    })
                    console.log(res.data.Data);
                } else {
                    wx.hideToast();
                    wx.showToast({
                        title: "获取失败",
                        icon: 'error',
                        duration: 2000
                    });
                }
            },
            error(err) {
                that.setData({
                    animated: false,
                    loading: false
                });
                wx.hideToast();
                wx.showToast({
                    title: err,
                    icon: 'error',
                    duration: 2000
                });
            }
        })
    }
})