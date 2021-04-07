/**
 * New node file
 */
var express = require('express');
var fly = require("flyio");
var cookieParser = require('cookie-parser');
var request = require('request'); //方式2
var main = require('./main');
var urlencode = require('urlencode');
var app = express();
app.use(cookieParser()); //使用cookie中间件
//合创选择登陆模块
app.get('/', function (req, res) {
	console.log("合创选择登陆模块");
	res.render('HClogin/HClogin');
});
app.get('/login', function (req, res) {
	console.log("合创登陆模块");
	res.render('HClogin/login');
});

module.exports = app;