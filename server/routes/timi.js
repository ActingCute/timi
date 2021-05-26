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

module.exports = router;
