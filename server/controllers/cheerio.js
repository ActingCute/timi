/**
 * Created by 张辉 2021/03/13 11:10:09
 * 爬虫的函数
 */


const request = require('request')

module.exports = {
    handleRequestByPromise: async (options) => {
        let op = Object.assign(
            {},
            {
                url: options.url,
                method: "GET",
                encoding: null,
                header: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
                    Referer: "https://pvp.qq.com"
                }
            },
            options
        );

        if (op.url === "") {
            throw new Error("请求的url地址不正确");
        }

        const promise = new Promise((resolve, reject) => {
            request(op, (err, response, body) => {
                if (err) reject(err);

                if (response && response.statusCode === 200) {
                    resolve(body);
                } else {
                    reject(`请求✿✿✿${url}✿✿✿失败`);
                }
            });
        });

        return promise;
    }
}