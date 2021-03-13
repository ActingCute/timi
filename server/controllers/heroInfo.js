//捉取英雄信息
const cheerio = require('cheerio');
const cheerioFunc = require('./cheerio');
const iconv = require('iconv-lite');
const fs = require("fs");
var path = require("path");
const baseController = require("./base");
const dbConfig = require("../config/databases");
const qn = require("./qiniu");

let lis;
let hero_info = [];

module.exports = {
    data: hero_info,
    getData: function (hero) {
        let skill_pic_dir = "public/hero"
        hero.forEach(async (element, index) => {
            hero[index].skill = [];
            (await function (element, index) {
                (async (element, index) => {
                    let homeBody = await cheerioFunc.handleRequestByPromise({ url: element.link });
                    homeBody = iconv.decode(homeBody, "GBK"); //进行gbk解码
                    let $ = cheerio.load(homeBody);
                    //获取英雄技能
                    let lis = $(".show-list");
                    let lis_pic = $(".skill-u1 li");

                    for (let i = 0; i < lis.length; i++) {
                        let skill_name_desc = lis.eq(i).find(".skill-name");
                        let name = skill_name_desc.find("b").text();
                        if (name) {
                            hero[index].skill[i] = {};
                            hero[index].skill[i].name = skill_name_desc.find("b").text(); //技能名称
                            let cds = skill_name_desc.find("span");
                            hero[index].skill[i].cd = "";
                            for (let ei = 0; ei < cds.length; ei++)hero[index].skill[i].cd += cds.eq(ei).text() + " ";//技能冷却消耗
                            hero[index].skill[i].desc = lis.eq(i).find(".skill-desc").text();//技能描述
                        }
                    }
                    (await function (element, index) {
                        (async (element, index) => {
                            for (let i = 0; i < lis_pic.length - 1; i++) {
                                let skill_src = lis_pic.eq(i).find("img").attr("src");
                                //log.info(skill_src);
                                const pic_src = "http:" + skill_src

                                if (pic_src.indexOf("#") != -1 || !skill_src) continue;

                                //捉取技能图片到本地和七牛云
                                let hero_skill_dir = hero[index].name + "/skill/";
                                await baseController.mkdir(skill_pic_dir + "/" + hero_skill_dir);
                                const pic_name = hero[index].name + "/skill/" + hero[index].skill[i].name + ".png"
                                let covor = dbConfig.qiniu.Dns + pic_name;
                                hero[index].skill[i].covor = covor;
                                const filePath = path.resolve(skill_pic_dir + "/" + hero_skill_dir, hero[index].skill[i].name + ".png");
                                log.debug(pic_src, hero[index].skill[i].name + ".png", skill_pic_dir + "/" + hero_skill_dir);

                                if (!fs.existsSync(filePath)) {
                                    console.log(pic_src)
                                    await qn.toQiniu(pic_src, pic_name, skill_pic_dir + "/" + hero_skill_dir);
                                    await baseController.DownloadFile(pic_src, hero[index].skill[i].name + ".png", skill_pic_dir + "/" + hero_skill_dir);
                                }

                                //log.debug(hero[index].skill[i]);
                            }
                        })(element, index)
                    })(element, index)



                    //log.debug(hero);
                    // for (let i = 0; i < lis.length; i++) {
                    //     hero_info[i] = {};
                    //     hero_info[i].name = lis.eq(i).find("a").text()
                    //     hero_info[i].link = "https://pvp.qq.com/web201605/" + lis.eq(i).find("a").attr("href")
                    //     //捉取图片到本地
                    //     const pic_name = "hero/" + hero_info[i].name + ".png"
                    //     let covor = dbConfig.qiniu.Dns + pic_name;
                    //     const pic_src = "http:" + lis.eq(i).find("a").find("img").attr("src")
                    //     hero_info[i].cover = covor;

                    //     const filePath = path.resolve(pic_dir, pic_name);
                    //     if (!fs.existsSync(filePath)) {
                    //         qn.toQiniu(pic_src, pic_name);
                    //         baseController.DownloadFile(pic_src, pic_name, pic_dir);
                    //     }
                })(element, index)
            })(element, index)
        })
    }
}