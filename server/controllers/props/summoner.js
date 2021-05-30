/**
 * Created by 张辉 2021/03/15 11:10:09
 * timi 召唤师技能
 */

const path = require("path");
const baseController = require("../helper/index");
const dbConfig = require("../../config/databases");
const pic_dir = "public/props"
const axios = require("axios");
const fs = require("fs");
const summoner_json = "https://pvp.qq.com/web201605/js/summoner.json";


let getSummonerImg = (summoner_id) => {
    return `http://game.gtimg.cn/images/yxzj/img201606/summoner/${summoner_id}.jpg`;
}

module.exports = {
    getSummoner: (summoner_id) => { //获取指定id的召唤师技能
        return SUMMONER.find(item => item.summoner_id == Number(summoner_id)) || "";
    },
    getData: async () => {
        await baseController.Mkdir(pic_dir);

        let res = await axios.get(summoner_json, {
            headers: {
                referer: "https://pvp.qq.com/"
            }
        });

        if (res.status == 200) {
            SUMMONER = res.data;
        }

        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < SUMMONER.length; i++) {
                //捉取图片到本地和七牛云
                let local_path = pic_dir + "/summoner";
                await baseController.Mkdir(local_path);

                const pic_name = SUMMONER[i].summoner_name + ".png";
                const qiniu_path = "summoner/" + pic_name;
                let cover = dbConfig.qiniu.Dns + qiniu_path;
                const pic_src = getSummonerImg(SUMMONER[i].summoner_id);
                SUMMONER[i].cover = cover;
                const file_path = path.resolve(local_path, pic_name);

                if (!await fs.existsSync(file_path)) {
                    QINIU_DATA.push({ pic_src, qiniu_path, local_path, pic_name });
                    LOCAL_DATA.push({ pic_src, pic_name, local_path });
                }
                if (SUMMONER.length > 0) log.info("爬取召唤师技能：", Math.ceil(i / SUMMONER.length * 100) + "%");
                if (i == SUMMONER.length - 1) {
                    resolve("get summoner list ok");
                }
            }
        }).catch(err => {
            log.error(err);
        })
    }
}