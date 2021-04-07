/*基础管理模块*/
var express = require('express');
var http = require("http");
var request = require('request');//后台交互方式
var app = express();
var urlencode = require('urlencode');
var fs = require("fs");
var path = require("path");
var cookieParser = require('cookie-parser');
app.use(cookieParser()); //使用cookie中间件
//检测标准列表页
app.get('/standard_list', function (req, res) {
	console.log("检测标准列表页");
	res.render('modular_basics/standard_list');
})
//判定标准列表页
app.get('/Judgement', function (req, res) {
	console.log("判定标准列表页");
	res.render('modular_basics/Judgement');
})
//标准列表获取
app.get('/standard-list-info', function (req, res) {
	console.log("检测标准列表获取");
	var page = req.query.page;
	var limit = req.query.limit;
	var type = urlencode(req.query.type);
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/standard/list?page=' + page + '&limit=' + limit + '&type=' + type + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//删除标准
app.post('/standard_list', function (req, res, next) {
	console.log("删除标准");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/standard/delete',
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

//获取检测标准列表的添加 或编辑
app.get('/standardedit_list', function (req, res) {
	console.log("获取检测标准列表的添加 或编辑");
	var rid = req.query.id;
	console.log(req.query);
	var json = {
		id: 0,
		name: "",
		validDate: "",
		status: true,
		related: "",
		relatedStandard:"",
		FileList:"[]"
	};
	if (rid > 0) {
		request({url:global.base + '/admin/standard/getStandard?id=' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				if(JSON.parse(body).status=="fail"){
					res.render('home/error', {msg:jsonstr});
				}else{
					json.id = jsonstr.id;
					json.name = jsonstr.name;
					json.validDate = jsonstr.validDate;
					json.FileList = JSON.stringify(jsonstr.url);
					json.status = jsonstr.status;
					json.related = jsonstr.related
					json.relatedStandard =encodeURIComponent(JSON.stringify(jsonstr.relatedStandard))  
					res.render('modular_basics/standardedit_list', json);
				}
			} else {
				console.log(body);
			}
		});
	} else {
		res.render('modular_basics/standardedit_list', json);
		console.log(json);
		//添加页
	}
});
//上传检测标准列表的添加 或编辑
app.post('/standardedit_list', function (req, res, next) {
	console.log("上传检测标准列表的添加 或编辑");
	var rid = req.body.id;
	var name = req.body.name;//标准名称
	var validDate = req.body.validDate//实施日期
	var status = req.body.status//启用状态
	var type = "检测标准"
	var related = req.body.related //替代标准id
	var url = req.query.FileList
	console.log(req.body)
	console.log(req.query)
	if(rid>0){
		//编辑测试项
		var options = {
			method: 'POST',
			url: global.base + '/admin/standard/update',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'token':req.cookies.sessionId,
			},
			form: {
				id: rid,
				name: name,
				validDate: validDate,
				status: status,
				type: type,
				related: related,
				url:url,
			}
		};	
	}else{
		//添加测试项
		var options = {
			method: 'POST',
			url: global.base + '/admin/standard/add',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'token':req.cookies.sessionId,
			},
			form: {
				name: name,
				validDate: validDate,
				status: status,
				type: type,
				related: related,
				url: url,
			}
		};
	}
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//获取判定标准列表的添加 或编辑
app.get('/Judgementedit', function (req, res) {
	console.log("获取判定标准列表的添加 或编辑");
	var rid = req.query.id;
	console.log(req.query);
	var json = {
		id: 0,
		name: "",
		validDate: "",
		status: true,
		related: "",
		FileList:"[]",
	};
	if (rid > 0) {
		request({url:global.base + '/admin/standard/getStandard?id=' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				if(JSON.parse(body).status=="fail"){
					res.render('home/error', {msg:jsonstr});
				}else{
					json.id = jsonstr.id;
					json.name = jsonstr.name;
					json.validDate = jsonstr.validDate;
					json.FileList = JSON.stringify(jsonstr.url);
					json.status = jsonstr.status;
					json.related = jsonstr.related
					res.render('modular_basics/Judgementedit', json);
				}
			} else {
				console.log(body);
			}
		});
	} else {
		res.render('modular_basics/Judgementedit', json);
		console.log(json);
		//添加页
	}
});
//上传判定标准列表的添加 或编辑
app.post('/Judgementedit', function (req, res, next) {
	console.log("上传判定标准列表的添加 或编辑");
	var rid = req.body.id;
	var name = req.body.name;//标准名称
	var validDate = req.body.validDate//实施日期
	var status = req.body.status//启用状态
	var type = "判定标准"
	var related = req.body.related //替代标准id
	var url = req.query.FileList
	console.log(req.body)
	console.log(req.query)
	if(rid>0){
		//编辑测试项
		var options = {
			method: 'POST',
			url: global.base + '/admin/standard/update',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'token':req.cookies.sessionId,
			},
			form: {
				id: rid,
				name: name,
				validDate: validDate,
				status: status,
				type: type,
				related: related,
				url: url,
			}
		};	
	}else{
		//添加测试项
		var options = {
			method: 'POST',
			url: global.base + '/admin/standard/add',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'token':req.cookies.sessionId,
			},
			form: {
				name: name,
				validDate: validDate,
				status: status,
				type: type,
				related: related,
				url: url,
			}
		};
	}
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//下载标准表
app.get('/downLoad', function (req, res) {
	var fileName = encodeURIComponent(req.query.FileName);
	var uri = req.query.url;
	console.log(req.query);
	console.log(fileName);
	//创建文件夹目录
	var dirPath = path.join(__dirname, "file");
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath);
		console.log("文件夹创建成功");
	} else {
		console.log("文件夹已存在");
	}
	console.log(dirPath);
	let stream = fs.createWriteStream(path.join(dirPath, req.query.FileName));
	request(encodeURI(uri)).pipe(stream).on("close", function (err) {
		res.download("./routes/file/" + fileName);
	});
})
//测试项列表页
app.get('/testItem', function (req, res) {
	console.log("测试项列表页");
	var page=req.query.page?req.query.page:1
	var keyword=req.query.keyword?req.query.keyword:''
	res.render('modular_basics/testItem',{page:page,keyword:keyword});
})
//测试项列表获取
app.get('/testItemlist', function (req, res) {
	console.log("测试项列表获取");
	var page = req.query.page;
	var limit = req.query.limit;
	var standard = req.query.standard?urlencode(req.query.standard):"";
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/testItemManage/list?page=' + page + '&limit=' + limit + '&keyword=' + keyword+'&standard='+standard,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取测试项详情
app.get('/testItemedit', function (req, res) {
	console.log("获取测试项详情");
	var rid = req.query.id;
	var page=req.query.page
	var keyword=req.query.keyword
	console.log(req.query);
	var json = {
		id: 0,
		name: "",
		englishName: "",
		testStandard: "",//检测标准名称
		testClause:"",//测试条款
		main: 0,//是否是主实验，1表示是，0表示不是
		workHour:"",//完成该项测试的预估耗时，单位:小时
		equipment:[],//使用的设备对象，包含设备名称equipmentName和设备编号equipmentNumber
		condition:[],//技术要求，包含name和conditionValue
		auxiliaryEquipment:[],
		originalDataCheckInWay:1,
		page:1,
		keyword:''
	};
	if (rid > 0) {
		var url = global.base;
		request({url:url + '/admin/testItemManage/getTestItem?id=' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				if(JSON.parse(body).status=="fail"){
					res.render('home/error', {msg:jsonstr});
				}else{
					json.id = jsonstr.id;
					json.name = jsonstr.name;
					json.englishName = jsonstr.englishName;
					json.testStandard = jsonstr.testStandard;
					json.testClause = jsonstr.testClause;
					json.main = jsonstr.main
					json.workHour = jsonstr.workHour
					json.equipment = jsonstr.equipment;
					json.condition = jsonstr.condition;
					json.auxiliaryEquipment=jsonstr.auxiliaryEquipment
					json.originalDataCheckInWay=jsonstr.originalDataCheckInWay
					json.page=page
					json.keyword=keyword
					console.log(json)
					res.render('modular_basics/testItemedit', json);
				}
			} else {
				console.log(body);
			}
		});
	} else {
		console.log(json)
		res.render('modular_basics/testItemedit', json);
		//添加页
	}
});
//上传测试项的编辑
app.post('/testItemedit', function (req, res, next) {
	console.log("上传测试项的编辑");
	var rid = req.body.id;
	var name = req.body.name;
	var englishName = req.body.englishName
	var testStandard = req.body.testStandard
	var testClause = req.body.testClause
	var originalDataCheckInWay=req.body.originalDataCheckInWay
	var main = req.body.main=="false"?0:1
	var workHour = req.body.workHour
	var equipment = req.query.equipment
	var auxiliaryEquipment=req.query.auxiliaryEquipment
	var condition={}
	console.log(req.body)
	var conditionname=req.body.conditionname?req.body.conditionname:""
	var conditionValue=req.body.conditionValue?req.body.conditionValue:""
	console.log(typeof(conditionname))
	if(typeof(conditionname)=="string"){
		condition[conditionname]=conditionValue 
	}else{
		for(var i=0;i<conditionname.length;i++){
			condition[conditionname[i]]=conditionValue[i] 
		}
	}
	console.log(req.query)
	console.log(condition)
	if(rid>0){
		//编辑测试项
		var options = {
			method: 'POST',
			url: global.base + '/admin/testItemManage/update',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'token':req.cookies.sessionId,
			},
			form: {
				id: rid,
				name: name,
				englishName: englishName,
				testStandard: testStandard,
				testClause: testClause,
				main: main,
				workHour: workHour,
				equipment: equipment,
				auxiliaryEquipment:auxiliaryEquipment,
				originalDataCheckInWay:originalDataCheckInWay,
				condition: JSON.stringify(condition),
			}
		};	
	}
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//获取测试项详情
app.get('/testItemadd', function (req, res) {
	console.log("获取新增测试项详情");
	console.log(req.query);
	var json = {
		id: 0,
		name: "",
		englishName: "",
		testStandard: "",//检测标准名称
		testClause:"",//测试条款
		main: 0,//是否是主实验，1表示是，0表示不是
		workHour:"",//完成该项测试的预估耗时，单位:小时
		equipment:[],//使用的设备对象，包含设备名称equipmentName和设备编号equipmentNumber
		condition:[],//技术要求，包含name和conditionValue
		auxiliaryEquipment:[],
		originalDataCheckInWay:1,
	};
	console.log(json)
	res.render('modular_basics/testItemadd', json);
	
});
//上传测试项的添加
app.post('/testItemadd', function (req, res, next) {
	console.log("上传测试项的添加");
	var name = req.body.name;
	var englishName = req.body.englishName
	var testStandard = req.body.testStandard
	var testClause = req.body.testClause
	var originalDataCheckInWay=req.body.originalDataCheckInWay
	var main = req.body.main=="false"?0:1
	var workHour = req.body.workHour
	var equipment = req.query.equipment
	var auxiliaryEquipment=req.query.auxiliaryEquipment
	var condition={}
	console.log(req.body)
	var conditionname=req.body.conditionname?req.body.conditionname:""
	var conditionValue=req.body.conditionValue?req.body.conditionValue:""
	console.log(typeof(conditionname))
	if(typeof(conditionname)=="string"){
		condition[conditionname]=conditionValue 
	}else{
		for(var i=0;i<conditionname.length;i++){
			condition[conditionname[i]]=conditionValue[i] 
		}
	}
	console.log(req.query)
	console.log(condition)
	//添加测试项
	var options = {
		method: 'POST',
		url: global.base + '/admin/testItemManage/add',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			name: name,
			englishName: englishName,
			testStandard: testStandard,
			testClause: testClause,
			main: main,
			workHour: workHour,
			equipment: equipment,
			auxiliaryEquipment:auxiliaryEquipment,
			originalDataCheckInWay:originalDataCheckInWay,
			condition: JSON.stringify(condition),
		}
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});

//删除测试项
app.post('/testItemdel', function (req, res, next) {
	console.log("删除测试项");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/testItemManage/delete',
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
//测试序列列表页
app.get('/testproject', function (req, res) {
	console.log("测试序列列表");
	res.render('modular_basics/testproject');
})
//测试序列列表
app.get('/testprojectlist', function (req, res) {
	console.log("测试序列列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var type = urlencode(req.query.type);
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/testProjectManage/listSequence?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取测试序列详情
app.get('/testprojectedit', function (req, res) {
	console.log("获取测试序列详情");
	var rid = req.query.id;
	var jsontype=req.query.jsontype
	console.log(req.query);
	var json = {
		id: 0,
		name: "",
		testItemArray:[],//
	};
	var url = global.base;
	if (rid > 0) {
		if(jsontype){
			request({url:url + '/admin/testProjectManage/getSequence?id=' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(JSON.parse(body).message);
					var jsonstr = JSON.parse(body).message;
					res.json(JSON.parse(body));
				} else {
					console.log(body);
				}
			});
		}else{
			request({url:url + '/admin/testProjectManage/getSequence?id=' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(JSON.parse(body).message);
					var jsonstr = JSON.parse(body).message;
					if(JSON.parse(body).status=="fail"){
						res.render('home/error', {msg:jsonstr});
					}else{
						json.id = jsonstr.id;
						json.name = jsonstr.name;
						json.concurrence = jsonstr.concurrence
						json.testItemArray = jsonstr.testItemArray;
						res.render('modular_basics/testprojectedit', json);
					}
				} else {
					console.log(body);
				}
			});
		}
	} else {
		console.log(json)
		res.render('modular_basics/testprojectedit', json);
		//添加页
	}
});
//上传测试序列的添加或编辑
app.post('/testprojectedit', function (req, res, next) {
	console.log("上传测试序列的添加或编辑");
	var rid = parseInt(req.body.id);
	var name = req.body.name;
	var testItemArray= req.body.testItemArray
	console.log(req.body)
	if(rid>0){
		//编辑测试序列
		var options = {
			method: 'POST',
			url: global.base + '/admin/testProjectManage/updateSequence',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'token':req.cookies.sessionId,
			},
			form: {
				id: rid,
				name: name,
				testItemArray:JSON.stringify(testItemArray),
			}
		};	
	}else{
		//添加测试序列
		var options = {
			method: 'POST',
			url: global.base + '/admin/testProjectManage/addSequence',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'token':req.cookies.sessionId,
			},
			form: {
				name: name,
				testItemArray:JSON.stringify(testItemArray),
			}
		};
	}
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//删除测试序列
app.post('/testprojectdel', function (req, res, next) {
	console.log("删除测试序列");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/testProjectManage/deleteSequence',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {sequenceArray:ids}
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
//测试项选择设备页
app.get('/selectequipment', function (req, res) {
	console.log("测试项选择设备页");
	console.log(req.query)
	var equipmentlist=JSON.parse(req.query.equipmentlist) 
	var type=req.query.type
	res.render('modular_basics/selectequipment',{equipmentlist:equipmentlist,type:type});
})
//测试项选择设备列表
app.get('/equipmentlist', function (req, res) {
	console.log("测试项选择设备列表");
	var pageIndex = req.query.page;
	var pageSize = req.query.limit;
	var startIndex = (parseInt(req.query.page)-1)*pageSize==0?1:(parseInt(req.query.page)-1)*pageSize;
	var name = req.query.name?urlencode(req.query.name):'';
	console.log(req.query);
	var json={
			pageIndex:pageIndex,
			pageSize:pageSize,
			startIndex:startIndex,
			name:name,
			endtime:'',
			starttime:'',
			stopkind:"1"
		}
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/list',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

app.get('/standardlayer_list', function (req, res) {
	console.log("获取标准列表的添加 或编辑");
	var rid = req.query.id;
	console.log(req.query);
	var json = {
		Id: 0,
		StandardNo: "",
		StandardName: "",
		State: 0,
		ReplaceStandardid: 0,
		ReplaceStandardStarttime: "",
		FileList: 0,
	};
	if (rid > 0) {
		var url = global.basicsurl;
		request({url:url + '/api/ExecuteStandard/GetStandardDetail/' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).Data);
				var jsonstr = JSON.parse(body).Data;
				json.StandardNo = jsonstr.StandardNo;
				json.StandardName = jsonstr.StandardName;
				json.ReplaceStandardid = jsonstr.ReplaceStandardid;
				json.FileList = JSON.stringify(jsonstr.FileList);
				json.Id = jsonstr.Id;
				json.ReplaceStandardid = jsonstr.ReplaceStandardid
				json.State = jsonstr.State;
				res.render('modular_basics/standardlayer_list', json);
			} else {
				console.log(body);
			}
		});
	} else {
		res.render('modular_basics/standardlayer_list', json);
		console.log(json);
		//添加页
	}
});
//绑定模板
app.post('/bindTemplate', function (req, res, next) {
	console.log("绑定模板");
	var ids = req.query.ids;
	var templateId = req.query.templateId
	var templateName=req.query.name
	console.log(req.query)
	var options = {
		method: 'POST',
		url: global.base + '/admin/testItemManage/bindTemplate',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			ids: ids,
			templateId: templateId,
			templateName:templateName
		}
	};	
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//获取导入页面
app.get('/Import', function (req, res) {
	console.log("获取导入页面")
	var type=req.query.type
	res.render('modular_basics/Import',{type:type});
})
//上传导入页面
app.post('/Import', function (req, res, next) {
	console.log("上传导入页面");
	var fileurl = req.query.url
	var type=urlencode(req.query.type) 
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/standard/importStandard',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			url: fileurl,
			type:type
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
//导出标准
app.post('/Export', function (req, res, next) {
	console.log("导出标准");
	var type=urlencode(req.query.type) 
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/standard/exportStandard',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			type:type
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
//获取导入测试项
app.get('/ImportData', function (req, res) {
	console.log("获取导入测试项")
	res.render('modular_basics/ImportData');
})
//上传导入测试项页面
app.post('/ImportData', function (req, res, next) {
	console.log("上传导入测试项页面");
	var fileurl = req.query.url
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/testItemManage/importData',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			url: fileurl,
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
//导出测试项
app.post('/ExportData', function (req, res, next) {
	console.log("导出测试项");
	var type=urlencode(req.query.type) 
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/testItemManage/export',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
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
module.exports = app;

