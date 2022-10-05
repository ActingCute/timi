var redis = require("../helper/redis");

const base_url = "https://pvp.qq.com";

const personal_url = "https://pvp.qq.com/web201605/personal.shtml"
const hisrecord_url = "https://pvp.qq.com/web201605/hisrecord.shtml"

const wx_login_url = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxfac91dbf47418eb6&scope=snsapi_login&redirect_uri=https%3A%2F%2Fpvp.qq.com%2Fcomm-htdocs%2Fmilo_mobile%2Fwxlogin.html%3Fappid%3Dwxfac91dbf47418eb6%26sServiceType%3Dpvp%26originalUrl%3Dhttps%253A%252F%252Fpvp.qq.com%252Fweb201605%252Fpersonal.shtml&state=1&login_type=jssdk&self_redirect=true&styletype=&sizetype=&bgcolor=&rst=&style=black'
const qq_login = "https://ssl.ptlogin2.qq.com/ptqrshow?appid=21000501&e=2&l=M&s=3&d=72&v=4&t=0.6962919279445017&daid=8&pt_3rd_aid=0"

const wx_px = "https://open.weixin.qq.com"
const qq_px = "https://ssl.ptlogin2.qq.com"

const qn = require("../helper/qiniu");

var md5 = require("js-md5");

const WZ_USER_INFO = "WZ_USER_INFO_";
const WZ_USER_COOKIE = "WZ_USER_COOKIE_";
const WZ_RECORD_DATA = "WZ_RECORD_DATA_";
const WZ_UPDATE_TIME = "WZ_UPDATE_TIME_";

const NightMare = require('nightMare');
const moment = require('moment')

//获取cookie
async function getCookie(domain) {
  return redis.getString(WZ_USER_COOKIE + domain);
}

//获取用户信息
async function getUserInfo(domain) {
  return redis.get(WZ_USER_INFO + domain);
}

//设置cookie
async function setCookie(domain, cookie) {
  return redis.setString(WZ_USER_COOKIE + domain, cookie);
}

//设置用户信息
async function setUserInfoRedis(domain, user_info) {
  user_info.updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  return redis.set(WZ_USER_INFO + domain, user_info);
}

//设置战绩redis
async function setRecordRedis(domain, data) {
  return redis.set(WZ_RECORD_DATA + domain, data);
}

//设置历史信息
async function setRecord(domain, nightMare) {
  //最终出装
  try {
    var res = await getRecord(domain, true);
    if (res.err) {
      return new Promise(r => r(res))
    }
    var wz_history = res.data;

    await waitLoading(nightMare, hisrecord_url)

    nightMare
      .wait(5000)
      .evaluate(async (wz_history, done) => {

        let rBox = $('.his_last_game');
        let dataBox = [];
        try {
          if (rBox && rBox.length) {
            const getEquipmentImglist = (index) => {

              let equipmentImglistBox = [];
              let equipmentImglist = $('.his_last_game').eq(index).find('.equipment_imglist img');
              if (!equipmentImglist) {
                return []
              }
              if (equipmentImglist && equipmentImglist.length) {
                for (let i = 0; i < equipmentImglist.length; i++) {
                  let src = $('.his_last_game').eq(index).find('.equipment_imglist img').eq(i).attr('src')
                  equipmentImglistBox.push(src)
                }
              }
              return equipmentImglistBox;
            }
            let maxIndex = rBox.length - 1; //多出一个无效的战绩

            const getD = async (index) => {
              return new Promise(async function (r, rej) {
                if (!$('.his_last_game').eq(index)) {
                  r(false)
                  return
                }
                //上传kda
                let gameTime = $('.his_last_game').eq(index).find('.equipment_time').text() || new Date().getTime() + ''; //比赛开始时间
                let data = {
                  hero: $('.his_last_game').eq(index).find('.his_headimg').attr('src') || '//game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg', //使用英雄
                  type: $('.his_last_game').eq(index).find('.his_info_m_maptxt').text() || "母鸡", //比赛类型
                  result: $('.his_last_game').eq(index).find('.his_info_m_txt._suctxt').text() || '母鸡', //比赛结果
                  useTime: ($('.his_last_game').eq(index).find('.gameduration').text() || "99999"), //时长
                  mvpImg: $('.his_last_game').eq(index).find('.his_info_mvp').attr('src') || null, //mvp图片
                  equipmentImglist: getEquipmentImglist(index), //6神装
                  gameLevel: $('.his_last_game').eq(index).find('.his_info_dan').attr('src') || '//game.gtimg.cn/images/yxzj/web201605/page/rank15.png', //对局时候，段位是啥
                  kda: $('.his_last_game').eq(index).find('.hisdata').attr('src'),
                  gameTime
                }
                if (wz_history.find(item => item.gameTime == gameTime)) {
                  console.log("该战绩已经存在");
                } else {
                  // let kdaBase64 = $('.his_last_game').eq(index).find('.hisdata').attr('src');
                  // if (kdaBase64) data.kda = kdaBase64;
                  //await tools.qiniu.toQiniuBase64(kdaBase64, `img/wangzhe/kda/${tools.md5(tools.domain)}/${tools.md5(gameTime || new Date().getTime()+'')}.jpg`)
                  dataBox.push(data)
                }

                r(true)
              })
            }

            for (let index = 0; index < maxIndex; index++) {
              await getD(index)
            }

            done(null, {
              data: dataBox
            })

          }
        } catch (err) {
          done(null, {
            err
          })
          return
        }
      }, wz_history)
      .end().then(async res => {
        if (res.err) {
          console.error("获取战绩失败", res.err);
          return
        }
        //上传到七牛
        if (res.data && res.data.length) {
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index];
            let kdaBase64 = element.kda;
            if (kdaBase64 && kdaBase64.indexOf("img/wangzhe/kda") == -1)
              res.data[index].kda = await qn.newBase64(kdaBase64, `img/wangzhe/kda/${md5(domain)}/${md5(element.gameTime || new Date().getTime()+'')}.jpg`) || ""
            if (res.data[index].kda.length > 1024) res.data[index].kda = ""
          }
          //存入redis
          setRecordRedis(domain, res.data)
        }
      })
  } catch (err) {
    console.error(err);
    return {
      err: err
    }
  }

  return new Promise(r => r({
    msg: "王者战绩数据已经更新"
  }))
}

//获取历史信息
async function getRecord(domain, isAll = false, start = 0, limit = 10) {
  let data = await redis.get(WZ_RECORD_DATA + domain);

  if (!data) {
    return new Promise(r => r({
      data: []
    }))
  }

  if (start < 0) {
    return {
      err: 'start index error'
    }
  }

  if (isAll) {
    return new Promise(r => r({
      data,
      total: data.length
    }))
  }
  try {
    return new Promise(r => r({
      data: data.slice(start, limit + start),
      total: data.length
    }))
  } catch (error) {
    return new Promise(r => r({
      err: "获取数据失败" + error
    }))
  }
}

//获取用户信息
async function getUserInfoData(domain) {
  let user_info = await getUserInfo(domain);
  if (!user_info) {
    user_info = {
      name: '一个小可爱', //账号名
      avatar: '//game.gtimg.cn/images/yxzj/web201605/page/per_pic1.jpg', //用户头像
      credit: 0, //信誉积分
      grade: '小青铜', //段位
      gradeImg: '//game.gtimg.cn/images/yxzj/web201605/page/rank15.png', //段位图片
      ladderWinRate: '0%', //排位胜率
      ladderInfo: [
        "全部比赛：0 胜场：0 胜率：0%",
        "排位赛：0 胜场：3317 胜率：0%"
      ], //比赛信息
      heroCount: 0, //英雄数量
      skinCount: 0, //皮肤数量
      updateTime: moment
    }
  }
  return user_info;
}

//等待超时
function promiseTimeout(promise, nightMare, delay = 5 * 60000) {
  let timeout = new Promise(function (reslove, reject) {
    setTimeout(function () {
      reject('超时啦~')
      if (nightMare && typeof nightMare == 'object') nightMare.end().then();
    }, delay)
  })
  return Promise.race([timeout, promise])
}



//生成登录验证码
var nightMareBox = {}
async function getCode(loginType = 1, equipment = 1, code = 1, domain) {
  if (loginType != 1 && loginType != 2) {
    return new Promise(r => r({
      err: "loginType：1->微信，2->qq"
    }))
  }

  //检查大区是否正确
  // if (equipment == 2 && (code < 4011 || code > 4205)) {
  //   return new Promise(r => r({
  //     err: "code err,ios is 4010 < code < 4206"
  //   }))
  // } else if (equipment == 1 && (code < 3011 || code > 3420)) {
  //   return new Promise(r => r({
  //     err: "code err,android is 3011 < code < 3420"
  //   }))
  // }

  const waitTimeout = 5 * 60000

  nightMareBox[domain] = NightMare({
    show: true,
    waitTimeout, // .wait() 方法超时时长，单位:ms
    executionTimeout: 86400000, // .evaluate() 方法超时时长，单位:ms
  });


  let nightMare = nightMareBox[domain];


  let src = await promiseTimeout(
    nightMare.goto(`${loginType==1?wx_login_url:qq_login}`)
    .wait(`img`)
    .evaluate(() => $('img').attr('src'))).catch(e => {
    console.error(e);

    return new Promise(r => r({
      err: "操作超时"
    }))
  }, nightMare); //点击的是类选择器

  if (!src)
    return new Promise(r => r({
      err: "获取二维码失败"
    }))

  //等待扫码
  toWaitLogin(loginType, equipment, code, domain, nightMare)

  return new Promise(r => r({
    data: (loginType == 1 ? wx_px : qq_px) + src
  }))
}

//等待扫码
function toWaitLogin(loginType, equipment, code, domain, nightMare) {
  setTimeout(async () => {
    let isLogin =
      await promiseTimeout(nightMare.goto(base_url).wait(`#unlogin`).evaluate(() => $('#unlogin').attr('style')), nightMare).catch(e => {
        return new Promise(r => r({
          err: "操作超时"
        }))
      })
    isLogin = typeof isLogin == 'string' ? isLogin.indexOf('none') != -1 : false

    //判断是否已经登录 
    if (isLogin) {
      console.log("已经登录");
      selectRole(loginType, equipment, code, domain, nightMare)
    } else {
      console.log("未登录");
    }
  }, 1000 * 30);
}

//选大区角色
async function selectRole(loginType, equipment, code, domain, nightMare) {
  await promiseTimeout(nightMare.wait(`.select_role`).click('.select_role').wait('#area_select').wait(`#se-checkbox`).check('#se-checkbox'), nightMare).catch(e => {
    return new Promise(r => r({
      err: "操作超时"
    }))
  });

  setTimeout(async () => {
    //选设备类型
    console.log({
      code
    });
    promiseTimeout(nightMare.wait(`#channelContentId`).select('#channelContentId', equipment), nightMare).catch(e => {
      return new Promise(r => r({
        err: "操作超时"
      }))
    })
  }, 2000);

  setTimeout(async () => {
    //选大区
    console.log({
      code
    });
    promiseTimeout(nightMare.wait(`#areaContentId`).select('#areaContentId', code), nightMare).catch(e => {
      return new Promise(r => r({
        err: "操作超时"
      }))
    })
  }, 4000);

  //按下确认按钮
  setTimeout(async () => {
    await promiseTimeout(nightMare.wait(`#RoleSelectBtn`).click("#RoleSelectBtn"), nightMare)
      .catch(e => {
        return new Promise(r => r({
          err: "操作超时"
        }))
      });
    setUserInfo(loginType, equipment, code, domain, nightMare)
  }, 6000);
}


//等待加载完成
async function waitLoading(nightMare, url) {
  return promiseTimeout(nightMare.goto(url).wait(`#__ide_loader_layer__`).wait(() => {
    try {
      return document.getElementById('__ide_loader_layer__').style.display == 'none'
    } catch (error) {
      console.error(error);
      return true
    }
  }), nightMare).catch(e => {
    console.error(e);

    return new Promise((resolve, reject) => {
      resolve("操作超时")
    })
  });
}

//设置个人信息
async function setUserInfo(loginType, equipment, code, domain, nightMare) {
  //跳转个人信息页面
  await waitLoading(nightMare, personal_url).catch(e => {
    return new Promise(r => r({
      err: "跳转个人信息页面:操作超时"
    }))
  })
  //加载完成
  console.log("个人信息页面加载完成");
  promiseTimeout(nightMare.wait(`.info-id`).evaluate(function () {
    // 返回节点文本信息
    let user_info = {} //用户信息
    const getLadderInfo = (info) => {
      try {
        if (info && info.length) {
          let infos = info.replaceAll('排', '-排').split('-')
          infos.forEach((item, index) => {
            infos[index] = infos[index].replaceAll("胜", "/胜")
          })
          return infos
        }
      } catch (error) {
        console.error(error);
      }
      return ""
    }
    try {
      user_info = {
        name: $('#area_info').text() || '获取失败', //账号名
        avatar: $('.info-pho img').attr('src') || '//game.gtimg.cn/images/yxzj/web201605/page/per_pic1.jpg', //用户头像
        credit: $('b.credit_value').text() || 0, //信誉积分
        grade: $('span.grade_level').text() || '小青铜', //段位
        gradeImg: $('.sco.fl img').attr('src') || '//game.gtimg.cn/images/yxzj/web201605/page/rank15.png', //段位图片
        ladderWinRate: ($('span.ladder_win_rate').text() || 0) + '%', //排位胜率
        ladderInfo: getLadderInfo($('p.p1').text()), //比赛信息
        heroCount: $('em.hero_count').text() || 0, //英雄数量
        skinCount: $('em.skin_count').text() || 0, //皮肤数量
      }
    } catch (error) {
      console.error(error);
    }
    return user_info;
  }), nightMare).then(res => {
    if (res.name) {
      //存入redis
      setUserInfoRedis(domain, res);
      //设置战绩
      setTimeout(() => {
        setRecord(domain, nightMare)
      }, 1000);
    }
  }).catch(e => {
    return new Promise(r => r({
      err: "操作超时"
    }))
  });
}

//暴露函数
module.exports = {
  getCode,
  getRecord,
  getUserInfoData
};