/**
 * Created by 张辉 2021/03/22 09:55:04
 * 任务定时器
 */

const cronJob = require("cron").CronJob;

module.exports = {
    initCron: (func, ex_date, parameter) => {
        log.debug(new Date());
        new cronJob(ex_date, () => {
            func(parameter)
        }, null, true, 'Asia/Chongqing');
    }
}