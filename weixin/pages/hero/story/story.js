const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL, NAV_DATA } = globalData;

Page({
    data: {
        info0: null, //英雄故事
        info1: null, //历史上的他
        loading: true,
        animated: true
    },
    onLoad: function (data) {
        console.log("data -- ", data)
        let { ename, cname } = data;
        //标题
        app.globalData.SET_TITLE(cname);
        this.getData(ename);
    },
    getData(ename) {
        let that = this;
        wx.request({
            url: BASE_URL + '/timi/story',
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
                    let info0 = res.data.Data.data[0];
                    let info1 = null;
                    if (res.data.Data.data.length > 1) {
                        info1 = res.data.Data.data[1];
                    }
                    that.setData({
                        info0,
                        info1
                    })
                    console.log(info0)
                    console.log(info1)
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