var qiniu = require("qiniu");
var http = require("http");
var configData = require("../config/databases");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//需要填写你的 Access Key 和 Secret Key
const mac = new qiniu.auth.digest.Mac(configData.qiniu.AK, configData.qiniu.SK);

//要上传的空间
const bucket = configData.qiniu.Bucket_Name;

let WebToken = (name) => {
  if (!name) {
    return "";
  }
  var options = {
    scope: bucket,
    saveKey: name,
    forceSaveKey: true
  };
  //console.log("options--", options);
  var putPolicy = new qiniu.rs.PutPolicy(options);
  var uploadToken = putPolicy.uploadToken(mac);
  //console.log("uploadToken", uploadToken);
  return uploadToken;
}

module.exports = {
  toQiniu: async (url, pic_name, pic_src) => {
    return new Promise((resolve, reject) => {
      http.get(url, function (res) {
        var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
        var size = 0; //保存缓冲数据的总长度
        res.on("data", function (chunk) {
          chunks.push(chunk); //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)， //node会把接收到的数据片段逐段的保存在缓冲区（Buffer）， //这些数据片段会形成一个个缓冲对象（即Buffer对象）， //而Buffer数据的拼接并不能像字符串那样拼接（因为一个中文字符占三个字节）， //如果一个数据片段携带着一个中文的两个字节，下一个数据片段携带着最后一个字节， //直接字符串拼接会导致乱码，为避免乱码，所以将得到缓冲数据推入到chunks数组中， //利用下面的node.js内置的Buffer.concat()方法进行拼接
          size += chunk.length; //累加缓冲数据的长度
        });

        res.on("end", function (err) {
          var data = Buffer.concat(chunks, size); //Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data
          //console.log(Buffer.isBuffer(data)); //可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象
          var picBase = data.toString("base64"); //将Buffer对象转换为字符串并以base64编码格式显示
          //console.log(picBase); //进入终端terminal,然后进入index.js所在的目录， //在终端中输入node index.js //打印出来的就是图片的base64编码格式，格式如下

          var token = WebToken(pic_name);

          /*通过base64编码字符流计算文件流大小函数*/
          function fileSize(str) {
            var fileSize;
            if (str.indexOf("=") > 0) {
              var indexOf = str.indexOf("=");
              str = str.substring(0, indexOf); //把末尾的’=‘号去掉
            }

            fileSize = parseInt(str.length - (str.length / 8) * 2);
            return fileSize;
          }

          /*把字符串转换成json*/
          function strToJson(str) {
            try {
              var json = eval("(" + str + ")");
              return json;
            } catch (err) {
              console.error(err);
              console.error("上传七牛图片失败:", str);
              return { error: err };
            }
          }

          var url = "http://up.qiniu.com/putb64/" + fileSize(picBase);
          var xhr = new XMLHttpRequest();
          xhr.timeout = 100000;

          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
              var keyText = xhr.responseText;

              /*返回的key是字符串，需要装换成json*/
              keyText = strToJson(keyText);
              //console.log("keyText - ", keyText);
              if (keyText.error) {
                if (keyText.error != "file exists") {
                  console.error("上传七牛图片失败", keyText.error);
                  resolve(pic_name);
                }
              } else {
                //console.info("上传七牛图片OK", configData.qiniu.Dns + pic_name);
                resolve(configData.qiniu.Dns + pic_name);
              }
            }
          };
          xhr.open("POST", url, true);
          xhr.setRequestHeader("Content-Type", "application/octet-stream");
          xhr.setRequestHeader("Authorization", "UpToken " + token);
          xhr.send(picBase);
        });
      });
    });
  }
};
