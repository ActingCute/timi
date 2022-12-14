/**
 * Created by 张辉 2021/03/18 21:17:09
 * timi 路由
 */

const baseController = require('../controllers/helper/index');
const Data = require("../config/code");
const Code = Data.Code;
const Msg = Data.Msg;
const indexController = require("../controllers/index");
const record = require("../controllers/record/data")

module.exports = {
    index: (req, res, next) => { //英雄列表数据接口
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, DATA.HERO, res);
        }, res)
    },
    arms: (req, res, next) => { //局内道具接口
        baseController.DoFunc(() => {
            let item_id = req.query.item_id || 0;
            if (!item_id) {
                baseController.Result(Code.MissingParameter, Msg.MissingParameter, {}, res);
                return;
            }
            let item = DATA.ARMS.find(item => item.item_id == Number(item_id)) || "";
            if (!item) {
                baseController.Result(Code.Nothingness, Msg.Nothingness, {}, res);
                return;
            }
            baseController.Result(Code.Success, Msg.Success, item, res);
        }, res)
    },
    summoner: (req, res, next) => { //召唤师技能接口
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, DATA.SUMMONER, res);
        }, res)
    },
    freehero: (req, res, next) => { //周限免英雄
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, DATA.FREE_HERO, res);
        }, res)
    },
    novicehero: (req, res, next) => { //新手推荐英雄
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, DATA.NOVICE_HERO, res);
        }, res)
    },
    story: (req, res, next) => { //英雄故事
        baseController.DoFunc(() => {
            let ename = req.query.ename || 0;
            if (!ename) {
                baseController.Result(Code.MissingParameter, Msg.MissingParameter, {}, res);
                return;
            }
            let story = DATA.HERO_STORY.find(item => item.ename == Number(ename)) || "";
            if (!story) {
                baseController.Result(Code.Nothingness, Msg.Nothingness, {}, res);
                return;
            }
            baseController.Result(Code.Success, Msg.Success, story, res);
        }, res)
    },
    hero: (req, res, next) => { //英雄数据
        baseController.DoFunc(() => {
            let ename = req.query.ename || 0;
            if (!ename) {
                baseController.Result(Code.MissingParameter, Msg.MissingParameter, {}, res);
                return;
            }
            let hero = DATA.HERO.find(item => item.ename == Number(ename)) || "";
            if (!hero) {
                baseController.Result(Code.Nothingness, Msg.Nothingness, {}, res);
                return;
            }
            baseController.Result(Code.Success, Msg.Success, hero, res);
        }, res)
    },
    announcement: (req, res, next) => { //新闻 公告 活动数据
        baseController.DoFunc(() => {
            let id = req.query.id || 0;
            let data;
            if (id) {
                data = DATA.ANNOUNCEMENT.find(item => item.data.iNewsId == id) || "";
                if (!data) {
                    baseController.Result(Code.Nothingness, Msg.Nothingness, "嘤嘤没有数据啊~", res);
                    return;
                }
            } else {
                data = DATA.ANNOUNCEMENT;
            }
            baseController.Result(Code.Success, Msg.Success, data, res);
        }, res)
    },
    strategy: (req, res, next) => { //游戏攻略
        baseController.DoFunc(() => {
            let id = req.query.id || 0;
            let data;
            if (id) {
                data = DATA.STRATEGY.find(item => item.iId == id) || "";
                if (!data) {
                    baseController.Result(Code.Nothingness, Msg.Nothingness, "嘤嘤没有数据啊~", res);
                    return;
                }
            } else {
                data = DATA.STRATEGY;
            }
            baseController.Result(Code.Success, Msg.Success, data, res);
        }, res)
    },
    home: (req, res, next) => { //主页数据
        baseController.DoFunc(() => {
            indexController.initHomeData();
            baseController.Result(Code.Success, Msg.Success, DATA.SHOW_LIST.home, res);
        }, res)
    },
    herolist: (req, res, next) => { //小程序英雄列表数据
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, DATA.SHOW_LIST.hero_list, res);
        }, res)
    },
    armslist: (req, res, next) => { //小程序装备列表数据
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, DATA.SHOW_LIST.arms_list, res);
        }, res)
    },
    recordInit: (req, res, next) => { //召唤师技能接口
        baseController.DoFunc(async () => {
            if (!req.hostname) {
                baseController.Result(Code.Fail, "缺失host", null, res);
                return
            }
            if (!req.body || !req.body.cookie) {
                baseController.Result(Code.Fail, "缺失cookie", null, res);
                return
            }
            const data = await record.init(req.hostname, req.body.cookie)
            baseController.Result(Code.Success, data.err ? Msg.Fail : (data.msg || Msg.Success), data, res);
        }, res)
    },
    recordLogin: (req, res, next) => { //召唤师技能接口
        baseController.DoFunc(async () => {
            if (!req.hostname) {
                baseController.Result(Code.Fail, "缺失host", null, res);
                return
            }
            if (!req.body || !req.body.loginType) {
                baseController.Result(Code.Fail, "缺失loginType", null, res);
                return
            }
            if (!req.body || !req.body.code) {
                baseController.Result(Code.Fail, "缺失code", null, res);
                return
            }
            if (!req.body || !req.body.equipment) {
                baseController.Result(Code.Fail, "缺失equipment", null, res);
                return
            }
            const data = await record.getCode(req.body.loginType, req.body.equipment, req.body.code, req.hostname)
            baseController.Result(Code.Success, data.err ? Msg.Fail : (data.msg || Msg.Success), data, res);
        }, res)
    },
    recordData: (req, res, next) => { //召唤师技能接口
        baseController.DoFunc(async () => {
            console.log(req.query);
            if (!req.hostname) {
                baseController.Result(Code.Fail, "缺失host", null, res);
                return
            }
            if ((!req.query || !req.query.start) && (req.query && parseInt(req.query.start) != 0)) {
                baseController.Result(Code.Fail, "缺失start", null, res);
                return
            }
            if (!req.query || !req.query.limit) {
                baseController.Result(Code.Fail, "缺失limit", null, res);
                return
            }
            const data = await record.getRecord(req.hostname, false, parseInt(req.query.start), parseInt(req.query.limit))
            baseController.Result(Code.Success, data.err ? Msg.Fail : (data.msg || Msg.Success), data, res);
        }, res)
    },
    recordUserData: (req, res, next) => { //召唤师技能接口
        baseController.DoFunc(async () => {
            if (!req.hostname) {
                baseController.Result(Code.Fail, "缺失host", null, res);
                return
            }
            const data = await record.getUserInfoData(req.hostname)
            baseController.Result(Code.Success, data.err ? Msg.Fail : (data.msg || Msg.Success), data, res);
        }, res)
    },
    exportData: (req, res, next) => { //召唤师技能接口
        baseController.DoFunc(async () => {
            if (!req.hostname) {
                baseController.Result(Code.Fail, "缺失host", null, res);
                return
            }
            const data = await record.exportData(req.hostname)
            baseController.Result(Code.Success, data.err ? Msg.Fail : (data.msg || Msg.Success), data, res);
        }, res)
    },
    inputData: (req, res, next) => { //召唤师技能接口
        baseController.DoFunc(async () => {
            if (!req.hostname) {
                baseController.Result(Code.Fail, "缺失host", null, res);
                return
            }
            if (!req.body) {
                baseController.Result(Code.Fail, "缺失body", null, res);
                return
            }
            const data = await record.inputData(req.hostname, req.body)
            baseController.Result(Code.Success, data.err ? Msg.Fail : (data.msg || Msg.Success), data, res);
        }, res)
    },
    getRole: (req, res, next) => { //召唤师技能接口
        baseController.DoFunc(async () => {
            if (!req.hostname) {
                baseController.Result(Code.Fail, "缺失host", null, res);
                return
            }
            if (!req.query.type) {
                baseController.Result(Code.Fail, "缺失 type", null, res);
                return
            }
            const data = await record.getRole(req.query.type)
            baseController.Result(Code.Success, data.err ? Msg.Fail : (data.msg || Msg.Success), data, res);
        }, res)
    },
}