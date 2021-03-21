/**
 * Created by 张辉 2021/03/20 16:10:09
 * timi 初始化一些数据
 */

const config = require("../config/databases");
const baseController = require("../controllers/helper/index");
let timi = config.timi;

let initHomeData = () => {
    //随机轮播图
    let carousel = { desc: "轮播图", data: [] };
    let keys = baseController.RandomNums(timi.CarouselNumber || 3, 0, HERO.length - 1);
    keys.forEach(key => {
        let h_keys = baseController.RandomNums(1, 0, HERO[key].skin_list.length - 1) || 0;
        carousel.data.push({ ename: HERO[key].ename, pic: HERO[key].skin_list[h_keys] })
    });

    //新闻 公告 数据
    let announcement = { desc: "新闻公告", data: [] };
    let ai = ANNOUNCEMENT.length > 2 ? 3 : ANNOUNCEMENT.length;
    for (let i = 0; i < ai; i++) {
        announcement.data.push({ title: ANNOUNCEMENT[i].data.sTitle, type: ANNOUNCEMENT[i].desc, time: ANNOUNCEMENT[i].data.sIdxTime });
    }

    //周免英雄
    let free_hero = { desc: "周免英雄", data: [] };
    let free_hero_num = timi.FreeHero || 4;
    free_hero_num = free_hero_num < 0 ? 4 : free_hero_num;
    free_hero_num = free_hero_num > 7 ? 4 : free_hero_num;

    for (let i = 0; i < free_hero_num; i++) {
        free_hero.data.push({ cname: FREE_HERO[i].cname, ename: FREE_HERO[i].ename, cover: FREE_HERO[i].cover });
    }

    //攻略
    let strategy = { desc: "攻略", data: [] };
    let si = STRATEGY.length > 3 ? 4 : STRATEGY.length;
    for (let i = 0; i < si; i++) {
        strategy.data.push({ title: STRATEGY[i].sTitle, type: "攻略", time: STRATEGY[i].sIdxTime, cover: STRATEGY[i].sIMG });
    }

    SHOW_LIST.home = { carousel, announcement, free_hero, strategy };
}

module.exports = {
    initData: () => {
        initHomeData();
    }
}