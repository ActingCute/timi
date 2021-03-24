const app = getApp();

Page({
    data: {
        type_data: [
            { key: 0, text: "全部" },
            { key: 1, text: "攻击" },
            { key: 2, text: "法术" },
            { key: 3, text: "防御" },
            { key: 4, text: "移动" },
            { key: 5, text: "打野" },
            { key: 7, text: "游走" }
        ],
        data_url: "/timi/armslist"
    },
    onLoad: function () {
        //标题
        app.globalData.SET_TITLE("装备列表");
    },
})