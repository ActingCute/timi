//捉取英雄列表
const cheerio = require('cheerio');
const cheerioFunc = require('./cheerio');
const iconv = require('iconv-lite');
const fs = require("fs");
var path = require("path");
const baseController = require("./base");
const dbConfig = require("../config/databases");
const qn = require("./qiniu");
const pic_dir = "public"

let lis;
let HEARO = [];
const webUrl = "https://pvp.qq.com/web201605/herolist.shtml";

(async () => {
    let homeBody = await cheerioFunc.handleRequestByPromise({ url: webUrl });
    homeBody = iconv.decode(homeBody, "GBK"); //进行gbk解码
    let $ = cheerio.load(homeBody);
    lis = $(".herolist li");
    for (let i = 0; i < lis.length; i++) {
        HEARO[i] = {};
        HEARO[i].name = lis.eq(i).find("a").text()
        HEARO[i].link = "https://pvp.qq.com/web201605/" + lis.eq(i).find("a").attr("href")
        //捉取图片到本地
        const pic_name = "hearo/" + HEARO[i].name + ".png"
        let covor = dbConfig.qiniu.Dns + pic_name;
        const pic_src = "http:" + lis.eq(i).find("a").find("img").attr("src")
        HEARO[i].cover = covor;

        const filePath = path.resolve(pic_dir, pic_name);
        if (!fs.existsSync(filePath)) {
            qn.toQiniu(pic_src, pic_name);
            baseController.DownloadFile(pic_src, pic_name, pic_dir);
        }
    }
})()

module.exports = {
    data: HEARO
}