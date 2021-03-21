const app = getApp()
const globalData = app.globalData;
const CODE = globalData.CODE;
const MSG = globalData.MSG;

Page({
    data: {
        home_data: {
            announcement: { desc: "新闻公告", data: [] },
            carousel: { desc: "轮播图", data: [] },
            free_hero: { desc: "周免英雄", data: [] },
            strategy: { desc: "攻略", data: [] }
        }
    },
    onLoad: function () {
        this.getData()
    },
    getData() {
        let that = this;
        wx.request({
            url: 'http://127.0.0.1:5000/timi/home',
            data: {},
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.statusCode == 200 && res.data.Code == CODE.Success) {
                    that.setData({
                        home_data: res.data.Data
                    })
                    console.log(res.data.Data);
                }
            }
        })
    }
})