const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

Page({
    data: {
        MING_JSON: [],
        data: []
    },
    onLoad: function () {
        //标题
        app.globalData.SET_TITLE("铭文模拟器");
        const MING_JSON = require("../../json/minwen").data;
        console.log(MING_JSON);
        this.setData({
            MING_JSON
        })
        this.getData();
    },
    getData() {
        let that = this;
        wx.request({
            url: BASE_URL + '/timi/summoner',
            data: {},
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
                        data: res.data.Data
                    })
                    console.log(res.data.Data);
                }
            },
            error(err) {
                that.setData({
                    animated: false,
                    loading: false
                });
                wx.showToast({
                    title: err,
                    icon: 'error',
                    duration: 2000
                });
                wx.hideToast();
            }
        })
    }
})