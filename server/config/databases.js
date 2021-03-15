module.exports = {
    redis: {
        RDS_PORT: 6379, //端口号
        RDS_HOST: "127.0.0.1", //服务器IP
        RDS_PWD: "", //密码
        RDS_OPTS: {}
    },
    qiniu: {
        AK: "JMeo2KqeIeTl48kkN0mvKgYtDdspccphTM8kZ5Bh",
        SK: "VOrSt7BgbrQrtLNm2nCzo2S0X1Fhn-WES90gCFWC",
        Bucket_Name: "lovely",
        Dns: "https://lovely.haibarai.com/",
        Need_Upload: false//第一次上传之后，除非是官网有更新，否则不应该每次都上传七牛
    }
}