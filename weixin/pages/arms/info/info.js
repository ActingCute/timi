const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

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
        wx.request({
            url: BASE_URL + '/timi/arms',
            data: { item_id },
            header: {
                'content-type': 'application/json'
            },
            complete(c) {
                that.setData({
                    animated: false,
                    loading: false
                });
            },
            success(res) {
                if (res.statusCode == 200 && res.data.Code == CODE.Success) {
                    that.setData({
                        info: res.data.Data
                    });
                    //类型
                    let rt = that.data.type_data.find((item) => item.key == res.data.Data.item_type);
                    let arms_type = "";
                    if (rt) {
                        arms_type = rt.text;
                        that.setData({
                            arms_type
                        });
                    }

                } else {
                    wx.hideToast();
                    wx.showToast({
                        title: "获取失败",
                        icon: 'error',
                        duration: 2000
                    });
                }

            },
            fail(err) {
                console.error(err);
                wx.hideToast();
                wx.showToast({
                    title: err,
                    icon: 'error',
                    duration: 2000
                });
            }
        })
    },
});