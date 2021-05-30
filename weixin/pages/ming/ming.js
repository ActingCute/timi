const app = getApp();
const globalData = app.globalData;
const { NAV_DATA } = globalData;

//写的有点混乱 ，将就下咯
Page({
    data: {
        clen_data: {
            dialogShow: false,
            showOneButtonDialog: false,
            buttons: [{ text: '取消' }, { text: '确定' }],
        },
        scrollViewHeight: 0,
        activeTab: 0,
        tabs: ['蓝色', '绿色', '红色'],
        MING_JSON: [],
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
        img_show_box: { //展示在页面的格子
            blue_fw: [],
            green_fw: [],
            red_fw: []
        },
        ming_list: {   //分好类的铭文
            blue_fw: [],
            green_fw: [],
            red_fw: []
        },
        ming_key: 'blue_fw',
        ming_index: 0,
        ming_show: [], //弹出选择的列表
        isShowSheet: false,
        ming_value_show: {   //已经选择好的铭文
            blue_fw: [],
            green_fw: [],
            red_fw: [],
            show_attr: [] //存放总铭文值
        },
        level: 0,
        allValue: {}//做缓存用
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
        let item = this.data.ming_show[index];
        //设置在格子上
        this.data.img_show_box[this.data.ming_key][this.data.ming_index] = item;
        let img_show_box = this.data.img_show_box;

        //更新使用数量
        let data = this.data.img_show_box[this.data.ming_key].reduce((ids, ele) => {
            if (ele.id != -1) {
                if (!ids[ele.id]) ids[ele.id] = 0;
                ids[ele.id]++;
            }
            return ids;
        }, {});
        if (data) {
            for (let id in data) {
                let num = 10 - data[id];
                if (num < 0) {
                    num = 0;
                }
                this.data.ming_show.forEach(ele => {
                    if (ele.id == id) {
                        ele.num = num;
                    }
                });
                this.data.ming_list[this.data.ming_key].forEach(ele => {
                    if (ele.id == id) {
                        ele.num = num;
                    }
                });
            }
        }
        //更新总值 即全部铭文的效果
        let allValue = {};
        let ming_value_show = {};
        let level = 0;
        for (let i = 0; i < this.data.fw_type.length; i++) {
            this.data.img_show_box[this.data.fw_type[i]].forEach(ele => {
                if (ele.id < 0) return true;
                if (ele.num != 10) {
                    if (!ming_value_show[this.data.fw_type[i]]) ming_value_show[this.data.fw_type[i]] = [];
                    //排除重复
                    let has = ming_value_show[this.data.fw_type[i]].find(ele_item => ele_item.id == ele.id);
                    if (!has) {
                        ming_value_show[this.data.fw_type[i]].push(ele);
                    }
                    ele.attribute.forEach(item => {
                        for (let j in item) {
                            if (!allValue[j]) {
                                if (j != 'sign') {
                                    allValue[j] = { value: parseFloat(item[j]).toFixed(2), sign: item['sign'] }
                                }
                            } else {
                                if (j != 'sign') {
                                    let v = parseFloat(allValue[j]['value']) + parseFloat(item[j]);
                                    allValue[j]['value'] = v.toFixed(2);
                                }
                            }
                        }
                    });
                }
            });
        }
        let attrArr = [];
        for (let i in allValue) {
            let item = {
                [i]: allValue[i]['value'], sign: allValue[i]['sign']
            };
            attrArr.push(item);
        }

        for (let i = 0; i < this.data.fw_type.length; i++) {
            if (!ming_value_show[this.data.fw_type[i]]) continue;
            ming_value_show[this.data.fw_type[i]].forEach(ele => {
                let num = 10 - ele.num;
                level += num;
            })
        }

        level *= 5;

        ming_value_show['show_attr'] = this.formatValue1(attrArr);
        this.setData({
            level,
            ming_value_show,
            allValue,
            img_show_box,
            isShowSheet: false,
            ming_show: this.data.ming_show,
            ming_list: this.data.ming_list
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
            ming_list[this.data.fw_type[i]] = this.formatValue(i, ming);
        }
        this.setData({
            img_show_box,
            ming_list
        });

    },
    formatValue(i, ming) {
        let data = [];
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
                item.show_attr = this.formatValue1(item.attribute);

                data.push(item);
            }
        }
        return data;
    },
    formatValue1(arr) {
        let show_attr = [];
        for (let n = 0; n < arr.length; n++) {
            let attr = "";
            for (let m in arr[n]) {
                if (m == 'sign') {
                    attr += arr[n][m];
                } else {
                    attr = m + arr[n][m];
                }
            }
            show_attr.push(attr);
        }
        return show_attr;
    },
    cleanTip() {
        this.setData({
            clen_data: {
                dialogShow: true,
                showOneButtonDialog: false,
                buttons: [{ text: '取消' }, { text: '确定' }],
            }
        });
    },
    clean(e) {
        let { index } = e.detail;
        if (index == 1) {
            this.setData({
                img_show_box: { //展示在页面的格子
                    blue_fw: [],
                    green_fw: [],
                    red_fw: []
                },
                ming_list: {   //分好类的铭文
                    blue_fw: [],
                    green_fw: [],
                    red_fw: []
                },
                ming_key: 'blue_fw',
                ming_index: 0,
                ming_show: [], //弹出选择的列表
                isShowSheet: false,
                ming_value_show: {   //已经选择好的铭文
                    blue_fw: [],
                    green_fw: [],
                    red_fw: [],
                    show_attr: [] //存放总铭文值
                },
                level: 0,
                allValue: {}//做缓存用
            })
            this.init();
        }

        this.setData({
            clen_data: {
                dialogShow: false,
                showOneButtonDialog: false,
                buttons: [{ text: '取消' }, { text: '确定' }],
            }
        });

    },
    onLoad: function () {
        // 计算铭文值得剩余高度
        let windowHeight = 0;
        let tabbarHeight = 0
        let pixelRatio = 1;
        let isIos = false;
        wx.getSystemInfo({
            success: function (res) {
                isIos = res.system.toLowerCase().indexOf("ios") != -1
                windowHeight = res.windowHeight;
                pixelRatio = res.pixelRatio;
                tabbarHeight = (res.screenHeight - windowHeight - res.statusBarHeight) * pixelRatio
            }
        });
        let query = wx.createSelectorQuery().in(this);
        query.select('#fwbox').boundingClientRect();
        query.select('#level').boundingClientRect();

        query.exec((res) => {

            let h1 = res[0].height;
            let h2 = res[1].height;
            let scrollViewHeight = windowHeight - h1 - h2 - tabbarHeight;
            if (!isIos) {
                scrollViewHeight -= NAV_DATA.height;
            }
            this.setData({
                scrollViewHeight: (scrollViewHeight < 50 ? 500 : scrollViewHeight) + ''
            });
        });

        //标题
        app.globalData.SET_TITLE("铭文模拟器");
        let MING_JSON = require("../../json/minwen").data;
        for (let i = 0; i < MING_JSON.length; i++) {
            MING_JSON[i].src = `https://wzyz.haibarai.com/ming/${MING_JSON[i].name}.png`;
        }
        this.setData({
            MING_JSON
        });
        this.init();
    }
})