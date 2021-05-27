const app = getApp();

Page({
    data: {
        loading: true,
        animated: true
    },
    onLoad: function () {
        //标题
        app.globalData.SET_TITLE("攻略");
    }
})