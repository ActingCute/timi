/*
 * @Author: ActingCute酱 rem486@qq.com
 * @Date: 2021-05-26 23:05:11
 * @LastEditors: ActingCute酱 rem486@qq.com
 * @LastEditTime: 2022-10-06 18:21:17
 * @FilePath: \server\app.js
 * @Description: 说明
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var timiRouter = require('./routes/timi');

var app = express();

//cors
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/timi/public', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/timi', timiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//test qiniu
// const qiniu = require("./controllers/helper/qiniu")
// const b64 = require("./controllers/record/tsetBase64")
// qiniu.newBase64(b64, 'img/wangzhe/kda/testkda.jpg')

module.exports = app;