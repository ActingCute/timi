/**
 * Created by 张辉 2021/03/20 16:10:09
 * timi 初始化一些数据
 */

const config = require("../config/databases");
const baseController = require("./helper/index");
let timi = config.timi;

//初始化小程序首页数据
let initHomeData = (olny_update_carousel) => {
    //随机轮播图
    let carousel = { desc: "轮播图", data: [] };
    let keys = baseController.RandomNums(timi.CarouselNumber || 3, 0, DATA.HERO.length - 1);
    keys.forEach(key => {
        let h_keys = baseController.RandomNums(1, 0, DATA.HERO[key].skin_list.length - 1) || 0;
        carousel.data.push({ ename: DATA.HERO[key].ename, pic: DATA.HERO[key].skin_list[h_keys] })
    });

    if (olny_update_carousel) return;//只更新随机轮播图

    //新闻 公告 数据
    let announcement = { desc: "新闻公告", data: [] };
    let ai = DATA.ANNOUNCEMENT.length > 2 ? 3 : DATA.ANNOUNCEMENT.length;
    for (let i = 0; i < ai; i++) {
        announcement.data.push({ id: DATA.ANNOUNCEMENT[i].data.iNewsId, title: DATA.ANNOUNCEMENT[i].data.sTitle, type: DATA.ANNOUNCEMENT[i].desc, time: DATA.ANNOUNCEMENT[i].data.sIdxTime });
    }

    //周免英雄
    let free_hero = { desc: "周免英雄", data: [] };
    let free_hero_num = timi.FreeHero || 4;
    free_hero_num = free_hero_num < 0 ? 4 : free_hero_num;
    free_hero_num = free_hero_num > 7 ? 4 : free_hero_num;

    for (let i = 0; i < free_hero_num; i++) {
        free_hero.data.push({ cname: DATA.FREE_HERO[i].cname, ename: DATA.FREE_HERO[i].ename, cover: DATA.FREE_HERO[i].cover });
    }

    //攻略
    let strategy = { desc: "攻略", data: [] };
    let si = DATA.STRATEGY.length > 3 ? 4 : DATA.STRATEGY.length;
    for (let i = 0; i < si; i++) {
        strategy.data.push({ id: DATA.STRATEGY[i].iId, title: DATA.STRATEGY[i].sTitle, type: "攻略", time: DATA.STRATEGY[i].sIdxTime, cover: DATA.STRATEGY[i].sIMG });
    }
    DATA.SHOW_LIST.home = { carousel, announcement, free_hero, strategy };
}

//初始化小程序英雄列表页面数据
let initHeroListData = () => {
    DATA.SHOW_LIST.hero_list = []
    DATA.HERO.forEach(ele => {
        let { cname, cover, ename, hero_type } = ele;
        DATA.SHOW_LIST.hero_list.push({ id: ename, cover, name: cname, type: hero_type });
    })
}

//初始化小程序装备列表页面数据
let initArmsListData = () => {
    DATA.SHOW_LIST.arms_list = []
    DATA.ARMS.forEach(ele => {
        let { item_id, cover, item_name, item_type } = ele;
        DATA.SHOW_LIST.arms_list.push({ id: item_id, cover, name: item_name, type: item_type });
    })
}

module.exports = {
    initData: () => {
        initHomeData(false);
        initHeroListData();
        initArmsListData();
    },
    initHomeData: () => {
        initHomeData(true);
    }
}