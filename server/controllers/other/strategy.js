/**
 * Created by 张辉 2021/03/21 10:29:09
 * timi 攻略
 */


const axios = require("axios");

const url = "https://apps.game.qq.com/cmc/cross?serviceId=18&filter=tag&sortby=sIdxTime&source=web_pc&limit=16&logic=or&typeids=1%2C2&exclusiveChannel=4&exclusiveChannelSign=54a7ea3739d711c90a2ddd86e71f49da&time=1622523077&tagids=2543%2C619";

//获取相关列表
let getList = async () => {
    return new Promise(async (resolve, reject) => {
        let res = await axios
            .get(url, {
                headers: {
                    referer: "https://pvp.qq.com/"
                }
            });
        if (res.status != 200) resolve([false, []]);
        let data = res.data;
        if (data) {
            data = data.data.items
        }
        resolve([true, data]);
    });
}

let getInfoUrl = (id) => {
    return `https://apps.game.qq.com/wmp/v3.1/public/searchNews.php?source=pvpweb_detail&p0=18&id=${id}&openId=&&agent=&&channel=&&area=&&gicp_tk=5399&_=1616291183600`;
}

//获取相关内容
let getInfo = async (items) => {
    return new Promise(async (resolve, reject) => {
        let ci = 1;
        items.forEach(async (item) => {
            (async (item) => {
                if (item.sVID) {
                    //视频攻略
                    item.data = {};
                    item.isVideo = true;
                } else {
                    item.isVideo = false;
                    let url = getInfoUrl(item.iNewsId);
                    let res = await axios.get(url, {
                        headers: {
                            referer: "https://pvp.qq.com/"
                        }
                    });
                    if (res.status != 200) return;
                    let data = res.data;
                    if (data) {
                        data = data.replace("var searchObj=", "");
                        data = data.replace("};", "}");
                        data = JSON.parse(data);
                    }

                    item.data = data.msg;
                }


                if (ci == items.length) {
                    resolve(items);
                    return;
                }
                ci++;
                if (items.length > 0) log.info("爬取攻略：", Math.ceil(ci / items.length * 100) + "%");
            })(item)
        });
    })
}

module.exports = {
    getData: async () => {
        return new Promise(async (resolve, reject) => {
            let res = await getList();
            if (res[0]) {
                let data = await getInfo(res[1]);
                STRATEGY = data;
                resolve("ok");
                return;
            }
            resolve("no");
        })
    }
}