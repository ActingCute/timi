/**
 * Created by 张辉 2021/03/12 10:16:04
 * 控制器的一些公共函数
 */

//外部包
const fs = require("fs");
const path = require("path");
const axios = require("axios");
//引入配置
const Data = require("../config/code");
const MsgCode = Data.Code;

//格式化时间
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
};

//返回消息结构体
function Result(Code, Msg, Data, res) {
    res.send({
        Code,
        Msg,
        Data
    });
}



//暴露函数
module.exports = {
    Result: function (Code, Msg, Data, res) {
        Result(Code, Msg, Data, res);
    },
    DoFunc: function (func, res) {
        try {
            func();
        } catch (err) {
            console.error(err);
            Result(MsgCode.Fail, "出问题了～", err, res);
        }
    },
    mkdir: async function (reaPath) {
        if (!fs.existsSync(reaPath)) {
            fs.mkdirSync(reaPath);
        }
    },
    //下载文件
    DownloadFile: async function (url, name, pic_dir) {
        if (!fs.existsSync(pic_dir)) {
            fs.mkdirSync(pic_dir);
        }
        const mypath = path.resolve(pic_dir, name);
        const writer = fs.createWriteStream(mypath);
        const response = await axios({
            url,
            method: "GET",
            responseType: "stream"
        });
        response.data.pipe(writer);
        return new Promise(function (resolve, reject) {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    }
};
