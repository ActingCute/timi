const app = getApp();
const globalData = app.globalData;
const { NAV_DATA } = globalData;
const helper = require("../../../utils/util");
Page({
    data: {
        activeTab: 0,
        tabs: ['玩法推荐', '技能详情', '英雄关系'],
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
        animated: true,
        strategy: null,
        skill: null,
        relation: null,
        skin_list: []
    },
    view(e) {
        let activeTab = e.currentTarget.dataset.index || 0;
        this.setData({
            activeTab
        })
    },
    onLoad: function (data) {
        this.setData({
            paddingTop: NAV_DATA.status + NAV_DATA.height + "px"
        })
        let { id } = data;
        //标题
        app.globalData.SET_TITLE("英雄详情");
        this.getData(id || 105);
    },
    getData(ename) {
        let that = this;
        // url, data, success_msg, err_msg, callBack, completeFunc
        helper.HttpGet('/timi/hero', { ename }, "", "页面数据获取失败", (data) => {
            let info = data
            //callBack
            let ht = that.data.type_data.find((item) => item.key == info.hero_type);
            let hero_type = "";
            if (ht) {
                hero_type = ht.text;
            }
            let hero_type2 = info.hero_type2;
            if (hero_type2 && hero_type2 > 0) {
                ht = that.data.type_data.find((item) => item.key == hero_type2);
                if (ht) {
                    hero_type += "/" + ht.text;
                }
            }
            that.setData({
                info,
                hero_type,
                strategy: {
                    recommended_arms: info.recommended_arms,//推荐出装
                    recommended_ming: info.recommended_ming,//推荐铭文
                    master_skill: info.master_skill,//推荐召唤师技能
                    skill_recommended: info.skill_recommended//推荐加点
                },
                skill: info.skill,
                relation: info.relation
            });
            //皮肤
            let skin_list = []
            for (let i = 0; i < info.skin_list.length; i++) {
                skin_list.push(info.skin_list[i].data[1]);
            }
            that.setData({
                skin_list
            });
        }, () => {
            //completeFunc
            that.setData({
                animated: false,
                loading: false
            });
        });
    },
    story() {
        //查看故事
        let url = `../story/story?ename=${this.data.info.ename}&cname=${this.data.info.cname}`
        console.log("url -", url);
        wx.navigateTo({
            url, fail(err) {
                helper.showToast("跳转错误", "error")
                console.error(err);
            }
        });
    },
    skin() {
        if (this.data.skin_list.length < 1) {
            wx.hideToast();
            wx.showToast({
                title: "这英雄没有皮肤？",
                icon: 'error',
                duration: 2000
            });
            return;
        }
        wx.previewImage({
            current: this.data.skin_list[0], // 当前显示图片的http链接
            urls: this.data.skin_list // 需要预览的图片http链接列表
        });
    }
})