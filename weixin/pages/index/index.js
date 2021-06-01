const app = getApp();
const helper = require("../../utils/util");

Page({
    data: {
        home_data: {
            announcement: { desc: "新闻公告", data: [] },
            carousel: { desc: "轮播图", data: [] },
            free_hero: { desc: "周免英雄", data: [] },
            strategy: { desc: "攻略", data: [] }
        },
        animated: true,
        loading: true
    },
    onLoad: function () {
        //标题
        app.globalData.SET_TITLE("王者驿站");
        this.getData();
    },
    getData() {
        let that = this;
        // url, data, success_msg, err_msg, callBack, completeFunc
        helper.HttpGet('/timi/home', {}, "", "页面数据获取失败", (home_data) => {
            //callBack
            that.setData({
                home_data
            })
        }, () => {
            //completeFunc
            that.setData({
                animated: false,
                loading: false
            });
        });
    }
})