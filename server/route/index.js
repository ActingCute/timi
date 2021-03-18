
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
    }
}