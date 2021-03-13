/**
 * Created by 张辉 2021/03/13 11:10:09
 * 将爬取的英雄技能数据组装
 */

const cheerio = require('cheerio');
const cheerioFunc = require('./cheerio');
const iconv = require('iconv-lite');
const fs = require("fs");
var path = require("path");
const baseController = require("./base");
const dbConfig = require("../config/databases");
const qn = require("./qiniu");

let hero_info = [];

module.exports = {
    data: hero_info,
    getData: function () {
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

                                if (!fs.existsSync(filePath)) {
                                    await qn.toQiniu(pic_src, pic_name, skill_pic_dir + "/" + hero_skill_dir);
                                    await baseController.DownloadFile(pic_src, hero[index].skill[i].name + ".png", skill_pic_dir + "/" + hero_skill_dir);
                                }
                            }
                        })(element, index)
                    })(element, index)

                })(element, index)
            })(element, index)
        })
    }
}