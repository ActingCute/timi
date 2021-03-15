/**
 * Created by 张辉 2021/03/13 11:10:09
 * timi 逻辑
 */
//引入外部包
const heroList = require('./hero/list');
const heroInfo = require('./hero/info');
const heroWallpaper = require('./hero/skin');
const arms = require('./props/arms');
const baseController = require('./helper/index');
const Data = require("../config/code");
const Code = Data.Code;
const Msg = Data.Msg;

(async () => {
    let msg = await heroList.getData(); //爬取英雄列表数据
    log.debug("qiniu_data len1:", qiniu_data.length, msg);
    await heroInfo.getData(); //爬取英雄详情，如技能数据
    log.debug("qiniu_data len2:", qiniu_data.length);
    await heroWallpaper.getData();
    log.debug("qiniu_data len3:", qiniu_data.length);
    await arms.getData();
    log.debug("qiniu_data len4:", qiniu_data.length);
    baseController.UploadQiniu(qiniu_data.length - 1, qiniu_data)
})();

module.exports = {
    get_index: (req, res) => {
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, hero, res);
        }, res)
    }
}