/**
 * Created by 张辉 2021/03/15 11:10:09
 * timi 局内装备
 */

const path = require("path");
const baseController = require("../helper/index");
const dbConfig = require("../../config/databases");
const pic_dir = "public/props"
const axios = require("axios");
const fs = require("fs");
const arms_json = "https://pvp.qq.com/web201605/js/item.json";

let getArmsImg = (item_id) => {
    return `http://game.gtimg.cn/images/yxzj/img201606/itemimg/${item_id}.jpg`;
}

module.exports = {
    getData: async () => {
        await baseController.Mkdir(pic_dir);

        let res = await axios.get(arms_json);

        if (res.status == 200) {
            SUMMONER_SPELLS = res.data;
        }

        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < SUMMONER_SPELLS.length; i++) {
                //捉取图片到本地和七牛云
                let local_path = pic_dir + "/arms";
                await baseController.Mkdir(local_path);

                const pic_name = SUMMONER_SPELLS[i].item_name + ".png";
                const qiniu_path = "arms/" + pic_name;
                let covor = dbConfig.qiniu.Dns + qiniu_path;
                const pic_src = getArmsImg(SUMMONER_SPELLS[i].item_id);
                SUMMONER_SPELLS[i].cover = covor;
                const file_path = path.resolve(local_path, pic_name);

                if (!fs.existsSync(file_path)) {
                    qiniu_data.push({ pic_src, qiniu_path, local_path });
                    baseController.DownloadFile(pic_src, pic_name, local_path);
                }
                if (SUMMONER_SPELLS.length > 0) log.info("爬取局内装备：", Math.ceil(i / SUMMONER_SPELLS.length * 100) + "%");
                if (i == SUMMONER_SPELLS.length - 1) {
                    resolve("get arms list ok");
                }
            }
        }).catch(err => {
            log.error(err);
        })
    }
}