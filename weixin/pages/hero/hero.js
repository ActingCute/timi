const app = getApp()
const globalData = app.globalData;
const { CODE, MSG, BASE_URL } = globalData;

console.log("BASE_URL", BASE_URL);

Page({
    data: {
        current_type: 0,
        hero_list: [],
        hero_show_list: [],
        hero_type: [
            "全部",
            "战士",
            "法师",
            "坦克",
            "刺客",
            "射手",
            "辅助"
        ]
    },
    onLoad: function () {
        this.getData()
    },
    getData() {
        let that = this;
        wx.request({
            url: BASE_URL + '/timi/herolist',
            data: {},
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.statusCode == 200 && res.data.Code == CODE.Success) {
                    that.setData({
                        hero_list: res.data.Data,
                        hero_show_list: res.data.Data
                    })
                    console.log(res.data.Data);
                }
            }
        })
    },
    setHeroType(e) {
        //获取设置的类型
        let { index } = e.target.dataset;
        //重复点击
        if (index == this.data.current_type) return;
        //设置标识
        this.setData({
            current_type: index
        });
        //全部
        if (!index) {
            let that = this;
            this.setData({
                hero_show_list: that.data.hero_list
            });
            return;
        }
        //设置对应类型的英雄
        let hero_show_list = [];
        this.data.hero_list.forEach(hero => {
            if (hero.hero_type == index)
                hero_show_list.push(hero);
        });
        this.setData({
            hero_show_list
        });
    }
})