#### 数据流图
![image.png](/uploads/6321094BA20B4CCBABCE242F2547230D/image.png)

#### 小程序功能用例图
![image.png](/uploads/44D87846AEA74FD88699D30E456337D4/image.png)

#### 主要游戏资料类图
![image.png](/uploads/D20EBDF856E5480BBD1EB10C35AC04C0/image.png)

#### 小程序顺序图
![image.png](/uploads/796C47271A78470FB015FF66B543C357/image.png)

# 西皮滴滴
### 文档说明：本项目仅用于学习`nodejs爬虫`和`微信小程序`

![avatar](https://git.code.tencent.com/se2021/team01/timi/raw/19ac91a75e7221ffd54da9cdff4a5952401d6c6e/server/public/hero/%E8%89%BE%E7%90%B3/Wallpaper/skin-bigskin-%E5%A5%B3%E6%AD%A6%E7%A5%9E.png)

本小组的比较喜欢moba类型的游戏，特别是王者荣耀。《王者荣耀》是由腾讯游戏天美工作室群开发的moba类国产手游，建模很精美，与朋友几人一起玩乐趣多。

### 成员介绍

***

### 项目介绍
本项目前端使用微信小程序，后端采用nodejs,缓存使用redis，cdn使用七牛。
本项目主要是爬取王者荣耀官网的数据，包括英雄技能的介绍、英雄的玩法教程、装备信息、符文模拟器、野怪信息，该小程序实现了便捷了解游戏主要信息，以帮助游戏爱好者学习游戏的技巧。

## server
#### 环境 node:`v14.5.0`, redis
#### 开发工具 vscode,微信开发工具1.05.2102010
#### 微信ui [weui](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/)
#### 热更新工具 `npm install -g supervisor  `
#### 目录结构

    ├─server              `服务器`
    │  ├─bin              `启动程序`
    │  ├─config           `服务器配置`
    │  ├─controllers      `控制器`
    │  │  ├─helper        `公共函数`
    │  │  ├─hero          `英雄函数`
    │  │  ├─other         `王者的其他一些页面函数`
    │  │  └─props         `召唤师技能和局内道具还有铭文`
    │  ├─public           `静态文件`
    │  │  ├─hero          `英雄相关的资源`
    │  │  └─props         `局内道具资源`
    │  │      ├─arms      `装备`
    │  │      ├─ming      `铭文`
    │  │      └─summoner  `召唤师技能`
    │  └─routes `路由`
    └─weixin `微信小程序`
        ├─pages `页面`
        │  ├─arms `装备页面`
        │  ├─article `文章页面`
        │  ├─components `组件`
        │  │  ├─article `文章组件`
        │  │  ├─body    `页面body组件`
        │  │  ├─head    `页面头部组件`
        │  │  └─hero-and-arms `英雄和局内道具组件`
        │  ├─hero `英雄页面`
        │  ├─index `首页`
        │  ├─logs `日志`
        │  ├─ming `铭文`
        │  └─summoner `召唤师技能`
        └─utils `小程序公共函数`
    
#### 安装依赖

    cd server
    npm i

#### 运行

    cd server
    ./run.bat
    ./run
    npm start

#### 接口（端口5000）

1. 全部英雄数据
    
    GET
    参数 无
    path /timi

2. 全部装备
    
    GET
    参数 无
    path /timi/arms

3. 全部召唤师技能
    
    GET
    参数 无
    path /timi/summoner    

3. 周限免英雄
    
    GET
    参数 无
    path /timi/freehero        

4. 新手推荐英雄
    
    GET
    参数 无
    path /timi/novicehero        

5. 指定英雄故事
    
    GET
    参数 ename (int)
    path /timi/story      

6. 指定英雄数据
    
    GET
    参数 ename (int)
    path /timi/hero      

7. 新闻 公告 活动数据
    
    GET
    参数 id (string) 当传入id时候获取指定id数据，否则获取全部数据
    path /timi/announcement      

8. 攻略
    
    GET
    参数 id (string) 当传入id时候获取指定id数据，否则获取全部数据
    path /timi/strategy

9. 小程序主页数据
    
    GET
    参数 无
    path /timi/home        

10. 小程序英雄列表数据
    
    GET
    参数 无
    path /timi/herolist          

11. 小程序装备列表数据
    
    GET
    参数 无
    path /timi/armslist  

12. 微信登录
    
    GET
    参数 

        {
            "loginType":1, //登录类型 1->微信，2->qq
            "code":4078,   //大区
            "equipment":4  //设备 3->安卓，4->ios
        }

    path /timi/record/login

13. 获取历史战绩
    GET
    参数 
        start (int) 从第几条开始
        limit (int) 每次获取多少条

    path /timi/strategy

14. 获取个人信息
    GET
    参数 无
        
    path /timi/user/info 

15. 导出王者数据
    GET
    参数 无

    path /timi/data/input   

16. 导入王者数据
    POST
    参数 

        {
            "recordData": {
                "data": [
                    {
                        "equipmentImglist": [
                            "//game.gtimg.cn/images/yxzj/img201606/itemimg/1422.jpg",
                            "//game.gtimg.cn/images/yxzj/img201606/itemimg/1136.jpg",
                            "//game.gtimg.cn/images/yxzj/img201606/itemimg/1133.jpg",
                            "//game.gtimg.cn/images/yxzj/img201606/itemimg/1114.jpg",
                            "//game.gtimg.cn/images/yxzj/img201606/itemimg/11210.jpg",
                            "//game.gtimg.cn/images/yxzj/img201606/itemimg/1131.jpg"
                        ],
                        "gameLevel": "//game.gtimg.cn/images/yxzj/web201605/page/rank23.png",
                        "gameTime": "2022-10-05 23:32:34",
                        "hero": "//game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg",
                        "kda": "https://wzyz.haibarai.com/img/wangzhe/kda/f528764d624db129b32c21fbca0cb8d6/2d995f81c062f0cc84abcc1f8e3d2c9b.jpg",
                        "mvpImg": "//game.gtimg.cn/images/yxzj/web201605/page/icon_MVP.png",
                        "result": "胜利",
                        "type": "排位赛",
                        "useTime": "15:23"
                    }
                ],
                "total": 20
            },
            "userData": {
                "avatar": "https://q.qlogo.cn/g?b=qq&nk=2551966859&s=100",
                "credit": "100",
                "grade": "至尊星耀IV",
                "gradeImg": "//game.gtimg.cn/images/yxzj/web201605/page/rank23.png",
                "heroCount": "103",
                "ladderInfo": [
                    "全部比赛：8262/胜场：3940/胜率：48%",
                    "排位赛：6636/胜场：3207/胜率：48.3%"
                ],
                "ladderWinRate": "48.3%",
                "name": "初见时风也甜 [手Q85区-阴阳谋者]",
                "skinCount": "66",
                "updateTime": "2022-10-06 11:41:40"
            }
        }    

    path /timi/data/input      