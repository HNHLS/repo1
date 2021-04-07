var express = require('express');
var http = require("http");
var fly = require("flyio"); //方式1
var request = require('request'); //方式2
var urlencode = require('urlencode');
var cookieParser = require('cookie-parser');
var main = require('./main');
var app = express();
var moment = require("moment");
app.use(cookieParser()); //使用cookie中间件
const fs = require('fs');
//甘特图弹出页
app.get('/Ganttedit', function (req, res) {
	console.log("甘特图弹出页");
	var subTaskNumber=req.query.subTaskNumber
	res.render('modular_equipment/Ganttedit',{subTaskNumber:subTaskNumber});
})
//上传文件页面
app.get('/addfile', function (req, res) {
	console.log("上传文件页面");
	res.render('modular_equipment/addfile');
})
//上传排程计划表格
app.post('/uploadPlanSpreadSheet', function (req, res) {
	console.log("上传排程计划表格");
	var fileurl = req.body.url;
	console.log(req.body);
	var options = {
		method: 'POST',
		url: global.base + '/admin/task/uploadPlanSpreadSheet',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			url: fileurl
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
	
})
//甘特图页
app.get('/Gantt', function (req, res) {
	console.log("甘特图页");
	res.render('modular_equipment/Gantt');
})
//实际甘特图页
app.get('/actualGantt', function (req, res) {
	console.log("甘特图页");
	res.render('modular_equipment/actualGantt');
})
//下载排程计划表格
app.get('/downloadPlanSpreadSheet', function (req, res) {
	console.log("下载排程计划表格");
	var url = global.base;
	request({url:url + '/admin/task/downloadPlanSpreadSheet',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//echarts图表页
app.get('/echarts', function (req, res) {
	console.log("echarts图表页");
	var testCourseId = req.query.testCourseId;
	var equipmentId=req.query.equipmentId;
	var testCourseCostDto = JSON.parse(decodeURIComponent(req.query.testCourseCostDto));
	console.log(testCourseId);
	testCourseCostDto.startTimeStr = moment(new Date(testCourseCostDto.startTime)).format("YYYY-MM-DD HH:mm");
	res.render('modular_equipment/echarts',{testCourseId:testCourseId,testCourseCostDto:testCourseCostDto,equipmentId:equipmentId});
})
//甘特图页
app.get('/queryEquipmentGantt', function (req, res) {
	console.log("甘特图页");
	var groupId = req.query.groupId;
	var keyword = req.query.keyword;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	console.log(req.query);
	request({url:global.base + '/admin/equipment/queryEquipmentGantt?groupId=' + groupId+'&keyword='+keyword+'&startDate='+startDate+'&endDate='+endDate,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//实际甘特图页
app.get('/queryActualEquipmentGantt', function (req, res) {
	console.log("甘特图页");
	var groupId = req.query.groupId;
	var keyword = req.query.keyword;
	var startDate = req.query.startDate;
	var endDate = req.query.endDate;
	console.log(req.query);
	request({url:global.base + '/admin/equipment/queryActualEquipmentGantt?groupId=' + groupId+'&keyword='+keyword+'&startDate='+startDate+'&endDate='+endDate,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//获取一台设备的占用情况（开始时间往后一个月内的容量分布）
app.get('/getEquipmentRemainCapacity', function (req, res) {
	console.log("获取一台设备的占用情况");
	var testCourseId = req.query.testCourseId;
	var id = req.query.id;
	var startTime = req.query.startTime;
	var endTime = req.query.endTime;
	console.log(req.query);
	request({url:global.base + '/admin/task/getEquipmentRemainCapacity?testCourseId=' + testCourseId+'&id='+id+'&startTime='+startTime+'&endTime='+endTime,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//获取分单排程时间安排
app.get('/getSubTaskTestPlan', function (req, res) {
	console.log("获取分单排程时间安排");
	var subTaskNumber = req.query.subTaskNumber;
	var filterMain =req.query.filterMain;
	console.log(req.query);
	request({url:global.base + '/admin/task/getSubTaskTestPlan?subTaskNumber=' + subTaskNumber+"&filterMain="+filterMain,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//获取测试过程可用的设备列表
app.get('/listEquipmentByTestCourseId', function (req, res) {
	console.log("获取测试过程可用的设备列表");
	var testCourseId = req.query.testCourseId;
	console.log(req.query);
	request({url:global.base + '/admin/task/listEquipmentByTestCourseId?testCourseId=' + testCourseId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//修改单条计划，时间，占用设备选择
app.get('/modifyTestCoursePlan', function (req, res) {
	console.log("修改单条计划，时间，占用设备选择");
	var testCourseUseEquipmentId = req.query.testCourseUseEquipmentId;
	var equipmentId = req.query.equipmentId;
	var useCount = req.query.useCount;
	var startDate = req.query.startDate;
	console.log(req.query);
	request({url:global.base + '/admin/task/modifyTestCoursePlan?testCourseUseEquipmentId=' + testCourseUseEquipmentId+"&equipmentId="+equipmentId+"&useCount="+useCount+"&startDate="+startDate,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//保存分单排程时间安排
app.get('/saveSubTaskTestPlan', function (req, res) {
	console.log("保存分单排程时间安排");
	var subTaskNumber = req.query.subTaskNumber;
	console.log(req.query);
	request({url:global.base + '/admin/task/saveSubTaskTestPlan?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
// 设备所以导入

//设备导入页
app.get('/Import', function (req, res) {
	console.log("设备导入页");
	var type=req.query.type
	res.render('modular_equipment/Import',{type:type});
})
//设备基础导入
app.post('/enquipmentinfoImport', function (req, res, next) {
	console.log("设备基础导入");
	var fileurl = req.query.urlstr
	console.log(fileurl);
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipmentinfo_poi',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		form: {
			urlstr: fileurl,
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
//设备检定/校准导入
app.post('/equipmentrecordImport', function (req, res, next) {
	console.log("设备检定/校准导入");
	var fileurl = req.query.urlstr
	console.log(fileurl);
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentrecord/equipmentinfo_poi',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		form: {
			urlstr: fileurl,
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
//设备期间核查导入
app.post('/equipmentchecksImport', function (req, res, next) {
	console.log("设备期间核查导入");
	var fileurl = req.query.urlstr
	console.log(fileurl);
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentchecks/checkpoi',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		form: {
			urlstr: fileurl,
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
//设备耗材/备件导入
app.post('/consumablesinfoImport', function (req, res, next) {
	console.log("设备耗材/备件导入");
	var fileurl = req.query.urlstr
	console.log(fileurl);
	var options = {
		method: 'POST',
		url: global.equipment + '/consumablesinfo/consumpoi',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		form: {
			urlstr: fileurl,
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

//设备基础管理列表页
app.get('/basic', function (req, res) {
	console.log("基础管理列表页");
	var role=req.cookies.role
	var rolelist=""
	for(var i=0;i<role.length;i++){
		if(i==role.length-1){
			rolelist+=role[i].name
		}else{
			rolelist+=role[i].name+","
		}
	}
	res.render('modular_equipment/basic',{rolelist:rolelist});
})
//设备基础管理列表
app.get('/equipmentlist', function (req, res) {
	console.log("设备基础管理列表");
	var pageSize = parseInt(req.query.limit);
	var startIndex = (parseInt(req.query.page)-1)*pageSize==0?1:(parseInt(req.query.page)-1)*pageSize;
	var pageIndex=parseInt(req.query.page)-1
	var name =req.query.name;
	var stopkind=req.query.stopkind;
	console.log(req.cookies.chosen)
	console.log(req.query);
	var json={
			pageIndex:pageIndex,
			pageSize:pageSize,
			startIndex:startIndex,
			name:name,
			endtime:'',
			starttime:'',
		    stopkind: stopkind === '1' ? "1" : "0"
		}
	console.log(json)
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
//获取设备基础详情
app.get('/basicedit', function (req, res) {
	console.log("获取设备基础详情");
	var rid = req.query.eqid;
	console.log(req.query);
	var chosen=req.cookies.chosen
	var json={
		  custodian: "",
		  date_production: "",//启用日期
		  equipment_name: "",
		  equipment_no: "",
		  factory_number: "",
		  fixed_no: "",
		  id: 0,
		  infostate: 0,//设备状态  0正常 1停用 2维护 3报废 4待检定
		  isabort: false,
		  manufacturer: "",
		  purchase_date: "",//购置日期
		  rangedemo: "",
		  custodianno:"",
		  specification_model: "",
		  use_department: "",
		  verification_date:"",//检定日期
		  verification_period:"",//检定周期
		  checks_date:"",//期间核查日期
		  checks_period:"",//期间核查周期
		  testinfo:"",
		  test_number:""//测试能力
		, chosen: decodeURIComponent(chosen),
			byCondition:false,
			isStat:false,
		};
	if (rid > 0) {
		request({url:global.equipment + '/enquipmentinfo/equipment_findone?id=' + rid,headers: {"content-type": "application/json",'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body));
				var jsonstr = JSON.parse(body);
				  json.custodian=jsonstr.custodian,
				  json.custodianno=jsonstr.custodianno
				  json.date_production=jsonstr.date_production,//启用日期
				  json.equipment_name=jsonstr.equipment_name,
				  json.equipment_no=jsonstr.equipment_no,
				  json.factory_number=jsonstr.factory_number,
				  json.fixed_no=jsonstr.fixed_no,
				  json.id=jsonstr.id,
				  json.infostate=jsonstr.infostate,//设备状态  0正常 1停用 2维护 3报废 4待检定
				  json.manufacturer=jsonstr.manufacturer,
				  json.purchase_date=jsonstr.purchase_date,//购置日期
				  json.rangedemo=jsonstr.rangedemo,
				  json.specification_model=jsonstr.specification_model,
				  json.use_department=jsonstr.use_department,
				  json.verification_date=jsonstr.verification_date,//检定日期
				  json.verification_period=jsonstr.verification_period,//检定周期
				  json.checks_date=jsonstr.checks_date,//期间核查日期
				  json.checks_period=jsonstr.checks_period//期间核查周期
				  json.testinfo=jsonstr.testinfo//可测试项
				  json.test_number=jsonstr.test_number//测试能力
				  json.byCondition=jsonstr.byCondition;
				  json.isStat=jsonstr.isstat;
				  console.log(json)
				res.render('modular_equipment/basicedit', json);
			} else {
				console.log(body);
			}
		});
	} else {
		console.log(json)
		res.render('modular_equipment/basicedit', json);
		//添加页
	}
});
//上传设备基础的添加或编辑
app.post('/basicedit', function (req, res, next) {
	console.log("上传设备基础的编辑");
	var rid = req.body.id?req.body.id:0;
	var equipment_no = req.body.equipment_no;
	var equipment_name = req.body.equipment_name;
	var equipment_no = req.body.equipment_no;
	var factory_number = req.body.factory_number;
	var custodian = req.body.custodian.split(",")[1];
	var custodianno = req.body.custodian.split(",")[0];
	var department = req.body.department;
	var verification_date = req.body.verification_date;
	var verification_period = req.body.verification_period;
	var checks_date = req.body.checks_date==""?null:req.body.checks_date;
	var checks_period = req.body.checks_period;
	var infostate =req.body.infostate;
	var test_number=req.body.test_number
	
	var use_department=req.body.use_department;
	var specification_model=req.body.specification_model;
	var manufacturer = req.body.manufacturer;
	var rangedemo = req.body.rangedemo;
	var testinfo = req.body.testinfo;
	var purchase_date = req.body.purchase_date==""?null:req.body.purchase_date;
	var date_production = req.body.date_production==""?null:req.body.date_production;
	var fixed_no = req.body.fixed_no;
	var rule=req.body.rule
	var role=req.cookies.role
	var equipmentinfo_add=1
	var byCondition=req.body.byCondition;
	var isstat=req.body.isstat;
	for(var i=0;i<role.length;i++){
		if(role[i].name=="设备管理员"){
			equipmentinfo_add=0
		}
	}
	
	console.log(checks_date)
	var json={
			custodian: custodian,
			date_production: date_production,//启用日期
			equipment_name: equipment_name,
			equipment_no: equipment_no,
			factory_number: factory_number,
			fixed_no:fixed_no,
			id: rid,
			infostate:infostate,//设备状态  0正常 1停用 2维护 3报废 4待检定
			isabort: false,
			manufacturer:manufacturer,
			custodianno:custodianno,
			purchase_date: purchase_date,//购置日期
			rangedemo: rangedemo,
			specification_model:specification_model,
			use_department: use_department,
			verification_date:verification_date,//检定日期
			verification_period:verification_period,//检定周期
			checks_date:checks_date,//期间核查日期
			checks_period:checks_period,//期间核查周期
			testinfo:testinfo,
			equipmentinfo_add:equipmentinfo_add,
			test_number:test_number,//测试能力
			byCondition:byCondition,
			isstat:isstat
		};
		console.log(json);
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipmentinfo_add?usertype=0&numtype='+rule,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
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
//获取设备基础详情
app.get('/basicadd', function (req, res) {
	console.log("获取新增设备基础详情");
	console.log(req.query);
	var chosen=req.cookies.chosen
	var json={
		  custodian: "",
		  date_production: "",//启用日期
		  equipment_name: "",
		  equipment_no: "",
		  factory_number: "",
		  fixed_no: "",
		  id: 0,
		  infostate: 0,//设备状态  0正常 1停用 2维护 3报废 4待检定
		  isabort: false,
		  manufacturer: "",
		  purchase_date: "",//购置日期
		  rangedemo: "",
		  custodianno:"",
		  specification_model: "",
		  use_department: "",
		  verification_date:"",//检定日期
		  verification_period:"",//检定周期
		  checks_date:"",//期间核查日期
		  checks_period:"",//期间核查周期
		  testinfo:"",
		  test_number:"",//测试能力
		  chosen: decodeURIComponent(chosen),
		  byCondition:"",
		  isStat:false
		};
		console.log(json);
		res.render('modular_equipment/basicadd', json);
		//添加页
});
//上传设备基础的添加
app.post('/basicadd', function (req, res, next) {
	console.log("上传设备基础的添加");
	var rid = req.body.id?req.body.id:0;
	var equipment_no = req.body.equipment_no;
	var equipment_name = req.body.equipment_name;
	var equipment_no = req.body.equipment_no;
	var factory_number = req.body.factory_number;
	var custodian = req.body.custodian.split(",")[1];
	var custodianno = req.body.custodian.split(",")[0];
	var department = req.body.department;
	var verification_date = req.body.verification_date;
	var verification_period = req.body.verification_period;
	var checks_date = req.body.checks_date==""?null:req.body.checks_date;
	var checks_period = req.body.checks_period;
	var infostate =req.body.infostate;
	var test_number=req.body.test_number
	
	var use_department=req.body.use_department;
	var specification_model=req.body.specification_model;
	var manufacturer = req.body.manufacturer;
	var rangedemo = req.body.rangedemo;
	var testinfo = req.body.testinfo;
	var purchase_date = req.body.purchase_date==""?null:req.body.purchase_date;
	var date_production = req.body.date_production==""?null:req.body.date_production;
	var fixed_no = req.body.fixed_no;
	var rule=req.body.rule
	var role=req.cookies.role
	var equipmentinfo_add=1
	var byCondition=req.body.byCondition;
	for(var i=0;i<role.length;i++){
		if(role[i].name=="设备管理员"){
			equipmentinfo_add=0
		}
	}
	
	console.log(checks_date)
	var json={
			custodian: custodian,
			date_production: date_production,//启用日期
			equipment_name: equipment_name,
			equipment_no: equipment_no,
			factory_number: factory_number,
			fixed_no:fixed_no,
			id: rid,
			infostate:infostate,//设备状态  0正常 1停用 2维护 3报废 4待检定
			isabort: false,
			manufacturer:manufacturer,
			custodianno:custodianno,
			purchase_date: purchase_date,//购置日期
			rangedemo: rangedemo,
			specification_model:specification_model,
			use_department: use_department,
			verification_date:verification_date,//检定日期
			verification_period:verification_period,//检定周期
			checks_date:checks_date,//期间核查日期
			checks_period:checks_period,//期间核查周期
			testinfo:testinfo,
			equipmentinfo_add:equipmentinfo_add,
			test_number:test_number,//测试能力
			byCondition:byCondition
		};
		console.log(json);
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipmentinfo_add?usertype=0&numtype='+rule,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
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
//通过设备编号规则获取设备编号
app.post('/createInfoNo', function (req, res, next) {
	console.log("通过设备编号规则获取设备编号");
	var numtype = req.query.numtype;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/createInfoNo',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		form: {
			numtype:numtype
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
//判断设备编号是否重复
app.post('/haveNo', function (req, res, next) {
	console.log("通过设备编号规则获取设备编号");
	var numtype = req.query.numtype;
	var equipment_no=req.query.equipment_no
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/haveNo',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		form: {
			numtype:numtype,
			equipment_no:equipment_no
		}
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
//删除设备基础
app.post('/basicdel', function (req, res, next) {
	console.log("删除设备基础");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipmentinfo_delete',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		form: {
			idStr:ids
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
//批量打印条形码
app.post('/code', function (req, res, next) {
	console.log("批量打印条形码");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/outlistcode',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		form: {
			ids:ids
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
//设备基础导出
app.post('/equipment_outexcel', function (req, res, next) {
	console.log("设备基础导出");
	console.log(req.body)
	console.log(req.query)
	console.log(req.cookies)
	var name=req.query.name
	var nowuser = req.cookies.number;
	var usertype=0
	var json={
		name:name,
		pageIndex:0,
		pageSize:10,
		startIndex:0,
		endtime:'',
		starttime:'',
		nowuser:nowuser,
		usertype:usertype
	}
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipment_outexcel',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
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
//检定校准列表页
app.get('/Calibration', function (req, res) {
	console.log("检定校准列表页");
	var nowuser = req.cookies.number;
	res.render('modular_equipment/Calibration',{nowuser:nowuser});
})
//检定校准列表
app.get('/Calibrationlist', function (req, res) {
	console.log("检定校准列表");
	var nowuser = req.cookies.number;
	var usertype=0
	var pageSize = parseInt(req.query.limit);
	var startIndex = (parseInt(req.query.page)-1)*pageSize==0?1:(parseInt(req.query.page)-1)*pageSize;
	var pageIndex=parseInt(req.query.page)-1
	var name = req.query.name?urlencode(req.query.name):''
	console.log(req.query);
	var json={
			pageIndex:pageIndex,
			pageSize:pageSize,
			startIndex:startIndex,
			name:name,
			endtime:'',
			starttime:'',
			nowuser:nowuser,
			usertype:usertype
		}
	console.log(json)
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentrecord/record',
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
//获取检定校准详情
app.get('/Calibrationedit', function (req, res) {
	console.log("获取检定校准详情");
	var rid = req.query.id
	var nickName=req.cookies.nickName//检定校准人员：获取登陆人员信息
	var type=req.query.type
	console.log(req.query)
	var json={}
	if (rid > 0) {
		var options = {
			method: 'POST',
			url: global.equipment + '/equipmentrecord/equipment_findone?id='+rid,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
			}
		};	
		request.post(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body));
				var jsonstr = JSON.parse(body);
				  json.certificate_path=jsonstr.certificate_path,
				  json.date_verification=jsonstr.date_verification,
				  json.inspectors=jsonstr.inspectors,//检定人员
				  json.inspectorsno=jsonstr.inspectorsno,//检定人员工号
				  json.remarks=jsonstr.remarks,
				  json.table_path=jsonstr.table_path,
				  json.need_path=jsonstr.need_path,
				  json.verification_period=jsonstr.verification_period,
				  json.verification_situation=jsonstr.verification_situation,
				  json.verification_unit=jsonstr.verification_unit,
				  json.firstno=jsonstr.recordshenid.firstno,
				  json.secondno=jsonstr.recordshenid.secondno,
				  json.verification_number=jsonstr.verification_number
				  json.id=jsonstr.id
				  json.type=type
				  json.eqid=0
				  console.log(json)
				res.render('modular_equipment/Calibrationedit', json);
			} else {
				console.log(body);
			}
		});
	} else {
		var eqid=req.query.eqid
		console.log(json)
		json.certificate_path='[]',
		json.date_verification="",
		json.inspectors="",//检定人员
		json.inspectorsno="",//检定人员工号
		json.remarks="",
		json.table_path='[]',
		json.verification_period="",
		json.verification_situation="",
		json.verification_unit="",
		json.need_path='[]',
		json.firstno=''
		json.secondno=''
		json.verification_number=''
		json.id=0
		json.type=type
		json.eqid=eqid
		res.render('modular_equipment/Calibrationedit', json);
		//添加页
	}
});
//上传检定校准的添加或编辑
app.post('/Calibrationedit', function (req, res, next) {
	console.log("上传检定校准的添加或编辑");
	console.log(req.body)
	console.log(req.query)
	console.log(req.cookies)
	var certificate_path=req.query.certificate_path
	var date_verification=req.body.date_verification
	var inspectors=req.cookies.nickName//检定校准人员：获取登陆人员信息
	var inspectorsno=req.cookies.number//检定人员工号
	var table_path=req.query.table_path
	var verification_period=req.body.verification_period
	var verification_situation=req.body.verification_situation
	var verification_number=req.body.verification_number
	var verification_unit=req.body.verification_unit
	var firstname=req.body.firstname.split(",")[1]//测试主管名字
	var firstno=req.body.firstname.split(",")[0]//测试主管工号
	var secondname=req.body.secondname.split(",")[1]//授权签字人名字
	var secondno=req.body.secondname.split(",")[0]//授权签字人工号
	var need_path=req.query.need_path
	var remarks=req.body.remarks
	var eqid=req.body.eqid
	
	var json={
			certificate_path: certificate_path,
			date_verification: date_verification,//启用日期
			inspectors: inspectors,
			inspectorsno:inspectorsno,
			table_path:table_path,
			need_path:need_path,
			verification_number:verification_number,//校准证书编号
			remarks:remarks,
			verification_period: verification_period,
			verification_situation:verification_situation,
			verification_unit:verification_unit,
			eqid: eqid,
			firstname:firstname,
			firstno:firstno,
			secondname:secondname,
			secondno:secondno
		}
	console.log(json)
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentrecord/recordadd',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
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
//检定校准的审批
app.post('/recordfirst', function (req, res, next) {
	console.log("检定校准的审批");
	console.log(req.body)
	console.log(req.query)
	console.log(req.cookies)
	var id=req.query.id
	var state=req.query.state
	var nownmo=req.cookies.number//检定校准人员：获取登陆人员信息
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentrecord/recordfirst?id='+id+"&firststate="+state+"&nownmo="+nownmo,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
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
//检定校准导出
app.post('/outexcel', function (req, res, next) {
	console.log("检定校准导出");
	console.log(req.body)
	console.log(req.query)
	console.log(req.cookies)
	var name=req.query.name
	var nowuser = req.cookies.number;
	var usertype=0
	var json={
		name:name,
		pageIndex:0,
		pageSize:10,
		startIndex:0,
		endtime:'',
		starttime:'',
		nowuser:nowuser,
		usertype:usertype
	}
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentrecord/outexcel',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
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
//期间核查列表页
app.get('/Checks', function (req, res) {
	console.log("期间核查列表页");
	var nowuser = req.cookies.number;
	res.render('modular_equipment/Checks',{nowuser:nowuser});
})
//期间核查列表
app.get('/Checkslist', function (req, res) {
	console.log("期间核查列表");
	var nowuser = req.cookies.number;
	var usertype=0
	var pageSize = parseInt(req.query.limit);
	var startIndex = (parseInt(req.query.page)-1)*pageSize==0?1:(parseInt(req.query.page)-1)*pageSize;
	var pageIndex=parseInt(req.query.page)-1
	var name = req.query.name?urlencode(req.query.name):''
	console.log(req.query);
	var json={
			pageIndex:pageIndex,
			pageSize:pageSize,
			startIndex:startIndex,
			name:name,
			endtime:'',
			starttime:'',
			nowuser:nowuser,
			usertype:usertype
		}
	console.log(json)
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentchecks/list',
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
//获取期间核查详情
app.get('/Checksedit', function (req, res) {
	console.log("获取期间核查详情");
	var rid = req.query.id
	var type=req.query.type
	console.log(req.query)
	var json={}
	if (rid > 0) {
		request({url:global.equipment + '/equipmentchecks/equipment_findone?id='+rid,headers: {"content-type": "application/json",'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",}},function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body));
				var jsonstr = JSON.parse(body);
				  json.check_inspectors=jsonstr.check_inspectors,
				  json.check_inspectorsno=jsonstr.check_inspectorsno,
				  json.check_station=jsonstr.check_station,
				  json.checkdate=jsonstr.checkdate,
				  json.checkplan=jsonstr.checkplan,//备注
				  json.checkstandard=jsonstr.checkstandard,//核查指标
				  json.saveaddress=jsonstr.saveaddress,//
				  json.checkdate_peroid=jsonstr.checkdate_peroid
				  json.firstno=jsonstr.firstno
				  json.secondno=jsonstr.secondno
				  json.id=jsonstr.id
				  json.type=type
				  json.eqid=0
				  console.log(json)
				res.render('modular_equipment/Checksedit', json);
			} else {
				console.log(body);
			}
		});
	} else {
		var eqid=req.query.eqid
		console.log(json)
		json.check_inspectors="",
		json.check_inspectorsno="",
		json.checkdate="",
		json.check_station="",
		json.checkplan="",//备注
		json.checkstandard="[]",//核查指标
		json.saveaddress="[]",
		json.checkdate_peroid=""
		json.firstno=''
		json.secondno=''
		json.id=0
		json.type=type
		json.eqid=eqid
		res.render('modular_equipment/Checksedit', json);
		//添加页
	}
});
//上传期间核查的添加或编辑
app.post('/Checksedit', function (req, res, next) {
	console.log("上传期间核查的添加或编辑");
	var check_station=req.body.check_station
	var checkdate=req.body.checkdate
	var checkplan=req.body.checkplan//备注
	var checkstandard=req.query.checkstandard
	var saveaddress=req.query.saveaddress
	var check_inspectorsno=req.cookies.number//核查人编号
	var check_inspectors=req.cookies.nickName
	var eqid=req.body.eqid
	var checkdate_peroid=req.body.checkdate_peroid
	var firstname=req.body.firstname.split(",")[1]//测试主管名字
	var firstno=req.body.firstname.split(",")[0]//测试主管工号
	var secondname=req.body.secondname.split(",")[1]//授权签字人名字
	var secondno=req.body.secondname.split(",")[0]//授权签字人工号
//	console.log(req.body)
//	console.log(req.query)
	var json={
			check_inspectors: check_inspectors,
			check_inspectorsno: check_inspectorsno,//启用日期
			checkdate: checkdate,
			check_station: check_station,
			checkplan:checkplan,
			checkstandard: checkstandard,
			saveaddress:saveaddress,
			eqid: eqid,
			checkdate_peroid:checkdate_peroid,
			firstname:firstname,
			firstno:firstno,
			secondname:secondname,
			secondno:secondno
		}
	console.log(json)
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentchecks/add',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
	};	
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body,"111");
			res.json(JSON.parse(body));
		} else {
			console.log(body,"222");
		}
	});
});
//期间核查的审批
app.post('/checkshen', function (req, res, next) {
	console.log("期间核查的审批");
	console.log(req.body)
	console.log(req.query)
	console.log(req.cookies)
	var id=req.query.id
	var state=req.query.state
	var nownmo=req.cookies.number//检定校准人员：获取登陆人员信息
	console.log(nownmo)
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentchecks/checkshen?id='+id+"&state="+state+"&nowno="+nownmo,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
	};	
	request.post(options, function (error, response, body) {
		console.log(response.statusCode)
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//期间核查导出
app.post('/checksoutexcel', function (req, res, next) {
	console.log("期间核查导出");
	console.log(req.body)
	console.log(req.query)
	console.log(req.cookies)
	var name=req.query.name
	var nowuser = req.cookies.number;
	var usertype=0
	var json={
		name:name,
		pageIndex:0,
		pageSize:10,
		startIndex:0,
		endtime:'',
		starttime:'',
		nowuser:nowuser,
		usertype:usertype
	}
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentchecks/outexcel',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
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
//设备保养列表页
app.get('/Maintain', function (req, res) {
	console.log("设备保养列表页");
	res.render('modular_equipment/Maintain');
})
//设备保养列表
app.get('/Maintainlist', function (req, res) {
	console.log("设备保养列表");
	var pageSize = parseInt(req.query.limit);
	var startIndex = (parseInt(req.query.page)-1)*pageSize==0?1:(parseInt(req.query.page)-1)*pageSize;
	var pageIndex=parseInt(req.query.page)-1
	var name =req.query.name?urlencode(req.query.name):'';
	console.log(req.query);
	var json={
			pageIndex:pageIndex,
			pageSize:pageSize,
			startIndex:startIndex,
			name:name,
			endtime:'',
			starttime:''
		}
	console.log(json)
	var options = {
		method: 'POST',
		url: global.equipment + '/theqmaintain/list',
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
//获取设备保养详情
app.get('/Maintainedit', function (req, res) {
	console.log("获取设备保养详情");
	var rid = req.query.id;
	var eqid=req.query.eqid
	console.log(req.query);
	var json={
		eqid: eqid,
		manno: "",//
		maincustoin:"",
		upfiledate:"",
		fileaddrss: "[]",
	}
	console.log(json)
	res.render('modular_equipment/Maintainedit', json);
//	if (rid > 0) {
//		request(global.equipment + '/enquipmentinfo/equipment_findone?id=' + rid, function (error, response, body) {
//			if (!error && response.statusCode == 200) {
//				console.log(JSON.parse(body));
//				var jsonstr = JSON.parse(body);
//				  json.custodian=jsonstr.custodian,
//				  json.custodianno=jsonstr.custodianno
//				  json.date_production=jsonstr.date_production,
//				  console.log(json)
//				res.render('modular_equipment/Maintainedit', json);
//			} else {
//				console.log(body);
//			}
//		});
//	} else {
//		
//		//添加页
//	}
});
//上传设备保养的添加或编辑
app.post('/Maintainedit', function (req, res, next) {
	console.log("上传设备保养的添加或编辑");
	var eqid = req.body.eqid;
	var maincustoin = req.body.maincustoin;
	var manno=req.cookies.number//获取登陆人员信息
	var upfiledate = req.body.upfiledate;
	var fileaddrss = req.query.fileaddrss;
	console.log(req.body)
	var json={
			eid: eqid,
			maincustoin: maincustoin,
			upfiledate:upfiledate,
			manno:manno,
			fileaddrss: fileaddrss,
		}
	console.log(json)
	var options = {
		method: 'POST',
		url: global.equipment + '/theqmaintain/add',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
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
//设备维修列表页
app.get('/Repair', function (req, res) {
	console.log("设备维修列表页");
	console.log(req.cookies);
	var number=req.cookies.number
	res.render('modular_equipment/Repair',{number:number});
})
//设备维修列表
app.get('/Repairlist', function (req, res) {
	console.log("设备维修列表");
	var nowuser = req.cookies.number;
	var usertype=0
	var pageSize = parseInt(req.query.limit);
	var startIndex = (parseInt(req.query.page)-1)*pageSize==0?1:(parseInt(req.query.page)-1)*pageSize;
	var pageIndex=parseInt(req.query.page)-1
	var name = req.query.name?urlencode(req.query.name):''
	console.log(req.query);
	var json={
			pageIndex:pageIndex,
			pageSize:pageSize,
			startIndex:startIndex,
			name:name,
			endtime:'',
			starttime:'',
			nowuser:nowuser,
			usertype:usertype
		}
	console.log(json)
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentmainten/maintenlist',
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

//获取设备维修详情
app.get('/Repairedit', function (req, res) {
	console.log("获取设备维修详情");
	var rid = req.query.id;
	var type=req.query.type
	var equipment_name = req.query.equipment_name;
	var equipment_no = req.query.equipment_no;
	console.log(req.query);
	var json={
		equipment_name: equipment_name,
		equipment_no: equipment_no,
		id: rid,
		type:type,
		fileaddress: "[]",
		records: "",
		firstno:'',
		
	}
	request({url:global.equipment + '/equipmentmainten/equipment_findone?id=' + rid,headers: {"content-type": "application/json",'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body);
				json.fileaddress=jsonstr.maintenance_address,//启用日期
				json.records=jsonstr.records,
				json.maintenance_person=jsonstr.maintenance_person,//测试人员名称
				json.adminname=jsonstr.maintenshenid.adminname,//设备负责人
				json.firstno=jsonstr.firstno
				json.testadminname=jsonstr.maintenshenid.testadminname,//测试主管
				console.log(json)
			res.render('modular_equipment/Repairedit', json);
		} else {
			console.log(body);
		}
	});
});
//上传设备维修的添加或编辑
app.post('/Repairedit', function (req, res, next) {
	console.log("上传设备维修的添加或编辑");
	var equipment_id = req.body.equipment_id;
	var records = req.body.records;
	var fileaddress = req.query.fileaddress;
	var personno=req.cookies.number//报修人编号
	var personname=req.cookies.nickName
	var firstname=req.body.firstname.split(",")[1]//测试主管名字
	var firstno=req.body.firstname.split(",")[0]//测试主管工号
	var secondname=req.body.secondname.split(",")[1]//设备管理员名字
	var secondno=req.body.secondname.split(",")[0]//设备管理员工号
//	console.log(req.cookies)
//	console.log(req.query)
//	console.log(req.body)
	var json={
			equipment_id: equipment_id,
			records: records,//启用日期
			fileaddress: fileaddress,
			personno:personno,
			personname:personname,
			firstname:firstname,
			firstno:firstno,
			secondname:secondname,
			secondno:secondno
		}
	console.log(json)
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentmainten/maintendadd',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
	};	
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body,"111");
			res.json(JSON.parse(body));
		} else {
			console.log(body,"2222");
		}
	});
});
//获取设备维修详情
app.get('/Repairadd', function (req, res) {
	console.log("获取设备维修详情");
	var rid = req.query.id;
	var equipment_id = req.query.eqid;
	var equipment_name = req.query.equipment_name;
	var equipment_no = req.query.equipment_no;
	console.log(req.query);
	var json={
		equipment_name: equipment_name,
		equipment_no: equipment_no,
		equipment_id: equipment_id,
		id: 0,
		fileaddress: "[]",
		records: "",
		firstno:"",
		secondno:''
	}
	console.log(json)
	res.render('modular_equipment/Repairadd', json);
});

//测试主管处理维护审核
app.post('/approval', function (req, res, next) {
	console.log("测试主管处理维护审核");
	var id = req.body.id;
	var type = req.query.type;
	console.log(req.query)
	console.log(req.body)
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentmainten/teststate?mainstate='+type+"&mainrecordid="+id,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
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
//设备管理员处理维护审核
app.post('/confirm', function (req, res, next) {
	console.log("设备管理员处理维护审核");
	var id = req.body.id;
	var type = req.query.type;
	console.log(req.query)
	console.log(req.body)
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentmainten/mainstate?mainstate='+type+"&mainrecordid="+id,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
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
//设备负责人确认维修完成
app.post('/complete', function (req, res, next) {
	console.log("设备负责人确认维修完成");
	var id = req.body.id;
	var type = req.query.type;
	console.log(req.query)
	console.log(req.body)
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentmainten/mailtoshen?maintenid='+id,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
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
//申请人确认修复后 设备恢复正常状态
app.post('/personconfirm', function (req, res, next) {
	console.log("申请人确认修复后 设备恢复正常状态");
	var id = req.body.id;
	var type = req.query.type;
	console.log(req.query)
	console.log(req.body)
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentmainten/maintendback?infostate='+type+"&maintenid="+id,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
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
//设备维修导出
app.post('/maintenexcel', function (req, res, next) {
	console.log("设备维修导出");
	console.log(req.body)
	console.log(req.query)
	console.log(req.cookies)
	var name=req.query.name
	var nowuser = req.cookies.number;
	var usertype=0
	var json={
		name:name,
		pageIndex:0,
		pageSize:10,
		startIndex:0,
		endtime:'',
		starttime:'',
		nowuser:nowuser,
		usertype:usertype
	}
	var options = {
		method: 'POST',
		url: global.equipment + '/equipmentmainten/outexcel',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
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
//设备台账管理列表页
app.get('/Ledger', function (req, res) {
	console.log("设备台账管理列表页");
	res.render('modular_equipment/Ledger');
})
//设备台账管理列表
app.get('/Ledgerlist', function (req, res) {
	console.log("设备台账管理列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var startDate= req.query.startDate?req.query.startDate:'';
	var endDate= req.query.endDate?req.query.endDate:'';
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query);
	request({url:global.base + '/admin/equipment/listEquipmentLedger?page=' + page + '&limit=' + limit + '&keyword=' + keyword +'&endDate='+endDate+'&startDate='+startDate,headers: {'Content-Type': 'application/json; charset=UTF-8','token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//删除设备台账
app.post('/removeEquipmentLedger', function (req, res, next) {
	console.log("删除设备台账");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/equipment/removeEquipmentLedger',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			ids:ids
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
//耗材/备件管理列表页
app.get('/Consumables', function (req, res) {
	console.log("耗材/备件管理列表页");
	res.render('modular_equipment/Consumables');
})
//耗材/备件管理列表
app.get('/Consumableslist', function (req, res) {
	console.log("耗材/备件管理列表");
	var pageSize = parseInt(req.query.limit);
	var startIndex = (parseInt(req.query.page)-1)*pageSize==0?1:(parseInt(req.query.page)-1)*pageSize;
	var pageIndex=parseInt(req.query.page)-1
	var name = req.query.name?urlencode(req.query.name):''
	console.log(req.query);
	var json={
			pageIndex:pageIndex,
			pageSize:pageSize,
			startIndex:startIndex,
			name:name,
			endtime:'',
			starttime:'',
		}
	console.log(json)
	var options = {
		method: 'POST',
		url: global.equipment + '/consumablesinfo/list',
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
			console.log(body);
		}
	});
})
//获取耗材/备件详情
app.get('/Consumablesedit', function (req, res) {
	console.log("获取耗材/备件详情");
	var rid = req.query.id;
	console.log(req.query);
	var json={
		consummanid:"",
		consummodel:"",
		consumname:"",
		consumnum:"",
		consumwarnnum:"",
		id:rid
	}
	var options = {
		method: 'POST',
		url: global.equipment + '/consumablesinfo/findone?id=' + rid,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
	};
	if (rid > 0) {
		request.post(options, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				  json.consummanid=jsonstr.consummanid,
				  json.consummodel=jsonstr.consummodel
				  json.consumname=jsonstr.consumname,//
				  json.consumnum=jsonstr.consumnum,
				  json.consumwarnnum=jsonstr.consumwarnnum,
				  json.id=jsonstr.id,//
				  console.log(json)
				res.render('modular_equipment/Consumablesedit', json);
			} else {
				console.log(body);
			}
		});
	} else {
		console.log(json)
		res.render('modular_equipment/Consumablesedit', json);
		//添加页
	}
});
//上传耗材/备件的添加或编辑
app.post('/Consumablesedit', function (req, res, next) {
	console.log("上传耗材/备件的添加或编辑");
	var rid = req.body.id?req.body.id:0;
	var consumwarnnum = req.body.consumwarnnum;
	var consummanid = req.body.consumman.split(",")[0];
	var consumman = req.body.consumman.split(",")[1];
	var consummodel = req.body.consummodel;
	var consumname = req.body.consumname;
	var consumnum = req.body.consumnum;
	console.log(req.body)
	var json={
			consumwarnnum: consumwarnnum,
			consummanid: consummanid,//启用日期
			consumman: consumman,
			consummodel: consummodel,
			consumname: consumname,
			consumnum: consumnum,
			id:rid,
		}
	var options = {
		method: 'POST',
		url: global.equipment + '/consumablesinfo/add',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
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
//耗材/备件入库页
app.get('/ConsumablesEnter', function (req, res) {
	console.log("耗材/备件入库页");
	console.log(req.query)
	var consumname=req.query.consumname
	var id=req.query.id
	res.render('modular_equipment/ConsumablesEnter',{consumname:consumname,id:id});
})
//耗材/备件领用页
app.get('/ConsumablesOut', function (req, res) {
	console.log("耗材/备件领用页");
	console.log(req.query)
	var consumname=req.query.consumname
	var id=req.query.id
	res.render('modular_equipment/ConsumablesOut',{consumname:consumname,id:id});
})
//入库/领用
app.post('/consumusesheet', function (req, res) {
	console.log("入库/领用");
	console.log(req.body);
	var consumid = req.body.id;
	var douser = req.body.douser.split(",")[1];
	var douserid =req.body.douser.split(",")[0];
	var num = req.body.num;
	var type =req.body.type;
	var json={
			consumid:consumid,
			douser:douser,
			douserid:douserid,
			num:num,
			type:type,
	}
	console.log(json)
	var options = {
		method: 'POST',
		url: global.equipment + '/consumablesinfo/consumusesheet',
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
//耗材导出
app.post('/consumoutexcel', function (req, res, next) {
	console.log("耗材导出");
	console.log(req.body)
	console.log(req.query)
	console.log(req.cookies)
	var name=req.query.name
	var nowuser = req.cookies.number;
	var usertype=0
	var json={
		name:name,
		pageIndex:0,
		pageSize:10,
		startIndex:0,
		endtime:'',
		starttime:'',
		nowuser:nowuser,
		usertype:usertype
	}
	var options = {
		method: 'POST',
		url: global.equipment + '/consumablesinfo/consumoutexcel',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'databasetype':decodeURIComponent(req.cookies.chosen)=="理化"?"2":"1",
		},
		body:JSON.stringify(json)
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
module.exports = app;