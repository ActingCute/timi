/*
 * @Author: ActingCute酱 rem486@qq.com
 * @Date: 2022-10-03 09:21:14
 * @LastEditors: ActingCute酱 rem486@qq.com
 * @LastEditTime: 2022-10-03 10:04:36
 * @FilePath: \server\config\databases.js
 * @Description: 说明
 */
module.exports = {
    web: {
        port: 5000
    },
    redis: {
        RDS_PORT: 6379, //端口号
        RDS_HOST: "127.0.0.1", //服务器IP
        RDS_PWD: "", //密码
        RDS_OPTS: {}
    },
    qiniu: {
        AK: "JMeo2KqeIeTl48kkN0mvKgYtDdspccphTM8kZ5Bh",
        SK: "VOrSt7BgbrQrtLNm2nCzo2S0X1Fhn-WES90gCFWC",
        Bucket_Name: "wzyz",
        Dns: "https://wzyz.haibarai.com/",
        Need_Upload: false, //第一次上传之后，除非是官网有更新，否则不应该每次都上传七牛
        UseSliceUpload: true //使用分片上传
    },
    timi: {
        CarouselNumber: 4, //轮播图数量
        FreeHero: 7, //周免英雄应该小于7大于0
        ClearData: false //启动时候清除数据
    }
}