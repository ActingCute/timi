/**
 * Created by 张辉 2021/03/17 11:10:09
 * 七牛的分片上传，断点续传
 */
const md5 = require('js-md5');
const qiniu = require("qiniu");
const qiniuController = require("./qiniu");
const path = require("path");
const fs = require("fs");
var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;
// 是否使用https域名
//config.useHttpsDomain = true;
// 上传是否使用cdn加速
//config.useCdnDomain = true;
module.exports = {
    putFile: async (localPath, fname, key) => {
        return new Promise(async (resolve, reject) => {

            const localFile = path.resolve(localPath, fname);
            if (!await fs.existsSync(localFile)) {
                log.error(`上传七牛云：${fname} 不存在`);
                resolve("error");
                return;
            }
            var resumeUploader = new qiniu.resume_up.ResumeUploader(config);
            var putExtra = new qiniu.resume_up.PutExtra();
            // 扩展参数
            // putExtra.params = {
            //     "x:name": "",
            //     "x:age": 27,
            // }
            putExtra.fname = fname;
            // 如果指定了断点记录文件，那么下次会从指定的该文件尝试读取上次上传的进度，以实现断点续传
            putExtra.resumeRecordFile = `log/qiniu/${md5(key + fname)}-progress.log`;

            let uploadToken = qiniuController.WebToken(fname)

            // 文件分片上传
            resumeUploader.putFile(uploadToken, key, localFile, putExtra, (respErr,
                respBody, respInfo) => {
                if (respErr) {
                    log.error(respErr);
                    resolve("error");
                    return;
                }
                if (respInfo.statusCode != 200) {
                    resolve("error");
                } else {
                    resolve("ok");
                }
            });
        }).catch(err => {
            log.error(err);
        });
    }
}