/**
 * Created by 张辉 2021/03/12 10:16:04
 * 控制器的一些公共函数
 */

//外部包
const fs = require("fs");
const path = require("path");
const http = require("http");
const qn = require("./qiniu");
//引入配置
const Data = require("../config/code");
const MsgCode = Data.Code;

//格式化时间
Date.prototype.Format = (fmt) => {
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
let Result = (Code, Msg, Data, res) => {
    res.send({
        Code,
        Msg,
        Data
    });
}

//判断文件夹不存在就创建
let Mkdir = (async (reaPath) => {
    reaPath = path.resolve(reaPath);
    if (!fs.existsSync(reaPath)) {
        fs.mkdir(reaPath, { recursive: true }, (err) => {
            if (err) log.error(err)
        });
    }
})

//下载文件
let UploadQiniu = (index, data) => {
    if (data.length > 0) log.info("上传图片到七牛云：", data.length - index - 1 + "/" + data.length, Math.ceil((data.length - 1 - index) / data.length * 100) + "%");
    if (index > -1) {
        let { pic_src, qiniu_path, local_path } = data[index--];
        qn.toQiniu(pic_src, qiniu_path, local_path).then(res => {
            UploadQiniu(index, data);
        })
    }
}
//暴露函数
module.exports = {
    UploadQiniu: (index, data) => {
        UploadQiniu(index, data);
    },
    //下载图片到本地
    DownloadFile: async (url, name, pic_dir) => {
        return new Promise(async (resolve, reject) => {
            await Mkdir(pic_dir);
            const mypath = path.resolve(pic_dir, name);

            http.request(url)
                .on('response', function (res) {
                    if (!~[200, 304].indexOf(res.statusCode)) {
                        reject(new Error('Received an invalid status code.'));
                    } else if (!res.headers['content-type'].match(/image/)) {
                        reject(new Error('Not an image.'));
                    } else {
                        var body = ''
                        res.setEncoding('binary')
                        res
                            .on('error', function (err) {
                                reject(err);
                            })
                            .on('data', function (chunk) {
                                body += chunk
                            })
                            .on('end', function () {
                                // What about Windows?!
                                fs.writeFile(mypath, body, 'binary', function (err) {

                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve("ok");
                                    }
                                })
                            })
                    }
                })
                .on('error', function (err) {
                    reject(err);
                })
                .end();
        }).catch(err => {
            log.error(err);
        })
    },

    //消息结构体
    Result,
    DoFunc: (func, res) => {
        try {
            func();
        } catch (err) {
            console.error(err);
            Result(MsgCode.Fail, "出问题了～", err, res);
        }
    },
    //创建文件
    Mkdir
};
