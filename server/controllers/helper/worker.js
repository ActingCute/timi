let { expose } = require("threads/worker")
const baseController = require("../helper/index");
const qiniuController = require("./qiniu");

expose({
    DownloadFile: (url, name, pic_dir) => {
        baseController.DownloadFile(url, name, pic_dir)
    },
    UploadQiniu: (url, pic_name, pic_src) => {
        qiniuController.toQiniu(url, pic_name, pic_src);
    }
})