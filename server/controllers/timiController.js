/**
 * Created by 张辉 2021/03/13 11:10:09
 * timi 逻辑
 */
//引入外部包
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

(async () => {
    await arms.getData();//局内装备
    await ming.getData();//铭文
    await heroList.getData(); //爬取英雄列表数据
    await heroInfo.getData(); //爬取英雄详情，如技能数据
    await heroWallpaper.getData();//英雄皮肤
    await summoner.getData();//召唤师技能
    log.debug("QINIU_DATA len:", QINIU_DATA.length);
    log.debug("LOCAL_DATA len:", LOCAL_DATA.length);
    let msg = await baseController.DownloadFile(LOCAL_DATA.length - 1, LOCAL_DATA);
    log.info("下载图片到本地：", msg);
    baseController.UploadQiniu(QINIU_DATA.length - 1, QINIU_DATA)
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