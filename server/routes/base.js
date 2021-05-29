
/**
 * Created by 张辉 2021/03/18 21:17:09
 * timi 路由
 */

const baseController = require('../controllers/helper/index');
const Data = require("../config/code");
const Code = Data.Code;
const Msg = Data.Msg;
const indexController = require("../controllers/index");


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
                data = DATA.STRATEGY.find(item => item.iNewsId == id) || "";
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
}