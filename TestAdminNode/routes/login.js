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

app.get('/', function (req, res) {
	res.render('login/login');
});
app.get('/noin', function (req, res) {
	console.log("提示浏览器不支持页面");
	var msg = req.query.token
	var json = {
		msg: msg
	}
	res.render('login/noin', json);
});

//退出
app.get('/loginout', function (req, res) {
	console.log("退出");
	//删除cookie
	res.clearCookie('nickName');
	res.clearCookie('loginName');
	res.clearCookie('number');
	res.clearCookie('group');
	res.clearCookie('role');
	res.clearCookie('sessionId');
	res.clearCookie('chosen');
	request({url:global.base + '/admin/login/logout',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body)
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
	
});

app.post('/login', function (req, res) {
	console.log("处理登录");
	var account = req.body.account;
	var password = req.body.password;
	console.log(account);
	console.log(password);
	var options = {
		method: 'POST',
		url: global.base + '/admin/login/login',
		headers: {
			"content-type": "application/json",
		},
		form: {
			userName: account,
			password: password,
		}
	};
	request.post(options,function(error, response, body){
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var data=JSON.parse(body)
//			res.json();
			if (data.status == "ok") { 
				//number role nickName(登陆姓名) loginName(登陆账号) group
//				console.log(data.message)
//				console.log(data.message.group)
				res.cookie('number',data.message.number)
				res.cookie('role',data.message.role);
				res.cookie('nickName',data.message.nickName);
				res.cookie('loginName',data.message.loginName);
				res.cookie('group',data.message.group);
				res.cookie('sessionId',data.message.sessionId);
				res.cookie('chosen',encodeURIComponent(data.message.chosen[0]));
				res.json({
					"errcode": 0,
					"errmsg": "ok",
					"token": data.message.sessionId,
					"chosen":data.message.chosen
				});
			}else{
				res.json({
					"errcode": 500,
					"errmsg": data.message
				});
			}
		} else {
			console.log(error);
		}
	})
//		.then(function (response) {
//			var user = response.data;
//			console.log(user);
//			if (user.status == "ok") {
//				//处理存储给客户端
//				res.cookie('taskurl', "http://" + usernickName.ip + ":" + user.port);
//				//处理过期时间
//				res.cookie('code', 'songmili');
//				//返回
//				res.json({
//					"errcode": 0,
//					"errmsg": "ok",
//					"token": user.token,
//					"depar_name": user.department_name,
//				});
//				//res.redirect('/home');
//			} else {
//				res.json({
//					"errcode": 500,
//					"errmsg": user.message
//				});
//				//var jc = req.cookies.d_jc;
//				//res.redirect('/login?errmsg=账号或密码错误&s=' + jc);
//			}
//
//		})
//		.catch(function (error) {
//			console.log(error);
//		});
});
//合创选择登陆模块
app.get('/', function (req, res) {
	console.log("合创选择登陆模块");
	res.render('login/HCchosen');
});
//选择登陆模块
app.get('/chosen', function (req, res) {
	console.log("选择登陆模块");
	res.render('login/chosen');
});
//绑定本次登录选择的部门
app.get('/bindDepartment', function (req, res) {
	console.log("绑定本次登录选择的部门");
	var department=urlencode(req.query.department) 
	console.log(req.query)
	request({url:global.base + '/admin/login/bindDepartment?department='+department,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body))
			if(JSON.parse(body).status=="ok"){
				res.cookie('chosen',department);
				res.json(JSON.parse(body));
			}
		} else {
			console.log(error);
		}
	});
});
module.exports = app;