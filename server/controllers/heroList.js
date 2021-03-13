//捉取英雄列表
const threads = require("./threads")
const cheerio = require('cheerio');
const cheerioFunc = require('./cheerio');
const iconv = require('iconv-lite');
const fs = require("fs");
var path = require("path");
const baseController = require("./base");
const dbConfig = require("../config/databases");
const qn = require("./qiniu");
const pic_dir = "public/hero"
const hi = require("./heroInfo")
let lis;
let hero = [];
const webUrl = "https://pvp.qq.com/web201605/herolist.shtml";

(async () => {
    let homeBody = await cheerioFunc.handleRequestByPromise({ url: webUrl });
    homeBody = iconv.decode(homeBody, "GBK"); //进行gbk解码
    let $ = cheerio.load(homeBody);
    lis = $(".herolist li");
    for (let i = 0; i < lis.length; i++) {
        hero[i] = {};
        hero[i].name = lis.eq(i).find("a").text()
        hero[i].link = "https://pvp.qq.com/web201605/" + lis.eq(i).find("a").attr("href")
        //捉取图片到本地和七牛云
        let hero_pic_dir = pic_dir + "/" + hero[i].name
        await baseController.mkdir(hero_pic_dir);
        const pic_name = "covor.png"
        let covor = dbConfig.qiniu.Dns + "hero/" + hero[i].name + "/" + pic_name;
        const pic_src = "http:" + lis.eq(i).find("a").find("img").attr("src")
        hero[i].cover = covor;
        const filePath = path.resolve(hero_pic_dir, pic_name);

        if (!fs.existsSync(filePath)) {
            //await threads.UploadQiniu(pic_src, "hero/" + hero[i].name + "/" + pic_name, hero_pic_dir);
            await qn.toQiniu(pic_src, "hero/" + hero[i].name + "/" + pic_name, hero_pic_dir);
            //await threads.DownloadFile(pic_src, pic_name, hero_pic_dir);
            await baseController.DownloadFile(pic_src, pic_name, hero_pic_dir);
        }
    }
    hi.getData(hero)
})()



module.exports = {
    data: hero
}