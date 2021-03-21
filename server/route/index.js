
/**
 * Created by 张辉 2021/03/18 21:17:09
 * timi 路由 下横线前是请求方式，后是api名字
 */

const baseController = require('../controllers/helper/index');
const Data = require("../config/code");
const Code = Data.Code;
const Msg = Data.Msg;

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
    },
    get_freehero: (req, res) => { //周限免英雄
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, FREE_HERO, res);
        }, res)
    },
    get_novicehero: (req, res) => { //新手推荐英雄
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, NOVICE_HERO, res);
        }, res)
    },
    get_story: (req, res) => { //英雄故事
        baseController.DoFunc(() => {
            let ename = req.query.ename || 0;
            if (!ename) {
                baseController.Result(Code.MissingParameter, Msg.MissingParameter, {}, res);
                return;
            }
            let story = HERO_STORY.find(item => item.ename == Number(ename)) || "";
            if (!story) {
                baseController.Result(Code.Nothingness, Msg.Nothingness, {}, res);
                return;
            }
            baseController.Result(Code.Success, Msg.Success, story, res);
        }, res)
    },
    get_hero: (req, res) => { //英雄数据
        baseController.DoFunc(() => {
            let ename = req.query.ename || 0;
            if (!ename) {
                baseController.Result(Code.MissingParameter, Msg.MissingParameter, {}, res);
                return;
            }
            let hero = HERO.find(item => item.ename == Number(ename)) || "";
            if (!hero) {
                baseController.Result(Code.Nothingness, Msg.Nothingness, {}, res);
                return;
            }
            baseController.Result(Code.Success, Msg.Success, hero, res);
        }, res)
    },
    get_announcement: (req, res) => { //新闻 公告 活动数据
        baseController.DoFunc(() => {
            let id = req.query.id || 0;
            let data;
            if (id) {
                data = ANNOUNCEMENT.find(item => item.data.iNewsId == id) || "";
                if (!data) {
                    baseController.Result(Code.Nothingness, Msg.Nothingness, "嘤嘤没有数据啊~", res);
                    return;
                }
            } else {
                data = ANNOUNCEMENT;
            }
            baseController.Result(Code.Success, Msg.Success, data, res);
        }, res)
    },
    get_strategy: (req, res) => { //新闻 公告 活动数据
        baseController.DoFunc(() => {
            let id = req.query.id || 0;
            let data;
            if (id) {
                data = STRATEGY.find(item => item.iNewsId == id) || "";
                if (!data) {
                    baseController.Result(Code.Nothingness, Msg.Nothingness, "嘤嘤没有数据啊~", res);
                    return;
                }
            } else {
                data = STRATEGY;
            }
            baseController.Result(Code.Success, Msg.Success, data, res);
        }, res)
    },
    get_home: (req, res) => { //主页数据
        baseController.DoFunc(() => {
            baseController.Result(Code.Success, Msg.Success, SHOW_LIST.home, res);
        }, res)
    },
}