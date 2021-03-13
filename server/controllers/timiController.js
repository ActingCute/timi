/**
 * Created by 张辉 2021/03/13 11:10:09
 * timi 逻辑
 */
//引入外部包
const heroList = require('./heroList');
const baseController = require('./base');
const Data = require("../config/code");
const Code = Data.Code
const Msg = Data.Msg

module.exports = {
    get_index: function (req, res) {
        baseController.DoFunc(function () {
            baseController.Result(Code.Success, Msg.Success, hero, res);
        }, res)
    }
}