const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

Page({
    data: {
        data: [],
        loading: true,
        animated: true
    },
    onLoad: function () {
        //标题
        app.globalData.SET_TITLE("新闻");
        this.getData();
    },
    getData() {
        let that = this;
        wx.request({
            url: BASE_URL + '/timi/announcement',
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