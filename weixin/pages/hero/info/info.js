const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL, NAV_DATA } = globalData;

Page({
    data: {
        hero_type: "小可爱",
        type_data: [
            { key: 1, text: "战士" },
            { key: 2, text: "法师" },
            { key: 3, text: "坦克" },
            { key: 4, text: "刺客" },
            { key: 5, text: "射手" },
            { key: 6, text: "辅助" }
        ],
        paddingTop: "48px",
        info: null,
        loading: true,
        animated: true
    },
    onLoad: function (data) {
        this.setData({
            paddingTop: NAV_DATA.status + NAV_DATA.height + "px"
        })
        console.log("paddingTop -- ", this.data.paddingTop)
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
            complete(c) {
                that.setData({
                    animated: false,
                    loading: false
                });
            },
            success(res) {

                if (res.statusCode == 200 && res.data.Code == CODE.Success) {
                    let ht = that.data.type_data.find((item) => item.key == res.data.Data.hero_type);
                    let hero_type = "";
                    if (ht) {
                        hero_type = ht.text;
                    }
                    let hero_type2 = res.data.Data.hero_type2;
                    if (hero_type2 && hero_type2 > 0) {
                        ht = that.data.type_data.find((item) => item.key == hero_type2);
                        if (ht) {
                            hero_type += "/" + ht.text;
                        }
                    }
                    that.setData({
                        info: res.data.Data,
                        hero_type
                    })
                    console.log(that.data.info);
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