const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

Page({
    data: {
        activeTab: 0,
        tabs: ['蓝色', '绿色', '红色'],
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
        ming_list: {
            blue_fw: [],
            green_fw: [],
            red_fw: []
        },
        ming_key: 'blue_fw',
        ming_index: 0,
        ming_show: [],
        isShowSheet: false
    },
    view(e) {
        let activeTab = e.currentTarget.dataset.index || 0;
        this.setData({
            activeTab,
            ming_index: 0,
            ming_show: this.data.ming_list[this.data.fw_type[activeTab]]
        })
    },
    setMing(e) {
        let { type, index, key } = e.target.dataset;
        this.setData({
            activeTab: type,
            ming_key: key,
            isShowSheet: true,
            ming_index: index,
            ming_show: this.data.ming_list[key]
        });
    },
    useMing(e) {
        let { index } = e.currentTarget.dataset;
        console.log("index -- ", index)

        this.data.img_show_box[this.data.ming_key][this.data.ming_index] = this.data.ming_show[index];
        let img_show_box = this.data.img_show_box;
        this.setData({
            img_show_box
        });
    },
    init() {
        //显示的铭文插槽
        let img_show_box = {
            blue_fw: [],
            green_fw: [],
            red_fw: []
        }
        //铭文分类
        let ming_list = {
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
            //分类
            let ming = this.data.MING_JSON;
            console.log("ming -- ", ming)
            for (let k = 0; k < ming.length; k++) {
                let item = ming[k];
                let key = "";
                if (i == 0) {
                    key = "蓝色";
                    //蓝
                } else if (i == 1) {
                    //绿
                    key = "绿色";
                } else {
                    //红
                    key = "红色";
                }
                if (item.type.indexOf(key) != -1) {
                    item.num = 10;
                    //重新组装下数据给前台显示
                    item.show_attr = [];
                    for (let n = 0; n < item.attribute.length; n++) {
                        let attr = "";
                        for (let m in item.attribute[n]) {
                            if (m == 'sign') {
                                attr += item.attribute[n][m];
                            } else {
                                attr = m + item.attribute[n][m];
                            }
                        }
                        item.show_attr.push(attr);
                    }
                    ming_list[this.data.fw_type[i]].push(item);
                }
            }
            console.log("ming_list -- ", ming_list)

        }
        this.setData({
            img_show_box,
            ming_list
        });

    },
    onLoad: function () {
        //标题
        app.globalData.SET_TITLE("铭文模拟器");
        let MING_JSON = require("../../json/minwen").data;
        for (let i = 0; i < MING_JSON.length; i++) {
            MING_JSON[i].src = `https://wzyz.haibarai.com/ming/${MING_JSON[i].name}.png`;
        }
        console.log(MING_JSON);
        this.setData({
            MING_JSON
        });
        this.init();
        //this.getData();
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
    }
})