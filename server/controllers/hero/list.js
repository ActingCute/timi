/**
 * Created by 张辉 2021/03/13 11:10:09
 * 将爬取的英雄列表数据组装
 */

const path = require("path");
const baseController = require("../helper/index");
const dbConfig = require("../../config/databases");
const pic_dir = "public/hero"
const axios = require("axios");
const fs = require("fs");

module.exports = {
    getHero: (ename) => { //获取指定id的英雄
        return HERO.find(item => item.ename == Number(ename)) || "";
    },
    getData: async () => {
        await baseController.Mkdir(pic_dir);

        let res = await axios.get("https://pvp.qq.com/web201605/js/herolist.json", {
            headers: {
                referer: "https://pvp.qq.com/"
            }
        });

        if (res.status == 200) {
            HERO = res.data;
        }

        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < HERO.length; i++) {
                //捉取图片到本地和七牛云
                let local_path = pic_dir + "/" + HERO[i].cname
                await baseController.Mkdir(local_path);

                const pic_name = "cover.png"
                const qiniu_path = "hero/" + HERO[i].cname + "/" + pic_name
                let cover = dbConfig.qiniu.Dns + qiniu_path;
                const pic_src = "http://game.gtimg.cn/images/yxzj/img201606/heroimg/" + HERO[i].ename + "/" + HERO[i].ename + ".jpg";
                HERO[i].cover = cover;
                const file_path = path.resolve(local_path, pic_name);
                if (!await fs.existsSync(file_path)) {
                    QINIU_DATA.push({ pic_src, qiniu_path, local_path, pic_name });
                    LOCAL_DATA.push({ pic_src, pic_name, local_path });
                }
                if (HERO.length > 0) log.info("爬取英雄列表：", Math.ceil(i / HERO.length * 100) + "%");
                if (i == HERO.length - 1) resolve("get hero list ok");

            }
        }).catch(err => {
            log.error(err);
        })
    },
    getNoviceFreeHeroData: () => {
        for (let hi = 0; hi < HERO.length; hi++) {
            if (HERO[hi].pay_type && HERO[hi].pay_type == 10) {
                FREE_HERO.push(HERO[hi]);//周限免英雄
            } else if (HERO[hi].pay_type && HERO[hi].pay_type == 11) {
                NOVICE_HERO.push(HERO[hi]); //新手推荐英雄
            }
        }
    }
}