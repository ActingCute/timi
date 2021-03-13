/**
 * Created by 张辉 2021/03/13 11:10:09
 * 入口文件
 */

//加载引用包
const log = require("./controllers/log");
const express = require("express");
const expressControllers = require("express-controller");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();

//静态文件载入
app.use(express.static(path.join(__dirname, "public")));

//传输数据json处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//路由控制
app.use(router);
console.error("dirname - ", __dirname)

//日志
global.log = log;

//全局英雄数据
global.hero = [];

//绑定控制器
expressControllers.setDirectory(__dirname + "\\controllers").bind(router);

//端口启动
app.listen(5000, function () {
    console.info("port 5000");
});
