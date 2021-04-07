/**
 * 用户模块
 */
var express = require('express');
var http = require("http");
var fly = require("flyio"); //方式1
var request = require('request'); //方式2
var urlencode = require('urlencode');
var cookieParser = require('cookie-parser');
var main = require('./main');
var app = express();
app.use(cookieParser()); //使用cookie中间件
const fs = require('fs');
var upload = require('multer')({
	dest: 'uploads/'
}); //文件上传中间件

////form表单需要的中间件。
//var mutipart= require('connect-multiparty');
//
//var mutipartMiddeware = mutipart();
//app.use(mutipart({uploadDir:'./uploads'}));

//角色管理
app.get('/role', function (req, res) {
	console.log("角色列表");
	res.render('modular_users/role', {
		title: '常州市建筑科学研究院集团'
	});
});

//角色的列表
app.get('/rolelist', function (req, res) {
	var page = req.query.page;
	var limit = req.query.limit;
	fly.get({url:global.base + '/admin/role/list?page='+page+'&limit='+limit,headers: {"content-type": "application/json",'token':req.cookies.sessionId}})
		.then(function (response) {
			res.json(response.data);
		})
		.catch(function (error) {
			console.log(error);
		});
});

//角色的添加
app.post('/save', function (req, res, next) {
	console.log('角色的添加')
	var name = req.body.name;
	// console.log(rid);	 console.log(name);
	console.log(name);
	var options = {
		method: 'POST',
		url: global.base + '/admin/role/save',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			"role.name": name,
		}
	};
	request.post(options, function (error, response, body) {
		console.log(body);
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
//角色的编辑
app.post('/update', function (req, res, next) {
	console.log('角色的编辑')
	var rid = req.body.id;
	var name = req.body.name;
	// console.log(rid);	 console.log(name);
	console.log(name,rid);
	var options = {
		method: 'POST',
		url: global.base + '/admin/role/update',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			"role.name": name,
			"role.id":rid
		}
	};
	request.post(options, function (error, response, body) {
		console.log(body);
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});

//角色删除
app.post('/roledel', function (req, res) {
	console.log("角色删除");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'Post',
		url: global.base + '/admin/role/delete',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {ids:ids}
	};
	request.post(options, function (error, response, body) {
		console.log(body);
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});

});

//角色编辑
app.get('/roleedit', function (req, res) {
	console.log("角色编辑");
	var rid = req.query.id;
	var name=req.query.name;
	if(rid>0){
		var json = {
			id: rid,
			name: name,
		};
	}else{
		var json = {
			id: 0,
			name: "",
		};
	}
	res.render('modular_users/roleedit', json);
});





//部门的添加 或编辑
app.post('/departmentedit', function (req, res, next) {
	var rid = req.body.id;
	var name = req.body.name;
	console.log(name);
	var type = req.body.type;
	var pid = req.body.pid;
	var reportid = req.body.reportid;
	var reportname = req.body.reportname;
	var reportno = req.body.reportno;
	//请求体
	var options = {
		method: 'POST',
		url: global.userurl + '/api/GetDepartment/add',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			id: rid,
			parent_id: pid,
			name: name,
			type: type,
			report_signuser_id: reportid,
			report_signuser_no: reportno,
			report_signuser_name: reportname
		}
	};
	console.log(options);
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(body);
		} else {
			console.log(error);
		}

	});
});
//部门的删除
app.post('/departmentdetele', function (req, res, next) {
	var rid = req.body.id;
	//请求体
	var options = {
		method: 'POST',
		url: global.base + '/admin/department/delete?id=' + rid,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		}
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(body);
		} else {
			console.log(error);
		}
	});
});
//菜单管理
app.get('/menu', function (req, res) {
	console.log("菜单管理");
	var rid = req.query.rid;
	var json = {
		rid: 0,
		menu: [],
	};
	//获取菜单展示
	request({url:global.base + '/admin/role/getRoleMenu?role.id=' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			var jsonstr = JSON.parse(body);
			if(jsonstr.status=="ok"){
				json.menu = jsonstr.message;
				json.rid=rid
				res.render('modular_users/menu', json);
			}
		}
	});
});
//启用或停用主菜单
app.get('/toggleRoleMenu', function (req, res) {
	console.log("启用或停用主菜单");
	var rid = req.query.id;
	var menuId=req.query.menuId;
	var enable=req.query.enable=="true"?1:0;
	console.log(enable)
	//获取菜单展示
	request({url:global.base + '/admin/role/toggleRoleMenu?role.id=' + rid+'&menuId='+menuId+'&enable='+enable,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			var jsonstr = JSON.parse(body);
			res.json(jsonstr);
		}
	});
});
//菜单编辑添加页
app.get('/addmenu', function (req, res) {
	console.log("添加菜单");
	var rid = req.query.rid; //角色id
	var json = {
		id: rid,
		name: "",
		sort: 0,
		icon: "",
		extra: "",
	};
	console.log(rid)
	if (rid > 0) {
		//取数据
		var url = global.base + '/admin/role/getRoleMenu?role.id=' + rid
		console.log(url);
		request({url:url,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
				var jsonstr = JSON.parse(body);
				json.id = jsonstr.message.roleId;
				json.name = jsonstr.message.name;
				json.sortNum = jsonstr.message.sortNum;
				json.icon = jsonstr.message.icon;
				json.extra = jsonstr.message.extra;
				res.render('modular_users/addmenu', json);
			}
		});
	} else {
		res.render('modular_users/addmenu', json);
	}
});

//菜单编辑添加
app.post('/addmenu', function (req, res) {
	console.log("添加|编辑菜单");
	//请求添加接口 post
	var rid = req.body.rid; //角色编号
	var name = req.body.name;
	var icon = req.body.icon;
	var sortNum = req.body.sortNum;
	var extra = req.body.extra;
	var options = {
		method: 'Post',
		url: global.userurl + '/api/GetMenu/AddMenu',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			"role.id": rid,
			name: name,
			icon: icon,
			sortNum: sortNum,
			extra: extra,
		}
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body);
			res.json(body);
		} else {
			console.log(error);
		}
	});
});

//菜单删除
app.get('/menudelete', function (req, res) {
	console.log("菜单删除");
	var rid = req.query.id;
	//获取菜单展示
	request(global.userurl + '/api/GetMenu/Delete?idlist=' + rid, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body);
			res.json(body);
		} else {
			console.log(body);
		}

	});

});

//补充菜单子项
app.post('/addmenujson', function (req, res) {
	console.log("菜单子项添加");
	var roleMenuId = req.body.pid;
	var name = req.body.name;
	var url = req.body.href;
	var sortNum = req.body.sort;
	//开始
	var options = {
		method: 'Post',
		url: global.base + '/admin/role/addSubMenu',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			roleMenuId: roleMenuId,
			name: name,
			sortNum: sortNum,
			url: url,
		}
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body);
			res.json(body);
		} else {
			console.log(error);
		}
	});

});
//更新菜单子项
app.post('/updatemenujson', function (req, res) {
	console.log("更新菜单子项");
	var id = req.body.id;
	var name = req.body.name;
	var url = req.body.href;
	var sortNum = req.body.sort;
	//开始
	var options = {
		method: 'Post',
		url: global.base + '/admin/role/updateSubMenu',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			id: id,
			name: name,
			sortNum: sortNum,
			url: url,
		}
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(body);
		} else {
			console.log(error);
		}
	});

});
//获取主菜单对应的子项列表
app.get('/menuitemlist', function (req, res) {
	console.log("菜单子项列表");
	var rid = req.query.id;
	//获取菜单展示
	request({url:global.base + '/admin/role/getSubMenu?roleMenuId=' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		}
	});

});
//日志列表页
app.get('/reportoverdue', function (req, res) {
	console.log("日志列表页");
	res.render('modular_users/reportoverdue');
});
//日志列表
app.get('/loglist', function (req, res) {
	console.log("日志列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var startDate = req.query.startDate?req.query.startDate:'';
	var endDate = req.query.endDate?req.query.endDate:'';
	var error = req.query.error?req.query.error:'';
	console.log(req.query)
	//获取菜单展示
	request({url:global.base + '/admin/log/list?page=' + page+'&limit='+limit+'&keyword='+keyword+'&startDate='+startDate+'&endDate='+endDate+'&error='+error,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		}
	});

});
//删除子项
app.get('/menuitemdelete', function (req, res) {
	console.log("菜单删除子项删除");
	var rid = req.query.id;
	//获取菜单展示
	request({url:global.base + '/admin/role/deleteSubMenu?id=' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body);
			res.json(body);
		} else {
			console.log(body);
		}

	});

});

//获取邮箱SMTP设置
app.get('/emailsetting', function (req, res) {
	console.log("获取邮箱SMTP设置");
	var json={}
	var url = global.base + '/admin/account/getMailSetting'
	console.log(url);
	request({url:url,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			var jsonstr = JSON.parse(body).message;
			json.addresser = jsonstr.addresser;
			json.email = jsonstr.email;
			json.smtpHost = jsonstr.smtpHost;
			json.smtpPort = jsonstr.smtpPort;
			json.testEmail=""
			json.password=""
			// json.extra = jsonstr.extra;
			res.render('modular_users/emailsetting', json);
		}
	});
});
//更新邮箱SMTP设置
app.post('/updateMailSetting', function (req, res) {
	console.log("更新邮箱SMTP设置");
	var data=req.body
	console.log(data)
	var options = {
		method: 'Post',
		url: global.base + '/admin/account/updateMailSetting',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			addresser: data.addresser,
			email: data.email,
			password: data.password,
			smtpHost: data.smtpHost,
			smtpPort:data.smtpPort,
			testEmail:data.testEmail
		}
	};
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			var jsonstr = JSON.parse(body);
			console.log(jsonstr);
			res.json(jsonstr);
		}
	});
});
//用户管理
app.get('/adminuser', function (req, res) {
	console.log("用户管理");
	res.render('modular_users/adminuser');
});
//用户的列表
app.get('/adminuserslist', function (req, res) {
	console.log("用户的列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var role = req.query.role?urlencode(req.query.role):"";
	var keyword = req.query.keyword?urlencode(req.query.keyword):"";
	console.log(req.query)
	fly.get({url:global.base + '/admin/account/list?page=' + page + '&limit=' + limit + '&keyword=' + keyword + '&role=' + role,headers: {"content-type": "application/json",'token':req.cookies.sessionId}})
		.then(function (response) {
			console.log(response.data)
			res.json(response.data);
		})
		.catch(function (error) {
			console.log(error);
		});
});
//角色下拉
app.get('/queryAllRoleList', function (req, res) {
	console.log("角色下拉");
	request({url:global.base + '/admin/role/list?page=-1&limit=0',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var jsonstr = JSON.parse(body);
				console.log(jsonstr);
				res.json(jsonstr);
			} else {
				console.log(body);
			}
		});
});
//重置用户密码
app.get('/resetPassword', function (req, res) {
	console.log("重置用户密码");
	var id=req.query.id;
	request({url:global.base + '/admin/account/resetPassword?id='+id,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
				var jsonstr = JSON.parse(body);
				res.json(jsonstr);
			} else {
				console.log(body);
			}
		});
});
//用户添加页
app.get('/adminusersadd', function (req, res) {
	console.log("用户添加页");
	res.render('modular_users/adminusersadd');
});
//新增用户
app.post('/create', function (req, res) {
	console.log("新增用户");
	var data = req.body;
	var options = {
		method: 'Post',
		url: global.base + '/admin/account/create',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form:{
			roleArray:JSON.stringify(data.role.split(",")),
			id:data.id,
			name:data.name,
			nickName:data.nickName,
			email:data.email,
			extra:data.extra,
			number:data.number,
			password:data.password
		}
	};
	console.log(options);
	request.post(options, function (error, response, body) {
		console.log(body);
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
	//res.render('modular_users/witnessback');
});
//获取用户编辑页
app.get('/adminuseredit', function (req, res) {
	console.log("获取用户编辑页");
	var id=req.query.id;
	var json={}
	request({url:global.base + '/admin/account/getAccountById?id=' + id,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var jsonstr = JSON.parse(body).message;
				console.log(jsonstr);
				json.id = jsonstr.id;
				json.loginName = jsonstr.loginName;
				json.roleArray = jsonstr.roleArray;
				json.nickName = jsonstr.nickName;
				json.extra = jsonstr.extra;
				json.email = jsonstr.email;
				console.log(json)
				res.render('modular_users/adminuseredit', json);
			} else {
				console.log(body);
			}
		});
});
//用户编辑页
app.post('/adminuseredit', function (req, res) {
	console.log("用户编辑页");
	console.log(req.body)
	var data=req.body
	console.log(JSON.stringify(data.role.split(",")))
	var options = {
		method: 'Post',
		url: global.base + '/admin/account/updateAccount',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			roleArray:JSON.stringify(data.role.split(",")),
			id:data.id,
			loginName:data.loginName,
			nickName:data.nickName,
			email:data.email,
			extra:data.extra,
		}
	};
	request.post(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var jsonstr = JSON.parse(body);
				console.log(jsonstr);
				res.json(jsonstr);
				
			} else {
				console.log(body);
			}
		});

});
//用户删除
app.post('/adminuserdel', function (req, res, next) {
	console.log("用户删除");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/account/removeAccounts',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {ids:ids}
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
//获取所有的下拉框类别页
app.get('/dropdown', function (req, res) {
	console.log("获取所有的下拉框类别页");
	res.render('modular_users/dropdown');
});
//下拉框管理
//获取所有的下拉框类别
app.get('/listCategory', function (req, res) {
	console.log("获取所有的下拉框类别");
	request({url:global.base + '/admin/dataDic/listCategory',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
				res.json(JSON.parse(body));
			} else {
				console.log(body);
			}
		});
});
//获取下拉框选项
app.get('/listOption', function (req, res) {
	console.log("获取下拉框选项");
	var category=urlencode(req.query.category);
	console.log(category)
	request({url:global.base + '/admin/dataDic/listOption?category='+category,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body)
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//获取添加下拉框选项页
app.get('/dropdownedit', function (req, res) {
	console.log("获取下拉框选项页");
	var category=req.query.category
	console.log(category)
	res.render('modular_users/dropdownedit',{category:category});
});
//添加下拉框选项
app.post('/addOption', function (req, res) {
	console.log("添加下拉框选项");
	console.log(req.query)
	var category=req.query.category
	var value=req.query.value
	var options = {
		method: 'Post',
		url: global.base + '/admin/dataDic/addOption',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			category:category,
			value:value,
		}
	};
	request.post(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var jsonstr = JSON.parse(body);
				console.log(jsonstr);
				res.json(jsonstr);
			} else {
				console.log(body);
			}
		});

});
//下拉框选项删除
app.post('/removeOption', function (req, res, next) {
	console.log("下拉框选项删除");
	var category = req.query.category;
	var value = req.query.value;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/dataDic/removeOption',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			category:category,
			value:value
		}
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
//客户管理
app.get('/customer', function (req, res) {
	console.log("客户管理");
	res.render('modular_users/customer');
});
//客户管理列表
app.get('/customerlist', function (req, res) {
	console.log("客户管理列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):"";
	console.log(req.query)
	fly.get({url:global.base + '/admin/customer/list?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}})
		.then(function (response) {
			console.log(response.data)
			res.json(response.data);
		})
		.catch(function (error) {
			console.log(error);
		});
});
//获取客户管理编辑页
app.get('/customeredit', function (req, res) {
	console.log("获取客户管理编辑页");
	var enterpriseId=req.query.enterpriseId;
	var name=req.query.name
	var address=req.query.address
	var json={
		name:"",
		address:"",
		enterpriseId:enterpriseId
	}
	if(enterpriseId>0){
		json.name=name
		json.address=address
		res.render('modular_users/customeredit',json);
	}else{
		res.render('modular_users/customeredit',json);
	}
});
//客户管理的新增
app.post('/customeradd', function (req, res, next) {
	console.log('客户管理的新增')
	var name = req.body.name;
	var address = req.body.address;
	console.log(name,address);
	var options = {
		method: 'POST',
		url: global.base + '/admin/customer/add',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			name: name,
			address:address
		}
	};
	request.post(options, function (error, response, body) {
		console.log(body);
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
//客户管理的编辑
app.post('/customerupdate', function (req, res, next) {
	console.log('客户管理的编辑')
	var rid = req.body.enterpriseId;
	var name = req.body.name;
	var address = req.body.address;
	console.log(name,rid,address);
	var options = {
		method: 'POST',
		url: global.base + '/admin/customer/update',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			name: name,
			enterpriseId:rid,
			address:address
		}
	};
	request.post(options, function (error, response, body) {
		console.log(body);
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
//客户管理删除
app.post('/customerdel', function (req, res, next) {
	console.log("客户管理删除");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/customer/delete',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {ids:ids}
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
//客户联系人管理
app.get('/contacts', function (req, res) {
	console.log("客户联系人管理");
	var enterpriseId=req.query.enterpriseId
	res.render('modular_users/contacts',{enterpriseId:enterpriseId});
});
//客户联系人管理列表
app.get('/contactslist', function (req, res) {
	console.log("客户联系人管理列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):"";
	var enterpriseId=req.query.enterpriseId
	console.log(req.query)
	fly.get({url:global.base + '/admin/customer/listContact?page=' + page + '&limit=' + limit + '&keyword=' + keyword+'&enterpriseId='+enterpriseId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}})
		.then(function (response) {
			console.log(response.data)
			res.json(response.data);
		})
		.catch(function (error) {
			console.log(error);
		});
});
//获取客户联系人编辑页
app.get('/contactsedit', function (req, res) {
	console.log("获取客户联系人编辑页");
	var id=req.query.id;
	var name=req.query.name
	var email=req.query.email
	var phoneNumber=req.query.phoneNumber
	var json={
		name:"",
		phoneNumber:"",
		email:"",
		enterpriseId:0,
		id:0
	}
	if(id>0){
		json.name=name
		json.phoneNumber=phoneNumber
		json.email=email
		json.id=id
		res.render('modular_users/contactsedit',json);
	}else{
		var enterpriseId=req.query.enterpriseId
		json.enterpriseId=enterpriseId
		console.log(json)
		res.render('modular_users/contactsedit',json);
	}
});
//客户联系人的新增
app.post('/addContact', function (req, res, next) {
	console.log('客户联系人的新增')
	var name = req.body.name;
	var phoneNumber = req.body.phoneNumber;
	var email=req.body.email
	var enterpriseId=req.body.enterpriseId
	console.log(name,phoneNumber,email,enterpriseId);
	var options = {
		method: 'POST',
		url: global.base + '/admin/customer/addContact',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			name: name,
			email:email,
			enterpriseId:enterpriseId,
			phoneNumber:phoneNumber
		}
	};
	request.post(options, function (error, response, body) {
		console.log(body);
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
//客户联系人的编辑
app.post('/updateContact', function (req, res, next) {
	console.log('客户联系人的编辑')
	var rid = req.body.id;
	var name = req.body.name;
	var phoneNumber = req.body.phoneNumber;
	var email=req.body.email
	console.log(name,rid,phoneNumber,email);
	var options = {
		method: 'POST',
		url: global.base + '/admin/customer/updateContact',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			name: name,
			email:email,
			id:rid,
			phoneNumber:phoneNumber
		}
	};
	request.post(options, function (error, response, body) {
		console.log(body);
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
//客户联系人删除
app.post('/contactsdel', function (req, res, next) {
	console.log("客户联系人删除");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/customer/deleteContact',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {ids:ids}
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});

//报告布局
app.get('/layout', function (req, res) {
	console.log("报告布局");
	res.render('modular_users/layout');
});
//获取报告Overlay配置
app.get('/getReportOverlaySetting', function (req, res) {
	console.log("获取报告Overlay配置");
	request({url:global.base + '/admin/setting/getReportOverlaySetting',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
//更新报告Overlay设置
app.get('/updateReportOverlaySetting', function (req, res) {
	console.log("更新报告Overlay设置");
	var array=req.query.array
	console.log(req.query)
	var options = {
		method: 'POST',
		url: global.base + '/admin/setting/updateReportOverlaySetting',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		body: array
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
module.exports = app;