/**
 * Created by 张辉 2021/03/13 11:10:09
 * timi 逻辑
 */
//引入外部包
const redis = require('./helper/redis');
const heroList = require('./hero/list');
const heroInfo = require('./hero/info');
const heroWallpaper = require('./hero/skin');
const arms = require('./props/arms');
const summoner = require('./props/summoner');
const ming = require('./props/ming');
const baseController = require('./helper/index');
const Data = require("../config/code");
const Code = Data.Code;
const Msg = Data.Msg;
const TIMI_DATA = "TIMI_DATA";

//初始化
(async () => {

    try {
        //清空缓存
        //redis.set(TIMI_DATA, "");
        //判断缓存数据是否存在
        let timi_data = await redis.get(TIMI_DATA) || "";
        if (timi_data) {
            //存在缓存数据
            log.info("存在缓存数据！");
            let { HERO, ARMS, SUMMONER, MING } = JSON.parse(timi_data);
            global.HERO = HERO; //英雄数据
            global.ARMS = ARMS; //装备
            global.SUMMONER = SUMMONER;//召唤师技能
            global.MING = MING;//铭文
            return;
        }
        log.info("缓存数据不存在！");
        //爬取数据
        await arms.getData();//局内装备
        await ming.getData();//铭文
        await heroList.getData(); //爬取英雄列表数据
        await heroInfo.getData(); //爬取英雄详情，如技能数据
        await heroWallpaper.getData();//英雄皮肤
        await summoner.getData();//召唤师技能
        log.debug("QINIU_DATA len:", QINIU_DATA.length);
        log.debug("LOCAL_DATA len:", LOCAL_DATA.length);
        await baseController.DownloadFile(LOCAL_DATA.length - 1, LOCAL_DATA);
        baseController.UploadQiniu(QINIU_DATA.length - 1, QINIU_DATA);
        //将数据缓存起来
        redis.set(TIMI_DATA, JSON.stringify({ HERO, ARMS, SUMMONER, MING }));
        log.info("数据已存入redis");
    } catch (err) {
        log.error(err);
    }

})();

module.exports = {
    get_index: (req, res) => { //英雄列表数据接口
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, HERO, res);
        }, res)
    },
    get_arms: (req, res) => { //局内道具接口
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, ARMS, res);
        }, res)
    },
    get_summoner: (req, res) => { //召唤师技能接口
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, SUMMONER, res);
        }, res)
    }
}