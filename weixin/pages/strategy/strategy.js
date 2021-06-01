const app = getApp();
const helper = require("../../utils/util");

Page({
    data: {
        data: [],
        loading: true,
        animated: true
    },
    onLoad: function () {
        //标题
        app.globalData.SET_TITLE("攻略");
        this.getData();
    },
    getData() {
        let that = this;
        // url, data, success_msg, err_msg, callBack, completeFunc
        helper.HttpGet('/timi/strategy', {}, "", "页面数据获取失败", (data) => {
            //callBack
            that.setData({
                data
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