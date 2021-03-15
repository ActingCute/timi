let { expose } = require("threads/worker")
const baseController = require("../helper/index");
const qiniuController = require("./qiniu");

expose({
    DownloadFile: function (url, name, pic_dir) {
        baseController.DownloadFile(url, name, pic_dir)
    },
    UploadQiniu: function (url, pic_name, pic_src) {
        qiniuController.toQiniu(url, pic_name, pic_src);
    }
})