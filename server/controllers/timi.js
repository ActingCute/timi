/**
 * Created by 张辉 2021/03/13 11:10:09
 * timi 启动时候捉包的逻辑
 */

//引入外部包
const redis = require('./helper/redis');
const heroList = require('./hero/list');
const heroInfo = require('./hero/info');
const heroWallpaper = require('./hero/skin');
const arms = require('./props/arms');
const summoner = require('./props/summoner');
const ming = require('./props/ming');
const announcement = require('./other/announcement');
const strategy = require('./other/strategy');
const baseController = require('./helper/index');

const indexController = require("./index");

const TIMI_DATA = "TIMI_DATA";

//初始化
let init = async (need_clean) => {
    try {
        QINIU_DATA = [];
        LOCAL_DATA = [];
        //清空缓存
        if (need_clean) redis.set(TIMI_DATA, "");
        //判断缓存数据是否存在
        let timi_data = await redis.get(TIMI_DATA) || "";
        if (timi_data) {
            //存在缓存数据
            log.info("存在缓存数据！");
            let { HERO, ARMS, SUMMONER, MING, NOVICE_HERO, FREE_HERO, HERO_STORY, ANNOUNCEMENT, STRATEGY } = JSON.parse(timi_data);
            global.HERO = HERO; //英雄数据
            global.ARMS = ARMS; //装备
            global.SUMMONER = SUMMONER; //召唤师技能
            global.MING = MING; //铭文
            global.NOVICE_HERO = NOVICE_HERO; //新手推荐英雄
            global.FREE_HERO = FREE_HERO; //周限免英雄
            global.HERO_STORY = HERO_STORY; //英雄故事
            global.ANNOUNCEMENT = ANNOUNCEMENT; //新闻公告
            global.STRATEGY = STRATEGY;
            global.DATA = { HERO, ARMS, SUMMONER, MING, NOVICE_HERO, FREE_HERO, HERO_STORY, ANNOUNCEMENT, STRATEGY, SHOW_LIST: {} };
            //初始化数据
            indexController.initData();
            return;
        }
        if (need_clean) {
            log.info("更新缓存：", new Date());
        } else {
            log.info("缓存数据不存在！");
        }

        //爬取数据
        await arms.getData(); //局内装备
        await ming.getData(); //铭文
        await heroList.getData(); //爬取英雄列表数据
        await heroInfo.getData(); //爬取英雄详情，如技能数据
        await heroWallpaper.getData(); //英雄皮肤
        await summoner.getData(); //召唤师技能
        await announcement.getData(); //新闻 公告 
        await strategy.getData(); //攻略

        heroList.getNoviceFreeHeroData(); //获取周限免英雄和新手推荐英雄
        log.debug("QINIU_DATA len:", QINIU_DATA.length);
        log.debug("LOCAL_DATA len:", LOCAL_DATA.length);
        await baseController.DownloadFile(LOCAL_DATA.length - 1, LOCAL_DATA);
        baseController.UploadQiniu(QINIU_DATA.length - 1, QINIU_DATA);
        //将数据缓存起来
        redis.set(TIMI_DATA, JSON.stringify({ HERO, ARMS, SUMMONER, MING, NOVICE_HERO, FREE_HERO, HERO_STORY, ANNOUNCEMENT, STRATEGY }));
        log.info("数据已存入redis");

        //初始化数据
        global.DATA = { HERO, ARMS, SUMMONER, MING, NOVICE_HERO, FREE_HERO, HERO_STORY, ANNOUNCEMENT, STRATEGY, SHOW_LIST: {} };
        indexController.initData();
    } catch (err) {
        log.error(err);
    }

}

module.exports = { init }