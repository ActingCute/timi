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
const ming = require("../props/ming");
let skill_pic_dir = "public/hero";

//铭文搭配建议
let heroRecommendedMing = async($, index) => {
    HERO[index].recommended_ming = {};
    HERO[index].recommended_ming.tips = $("p.sugg-tips").text();
    HERO[index].recommended_ming.data = [];
    return new Promise(async(resolve, reject) => {
        let mings = $(".sugg-u1").attr("data-ming").split("|");
        for (let i = 0; i < mings.length; i++) {
            let ming_data = ming.getMing(mings[i]);
            if (!ming_data) continue;
            let des = ming_data.des;
            let name = ming_data.name; //铭文名字
            HERO[index].recommended_ming.data.push({ name, des });
            if (i == mings.length - 1) {
                resolve("heroRecommendedMing ok");
            }
        }
    }).catch(err => {
        log.error(err);
    })
}

//英雄技能描述
let heroSkillDesc = async($, index) => {
    let lis = $(".show-list");
    return new Promise(async(resolve, reject) => {
        for (let i = 0; i < lis.length; i++) {
            let skill_name_desc = lis.eq(i).find(".skill-name");
            let name = skill_name_desc.find("b").text();
            if (name) {
                HERO[index].skill[i] = {};
                HERO[index].skill[i].name = skill_name_desc.find("b").text(); //技能名称
                let cds = skill_name_desc.find("span");
                HERO[index].skill[i].cd = "";
                for (let ei = 0; ei < cds.length; ei++) HERO[index].skill[i].cd += cds.eq(ei).text() + " "; //技能冷却消耗
                HERO[index].skill[i].desc = lis.eq(i).find(".skill-desc").text(); //技能描述
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
let heroSkillImages = async($, index) => {
    let lis_pic = $(".skill-u1 li");
    return new Promise(async(resolve, reject) => {
        for (let i = 0; i < lis_pic.length - 1; i++) {
            let skill_src = lis_pic.eq(i).find("img").attr("src");
            const pic_src = "http:" + skill_src
            if (pic_src.indexOf("#") != -1 || !skill_src) continue;

            let hero_skill_dir = HERO[index].cname + "/skill/";
            let pic_name = HERO[index].skill[i].name + ".png"; //图片名字
            let local_path = skill_pic_dir + "/" + hero_skill_dir; //本地存放的路径
            await baseController.Mkdir(local_path);
            const qiniu_path = "hero/" + hero_skill_dir + pic_name; //七牛路径
            let covor = dbConfig.qiniu.Dns + qiniu_path;
            HERO[index].skill[i].covor = covor;
            const filePath = path.resolve(local_path, HERO[index].skill[i].name + ".png");

            if (!fs.existsSync(filePath)) {
                qiniu_data.push({ pic_src, qiniu_path, local_path });
                baseController.DownloadFile(pic_src, pic_name, local_path);
            }

            if (i == lis_pic.length - 2) resolve("heroSkillImages ok");

        }
    }).catch(err => {
        log.error(err);
    })
}

//获取技能图片
let getheroRecommendedSkill = (hero_name, skill_name) => {
    return dbConfig.qiniu.Dns + `hero/${hero_name}/skill/${skill_name}.png`
}

//获取召唤师推荐技能图片
let getheroRecommendedSummoner = (summoner_name) => {
    if (summoner_name == "斩杀") summoner_name = "终结";
    return dbConfig.qiniu.Dns + `summoner/${summoner_name}.png`
}

//获取英雄推荐升级技能
let getHeroSkill = (index, skill_name, type) => {
    let skill_data = HERO[index].skill.find(item => item.name == skill_name) || "";
    if (!skill_name) return { name: "", covor: "" };
    return { name: skill_data.name, covor: skill_data.covor, type };
}

//英雄推荐加点和召唤师技能
let heroRecommendedUpgradeSkill = async($, index) => {
    return new Promise(async(resolve, reject) => {
        ((index, $) => {
            //加点
            let n1 = $('.sugg-skill img').eq(0).attr('src')[$('.sugg-skill img').eq(0).attr('src').length - 6],
                n2 = $('.sugg-skill img').eq(1).attr('src')[$('.sugg-skill img').eq(1).attr('src').length - 6];
            let mastar_skill_name = $('.skill-show .skill-name b').eq(n1).text(); //主加技能
            let second_skill_name = $('.skill-show .skill-name b').eq(n2).text(); //副加技能

            HERO[index].skill_recommended = [
                getHeroSkill(index, mastar_skill_name, "主加"),
                getHeroSkill(index, second_skill_name, "副加")
            ];

            //召唤师技能
            let master_skill = $(".sugg-info2.info p.sugg-name3");
            let desc = master_skill.find("b").text();
            let name = master_skill.find("span").text();
            let names = name.split("/");
            let covor = [];
            for (let i = 0; i < names.length; i++) covor.push(getheroRecommendedSummoner(names[i]));
            HERO[index].master_skill = { desc, name, covor };

            resolve("爬取英雄推荐加点和召唤师技能：ok");

        })(index, $)

    }).catch(err => {
        log.error(err);
    })
}

module.exports = {
    getData: async() => {
        return new Promise(async(resolve, reject) => {
            for (let index = 0; index < HERO.length; index++) {
                (async(index) => {
                    HERO[index].skill = [];
                    let homeBody = await cheerioFunc.handleRequestByPromise({ url: "https://pvp.qq.com/web201605/herodetail/" + HERO[index].ename + ".shtml" });
                    homeBody = iconv.decode(homeBody, "GBK"); //进行gbk解码
                    let $ = cheerio.load(homeBody);
                    //json文件一些英雄皮肤数据没有，所以要重新获取皮肤数据
                    let skin_data = $(".pic-pf-list.pic-pf-list3").attr("data-imgname");
                    let skin_datas = skin_data.split("|");
                    let skin_str = [];
                    skin_datas.forEach((ele, ele_index) => {
                        let skill_name = ele.split("&");
                        if (skill_name.length > 0) {
                            skill_name = skill_name[0];
                            skin_str.push(skill_name);
                        }
                    })
                    if (skin_str) HERO[index].skin_name = skin_str.join("|");
                    //英雄技能
                    await heroSkillDesc($, index);
                    //英雄技能图片
                    await heroSkillImages($, index);
                    //英雄推荐升级的技能携带的召唤师技能
                    await heroRecommendedUpgradeSkill($, index);
                    //铭文搭配建议
                    await heroRecommendedMing($, index)

                })(index)

                if (HERO.length > 0) log.info("爬取英雄技能：", Math.ceil(index / HERO.length * 100) + "%");
                if (index == HERO.length - 1) resolve(qiniu_data);
            }
        }).catch(err => {
            log.error(err);
        })
    }
}