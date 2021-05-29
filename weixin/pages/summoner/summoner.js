const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

Page({
    data: {
        MING_JSON: [],
        data: [],
        v_index: 0,
        animated: true,
        loading: true
    },
    onLoad: function () {
        //标题
        app.globalData.SET_TITLE("召唤师技能");
        this.getData();
    },
    view: function (e) {
        let v_index = e.currentTarget.dataset.index || 0;
        this.setData({
            v_index
        });
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