const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

Page({
    data: {
        MING_JSON: [],
        data: [],
        animated: true,
        loading: true,
        no_img: "https://wzyz.haibarai.com/fw/no.png",
        sel_img: "https://wzyz.haibarai.com/fw/sel.png",
        bg: "https://wzyz.haibarai.com/fwbg.jpg",
        fw_type: ['blue_fw', 'green_fw', 'red_fw'],
        img_box: ["https://wzyz.haibarai.com/fw/blue.png",
            "https://wzyz.haibarai.com/fw/green.png",
            "https://wzyz.haibarai.com/fw/red.png"
        ],
        img_show_box: {
            blue_fw: [],
            green_fw: [],
            red_fw: []
        },
        isShowSheet: false
    },
    onLoad: function () {
        let img_show_box = {
            blue_fw: [],
            green_fw: [],
            red_fw: []
        }
        for (let i = 0; i < this.data.fw_type.length; i++) {
            for (let j = 0; j < 10; j++) {
                let src = this.data.img_box[i];
                let data = {
                    id: -1,
                    attribute: [],
                    name: "",
                    src,
                    type: []
                }
                img_show_box[this.data.fw_type[i]].push(data);
            }
        }
        this.setData({
            img_show_box
        })
        console.log("img_show_box - ", img_show_box)

        //标题
        app.globalData.SET_TITLE("铭文模拟器");
        let MING_JSON = require("../../json/minwen").data;
        for (let i = 0; i < MING_JSON.length; i++) {
            MING_JSON[i].src = `https://wzyz.haibarai.com/ming/${MING_JSON[i].name}.png`;
        }
        console.log(MING_JSON);
        this.setData({
            MING_JSON
        })
        this.getData();
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
    },
    setMing(e) {
        let { type, index } = e.target.dataset
        console.log(type, index);
        this.data.img_show_box[type][index] = this.data.MING_JSON[0];
        let img_show_box = this.data.img_show_box;
        this.setData({
            isShowSheet: true
        });
    }
})