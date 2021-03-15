//日志输出
const log4js = require('log4js');
var logger;

(() => {
    log4js.configure({
        appenders: {
            out: { type: 'console' },
            default: { type: 'dateFile', filename: 'log/timi', "pattern": "-MM-dd.log", alwaysIncludePattern: true }
        },
        categories: {

            default: { appenders: ['out', 'default'], level: 'debug' },
        }
    });
    logger = log4js.getLogger(' ');
})()

module.exports = {
    info: function (...data) {
        logger.info(...data);
    },
    debug: function (...data) {
        logger.debug(...data);
    },
    error: function (...data) {
        logger.error(...data);
    }
}
