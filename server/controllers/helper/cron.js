/*
 * @Author: ActingCute酱 rem486@qq.com
 * @Date: 2021-05-26 23:05:11
 * @LastEditors: ActingCute酱 rem486@qq.com
 * @LastEditTime: 2022-10-06 10:12:44
 * @FilePath: \server\controllers\helper\cron.js
 * @Description: 说明
 */
/**
 * Created by 张辉 2021/03/22 09:55:04
 * 任务定时器
 */

const cronJob = require("cron").CronJob;

module.exports = {
    initCron: (func, ex_date, parameter) => {
        //TODO 暂时不维护
        // log.debug(new Date());
        // new cronJob(ex_date, () => {
        //     func(parameter)
        // }, null, true, 'Asia/Chongqing');
    }
}