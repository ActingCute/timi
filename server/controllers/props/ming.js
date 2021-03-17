/**
 * Created by 张辉 2021/03/15 19:41:09
 * timi 铭文
 */

const path = require("path");
const baseController = require("../helper/index");
const dbConfig = require("../../config/databases");
const pic_dir = "public/props"
const axios = require("axios");
const fs = require("fs");
const ming_json = "https://pvp.qq.com/web201605/js/ming.json";


let getMingImg = (ming_id) => {
    return `http://game.gtimg.cn/images/yxzj/img201606/mingwen/${ming_id}.png`;
}

module.exports = {
    getMing: (ming_id) => { //获取指定id的铭文
        ming_id += "";
        return MING.find(item => item.mid == ming_id) || "";
    },
    getData: async () => {
        await baseController.Mkdir(pic_dir);

        let res = await axios.get(ming_json);

        if (res.status == 200) {
            MING_temp = res.data;
            MING = [];

            //只保留5级的铭文数据
            for (let i = 0; i < MING_temp.length; i++)
                if (MING_temp[i].ming_grade == "5")
                    MING.push({ mid: MING_temp[i].ming_id, name: MING_temp[i].ming_name, des: MING_temp[i].ming_des });
        }

        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < MING.length; i++) {
                //捉取图片到本地和七牛云
                let local_path = pic_dir + "/ming";
                await baseController.Mkdir(local_path);

                const pic_name = MING[i].name + ".png";
                const qiniu_path = "ming/" + pic_name;
                let cover = dbConfig.qiniu.Dns + qiniu_path;
                const pic_src = getMingImg(MING[i].mid);

                MING[i].cover = cover;
                const file_path = path.resolve(local_path, pic_name);

                if (!await fs.existsSync(file_path)) {
                    QINIU_DATA.push({ pic_src, qiniu_path, local_path, pic_name });
                    LOCAL_DATA.push({ pic_src, pic_name, local_path });
                }
                if (MING.length > 0) log.info("爬取铭文：", Math.ceil(i / MING.length * 100) + "%");
                if (i == MING.length - 1) {
                    resolve("get ming list ok");
                }
            }
        }).catch(err => {
            log.error(err);
        })
    }
}