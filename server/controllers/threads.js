//线程任务
let { spawn, Thread, Worker } = require("threads");

module.exports = {
    DownloadFile: async function (url, name, pic_dir) {
        const worker = await spawn(new Worker("./worker.js"));
        await worker.DownloadFile(url, name, pic_dir)
        await Thread.terminate(worker)
    },
    UploadQiniu: async function (url, pic_name, pic_src) {
        const worker = await spawn(new Worker("./worker.js"));
        await worker.UploadQiniu(url, pic_name, pic_src);
        await Thread.terminate(worker);
    }
}

