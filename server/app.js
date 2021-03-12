/**
 * Created by 张辉 2021/03/13 11:10:09
 * 入口文件
 */

//加载引用包
var baseController = require("./controllers/base");
var FileStreamRotator = require('file-stream-rotator');
var fs = require("fs");
var express = require("express");
var expressControllers = require("express-controller");
var path = require("path");
var logger = require("morgan");//日志模块
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();

//静态文件载入
app.use(express.static(path.join(__dirname, "public")));

//传输数据json处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//日志输出
const log_path = __dirname + "/log";
(async (app) => {
    await baseController.mkdir(log_path);
    //创建一个写路由
    var accessLogStream = FileStreamRotator.getStream({
        filename: log_path + '/accss-%DATE%.log',
        frequency: 'daily',
        verbose: false
    })
    app.use(logger('combined', { stream: accessLogStream }));//写入日志文件
})(app)


//路由控制
app.use(router);

console.error("dirname - ", __dirname)

//绑定控制器
expressControllers.setDirectory(__dirname + "\\controllers").bind(router);

//端口启动
app.listen(5000, function () {
    console.info("port 5000");
});
