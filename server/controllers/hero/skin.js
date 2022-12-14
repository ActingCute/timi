/**
 * Created by 张辉 2021/03/14 16:21:09
 * 爬取的英雄皮肤
 */

const path = require("path");
const baseController = require("../helper/index");
const dbConfig = require("../../config/databases");
const pic_dir = "public/hero"
const fs = require("fs");

const bigskin_base_url = "http://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/"
const smallskin_base_url = "http://game.gtimg.cn/images/yxzj/img201606/heroimg/"

let todo = async (wallpaper_list, index, skin_index, i, local_path) => {
    let pic_src = "";
    return new Promise(async (resolve, reject) => {
        let px = ""
        if (index == 0) {
            //预览皮肤 
            px = "-smallskin-";
            pic_src = smallskin_base_url + HERO[i].ename + "/" + HERO[i].ename + px + (skin_index + 1) + ".jpg"
        } else {
            //大的皮肤
            px = "-bigskin-";
            pic_src = bigskin_base_url + HERO[i].ename + "/" + HERO[i].ename + px + (skin_index + 1) + ".jpg"
        }

        const pic_name = "skin" + px + wallpaper_list[skin_index] + ".png";
        const qiniu_path = "hero/" + HERO[i].cname + "/skin/" + px + pic_name;

        let covor = dbConfig.qiniu.Dns + qiniu_path;

        const file_path = path.resolve(local_path, pic_name);

        if (!await fs.existsSync(file_path)) {
            QINIU_DATA.push({ pic_src, qiniu_path, local_path, pic_name });
            LOCAL_DATA.push({ pic_src, pic_name, local_path });
        }
        resolve(covor);
    }).catch(err => {
        log.error(err);
    })
}

let getSkinSrc = async (i) => {
    return new Promise(async (resolve, reject) => {

        HERO[i].skin_list = [];

        //捉取图片到本地和七牛云
        let local_path = pic_dir + "/" + HERO[i].cname + "/Wallpaper"
        await baseController.Mkdir(local_path);
        let wallpaper_list = HERO[i].skin_name ? HERO[i].skin_name.split("|") : [];
        for (let skin_index = 0; skin_index < wallpaper_list.length; skin_index++) {

            let skin = {};
            skin.nmae = wallpaper_list[skin_index];
            skin.data = [];
            for (let index = 0; index < 2; index++) {
                let covor = await todo(wallpaper_list, index, skin_index, i, local_path);
                skin.data.push(covor);
            }
            HERO[i].skin_list.push(skin);
            if (skin_index == wallpaper_list.length - 1) resolve("skin ok ");
        }
    }).catch(err => {
        log.error(err);
    })
}

module.exports = {
    getData: async () => {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < HERO.length; i++) {
                await getSkinSrc(i);
                if (HERO.length > 0) log.info("爬取英雄皮肤壁纸：", Math.ceil(i / HERO.length * 100) + "%");
                if (i == HERO.length - 1) resolve("get hero list ok");
            }
        }).catch(err => {
            log.error(err);
        })
    }
}