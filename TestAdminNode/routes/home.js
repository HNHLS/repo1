/**
 * New node file
 */
/**
 * New node file
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var request = require('request'); //方式2
var fly = require("flyio");
var urlencode = require('urlencode');
var main = require('./main');
var app = express();

app.use(cookieParser()); //使用cookie中间件

app.get('/', function (req, res) {
	console.log("系统首页");
	var token = req.cookies.sessionId;
	var nickName = req.cookies.nickName;
	var chosen=req.query.chosen?req.query.chosen:decodeURIComponent(req.cookies.chosen); 
	console.log(chosen)
//	var isshow
////	console.log(code);
//	var url = global.test + '/api/GetTestPeople/GetLessThanFive';
////	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			isshow = JSON.parse(body)
//		} else {
//			console.log(body);
//		}
//	})
	if (token != null && nickName != null) {
		var options = {
			method: 'Post',
			url: global.base + '/admin/login/listMenu',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'token':req.cookies.sessionId,
			}
		};
		request.post(options, function (error, response, body) {
//			console.log(options);
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body));	
				var resultjson = JSON.parse(body);
				if (resultjson.status == 'ok') {
					//存放权限cookie
					var cookie = {
						account: resultjson.account,
						user_no: resultjson.id,
						user_name: resultjson.name,
						user_did: resultjson.department_id,
						user_dep: resultjson.department_name,
						token: token,
					}
					res.cookie('chosen', chosen);
					var menulist=resultjson.message
//					var menulist=[{"id":12,"name":"任务管理","sort":0,
//									"menuitems":[{"id":143,"menuid":12,"name":"任务列表","href":"/modular_task/taskmanagement","sort":0}
//									,{"id":145,"menuid":12,"name":"测试排程","href":"/modular_task/scheduling","sort":1}
//									,{"id":146,"menuid":12,"name":"检测开始","href":"/modular_task/teststart","sort":2}
//									,{"id":147,"menuid":12,"name":"数据复核","href":"/modular_task/review","sort":3}
//									,{"id":148,"menuid":12,"name":"样品退库","href":"/modular_task/withdrawal","sort":4}
//									,{"id":149,"menuid":12,"name":"报告编写","href":"/modular_task/reportwriting","sort":5}
//									,{"id":150,"menuid":12,"name":"报告审核","href":"/modular_task/reportaudit","sort":6}
//									,{"id":151,"menuid":12,"name":"报告签发","href":"/modular_task/reportIssue","sort":7}
//									,{"id":152,"menuid":12,"name":"项目文件","href":"/modular_task/projectfile","sort":8}]
//								},{"id":13,"name":"样品管理","sort":1,
//									"menuitems":[{"id":143,"menuid":13,"name":"样品列表","href":"/modular_sample/sampling","sort":0}
//									,{"id":146,"menuid":13,"name":"样品退库","href":"/modular_sample/partwithdrawal","sort":1}
//									,{"id":147,"menuid":13,"name":"退样管理","href":"/modular_sample/withdrawal","sort":2}]
//								},{"id":14,"name":"设备管理","sort":2,
//									"menuitems":[{"id":143,"menuid":14,"name":"甘特图","href":"/modular_equipment/Gantt","sort":0}
//									,{"id":144,"menuid":14,"name":"基础管理","href":"/modular_equipment/basic","sort":1}
//									,{"id":145,"menuid":14,"name":"设备台账","href":"/modular_equipment/Ledger","sort":2}
//									,{"id":146,"menuid":14,"name":"检定校准","href":"/modular_equipment/Calibration","sort":3}
//									,{"id":147,"menuid":14,"name":"期间核查","href":"/modular_equipment/Checks","sort":4}
//									,{"id":148,"menuid":14,"name":"设备保养","href":"/modular_equipment/Maintain","sort":5}
//									,{"id":148,"menuid":14,"name":"设备维修","href":"/modular_equipment/Repair","sort":6}
//									,{"id":149,"menuid":14,"name":"耗材/备件","href":"/modular_equipment/Consumables","sort":7}]
//								},{"id":19,"name":"资质管理","sort":2,
//									"menuitems":[{"id":143,"menuid":19,"name":"人员管理","href":"/modular_qualifications/personnel","sort":0}
//									,{"id":144,"menuid":19,"name":"群组管理","href":"/modular_qualifications/department","sort":1}]
//								},{"id":15,"name":"报表统计","sort":3,
//									"menuitems":[{"id":156,"menuid":15,"name":"项目统计","href":"/modular_statistics/project","sort":0}
//									,{"id":150,"menuid":15,"name":"费用统计","href":"/modular_statistics/cost","sort":1}
//									,{"id":151,"menuid":15,"name":"设备统计","href":"/modular_statistics/equipment","sort":2}
//									,{"id":152,"menuid":15,"name":"资质统计","href":"/modular_statistics/qualifications","sort":3}
//									,{"id":153,"menuid":15,"name":"样品统计","href":"/modular_statistics/sample","sort":4}]
//								},{"id":16,"name":"进度总览","sort":4,
//									"menuitems":[{"id":157,"menuid":16,"name":"项目管理","href":"/modular_progress/project","sort":0}
//									,{"id":158,"menuid":16,"name":"报告逾期","href":"/modular_progress/reportoverdue","sort":1}
//									,{"id":159,"menuid":16,"name":"报告查询","href":"/modular_progress/reportquery","sort":2}]
//								},{"id":17,"name":"基础管理","sort":5,
//									"menuitems":[{"id":161,"menuid":17,"name":"检测依据","href":"/modular_basics/standard_list","sort":0}
//									,{"id":162,"menuid":17,"name":"判定依据","href":"/modular_basics/Judgement","sort":1}
//									,{"id":163,"menuid":17,"name":"测试序列","href":"/modular_basics/testproject","sort":2}
//									,{"id":164,"menuid":17,"name":"测试项","href":"/modular_basics/testItem","sort":3}
//									]//,{"id":164,"menuid":17,"name":"模板管理","href":"/modular_basics/template","sort":4}
//								},{"id":18,"name":"系统设置","sort":6,
//									"menuitems":[{"id":165,"menuid":18,"name":"账号管理","href":"/modular_users/adminuser","sort":0}
//									,{"id":166,"menuid":18,"name":"客户管理","href":"/modular_users/customer","sort":1}
//									,{"id":167,"menuid":18,"name":"角色管理","href":"/modular_users/role","sort":2}
//									,{"id":168,"menuid":18,"name":"日志管理","href":"/modular_users/reportoverdue","sort":3}
//									,{"id":169,"menuid":18,"name":"下拉框管理","href":"/modular_users/dropdown","sort":4}]
//								}]
					var menu = {
						menulist: menulist
					}//处理不修改页面的问题
					var json = {
//						dep:'超级管理员',
						username: nickName,
						chosen:chosen,
						menulist: menu,
					}
					console.log(menu)
					res.render('home/index', json);
				} else {
					var json = {
						msg: resultjson.message
					}
					res.render('login/noin', json);
				}

			} else {
				console.log(error);
			}
		});
	} else {
		//不存在
		res.redirect('/login');
	}
});
//查看是否有新通知
app.get('/hasNew',function(req, res){
	console.log("查看是否有新通知")
	request({url:global.base + '/admin/notification/hasNew',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body))
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})
//获取用户通知列表页
app.get('/message',function(req, res){
	console.log("获取用户通知列表页")
	res.render('home/message')
})
//获取用户通知列表
app.get('/notification',function(req, res){
	console.log("获取用户通知列表")
	var page = req.query.page;
	var limit = req.query.limit;
	var startDate= req.query.startDate?req.query.startDate:'';
	var endDate= req.query.endDate?req.query.endDate:'';
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	request({url:global.base + '/admin/notification/list?page=' + page + '&limit=' + limit + '&keyword=' + keyword +'&endDate='+endDate+'&startDate='+startDate,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body))
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})
//设置已读
app.get('/updateViewed',function(req, res){
	console.log("设置已读")
	var ids = req.query.ids;
	console.log(req.query)
	var options = {
		method: 'POST',
		url: global.base + '/admin/notification/updateViewed',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {ids:ids}
	};
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body))
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})
//修改密码页面
app.get('/password', function (req, res) {
	console.log("修改密码页面");
	res.render('home/password');
})
//修改密码
app.post('/modifyPassword',function(req, res){
	console.log("修改密码")
	var originalPass = req.body.originalPass;
	var newPass = req.body.newPass;
	console.log(req.body)
	var options = {
		method: 'POST',
		url: global.base + '/admin/account/modifyPassword',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			originalPass:originalPass,
			newPass:newPass
		}
	};
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body))
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})
//拉取待处理个数
//app.get('/getnum', function (req, res) {
//	console.log("拉取待处理个数");
//	//反序列話json
//	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
//	var userid = cookie.user_no;
//	var url = req.cookies.taskurl + '/api/Task_List/GetUserTaskNum?userid=' + userid;
//	console.log(url);
//	request(url, function (error, response, body) {
//		//console.log(response);
//		if (!error && response.statusCode == 200) {
//			res.json(JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//
////待办页
//app.get('/daiban', function (req, res) {
//	console.log("待办页");
//	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
//	var url = req.cookies.taskurl + '/api/Statistics/GetTodoItems';
//	var option = {
//		url: url,
//		headers: {
//			token: cookie.token,
//		}
//	}
//	console.log(option);
//	request(option, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			var msg = JSON.parse(body);
//			console.log(msg);
//			res.render('home/daiban', msg);
//		} else {
//			console.log(error);
//		}
//	});
//
//})

////获取消息列表
//app.get('/getmessage', function (req, res) {
//	console.log("获取消息列表");
//	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
//	var url = global.userurl+ '/api/GetMessage/GetUnitCerList?userid='+cookie.user_no;
//	var option = {
//		url: url
//	}
//	request(option, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			var msg = JSON.parse(body);
//			console.log(msg);
//			res.json(msg);
//		} else {
//			console.log(error);
//		}
//	});
//
//})
//
////已读消息列表
//app.get('/readmessage', function (req, res) {
//	console.log("已读消息列表");
//	var id = req.query.id;
//	var url = global.userurl+ '/api/GetMessage/Read?id='+id;
//	var option = {
//		url: url
//	}
//	console.log(option);
//	request(option, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			var msg = JSON.parse(body);
//			console.log(msg);
//			res.json(msg);
//		} else {
//			console.log(error);
//		}
//	});
//
//})
//
//
////home
//app.get('/home', function (req, res) {
//	console.log("首页统计");
//	var url = req.cookies.taskurl + '/api/Statistics/GetList';
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.render('home/home', JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//
//
////测试表格页
//app.get('/table', function (req, res) {
//	console.log("测试表格页");
//	res.render('home/table');
//})
//
//app.get('/Statistics1', function (req, res) {
//	console.log("统计1");
//	var url = req.cookies.taskurl + '/api/Statistics/GetStatic1';
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.render('home/Statistics1', JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//
//})
//
//app.get('/Statistics2', function (req, res) {
//	console.log("统计2");
//	var url = req.cookies.taskurl + '/api/Statistics/GetStatic_Data';
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.render('home/Statistics2', JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//
//
//app.get('/t2', function (req, res) {
//	console.log("统计2");
//	var year = req.query.year;
//	var depid = req.query.depid;
//	var url = req.cookies.taskurl + '/api/Statistics/GetStatic2?year=' + year + '&depid=' + depid;
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.json(JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//
//
//app.get('/t3', function (req, res) {
//	console.log("统计3");
//	var year = req.query.year;
//	var month = req.query.month;
//	var url = req.cookies.taskurl + '/api/Statistics/GetStatic3?year=' + year + '&month=' + month;
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.json(JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//
//
//app.get('/t4', function (req, res) {
//	console.log("统计4");
//	var year = req.query.year;
//	var type = req.query.type;
//	var url = req.cookies.taskurl + '/api/Statistics/GetStatic4?year=' + year + '&type=' + type;
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.json(JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//app.get('/t5', function (req, res) {
//	console.log("统计5");
//	var year = req.query.year;
//	var type = req.query.type;
//	var url = req.cookies.taskurl + '/api/Statistics/GetStatic5?year=' + year + '&type=' + type;
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.json(JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//app.get('/t6', function (req, res) {
//	console.log("统计6");
//	var year = req.query.year;
//	var projectid = req.query.projectid;
//	var url = req.cookies.taskurl + '/api/Statistics/GetStatic6?year=' + year + '&projectid=' + projectid;
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.json(JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//app.get('/t7', function (req, res) {
//	console.log("统计7");
//	var year = req.query.year;
//	var url = req.cookies.taskurl + '/api/Statistics/GetStatic7?year=' + year;
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.json(JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//app.get('/t8', function (req, res) {
//	console.log("统计8");
//	var year = req.query.year;
//	var depid = req.query.depid;
//	var url = req.cookies.taskurl + '/api/Statistics/GetStatic8?year=' + year + '&depid=' + depid;
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.json(JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//app.get('/t9', function (req, res) {
//	console.log("统计9");
//	var year = req.query.year;
//	var depid = req.query.depid;
//	var url = req.cookies.taskurl + '/api/Statistics/GetStatic9?year=' + year + '&depid=' + depid;
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.json(JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//app.get('/t10', function (req, res) {
//	console.log("统计10");
//	var year = req.query.year;
//	var url = req.cookies.taskurl + '/api/Statistics/GetStatic10?year=' + year;
//	console.log(url);
//	request(url, function (error, response, body) {
//		if (!error && response.statusCode == 200) {
//			console.log(JSON.parse(body));
//			res.json(JSON.parse(body));
//		} else {
//			console.log(body);
//		}
//	})
//})
//
//
////测试编码
//app.get('/testcode', function (req, res) {
//	console.log("测试编码");
//	var encode = main.aesEncode("123123", "songmili")
//	console.log(encode);
//	var decode = main.aesDecode(encode, "songmili");
//	console.log(decode);
//})
//
//
////待办待处理任务列表
//app.get('/daibanlist', function (req, res) {
//	console.log("待办页");
//	var type= req.query.type;//列表类别 0）今天 1）1-3工作日 2）3-7个工作日 3）7个工作日以上
//	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
//	var url = req.cookies.taskurl + '/api/Statistics/UntreatedTaskList?type='+type;
//	var option = {
//		url: url,
//		headers: {
//			token: cookie.token,
//		}
//	}
//	console.log(option);
//	request(option, function (error, response, body) {
//		console.log(body);
//		if (!error && response.statusCode == 200) {
//			var msg = JSON.parse(body);
//			console.log(msg);
//			var json={
//				list:msg
//			}
//			res.render('home/daibanlist', json);
//		} else {
//			console.log(error);
//		}
//	});
//
//})

//对外暴露接口
module.exports = app;