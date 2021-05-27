const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

Page({
    data: {
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
            url: BASE_URL + '/timi/home',
            data: {},
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.setData({
                    animated: false,
                    loading: false
                });
                if (res.statusCode == 200 && res.data.Code == CODE.Success) {
                    that.setData({
                        home_data: res.data.Data
                    })
                    console.log(res.data.Data);
                }
            }
        })
    }
})