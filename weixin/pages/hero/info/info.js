const app = getApp();
const globalData = app.globalData;
const { CODE, MSG, BASE_URL, NAV_DATA } = globalData;

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
        console.log("paddingTop -- ", this.data.paddingTop)
        let { id } = data;
        //标题
        app.globalData.SET_TITLE("英雄详情");
        this.getData(id || 105);
    },
    getData(ename) {
        let that = this;
        wx.request({
            url: BASE_URL + '/timi/hero',
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
                    let ht = that.data.type_data.find((item) => item.key == res.data.Data.hero_type);
                    let hero_type = "";
                    if (ht) {
                        hero_type = ht.text;
                    }
                    let hero_type2 = res.data.Data.hero_type2;
                    if (hero_type2 && hero_type2 > 0) {
                        ht = that.data.type_data.find((item) => item.key == hero_type2);
                        if (ht) {
                            hero_type += "/" + ht.text;
                        }
                    }
                    let info = res.data.Data
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
                } else {
                    wx.hideToast();
                    wx.showToast({
                        title: "获取失败",
                        icon: 'error',
                        duration: 2000
                    });
                }

            },
            fail(err) {
                console.error(err);
                wx.hideToast();
                wx.showToast({
                    title: err,
                    icon: 'error',
                    duration: 2000
                });
            }
        })
    },
    story() {
        //查看故事
        let url = `../story/story?ename=${this.data.info.ename}&cname=${this.data.info.cname}`
        console.log("url -", url);
        wx.navigateTo({
            url, fail(err) {
                wx.hideToast();
                wx.showToast({
                    title: "跳转错误",
                    icon: 'error',
                    duration: 2000
                });
                console.log(err);
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