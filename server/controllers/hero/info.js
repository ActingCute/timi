/**
 * Created by 张辉 2021/03/13 11:10:09
 * 将爬取的英雄技能数据组装
 */

const cheerio = require('cheerio');
const cheerioFunc = require('../helper/cheerio');
const iconv = require('iconv-lite');
const fs = require("fs");
var path = require("path");
const baseController = require("../helper/index");
const dbConfig = require("../../config/databases");
let skill_pic_dir = "public/hero";

//英雄技能描述
let heroSkillDesc = async ($, index) => {
    let lis = $(".show-list");
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < lis.length; i++) {
            let skill_name_desc = lis.eq(i).find(".skill-name");
            let name = skill_name_desc.find("b").text();
            if (name) {
                HERO[index].skill[i] = {};
                HERO[index].skill[i].name = skill_name_desc.find("b").text(); //技能名称
                let cds = skill_name_desc.find("span");
                HERO[index].skill[i].cd = "";
                for (let ei = 0; ei < cds.length; ei++)HERO[index].skill[i].cd += cds.eq(ei).text() + " ";//技能冷却消耗
                HERO[index].skill[i].desc = lis.eq(i).find(".skill-desc").text();//技能描述
            }

            if (i == lis.length - 1) {
                resolve("heroSkillDesc ok");
            }
        }
    }).catch(err => {
        log.error(err);
    })
}

//英雄技能图片
let heroSkillImages = async ($, index) => {
    let lis_pic = $(".skill-u1 li");
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < lis_pic.length - 1; i++) {
            let skill_src = lis_pic.eq(i).find("img").attr("src");
            //log.info(skill_src);
            const pic_src = "http:" + skill_src

            if (pic_src.indexOf("#") != -1 || !skill_src) continue;

            let hero_skill_dir = HERO[index].cname + "/skill/";
            let pic_name = HERO[index].skill[i].name + ".png"; //图片名字
            let local_path = skill_pic_dir + "/" + hero_skill_dir;//本地存放的路径
            await baseController.Mkdir(local_path);
            const qiniu_path = "hero/" + hero_skill_dir + pic_name;//七牛路径
            let covor = dbConfig.qiniu.Dns + qiniu_path;
            HERO[index].skill[i].covor = covor;
            const filePath = path.resolve(local_path, HERO[index].skill[i].name + ".png");

            if (!fs.existsSync(filePath)) {
                qiniu_data.push({ pic_src, qiniu_path, local_path });
                baseController.DownloadFile(pic_src, pic_name, local_path);
            }

            if (i == lis_pic.length - 2) {
                resolve("heroSkillImages ok");
            }
        }
    }).catch(err => {
        log.error(err);
    })
}

//英雄推荐加点和召唤师技能
let heroRecommendedUpgradeSkill = async ($, index) => {

    return new Promise(async (resolve, reject) => {

        //加点
        let lis_skill = $(".sugg-info2.info p.sugg-name");
        HERO[index].skill_recommended = [];
        for (let i = 0; i < 2; i++) {
            let desc = lis_skill.eq(i).find("b").text(); //主加还是副加
            let name = lis_skill.eq(i).find("span").text();//加点的技能名字
            HERO[index].skill_recommended.push({ desc, name });
        }

        //召唤师技能
        let master_skill = $(".sugg-info2.info p.sugg-name3");
        let desc = master_skill.find("b").text();
        let name = master_skill.find("span").text();
        HERO[index].master_skill = { desc, name };

        log.debug(HERO[index]);

        //加点和召唤师技能的图片
        let pic_list = $(".hero.ls.fl").find("img");
        log.debug(pic_list.length);
        for (let i = 0; i < 4; i++) {
            log.debug(pic_list.eq(i).attr("src"))

            // 1 2 是推荐技能图片 3 4 召唤师技能图片
            if (i < 2) {
                //加点
            } else {
                //召唤师技能
            }
        }

        // for (let i = 0; i < lis_pic.length - 1; i++) {
        //     let skill_src = lis_pic.eq(i).find("img").attr("src");
        //     //log.info(skill_src);
        //     const pic_src = "http:" + skill_src

        //     if (pic_src.indexOf("#") != -1 || !skill_src) continue;

        //     let hero_skill_dir = HERO[index].cname + "/skill/";
        //     let pic_name = HERO[index].skill[i].name + ".png"; //图片名字
        //     let local_path = skill_pic_dir + "/" + hero_skill_dir;//本地存放的路径
        //     await baseController.Mkdir(local_path);
        //     const qiniu_path = "hero/" + hero_skill_dir + pic_name;//七牛路径
        //     let covor = dbConfig.qiniu.Dns + qiniu_path;
        //     HERO[index].skill[i].covor = covor;
        //     const filePath = path.resolve(local_path, HERO[index].skill[i].name + ".png");

        //     if (!fs.existsSync(filePath)) {
        //         qiniu_data.push({ pic_src, qiniu_path, local_path });
        //         baseController.DownloadFile(pic_src, pic_name, local_path);
        //     }

        //     if (i == lis_pic.length - 2) {
        //         resolve("heroSkillImages ok");
        //     }
        // }
    }).catch(err => {
        log.error(err);
    })
}

module.exports = {
    getData: async () => {
        return new Promise(async (resolve, reject) => {

            for (let index = 0; index < HERO.length; index++) {
                HERO[index].skill = [];

                let homeBody = await cheerioFunc.handleRequestByPromise({ url: "https://pvp.qq.com/web201605/herodetail/" + HERO[index].ename + ".shtml" });
                homeBody = iconv.decode(homeBody, "GBK"); //进行gbk解码
                let $ = cheerio.load(homeBody);

                //英雄技能
                await heroSkillDesc($, index);
                //英雄技能图片
                await heroSkillImages($, index);
                //英雄推荐升级的技能携带的召唤师技能
                //await heroRecommendedUpgradeSkill($, index);

                if (HERO.length > 0) log.info("爬取英雄技能：", Math.ceil(index / HERO.length * 100) + "%");

                if (index == HERO.length - 1) {
                    resolve(qiniu_data);
                }
            }
        }).catch(err => {
            log.error(err);
        })
    }
}