const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

Page({
    data: {
        MING_JSON: [],
        data: [],
        animated: true,
        loading: true,
        no_img: "https://wzyz.haibarai.com/fw/no.png",
        sel_img: "https://wzyz.haibarai.com/fw/sel.png",
        bg: "https://wzyz.haibarai.com/fwbg.jpg",
        fw_type: ['blue_fw', 'green_fw', 'red_fw'],
        img_box: ["https://wzyz.haibarai.com/fw/blue.png",
            "https://wzyz.haibarai.com/fw/green.png",
            "https://wzyz.haibarai.com/fw/red.png"
        ]
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
                if (res.statusCode == 200 && res.data.Code == CODE.Success) {
                    that.setData({
                        data: res.data.Data
                    })
                    console.log(res.data.Data);
                }
            },
            fail(err) {
                console.err(err);
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
    }
})