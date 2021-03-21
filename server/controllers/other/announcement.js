/**
 * Created by 张辉 2021/03/20 10:14:09
 * timi 公告 新闻 活动
 */

const cheerio = require('cheerio');
const cheerioFunc = require('../helper/cheerio');
const iconv = require('iconv-lite');
const md5 = require('js-md5');
const axios = require('axios');

const newsUrl = 'http://apps.game.qq.com/cmc/cross';
const new_type_text = ['热门', '新闻', '公告', '活动', '赛事'];
const new_type = ['hot', 655, 656, 1139, 658]

let makeSign = (source) => {
    var timestamp = parseInt(+new Date / 1000)
    var source = source
    var serviceId = 18
    var token = '234ce0aef3020cb83887883877b64869'
    var id = 4
    var sign = md5(token + source + serviceId + timestamp)
    return {
        exclusiveChannel: id,
        exclusiveChannelSign: sign,
        time: timestamp
    }
}

//获取相关列表
let getList = async () => {
    return new Promise(async (resolve, reject) => {
        let homeBody = await cheerioFunc.handleRequestByPromise({ url: "https://pvp.qq.com/" });
        homeBody = iconv.decode(homeBody, "GBK"); //进行gbk解码
        let $ = cheerio.load(homeBody);
        var news = $('#newsContent').find('.news-list');
        var channelParams = {
            serviceId: 18,
            filter: 'channel',
            sortby: 'sIdxTime',
            source: 'web_pc',
            limit: 12,
            logic: 'or',
            typeids: '1',
        }
        var exclusive = makeSign(channelParams.source)
        channelParams.exclusiveChannel = exclusive.exclusiveChannel
        channelParams.exclusiveChannelSign = exclusive.exclusiveChannelSign
        channelParams.time = exclusive.time

        let items_array = [];
        let data_id_temp = [];
        for (let i = 0; i < news.length; i++) {
            var channelId = news.eq(i).attr('data-channelid')
            //var tagId = news.eq(i).attr('data-tagid')
            channelParams.chanid = channelId;
            let res = await axios({
                method: "get", url: newsUrl, params: channelParams,
                headers: {
                    referer: "https://pvp.qq.com/"
                }
            });
            if (res.status != 200) continue;
            let data = res.data.data;
            data.items.forEach(ele => {
                //过滤相同的数据
                if (data_id_temp.indexOf(ele.iNewsId) != -1) return true;
                data_id_temp.push(ele.iNewsId);
                //将数据添加到对应的列表
                for (let ti = 0; ti < new_type.length; ti++) {
                    let items = { desc: new_type_text[ti], data: [] };
                    if (ele.sTagids.indexOf(new_type[ti]) != -1) {
                        items.data = ele;
                        items_array.push(items);
                    }
                }
            })
        }
        resolve(items_array);
    })
}

//内容页面
let getInfoUrl = (iNewsId) => {
    return `https://apps.game.qq.com/wmp/v3.1/public/searchNews.php?p0=18&source=web_pc&id=${iNewsId}`;
}

//获取相关内容
let getInfo = async (items) => {
    return new Promise(async (resolve, reject) => {
        let ci = 1;
        items.forEach(async (item) => {
            (async (item) => {
                let url = getInfoUrl(item.data.iNewsId);
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

                if (ci == items.length) {
                    resolve(items);
                    return;
                }
                ci++;
                if (items.length > 0) log.info("爬取新闻公告：", Math.ceil(ci / items.length * 100) + "%");
            })(item)
        });
    })
}

module.exports = {
    getData: async () => {
        return new Promise(async (resolve, reject) => {
            let items = await getList();
            ANNOUNCEMENT = await getInfo(items);
            resolve("ok");
        })
    }
}