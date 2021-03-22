# 西皮滴滴
### 文档说明：本项目仅用于学习`nodejs爬虫`和`微信小程序`

![avatar](https://git.code.tencent.com/se2021/team01/timi/raw/fcb9f9b5709ead9a4396d242a734409cf0fe7596/server/public/hero/虞姬/Wallpaper/skin-bigskin-启明星使.png)

本小组的比较喜欢moba类型的游戏，特别是王者荣耀。《王者荣耀》是由腾讯游戏天美工作室群开发的moba类国产手游，建模很精美，与朋友几人一起玩乐趣多。

### 成员介绍

张辉：升学前专业是软件技术，前端学过`vue`,后端`nodejs`，对前端技术发展较为兴趣。
林志杰：升学之前的专业是电子商务，学过`HTML`、`CSS`、`JavaScript`、`C#`,对区块链有点兴趣，但是看不懂，感觉挺玄乎的。
李瑞昭：升学前专业是计算机应用技术，学过`Linux`，对网络爬虫有一丢丢感兴趣。

### 项目介绍
本项目前端使用微信小程序，后端采用nodejs,缓存使用redis，cdn使用七牛。
本项目主要是爬取王者荣耀官网的数据，包括英雄技能的介绍、英雄的玩法教程、装备信息、符文模拟器、野怪信息，该小程序实现了便捷了解游戏主要信息，以帮助游戏爱好者学习游戏的技巧。

### server
#### 环境 node:`v14.5.0`, redis
#### 开发工具 vscode,微信开发工具1.05.2102010
#### 微信ui: [weui](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/)
#### 安装依赖

    cd server
    npm i

#### 运行

    node app.js

#### 接口（端口5000）

1.全部英雄数据
    
    GET
    参数 无
    path /timi

2.全部装备
    
    GET
    参数 无
    path /timi/arms

3.全部召唤师技能
    
    GET
    参数 无
    path /timi/summoner    

3.周限免英雄
    
    GET
    参数 无
    path /timi/freehero        

4.新手推荐英雄
    
    GET
    参数 无
    path /timi/novicehero        

5.指定英雄故事
    
    GET
    参数 ename (int)
    path /timi/story      

6.指定英雄数据
    
    GET
    参数 ename (int)
    path /timi/hero      

7.新闻 公告 活动数据
    
    GET
    参数 id (string) 当传入id时候获取指定id数据，否则获取全部数据
    path /timi/announcement      

8.攻略
    
    GET
    参数 id (string) 当传入id时候获取指定id数据，否则获取全部数据
    path /timi/strategy

9.小程序主页数据
    
    GET
    参数 无
    path /timi/home        

9.小程序英雄列表数据
    
    GET
    参数 无
    path /timi/herolist          