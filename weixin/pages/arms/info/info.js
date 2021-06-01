const app = getApp();
const helper = require("../../../utils/util");

Page({
    data: {
        info: null,
        animated: true,
        loading: true,
        type_data: [
            { key: 1, text: "攻击" },
            { key: 2, text: "法术" },
            { key: 3, text: "防御" },
            { key: 4, text: "移动" },
            { key: 5, text: "打野" },
            { key: 7, text: "游走" }
        ],
        arms_type: "母鸡"
    },
    onLoad: function (data) {
        let { id } = data;
        //标题
        app.globalData.SET_TITLE("装备详情");
        this.getData(id || 11210);
    },
    getData(item_id) {
        let that = this;
        // url, data, success_msg, err_msg, callBack, completeFunc
        helper.HttpGet('/timi/arms', { item_id }, "", "页面数据获取失败", (data) => {
            //callBack
            that.setData({
                info: data
            });
            //类型
            let rt = that.data.type_data.find((item) => item.key == data.item_type);
            let arms_type = "";
            if (rt) {
                arms_type = rt.text;
                that.setData({
                    arms_type
                });
            }
        }, () => {
            //completeFunc
            that.setData({
                animated: false,
                loading: false
            });
        });
    },
});