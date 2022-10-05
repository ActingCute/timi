/*
 * @Author: ActingCute酱 rem486@qq.com
 * @Date: 2021-05-26 23:06:09
 * @LastEditors: ActingCute酱 rem486@qq.com
 * @LastEditTime: 2022-10-05 15:27:59
 * @FilePath: \server\routes\timi.js
 * @Description: 说明
 */
var express = require('express');
var router = express.Router();
const base = require('./base');

router.get('/', base.index);
router.get('/home', base.home);
router.get('/announcement', base.announcement);
router.get('/arms', base.arms);
router.get('/armslist', base.armslist);
router.get('/freehero', base.freehero);
router.get('/hero', base.hero);
router.get('/herolist', base.herolist);
router.get('/novicehero', base.novicehero);
router.get('/story', base.story);
router.get('/strategy', base.strategy);
router.get('/summoner', base.summoner);
router.post('/record/init', base.recordInit);
router.post('/record/login', base.recordLogin);
router.get('/record/get', base.recordData);
router.get('/user/info', base.recordUserData);

module.exports = router;