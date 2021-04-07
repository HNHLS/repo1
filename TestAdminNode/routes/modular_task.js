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
//委托单列表页
app.get('/taskmanagement', function (req, res) {
	console.log("委托单列表页");
	res.render('modular_task/taskmanagement');
})
//委托单列表
app.get('/tasklist', function (req, res) {
	console.log("委托单列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var startDate= req.query.startDate?req.query.startDate:'';
	var endDate= req.query.endDate?req.query.endDate:'';
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var costAssumeDepartment = req.query.costAssumeDepartment?urlencode(req.query.costAssumeDepartment):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/list?page=' + page + '&limit=' + limit + '&keyword=' + keyword +'&costAssumeDepartment='+costAssumeDepartment+'&endDate='+endDate+'&startDate='+startDate,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//查看委托单样品异常信息页
app.get('/abnormal', function (req, res) {
	console.log("查看委托单样品异常信息页");
	res.render('modular_task/abnormal',{delegateNum:req.query.delegateNum});
})
//查看委托单样品异常信息
app.get('/listSampleProblem', function (req, res) {
	console.log("查看委托单样品异常信息");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var delegateNum=req.query.delegateNum
	var startDate= req.query.startDate?req.query.startDate:'';
	var endDate = req.query.endDate?req.query.endDate:"";
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listSampleProblem?page=' + page + '&limit=' + limit + '&keyword=' + keyword+ '&startDate=' + startDate + '&endDate=' + endDate+'&delegateNum='+delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//样品异常处理
app.post('/sampleProblemDeal', function (req, res) {
	console.log("样品异常处理");
	var ids=req.query.ids
	var remark = urlencode(req.query.remark);
	console.log(req.query)
	var json={}
	request({url:global.base + '/admin/task/sampleProblemDeal?ids=' + ids+'&remark='+remark,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取委托单的添加 或编辑(外部)
app.get('/taskeditOut', function (req, res) {
	console.log("获取委托单的添加 或编辑(外部)");
	var delegateNum = req.query.delegateNum;
	console.log(req.query);
	var json = {
		create:true,
		department: "",
		customerNumber: "",
		address: "",
		proposer: "",
		phoneNumber: "",
		createTime:"",

		testStandard: "",
		judgementStandard: "",
		testProj: "",
		testPeriod: "",
		handleWay: "",
		completeDateLimit:"",

		estimateCost: "",
		contractNum:"",
		testNature: "",
		projType: "",
		issueReport: true,
		prior: false,
		purpose:"",

		extra: "",
		delegateNum: "",
		sampleName: "",
		sampleNumber: "",
		sampleModel: "",
		sampleCount:"",

		specsL: "",
		specsW: "",
		specsH: "",
		sampleState: "",
		sampleFrom: "",
		arriveDate:"",
		maxVoltage: "",
		components:[],
		//组件/层压件材料信息
	};
	if (delegateNum!='') {
		request({url:global.base + '/admin/task/getDelegateTaskOutside?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				if(JSON.parse(body).status=="fail"){
					res.render('home/error', {msg:jsonstr});
				}else{
					json.create=false;
					json.department = jsonstr.department;
					json.customerNumber = jsonstr.customerNumber;
					json.address = jsonstr.address;
					json.proposer = jsonstr.proposer;
					json.phoneNumber = jsonstr.phoneNumber;
					json.createTime = jsonstr.createTime

					json.testStandard = jsonstr.testStandard;
					json.judgementStandard = jsonstr.judgementStandard;
					json.testProj = jsonstr.testProj;
					json.testPeriod = jsonstr.testPeriod;
					json.handleWay = jsonstr.handleWay;
					json.completeDateLimit = jsonstr.completeDateLimit

					json.estimateCost = jsonstr.estimateCost;
					json.contractNum= jsonstr.contractNum
					json.testNature = jsonstr.testNature;
					json.projType = jsonstr.projType;
					json.issueReport = jsonstr.issueReport;
					json.prior = jsonstr.prior;
					json.purpose = jsonstr.purpose

					json.extra = jsonstr.extra;
					json.delegateNum = jsonstr.delegateNum;
					json.sampleName = jsonstr.sampleName;
					json.sampleNumber = jsonstr.sampleNumber;
					json.sampleModel = jsonstr.sampleModel;
					json.sampleCount = jsonstr.sampleCount

					json.specsL = jsonstr.specsL;
					json.specsW = jsonstr.specsW;
					json.specsH = jsonstr.specsH;
					json.sampleState = jsonstr.sampleState;
					json.sampleFrom = jsonstr.sampleFrom;
					json.arriveDate = jsonstr.arriveDate

					json.maxVoltage = jsonstr.maxVoltage;
					json.components = jsonstr.components;
	//				json.sampleNumber = jsonstr.sampleNumber;
	//				json.componentSurfaceMaterial = jsonstr.componentSurfaceMaterial;
	//				json.componentBackplaneMaterial = jsonstr.componentBackplaneMaterial
	//
	//				json.componentTopSurfaceEVA = jsonstr.componentTopSurfaceEVA;
	//				json.componentLowerSurfaceEVA = jsonstr.componentLowerSurfaceEVA;
	//				json.fuseCurrent = jsonstr.fuseCurrent;
	//				json.cellSheetTexturingProcess = jsonstr.cellSheetTexturingProcess;
	//				json.cellSpecifications = jsonstr.cellSpecifications;
					res.render('modular_task/taskeditOut', json);
				}
			} else {
				console.log(body);
			}
		});
	} else {
		res.render('modular_task/taskeditOut', json);
		console.log(json);
		//添加页
	}
});
//新建委托单(外部)
app.post('/createtask',function(req, res){
	console.log('新建委托单(外部)')
	console.log(req.body)
	var data=req.body
	var components=[]
	console.log(typeof(data.sampleNumber))
	if(typeof(data.sampleNumber)!="string"){
		for(var i=0;i<data.fuseCurrent.length;i++){
			var obj={}
			obj.componentSurfaceMaterial=data.componentSurfaceMaterial[i]
			obj.componentBackplaneMaterial=data.componentBackplaneMaterial[i]
			obj.componentTopSurfaceEVA=data.componentTopSurfaceEVA[i]
			obj.componentLowerSurfaceEVA=data.componentLowerSurfaceEVA[i]
			obj.fuseCurrent=data.fuseCurrent[i]
			obj.cellSheetTexturingProcess=data.cellSheetTexturingProcess[i]
			obj.cellSpecifications=data.cellSpecifications[i]
			obj.sampleNumber=data.sampleNumber[0].split(',')[i]
			components[i]=obj
		}
	}
	var json = {
		delegateNum: data.delegateNum,
		departmentId: data.department.split(",")[0],
		contactId: data.proposer.split(",")[0],

		testStandard: data.testStandard,
		judgementStandard: data.judgementStandard,
		testProj: data.testProj,
		testPeriod: data.testPeriod,
		handleWay: data.handleWay,
		completeDateLimit:data.completeDateLimit,

		estimateCost: data.estimateCost,
		contractNum:data.contractNum,
		testNature: data.testNature,
		projType: data.projType,
		issueReport:true,
		prior: data.prior=="true"?true:false,
		purpose:data.purpose,
		extra: data.extra,

		sampleName: data.sampleName,
		sampleNumber: data.sampleNumber,
		sampleModel: data.sampleModel,
		sampleCount:data.sampleCount,

		specsL: data.specsL,
		specsW: data.specsW,
		specsH: data.specsH,
		sampleState: data.sampleState,
		sampleFrom: data.sampleFrom,
		arriveDate:data.arriveDate,
		maxVoltage: data.maxVoltage,
		components:components,
		//组件/层压件材料信息
	};
	console.log(json)
	var options={
		method: 'POST',
		url: global.base + '/admin/task/create',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: json
	}
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//修改委托单信息(外部)
app.post('/updateDelegateTaskOutside',function(req, res){
	console.log('修改委托单信息(外部)')
	console.log(req.body)
	var data=req.body
	var components=[]
//	console.log(typeof(data.sampleNumber))
//	if(typeof(data.sampleNumber)!="string"){
//		for(var i=0;i<data.fuseCurrent.length;i++){
//			var obj={}
//			obj.componentSurfaceMaterial=data.componentSurfaceMaterial[i]
//			obj.componentBackplaneMaterial=data.componentBackplaneMaterial[i]
//			obj.componentTopSurfaceEVA=data.componentTopSurfaceEVA[i]
//			obj.componentLowerSurfaceEVA=data.componentLowerSurfaceEVA[i]
//			obj.fuseCurrent=data.fuseCurrent[i]
//			obj.cellSheetTexturingProcess=data.cellSheetTexturingProcess[i]
//			obj.cellSpecifications=data.cellSpecifications[i]
//			obj.sampleNumber=data.sampleNumber[0].split(',')[i]
//			components[i]=obj
//		}
//	}
//	console.log(components)
	var json = {
		delegateNum: data.delegateNum,
		departmentId: data.department.split(",")[0],
		contactId: data.proposer.split(",")[0],

		testStandard: data.testStandard,
		judgementStandard: data.judgementStandard,
		testProj: data.testProj,
		testPeriod: data.testPeriod,
		handleWay: data.handleWay,
		completeDateLimit:data.completeDateLimit,

		estimateCost: data.estimateCost,
		contractNum:data.contractNum,
		testNature: data.testNature,
		projType: data.projType,
		issueReport:true,
		prior: data.prior=="true"?true:false,
		purpose:data.purpose,
		extra: data.extra,

		sampleName: data.sampleName,
		sampleNumber: data.sampleNumber,
		sampleModel: data.sampleModel,
		sampleCount:data.sampleCount,

		specsL: data.specsL,
		specsW: data.specsW,
		specsH: data.specsH,
		sampleState: data.sampleState,
		sampleFrom: data.sampleFrom,
		arriveDate:data.arriveDate,
		maxVoltage: data.maxVoltage,
		components:components,
		//组件/层压件材料信息
	};
	console.log(json)
	var options={
		method: 'POST',
		url: global.base + '/admin/task/updateDelegateTaskOutside',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: json
	}
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取委托单的添加 或编辑(内部)
app.get('/taskeditIn', function (req, res) {
	console.log("获取委托单的添加 或编辑(内部)");
	var delegateNum = req.query.delegateNum;
	console.log(req.query);
	var json = {
		proposer:"",
		staffNumber:"",
		createTime:"",
		phoneNumber:"",
		department:"",

		testStandard: "",
		judgementStandard: "",
		testProj: "",
		testPeriod: "",
		handleWay: "",
		completeDateLimit:"",

		estimateCost: "",
		testNature: "",
		projType: "",
		issueReport: true,
		prior: false,
		purpose:"",

		extra: "",
		delegateNum: "",
		sampleName: "",
		sampleNumber: "",
		sampleModel: "",
		sampleCount:"",

		specsL: "",
		specsW: "",
		specsH: "",
		sampleState: "",
		sampleFrom: "",
		arriveDate:"",
		maxVoltage: "",
		bpmTestStandard:"",
		bpmJudgementStandard:"",
		components:[],
		//组件/层压件材料信息
		costAssumeDepartment:"",
		chosen:decodeURIComponent(req.cookies.chosen)
	};
	if (delegateNum!='') {
		request({url:global.base + '/admin/task/getDelegateTaskBpm?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				if(JSON.parse(body).status=="fail"){
					res.render('home/error', {msg:jsonstr});
				}else{
					json.assign=jsonstr.assign
					json.proposer = jsonstr.proposer;
					json.staffNumber = jsonstr.staffNumber;
					json.createTime = jsonstr.createTime;
					json.phoneNumber = jsonstr.phoneNumber;
					json.department = jsonstr.department;
					json.costAssumeDepartment = jsonstr.costAssumeDepartment;

					json.testStandard = jsonstr.testStandard;
					json.judgementStandard = jsonstr.judgementStandard;
					json.testProj = jsonstr.testProj;
					json.testPeriod = jsonstr.testPeriod;
					json.handleWay = jsonstr.handleWay;
					json.completeDateLimit = jsonstr.completeDateLimit

					json.estimateCost = jsonstr.estimateCost;
					json.testNature = jsonstr.testNature;
					json.projType = jsonstr.projType;
					json.issueReport = jsonstr.issueReport;
					json.prior = jsonstr.prior;
					json.purpose = jsonstr.purpose

					json.extra = jsonstr.extra;
					json.delegateNum = jsonstr.delegateNum;
					json.sampleName = jsonstr.sampleName;
					json.sampleNumber = jsonstr.sampleNumber;
					json.sampleModel = jsonstr.sampleModel;
					json.sampleCount = jsonstr.sampleCount

					json.specsL = jsonstr.specsL;
					json.specsW = jsonstr.specsW;
					json.specsH = jsonstr.specsH;
					json.sampleState = jsonstr.sampleState;
					json.sampleFrom = jsonstr.sampleFrom;
					json.arriveDate = jsonstr.arriveDate

					json.maxVoltage = jsonstr.maxVoltage;
					json.components = jsonstr.components;

					json.bpmJudgementStandard=jsonstr.bpmJudgementStandard
					json.bpmTestStandard=jsonstr.bpmTestStandard
					res.render('modular_task/taskeditIn', json);
				}
			} else {
				console.log(body);
			}
		});
	} else {
		res.render('modular_task/taskeditIn', json);
		console.log(json);
		//添加页
	}
});
//同步MES信息
app.get('/syncMESByConcatSampleStr', function (req, res) {
	console.log("同步MES信息");
	var sampleNumberStr = req.query.sampleNumberStr;
	var json={}
	console.log(req.query);
	request({url: global.base + '/admin/task/syncMESByConcatSampleStr?sampleNumberStr=' + encodeURIComponent(sampleNumberStr),headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message);
			var jsonstr = JSON.parse(body).message;
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.components=jsonstr
				res.render('modular_task/components', json);
			}
		} else {
			console.log(body);
		}
	});
});
//自己接受委托
app.post('/acceptTask',function(req, res){
	var delegateNum=req.query.delegateNum
	console.log(req.query)
	var options={
		method: 'POST',
		url: global.base + '/admin/task/acceptTask',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {delegateNum:delegateNum}
	}
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//分单获取样品基础信息
app.get('/separateorder', function (req, res) {
	console.log("分单获取样品基础信息");
	var delegateNum=req.query.delegateNum
	var json={}
	request({url:global.base + '/admin/task/getSampleBasicInfo?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
				json.delegateNum=jsonstr.delegateNum
				json.prior = jsonstr.prior;
				json.sampleName = jsonstr.sampleName;
				json.sampleNumber = jsonstr.sampleNumber;
				json.sampleNumberArray =encodeURIComponent(jsonstr.sampleNumberArray);
				json.sampleCount = jsonstr.sampleCount;
				json.sampleModel = jsonstr.sampleModel;

				json.sampleSpecs = jsonstr.sampleSpecs;
				json.arriveDate = jsonstr.arriveDate;
				json.subTasks = encodeURIComponent(JSON.stringify(jsonstr.subTasks));
				res.render('modular_task/separateorder', json);
		} else {
			console.log(error);
		}
	});
})
//分单对应编号新增页面
app.get('/addSampleNum', function (req, res) {
	console.log("分单对应编号新增页面");
	var sampleNumberArray
	if(req.query.sampleNumberArray==""){
		sampleNumberArray=[]
	}else{
		sampleNumberArray = JSON.parse(req.query.sampleNumberArray);
	}
	var num=req.query.num
	console.log(req.query,sampleNumberArray)
	res.render('modular_task/addSampleNum', {sampleNumberArray:sampleNumberArray,num:num});
})
//分单保存, JSON提交
app.post('/separateSubTask',function(req, res){
	var obj=req.query.obj
	console.log(obj)
	var options={
		method: 'POST',
		url: global.base + '/admin/task/separateSubTask',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		body:obj
	}
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//确认分单完成
app.post('/confirmSeparate',function(req, res){
	var delegateNum=req.query.delegateNum
	console.log(delegateNum)
	var options={
		method: 'POST',
		url: global.base + '/admin/task/confirmSeparate',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form:{
			delegateNum:delegateNum
		}
	}
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//指派他人弹出框
app.get('/handleothers', function (req, res) {
	console.log("指派他人弹出框");
	var delegateNum=req.query.delegateNum
	console.log(delegateNum)
	res.render('modular_task/handleothers',{delegateNum:delegateNum});
})
//指派他人
app.post('/assignTask',function(req, res){
	console.log("指派他人");
	var delegateNum=req.body.delegateNum.split(",")
	var id=req.body.id
	console.log(req.body)
	var options={
		method: 'POST',
		url: global.base + '/admin/task/assignTask',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			delegateNumArray:JSON.stringify(delegateNum),
			id:id
		}
	}
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//客户信息下拉
app.get('/customerlist', function (req, res) {
	console.log("客户信息下拉");
	fly.get({url:global.base + '/admin/customer/list?page=-1&limit=0&keyword=',headers: {"content-type": "application/json",'token':req.cookies.sessionId}})
		.then(function (response) {
			console.log(response.data)
			res.json(response.data);
		})
		.catch(function (error) {
			console.log(error);
		});
});
//客户联系人信息下拉
app.get('/contactslist', function (req, res) {
	console.log("客户联系人信息下拉");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):"";
	var enterpriseId=req.query.id
	console.log(req.query)
	fly.get({url:global.base + '/admin/customer/listContact?page=-1&limit=0&keyword=&enterpriseId='+enterpriseId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}})
		.then(function (response) {
			console.log(response.data)
			res.json(response.data);
		})
		.catch(function (error) {
			console.log(error);
		});
});
//标准下拉获取
app.get('/standardlist', function (req, res) {
	console.log("标准下拉获取");
	var type = urlencode(req.query.type);
	console.log(req.query);
	request({url:global.base + '/admin/standard/list?page=-1&limit=0&type=' + type + '&status=1',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

//修改委托单信息(内部)
app.post('/updateDelegateTaskBPM',function(req, res){
	console.log("修改委托单信息(内部)");
	console.log(req.body)
	var data=req.body
	var components=[]
	if(data.fuseCurrent){
		if(Array.isArray(data.fuseCurrent)&&data.fuseCurrent.length>1){
			for(var i=0;i<data.fuseCurrent.length;i++){
				var obj={}
				obj.componentSurfaceMaterial=data.componentSurfaceMaterial[i]
				obj.componentBackplaneMaterial=data.componentBackplaneMaterial[i]
				obj.componentTopSurfaceEVA=data.componentTopSurfaceEVA[i]
				obj.componentLowerSurfaceEVA=data.componentLowerSurfaceEVA[i]
				obj.fuseCurrent=data.fuseCurrent[i]
				obj.cellSheetTexturingProcess=data.cellSheetTexturingProcess[i]
				obj.cellSpecifications=data.cellSpecifications[i]
				obj.sampleNumber=data.componentssampleNumber[i]
				components[i]=obj
			}
		}else{
			var obj={}
			obj.componentSurfaceMaterial=data.componentSurfaceMaterial
			obj.componentBackplaneMaterial=data.componentBackplaneMaterial
			obj.componentTopSurfaceEVA=data.componentTopSurfaceEVA
			obj.componentLowerSurfaceEVA=data.componentLowerSurfaceEVA
			obj.fuseCurrent=data.fuseCurrent
			obj.cellSheetTexturingProcess=data.cellSheetTexturingProcess
			obj.cellSpecifications=data.cellSpecifications
			obj.sampleNumber=data.componentssampleNumber
			components.push(obj)
		}

	}
	console.log(components)
	var json = {
		delegateNum: data.delegateNum,
		testStandard: data.testStandard,
		judgementStandard: data.judgementStandard,
		testProj: data.testProj,
		testPeriod: data.testPeriod,
		handleWay: data.handleWay,
		completeDateLimit:data.completeDateLimit,

		estimateCost: data.estimateCost,
		costAssumeDepartment:data.costAssumeDepartment,
		testNature: data.testNature,
		projType: data.projType,
		issueReport:data.issueReport=="true"?true:false,
		prior: data.prior=="true"?true:false,
		purpose:data.purpose,

		extra: data.extra,
		sampleName: data.sampleName,
		sampleNumber: data.sampleNumber,
		sampleModel: data.sampleModel,
		sampleCount:data.sampleCount,

		specsL: data.specsL,
		specsW: data.specsW,
		specsH: data.specsH,
		sampleState: data.sampleState,
		sampleFrom: data.sampleFrom,
		arriveDate:data.arriveDate,
		maxVoltage: data.maxVoltage,
		components:JSON.stringify(components),
		//组件/层压件材料信息
	};
	var options={
		method: 'POST',
		url: global.base + '/admin/task/updateDelegateTaskBPM',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: json
	}
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//排程列表页
app.get('/scheduling', function (req, res) {
	console.log("排程列表页");
	res.render('modular_task/scheduling');
})
//排程列表
app.get('/schedulinglist', function (req, res) {
	console.log("排程列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var startDate= req.query.startDate?req.query.startDate:'';
	var endDate= req.query.endDate?req.query.endDate:'';
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listTestPlanningSubTask?page=' + page + '&limit=' + limit + '&keyword=' + keyword+'&startDate='+startDate+'&endDate='+endDate,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取分单排程信息
app.get('/schedulingedit', function (req, res) {
	console.log("获取分单排程信息");
	var subTaskNumber=req.query.subTaskNumber
	var json={}
	request({url:global.base + '/admin/task/getSubTaskTestPlans?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var jsonstr = JSON.parse(body).message;
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.subTaskNumber=jsonstr.subTaskNumber
				json.testStandardPiece=jsonstr.testStandardPiece
				json.physical = jsonstr.physical;
				json.prior = jsonstr.prior;
				json.sampleNumber = jsonstr.sampleNumber;
				json.sampleName =jsonstr.sampleName;
				json.sampleCount = jsonstr.sampleCount;
				json.testStandard = jsonstr.testStandard;
				json.judgementStandard = jsonstr.judgementStandard?jsonstr.judgementStandard:"";

				json.testProj=jsonstr.testProj
				json.completeDateLimit = jsonstr.completeDateLimit;
				json.extra = jsonstr.extra;

				json.testSequenceDesc=jsonstr.testSequenceDesc
				json.planMain=jsonstr.planMain
				json.confirmPlan=jsonstr.confirmPlan
				json.chosen=decodeURIComponent(req.cookies.chosen)
				// console.log(jsonstr.plans)
				var plans=jsonstr.plans
				//获取测试项下拉
				request({url:global.base + '/admin/testItemManage/list?page=-1&limit=0'+'&standard=' + urlencode(jsonstr.testStandard),headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
					function prepareEquipmentNumber(equipmentList) {
						let result='';
						if (Array.isArray(equipmentList)) {
							for (let i = 0; i < equipmentList.length; i++) {
								result+=equipmentList[i].number+";";
							}
						}
						return result;
					}
					function prepareAuxiliaryEquipmentNumber(equipmentList) {
						let result='';
						if (Array.isArray(equipmentList)) {
							for (let i = 0; i < equipmentList.length; i++) {
								result+=equipmentList[i].name+";";
							}
						}
						return result;
					}

					if (!error && response.statusCode == 200) {
						console.log("获取测试项下拉")
						// console.log(JSON.parse(body).message);
						var jsonstr = JSON.parse(body).message;
						json.testItemManage = jsonstr.data;
						var standardSet=new Set();
						for (let i = 0; i < json.testItemManage.length; i++) {
							json.testItemManage[i].equipment = json.testItemManage[i].equipment.replace(/\n/g, " ");
							json.testItemManage[i].equipmentNumber = json.testItemManage[i].main==0?prepareEquipmentNumber(json.testItemManage[i].equipmentList):prepareAuxiliaryEquipmentNumber(json.testItemManage[i].auxiliaryEquipmentList);
							standardSet.add(json.testItemManage[i].testStandard);
						}
						json.testStandardSet=standardSet;
						//获取群组下拉
						request({url:global.base + '/admin/department/getTree',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								// console.log(JSON.parse(body).message.list);
								var jsonstr = JSON.parse(body).message.list;
								var departmentlist=[]
								for(let i=0;i<jsonstr.length;i++){
									var list=jsonstr[i].list
									for(let j=0;j<list.length;j++){
										departmentlist.push(list[j].name)
									}
								}

								// console.log(plans)
								if(plans.length>0){
									for(let i=0;i<plans.length;i++){
										if(!plans[i].groupOptions||plans[i].groupOptions==null||plans[i].groupOptions==""){
											plans[i].groupOptions = departmentlist;
										}else{
											plans[i].groupOptions=plans[i].groupOptions.split(",")
										}
									}
								}
								json.plans = plans;
								json.departmentlist=departmentlist
								res.render('modular_task/schedulingedit', json);
							} else {
								console.log(error);
							}
						});
					} else {
						console.log(error);
					}
				});
			}
		} else {
			console.log(error);
		}
	});
})
//添加自定义测试序列
app.post('/addSequence', function (req, res) {
	console.log("添加自定义测试序列");
	var obj=req.body.obj
	var name=req.body.name
	var options = {
		method: 'POST',
		url: global.base + '/admin/testProjectManage/addSequence',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			testItemArray: JSON.stringify(obj),
			name: name
		}
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body)
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取已检测项(未出报告)页面
app.get('/historyTestCourse',function (req,res) {
    console.log("获取已检测项(未出报告)页面")
    res.render("modular_task/historyTestCourse");
})
//查询已检测项（未出报告）
app.get('/queryHistoryTestCourse',function (req,res) {
    console.log("查询已检测项（未出报告）");
    var page = req.query.page;
    var limit = req.query.limit;
    var keyword = req.query.keyword?urlencode(req.query.keyword):'';
    console.log(req.query,keyword);
    request({url:global.base + '/admin/task/listTestCompleteButNotReportTestCourse?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body));
            res.json(JSON.parse(body));
        } else {
            console.log(error);
        }
    });
})

//获取设备列表
app.get('/equipmentBasic', function (req, res) {
	console.log("获取设备列表");
	var num=req.query.num
	var equipmentarray=JSON.parse(req.query.equipmentarray)
	var main=req.query.main
	var equipmentName=req.query.equipmentName
	var group=req.query.group
	var type=req.query.type
	var functionName=req.query.func;
	var currentPiece=req.query.currentPiece;
	console.log(req.query)
	res.render('modular_task/equipmentBasic',{num:num,equipmentarray:equipmentarray,main:main,equipmentName:equipmentName,group:group,type:type,func:functionName,currentPiece:currentPiece});
})
//保存分单测试序列，JSON提交
app.post('/saveSubTaskTestSequence',function(req, res){
	var json=req.body.obj
	console.log(json)
	var options={
		method: 'POST',
		url: global.base + '/admin/task/saveSubTaskTestSequence',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		body:json
	}
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取打印流转单页面
app.get('/circulation', function (req, res) {
	console.log("获取打印流转单页面");
	var subTaskNumber=req.query.subTaskNumber
	console.log(subTaskNumber)
	var json={}
	request({url:global.base + '/admin/task/getSubTaskWorkFlowInfo?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.storageNum=jsonstr.storageNum
				json.manager=jsonstr.manager
				json.list=jsonstr.list
				json.sampleNumber=jsonstr.sampleNumber
				json.maxVoltage=jsonstr.maxVoltage
				json.sampleName=jsonstr.sampleName
				json.proposerAndDepartment=jsonstr.proposerAndDepartment

				json.sampleSpecs=jsonstr.sampleSpecs
				json.sn=jsonstr.sn
				json.powerCabineNumber=jsonstr.powerCabineNumber
				json.sampleModel=jsonstr.sampleModel

				json.testStandard=jsonstr.testStandard
				json.judgeStandard=jsonstr.judgeStandard
				json.delegateNum=jsonstr.delegateNum
				json.subTaskNumber=subTaskNumber
				console.log(jsonstr.list)
				res.render('modular_task/circulation',json);
			}
		} else {
			console.log(error);
		}
	});
})
//打印流转单，执行本操作后，分单进入样品收样状态
app.get('/printWorkFlowSheet', function (req, res) {
	console.log("分单进入样品收样状态");
	var subTaskNumber=req.query.subTaskNumber
//	var json={}
	request({url:global.base + '/admin/task/printWorkFlowSheet?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//检测开始列表页
app.get('/teststart', function (req, res) {
	console.log("检测开始列表页");
	res.render('modular_task/teststart');
})
//检测开始列表
app.get('/teststartlist', function (req, res) {
	console.log("检测开始列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var startDate= req.query.startDate?req.query.startDate:'';
	var endDate= req.query.endDate?req.query.endDate:'';
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var type = req.query.type ? req.query.type : '';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listPrepareTestTestCourse?page=' + page + '&limit=' + limit + '&keyword=' + keyword+'&startDate='+startDate+'&endDate='+endDate+"&type="+type,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//检测开始接收检测项
app.post('/assignTestCourseTestStaff',function(req, res){
	var testCourseIdArray=req.query.ids
	console.log(testCourseIdArray)
	var options={
		method: 'POST',
		url: global.base + '/admin/task/assignTestCourseTestStaff',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form:{
			testCourseIdArray:testCourseIdArray
		}
	}
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//分单信息的样品信息页
app.get('/addTeststart', function (req, res) {
	console.log("分单信息的样品信息");
	var uniqueNumber=req.query.uniqueNumber
	var subTaskNumber=req.query.subTaskNumber
	var testCourseId=req.query.testCourseId
	var json={
		uniqueNumber:uniqueNumber,
		subTaskNumber:subTaskNumber,
		testCourseId:testCourseId
	}
	console.log(json)
	res.render('modular_task/addTeststart', json);
})
//分单信息的样品异常页
app.get('/abnormalTeststart', function (req, res) {
	console.log("分单信息的样品异常页");
	var uniqueNumber=req.query.uniqueNumber
	var subTaskNumber=req.query.subTaskNumber
	var testCourseId=req.query.testCourseId
	var json={
		uniqueNumber:uniqueNumber,
		subTaskNumber:subTaskNumber,
		testCourseId:testCourseId
	}
	console.log(json)
	res.render('modular_task/abnormalTeststart', json);
})
//分单信息的样品信息
app.get('/getSubTaskSampleInfo', function (req, res) {
	console.log("分单信息的样品信息");
	var subTaskNumber=req.query.subTaskNumber
	var uniqueNumber=req.query.uniqueNumber
	if(subTaskNumber!=""){
		request({url:global.base + '/admin/task/querySubTaskSampleArray?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				res.json(JSON.parse(body));
			} else {
				console.log(error);
			}
		});
	}else{
		request({url:global.base + '/admin/task/querySubTaskSampleArray?uniqueNumber=' + uniqueNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				res.json(JSON.parse(body));
			} else {
				console.log(error);
			}
		});
	}
})
//测试人员接收样品
app.post('/testReceiveSample', function (req, res) {
	console.log("测试人员接收样品");
	var sampleArray = req.query.sampleArray;
	var testCourseId=req.query.testCourseId
	var subTaskNumber=req.query.subTaskNumber
	console.log(req.query);
	request({url:global.base + '/admin/task/testReceiveSample?sampleArray=' + sampleArray+'&testCourseId='+testCourseId+'&subTaskNumber='+subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//样品异常通知
app.post('/notifySampleProblem', function (req, res) {
	console.log("样品异常通知");
	var sampleArray = req.query.sampleArray;
	var extra=urlencode(req.query.extra)
	var subTaskNumber=req.query.subTaskNumber
	console.log(req.query);
	request({url:global.base + '/admin/task/notifySampleProblem?sampleArray=' + sampleArray+'&extra='+extra+'&subTaskNumber='+subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

app.get("/queryEquipmentUse",function (req,res) {
	var testCourseId = req.query.testCourseId;
	request({url:global.base + '/admin/task/queryTestCourseEquipment?testCourseId=' + testCourseId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

//检测项实际使用设备列表
app.get("/listActualTestCourseUseEquipment",function (req,res) {
	console.log("检测项实际使用设备列表");
	var testCourseId = req.query.testCourseId;
	request({url:global.base + '/admin/task/listActualTestCourseUseEquipment?testCourseId=' + testCourseId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

//新增检测项使用设备页面
app.get('/addequipment', function (req, res) {
	console.log("新增检测项使用设备页面");
	var testCourseId=req.query.testCourseId;
	var testItemWorkHour=req.query.testItemWorkHour;
	var json = {
		testCourseId: testCourseId,
		testItemWorkHour:testItemWorkHour
	};
	res.render('modular_task/addEquipment',json);
})

//测试项选择设备页
app.get('/selectequipment', function (req, res) {
	console.log("测试项选择设备页");
	console.log(req.query)
	var equipmentlist=JSON.parse(req.query.equipmentlist)
	res.render('modular_task/selectequipment',{equipmentlist:equipmentlist});
})

//新增检测项使用设备记录
app.post('/addActualTestCourseUseEquipment', function (req, res) {
	console.log("新增检测项使用设备记录");
	var testCourseId = req.body.testCourseId;
	var equipmentId=req.body.equipmentId;
	var startTime=req.body.startTime;
	var completeTime = req.body.completeTime;
	var useCount = req.body.useCount;
	var sampleNumberStr = req.body.sampleNumberStr;
	var remark =req.body.remark;
	var options = {
		method: 'POST',
		url: global.base + '/admin/task/addActualTestCourseUseEquipment',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			testCourseId:testCourseId,
			equipmentId:equipmentId,
			startTime:startTime,
			completeTime:completeTime,
			useCount:useCount,
			sampleNumberStr:sampleNumberStr,
			remark:remark,
		}
	};
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
	
})

//修改检测项使用设备页面
app.get('/editequipment', function (req, res) {
	console.log("修改检测项使用设备页面");
	var testCourseId=req.query.testCourseId;
	var id=req.query.id;
	var equipmentId=req.query.equipmentId;
	var equipmentName=req.query.equipmentName;
	var equipmentNumber=req.query.equipmentNumber;
	var startTime=req.query.startTime;
	var completeTime=req.query.completeTime;
	var useCount=req.query.useCount;
	var sampleNumberStr=req.query.sampleNumberStr;
	var remark=req.query.remark;
	var delayTime=req.query.delayTime;
	var testItemWorkHour = req.query.testItemWorkHour;
	var json = {
		testCourseId: testCourseId,
		id:id,
		equipmentId:equipmentId,
		equipmentName:equipmentName,
		equipmentNumber:equipmentNumber,
		startTime:startTime,
		completeTime:completeTime,
		useCount:useCount,
		sampleNumberStr:sampleNumberStr,
		remark:remark,
		delayTime:delayTime,
		testItemWorkHour:testItemWorkHour,
	};
	res.render('modular_task/editEquipment',json);
})

//修改检测项使用设备记录
app.post('/modifyActualTestCourseUseEquipment', function (req, res) {
	console.log("修改检测项使用设备记录");
	var testCourseId = req.body.testCourseId;
	var equipmentId=req.body.equipmentId;
	var startTime=req.body.startTime;
	var completeTime = req.body.completeTime;
	var useCount = req.body.useCount;
	var sampleNumberStr = req.body.sampleNumberStr;
	var remark = req.body.remark;
	var id = req.body.id;
	var testItemWorkHour=req.query.testItemWorkHour;
	console.log(req.body)
	var options = {
		method: 'POST',
		url: global.base + '/admin/task/modifyActualTestCourseUseEquipment',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			testCourseId:testCourseId,
			equipmentId:equipmentId,
			startTime:startTime,
			completeTime:completeTime,
			useCount:useCount,
			sampleNumberStr:sampleNumberStr,
			remark:remark,
			id:id,
			testItemWorkHour:testItemWorkHour,
		}
	};
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

//删除检测项使用设备记录
app.post('/removeActualTestCourseUseEquipment', function (req, res) {
	console.log("删除检测项使用设备记录");
	var testCourseId = req.query.testCourseId;
	var recordIdArray=req.query.recordIdArray;
	console.log(recordIdArray)
	var options = {
		method: 'POST',
		url: global.base + '/admin/task/removeActualTestCourseUseEquipment',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			testCourseId:testCourseId,
			recordIdArray:recordIdArray,
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

//获取原始记录
app.get('/teststartedit', function (req, res) {
	console.log("获取原始记录");
	var testCourseId=req.query.testCourseId
	console.log(testCourseId)
	var json={}
	request({url:global.base + '/admin/task/checkin?testCourseId=' + testCourseId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
			console.log(jsonstr)
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.problem=jsonstr.problem//驳回原因
				json.wrongFields=jsonstr.wrongFields//有误的输入信息，被数据复核驳回的才有
				json.originalData=JSON.stringify(jsonstr.originalData) //原始记录
				json.attachmentArray=jsonstr.attachmentArray//附件数组
				json.equipmentList=jsonstr.equipmentList//设备数组
				json.basicInfo=jsonstr.basicInfo//基础信息
				json.templateUrl=jsonstr.templateUrl
				json.testCourseId=testCourseId
				json.originalDataCheckInWay=jsonstr.originalDataCheckInWay
				json.testItemWorkHour=jsonstr.testItemWorkHour
				json.testCourseContinued=jsonstr.testCourseContinued
				res.render('modular_task/teststartedit', json);
			}
		} else {
			console.log(error);
		}
	});
})

//更正已完成的原始记录
app.get('/getNotReportTestCourse', function (req, res) {
	console.log("更正已完成的原始记录");
	var testCourseId=req.query.testCourseId
	console.log(testCourseId)
	var json={}
	request({url:global.base + '/admin/task/getNotReportTestCourse?testCourseId=' + testCourseId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.problem=jsonstr.problem//驳回原因
				json.wrongFields=jsonstr.wrongFields//有误的输入信息，被数据复核驳回的才有
				json.originalData=JSON.stringify(jsonstr.originalData) //原始记录
				json.attachmentArray=jsonstr.attachmentArray//附件数组
				json.equipmentList=jsonstr.equipmentList//设备数组
				json.basicInfo=jsonstr.basicInfo//基础信息
				json.templateUrl=jsonstr.templateUrl
				json.testCourseId=testCourseId
				json.originalDataCheckInWay=jsonstr.originalDataCheckInWay
				json.testCourseContinued=jsonstr.testCourseContinued
				res.render('modular_task/notReportTestCourse', json);
			}
		} else {
			console.log(error);
		}
	});
})


app.get('/changeEquipmentUsage',function (req, res) {
	console.log("调剂设备占用");
	var viewed=req.query.viewed;
	var testCourseUseEquipmentId = req.query.testCourseUseEquipmentId;
	res.render('modular_task/changeEquipmentUsage',{testCourseUseEquipmentId:testCourseUseEquipmentId,viewed:viewed});
})

app.get("/queryEquipmentUsageChangeHistory",function (req,res) {
	var testCourseUseEquipmentId = req.query.testCourseUseEquipmentId;
	request({url:global.base + '/admin/task/queryTestCourseEquipmentUsageChange?testCourseUseEquipmentId=' + testCourseUseEquipmentId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

app.post("/saveEquipmentUsageChangeRecord",function (req,res) {
	console.log("添加调剂设备占用");
	var testCourseUseEquipmentId=req.body.testCourseUseEquipmentId;
	var startDate = req.body.startDate;
	var endDate= req.body.endDate;
	var time=req.body.time;
	var extra=req.body.extra;
	var options = {
		method: 'POST',
		url: global.base + '/admin/task/addTestCourseEquipmentUsageChange',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			testCourseUseEquipmentId:testCourseUseEquipmentId,
			startTime:startDate,
			endTime:endDate,
			time:time,
			description:extra,
		}
	};
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

app.post("/deleteUsageChangeRecord",function (req,res) {
	var id=req.body.id;
	request({url:global.base + '/admin/task/deleteTestCourseEquipmentUsageChange?recordIds=' + JSON.stringify([id]),headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//保存原始记录
app.post('/saveOriginalRecord', function (req, res) {
	console.log("保存原始记录");
	var testCourseId = req.body.testCourseId;
	var jsonstr=req.body.json
	var options = {
		method: 'POST',
		url: global.base + '/admin/task/saveOriginalRecord',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {testCourseId:testCourseId,
			json:jsonstr}
	};
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//更正已完成未出报告的原始记录
app.post('/saveNotReportOriginalRecord', function (req, res) {
	console.log("更正已完成未出报告的原始记录");
	var testCourseId = req.body.testCourseId;
	var jsonstr=req.body.json
	var options = {
		method: 'POST',
		url: global.base + '/admin/task/saveNotReportOriginalRecord',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {testCourseId:testCourseId,
			json:jsonstr}
	};
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//继续后续检测
app.get('/continueCheckForward', function (req, res) {
	console.log("继续后续检测");
	var testCourseId = req.query.testCourseId;
	console.log(req.query);
	request({url:global.base + '/admin/task/continueCheckForward?testCourseId=' + testCourseId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取检测开始上传文件
app.get('/addfile', function (req, res) {
	console.log("获取检测开始上传文件");
	var testCourseId=req.query.testCourseId
	var json={}
	request({url:global.base + '/admin/task/getTestCourseAttachment?testCourseId=' + testCourseId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message);
			var jsonstr = JSON.parse(body).message ;
			json.attachmentArray=encodeURIComponent(JSON.stringify(jsonstr))
			json.testCourseId=testCourseId
			res.render('modular_task/addfile', json);
		} else {
			console.log(error);
		}
	});
})
//上传原始数据附件
app.post('/saveTestCourseAttachment', function (req, res) {
	console.log("上传原始数据附件");
	var testCourseId = req.body.testCourseId;
	var jsonstr=urlencode(req.body.attachmentArray)
	console.log(req.body);
	request({url:global.base + '/admin/task/saveTestCourseAttachment?testCourseId=' + testCourseId+'&attachmentArray='+jsonstr,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//下发数据复核页面
app.get('/assign', function (req, res) {
	console.log("下发数据复核页面");
	var testCourseId=req.query.testCourseId
	var delegateNum=req.query.delegateNum
	var noReport=req.query.noReport;
	var json = {testCourseId: testCourseId};
	if (noReport) {
		json.noReport = noReport;
	}else{
		json.noReport=false;
	}
	res.render('modular_task/assign',json);
})
//下发数据复核
app.post('/forwardOriginalDataCheck', function (req, res) {
	console.log("下发数据复核");
	var testCourseId = req.body.testCourseId.split(",");
	var id=req.body.id?req.body.id:""
	console.log(testCourseId);
	request({url:global.base + '/admin/task/forwardOriginalDataCheck?testCourseIdArray=' +JSON.stringify(testCourseId) +'&id='+id,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//数据复核列表页
app.get('/review', function (req, res) {
	console.log("数据复核列表页");
	res.render('modular_task/review');
})
//数据复核列表
app.get('/reviewlist', function (req, res) {
	console.log("数据复核列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listOriginalDataCheck?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取需要复核的原始记录详情
app.get('/reviewedit', function (req, res) {
	console.log("获取需要复核的原始记录详情");
	var testCourseId=req.query.testCourseId
	console.log(testCourseId)
	var json={}
	request({url:global.base + '/admin/task/getCheckPage?testCourseId=' + testCourseId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.wrongFields=jsonstr.wrongFields//有误的输入信息，被数据复核驳回的才有
				json.originalData=JSON.stringify(jsonstr.originalData) //原始记录
				json.attachmentArray=jsonstr.attachmentArray//附件数组
				json.equipmentList=jsonstr.equipmentList//设备数组
				json.basicInfo=jsonstr.basicInfo//基础信息
				json.templateUrl=jsonstr.templateUrl
				json.testCourseId=testCourseId
				res.render('modular_task/reviewedit', json);
			}
		} else {
			console.log(error);
		}
	});
})
//保存数据复核意见
app.get('/saveDataCheckResult', function (req, res) {
	console.log("保存数据复核意见");
	var testCourseId=req.query.testCourseId
	var action=req.query.action
	var problem=''
	if(action==0){
		problem=urlencode(req.query.problem)
	}
	console.log(req.query)
	var json={}
	request({url:global.base + '/admin/task/saveDataCheckResult?testCourseId=' + testCourseId+'&action='+action+'&problem='+problem,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
//			res.render('modular_task/reviewedit', json);
		} else {
			console.log(error);
		}
	});
})
//样品退库列表页
app.get('/withdrawal', function (req, res) {
	console.log("样品退库列表页");
	res.render('modular_task/withdrawal');
})
//样品退库列表
app.get('/withdrawallist', function (req, res) {
	console.log("样品退库列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listSubTaskBackToStorage?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//报告编写列表页
app.get('/reportwriting', function (req, res) {
	console.log("报告编写列表页");
	res.render('modular_task/reportwriting');
})
//报告编写列表
app.get('/reportwritinglist', function (req, res) {
	console.log("报告编写列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listPrepareReportTask?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})



//分单报告编制列表
app.get('/listSubTaskPrepareReport', function (req, res) {
	console.log("分单报告编制列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var delegateNum = req.query.delegateNum;
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listSubTaskPrepareReport?page=' + page + '&limit=' + limit + '&keyword=' + keyword +'&delegateNum='+delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

//获取委托单报告详情
app.get('/reportwritingedit', function (req, res) {
	console.log("获取委托单报告详情");
	var delegateNum=req.query.delegateNum
	console.log(delegateNum)
	var json={}
	request({url:global.base + '/admin/task/getReportDetail?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.sampleProblem=jsonstr.sampleProblem
				json.reportList=jsonstr.reportList//报告列表
				json.reportIframeUrl=jsonstr.reportIframeUrl //报告地址URL
				json.reviewOpinionList=jsonstr.reviewOpinionList//复核意见，复核退回的报告才有
				json.delegateNum=delegateNum
				json.cnas=jsonstr.cnas
				json.cma=jsonstr.cma
				json.testSpec=jsonstr.testSpec
				json.reportTypeId=jsonstr.reportTypeId
				json.reportTypeName=jsonstr.reportTypeName
				json.reportRemark=jsonstr.reportRemark
				res.render('modular_task/reportwritingedit', json);
			}
		} else {
			console.log(error);
		}
	});
})

app.get('/writeSubTaskReport',function (req,res) {
	console.log("获取分单报告详情");
	var subTaskNumber=req.query.subTaskNumber;
	console.log(subTaskNumber)
	var json={}
	request({url:global.base + '/admin/task/getSubTaskReportDetail?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.sampleProblem=jsonstr.sampleProblem
				json.reportList=jsonstr.reportList//报告列表
				json.reportIframeUrl=jsonstr.reportIframeUrl //报告地址URL
				json.reviewOpinionList=jsonstr.reviewOpinionList//复核意见，复核退回的报告才有
				json.subTaskNumber=subTaskNumber
				json.cnas=jsonstr.cnas
				json.cma=jsonstr.cma
				json.testSpec=jsonstr.testSpec
				json.reportTypeId=jsonstr.reportTypeId
				json.reportTypeName=jsonstr.reportTypeName
				json.reportRemark=jsonstr.reportRemark
				res.render('modular_task/writeSubTaskReport', json);
			}
		} else {
			console.log(error);
		}
	});
})
//上传报告
app.get('/uploadReport', function (req, res) {
	console.log("上传报告");
	var delegateNum=req.query.delegateNum
	var name=urlencode(req.query.name)
	var url=urlencode(req.query.url)
	console.log(req.query)
	var json={}
	request({url:global.base + '/admin/task/uploadReport?delegateNum=' + delegateNum+'&name='+name+'&url='+url,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//上传分单报告
app.get('/uploadSubTaskReport', function (req, res) {
	console.log("上传分单报告");
	var subTaskNumber=req.query.subTaskNumber
	var name=urlencode(req.query.name)
	var url=urlencode(req.query.url)
	console.log(req.query)
	var json={}
	request({url:global.base + '/admin/task/uploadSubTaskReport?subTaskNumber=' + subTaskNumber+'&name='+name+'&url='+url,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//删除报告
app.get('/removeReport', function (req, res) {
	console.log("删除报告");
	var reportIdArray=req.query.reportIdArray
	console.log(req.query)
	var json={}
	request({url:global.base + '/admin/task/removeReport?reportIdArray=' + reportIdArray,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//退回排程
app.get('/backToPlan',function (req,res) {
	console.log("退回排程");
	var delegateNum=req.query.delegateNum
	request({url:global.base + '/admin/task/backToPlan?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})


//选择审核人员页
app.get('/reviewStaff', function (req, res) {
	console.log("选择审核人员页");
	var delegateNum=req.query.delegateNum
	var reportRemark=req.query.reportRemark
	res.render('modular_task/reviewStaff',{delegateNum:delegateNum,reportRemark:reportRemark});
})
//分单选择审核人员页
app.get('/reviewSubStaff', function (req, res) {
	console.log("分单选择审核人员页");
	var subTaskNumber=req.query.subTaskNumber
	var reportRemark=req.query.reportRemark;
	res.render('modular_task/reviewSubStaff',{subTaskNumber:subTaskNumber,reportRemark:reportRemark});
})
//送往报告审核
app.post('/forwardReportReview', function (req, res) {
	console.log("送往报告审核");
	var delegateNum = req.body.delegateNum.split(",");
	var reviewStaffId=req.body.reviewStaff.split(",")[0]
	var reportRemark=req.body.reportRemark
	console.log(req.body);
	console.log(delegateNum,reviewStaffId)
	var options={
		method: 'POST',
		url:global.base + '/admin/task/forwardReportReview?delegateNumArray=' +JSON.stringify(delegateNum) +'&reviewStaffId='+reviewStaffId,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId
		},
		form:{
			reportRemark:reportRemark
		}
	}
	request(options,function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//分单报告送往报告审核
app.post('/forwardSubTaskReportReview', function (req, res) {
	console.log("分单报告送往报告审核");
	var subTaskNumber = req.body.subTaskNumber.split(",");
	var reviewStaffId=req.body.reviewStaff.split(",")[0]
	var reportRemark=req.body.reportRemark;
	console.log(req.body);
	console.log(subTaskNumber,reviewStaffId)
	var options={
		method: 'POST',
		url:global.base + '/admin/task/forwardSubTaskReportReview?subTaskNumberArray=' +JSON.stringify(subTaskNumber) +'&reviewStaffId='+reviewStaffId,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId
		},
		form:{
			reportRemark:reportRemark
		}
	}
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//选择印章，重新生成报告页
app.get('/seal', function (req, res) {
	console.log("选择印章，重新生成报告页");
	var json={}
	json.delegateNum=req.query.delegateNum
	json.seal=req.query.seal
	json.reportTypeId=req.query.reportTypeId
	json.reportTypeName=req.query.reportTypeName
	console.log(json)
	res.render('modular_task/seal',json);
})
//选择印章，重新生成报告
app.post('/rewriteReport', function (req, res) {
	console.log("选择印章，重新生成报告");
	var delegateNum = req.query.delegateNum;
	var reportTypeId=req.query.reportTypeId
	var reportTypeName=urlencode(req.query.reportTypeName)
	var cnas = req.query.cnas;
	var cma = req.query.cma;
	var testSpec = req.query.testSpec;
	console.log(req.query,reportTypeId);
	request({url:global.base + '/admin/task/rewriteReport?delegateNum=' + delegateNum + '&cnas=' + cnas+'&cma='+cma+'&testSpec='+testSpec+'&reportTypeId='+reportTypeId+'&reportTypeName='+reportTypeName,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//选择印章，重新生成分单报告页
app.get('/subSeal', function (req, res) {
	console.log("选择印章，重新生成报告页");
	var json={}
	json.subTaskNumber=req.query.subTaskNumber
	json.seal=req.query.seal
	json.reportTypeId=req.query.reportTypeId
	json.reportTypeName=req.query.reportTypeName
	console.log(json)
	res.render('modular_task/subSeal',json);
})
app.post('/rewriteSubTaskReport', function (req, res) {
	console.log("选择印章，重新生成报告");
	var subTaskNumber = req.query.subTaskNumber;
	var reportTypeId=req.query.reportTypeId
	var reportTypeName=urlencode(req.query.reportTypeName)
	var cnas = req.query.cnas;
	var cma = req.query.cma;
	var testSpec = req.query.testSpec;
	console.log(req.query,reportTypeId);
	request({url:global.base + '/admin/task/rewriteSubTaskReport?subTaskNumber=' + subTaskNumber + '&cnas=' + cnas+'&cma='+cma+'&testSpec='+testSpec+'&reportTypeId='+reportTypeId+'&reportTypeName='+reportTypeName,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

//报告驳回页面
app.get('/Reject', function (req, res) {
	console.log("报告驳回页面");
	var delegateNum=req.query.delegateNum
	res.render('modular_task/Reject',{delegateNum:delegateNum});
})
//分单报告驳回页面
app.get('/subReject', function (req, res) {
	console.log("分单报告驳回页面");
	var subTaskNumber=req.query.subTaskNumber
	res.render('modular_task/subReject',{subTaskNumber:subTaskNumber});
})
//获取委托单下的分单信息，用于驳回查询
app.get('/listSubTaskUnderDelegate', function (req, res) {
	console.log("获取委托单下的分单信息，用于驳回查询");
	var page = req.query.page;
	var limit = req.query.limit;
	var delegateNum=req.query.delegateNum
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listSubTaskUnderDelegate?page=' + page + '&limit=' + limit + '&keyword=' + keyword+'&delegateNum='+delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取分单下的测试项目，用于驳回查询
app.get('/listTestCourseUnderSubTask', function (req, res) {
	console.log("获取分单下的测试项目，用于驳回查询");
	var page = req.query.page;
	var limit = req.query.limit;
	var subTaskNumber=req.query.subTaskNumber
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listTestCourseUnderSubTask?page=' + page + '&limit=' + limit + '&keyword=' + keyword+'&subTaskNumber='+subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//驳回测试项，由测试人员重新编辑
app.get('/rejectTestCourser', function (req, res) {
	console.log("驳回测试项，由测试人员重新编辑");
	var testCourseId = req.query.testCourseId;
	var opinion = urlencode(req.query.opinion);
	console.log(req.query);
	request({url:global.base + '/admin/task/rejectTestCourser?testCourseId=' + testCourseId + '&opinion=' + opinion,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		}
	});
})
//报告审核列表页
app.get('/reportaudit', function (req, res) {
	console.log("报告审核列表页");
	res.render('modular_task/reportaudit');
})
//报告审核列表
app.get('/reportauditlist', function (req, res) {
	console.log("报告审核列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listReportReviewTask?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//查看报告审核详情
app.get('/reportauditedit', function (req, res) {
	console.log("查看报告审核详情");
	var delegateNum=req.query.delegateNum
	var subTaskNumber=req.query.subTaskNumber
	console.log(delegateNum)
	var json={}
	request({url:global.base + '/admin/task/getReportReviewTaskDetail?delegateNum=' + delegateNum+'&subTaskNumber='+subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
			json.reportList=jsonstr.reportList//报告列表
			json.opinionList=jsonstr.opinionList //意见列表
			json.sampleInfo=jsonstr.sampleInfo//样品信息
			json.plan=jsonstr.plan//项目计划
			json.basicInfo=jsonstr.basicInfo//基础信息
			json.delegateNum=delegateNum
			json.subTaskNumber=subTaskNumber
			json.reportRemark=jsonstr.reportRemark
			res.render('modular_task/reportauditedit', json);
		} else {
			console.log(error);
		}
	});
})
//保存报告审核
app.get('/doReportReview', function (req, res) {
	console.log("保存报告审核");
	var delegateNum=req.query.delegateNum
	var subTaskNumber=req.query.subTaskNumber
	var action=req.query.action
	var opinion=''
	if(action==0){
		opinion=urlencode(req.query.opinion)
	}
	console.log(req.query)
	var json={}
	request({url:global.base + '/admin/task/doReportReview?delegateNum=' + delegateNum+'&subTaskNumber='+subTaskNumber+'&action='+action+'&opinion='+opinion,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
//			res.render('modular_task/reviewedit', json);
		} else {
			console.log(error);
		}
	});
})
//报告签发列表页
app.get('/reportIssue', function (req, res) {
	console.log("报告审核列表页");
	res.render('modular_task/reportIssue');
})
//报告签发列表
app.get('/reportIssuelist', function (req, res) {
	console.log("报告签发列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listIssueReportTask?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//查看报告签发详情
app.get('/reportIssueedit', function (req, res) {
	console.log("查看报告签发详情");
	var delegateNum=req.query.delegateNum
	var subTaskNumber=req.query.subTaskNumber
	console.log(delegateNum)
	console.log(subTaskNumber)
	var json={}
	request({url:global.base + '/admin/task/getIssueReportDetail?delegateNum=' + delegateNum + '&subTaskNumber='+subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
			json.issueDate=jsonstr.issueDate//签发日期
			json.reportList=jsonstr.reportList//报告列表
			json.delegateInfo=jsonstr.delegateInfo //委托人信息
			json.sampleInfo=jsonstr.sampleInfo//样品信息
			json.basicInfo=jsonstr.basicInfo//基础信息
			json.delegateNum=delegateNum
			json.subTaskNumber=subTaskNumber
			res.render('modular_task/reportIssueedit', json);
		} else {
			console.log(error);
		}
	});
})
//保存报告签发
app.get('/confirmIssueReport', function (req, res) {
	console.log("保存报告签发");
	var delegateNum=req.query.delegateNum
	var subTaskNumber=req.query.subTaskNumber
	var remark=urlencode(req.query.remark)
	var date=req.query.date
	console.log(req.query)
	console.log(delegateNum)
	console.log(subTaskNumber)
	var json={}
	request({url:global.base + '/admin/task/confirmIssueReport?delegateNum=' + delegateNum + '&subTaskNumber='+subTaskNumber+'&remark='+remark+'&date='+date,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
//			res.render('modular_task/reviewedit', json);
		} else {
			console.log(error);
		}
	});
})
//项目文件列表页
app.get('/projectfile', function (req, res) {
	console.log("项目文件列表页");
	var token = req.cookies.sessionId;
	res.render('modular_task/projectfile',{token:token});
})
//项目文件列表
app.get('/projectfilelist', function (req, res) {
	console.log("项目文件列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listTaskFileManage?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//项目文件夹列表页
app.get('/projectFolder', function (req, res) {
	console.log("项目文件夹列表页");
	var delegateNum=req.query.delegateNum
	var token = req.cookies.sessionId;
	res.render('modular_task/projectFolder',{delegateNum:delegateNum,token:token});
})
//项目文件夹列表
app.get('/projectFolderlist', function (req, res) {
	console.log("项目文件夹列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var delegateNum=req.query.delegateNum
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listTaskDir?page=' + page + '&limit=' + limit + '&keyword=' + keyword+'&delegateNum='+delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//添加项目文件夹
app.get('/addTaskDir', function (req, res) {
	console.log("添加项目文件夹");
	var dirName = req.query.dirName?urlencode(req.query.dirName):'';
	var delegateNum=req.query.delegateNum
	console.log(req.query);
	request({url:global.base + '/admin/task/addTaskDir?dirName=' + dirName+'&delegateNum='+delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//修改项目文件夹名称
app.get('/updateTaskDir', function (req, res) {
	console.log("修改项目文件夹名称");
	var dirName = req.query.dirName?urlencode(req.query.dirName):'';
	var dirId=req.query.dirId
	console.log(req.query);
	request({url:global.base + '/admin/task/updateTaskDir?dirName=' + dirName+'&dirId='+dirId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//删除项目文件夹
app.post('/removeTaskDir', function (req, res, next) {
	console.log("删除项目文件夹");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/task/removeTaskDir',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {dirIdArray:ids}
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
//查看文件夹下的文件
app.get('/listTaskFileUnderDir', function (req, res) {
	console.log("查看文件夹下的文件");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var dirId=req.query.dirId
	console.log(req.query,keyword);
	request({url:global.base + '/admin/task/listTaskFileUnderDir?page=-1' + '&limit=' + limit + '&keyword=' + keyword+'&dirId='+dirId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//修改文件名称
app.get('/updateFileName', function (req, res) {
	console.log("修改文件名称");
	var name = req.query.dirName?urlencode(req.query.dirName):'';
	var fileId=req.query.dirId
	console.log(req.query);
	request({url:global.base + '/admin/task/updateFileName?name=' + name+'&fileId='+fileId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//删除文件
app.post('/removeFileArray', function (req, res, next) {
	console.log("删除文件");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/task/removeFileArray',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {fileIdArray:ids}
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
//上传文件页面
app.get('/addFolder', function (req, res) {
	console.log("上传文件页面");
	var dirId=req.query.dirId
	res.render('modular_task/addFolder',{dirId:dirId});
})
//上传多个独立文件
app.post('/addFileToDir', function (req, res) {
	console.log("上传多个独立文件");
	var dirId = req.body.dirId;
	var jsonstr=urlencode(req.body.attachmentArray)
	console.log(req.body);
	request({url:global.base + '/admin/task/addFileToDir?dirId=' + dirId+'&attachmentArray='+jsonstr,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//上传文件页面
app.get('/addAllFolder', function (req, res) {
	console.log("上传文件页面");
	res.render('modular_task/addAllFolder');
})
//批量上传文件
app.post('/addMultiFilePkg', function (req, res) {
	console.log("批量上传文件");
	var fileUrl=urlencode(req.body.fileUrl)
	console.log(req.body);
	request({url:global.base + '/admin/task/addMultiFilePkg?fileUrl='+fileUrl,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
module.exports = app;