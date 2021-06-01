const app = getApp();
const helper = require("../../../utils/util");

Page({
    data: {
        info0: null, //英雄故事
        info1: null, //历史上的他
        loading: true,
        animated: true
    },
    onLoad: function (data) {
        let { ename, cname } = data;
        //标题
        app.globalData.SET_TITLE(cname);
        this.getData(ename);
    },
    getData(ename) {
        let that = this;
        // url, data, success_msg, err_msg, callBack, completeFunc
        helper.HttpGet('/timi/story', { ename }, "", "页面数据获取失败", (data) => {
            //callBack
            let info0 = data.data[0];
            let info1 = null;
            if (data.length > 1) {
                info1 = data[1];
            }
            that.setData({
                info0,
                info1
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