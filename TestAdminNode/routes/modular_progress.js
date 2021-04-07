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
//项目管理进度总览列表页
app.get('/project', function (req, res) {
	console.log("项目管理进度总览列表页");
	var page=req.query.page?req.query.page:1
	var keyword=req.query.keyword?req.query.keyword:''
	var startDate=req.query.startDate?req.query.startDate:''
	var endDate=req.query.endDate?req.query.endDate:''
	res.render('modular_progress/project',{page:page,keyword:keyword,startDate:startDate,endDate:endDate});
})
//查看委托单进度
app.get('/listTaskProgress', function (req, res) {
	console.log("查看委托单进度");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var startDate = req.query.startDate ? req.query.startDate : '';
	var endDate = req.query.endDate ? req.query.endDate : '';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/progress/listTaskProgress?page=' + page + '&limit=' + limit + '&keyword=' + keyword+"&startDate="+startDate+"&endDate="+endDate,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//查看委托单下的分单试验进度
app.get('/listSubTaskProgress', function (req, res) {
	console.log("查看委托单下的分单试验进度");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var delegateNum = req.query.delegateNum;
	console.log(req.query,keyword);
	request({url:global.base + '/admin/progress/listSubTaskProgress?page=' + page + '&limit=' + limit + '&keyword=' + keyword +'&delegateNum='+delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//结束任务
app.post('/abort', function (req, res) {
	console.log("结束任务");
	var delegateNumArray = req.query.ids;
	console.log(delegateNumArray);
	request({
		url: global.base + '/admin/task/abort?delegateNumArray=' + delegateNumArray,
		headers: {"content-type": "application/json", 'token': req.cookies.sessionId}
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
});
app.post('/hurryUp', function (req, res) {
	var options = {
		method: 'POST',
		url: global.base + '/admin/progress/requestTaskHurryUp',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			delegateNumArray: JSON.stringify(req.body.ids),
			extra:req.body.extra
		}
	};
	request(options,function (error,response,body) {
		if (!error && response.statusCode === 200) {
			res.json(JSON.parse(body));
		}
	});
});
app.post('/testCourseHurryUp', function (req, res) {
	var options = {
		method: 'POST',
		url: global.base + '/admin/progress/requestTestCourseHurryUp',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			testCourseIdArray: JSON.stringify(req.body.ids),
			extra:req.body.extra
		}
	};
	request(options,function (error,response,body) {
		if (!error && response.statusCode === 200) {
			res.json(JSON.parse(body));
		}
	});
});
app.get("/chooseTestCourseHurry", function (req, res) {
	var delegateNum = req.query.delegateNum;
	res.render('modular_progress/chooseTestCourseHurry',{delegateNum:delegateNum});
});
//查看委托单报告
app.get('/report', function (req, res) {
	console.log("查看委托单报告");
	var delegateNum=req.query.delegateNum
	var page=req.query.page
	var keyword=req.query.keyword
	var startDate=req.query.startDate
	var endDate=req.query.endDate
	var url=req.query.url;
	console.log(delegateNum)
	var json={}
	request({url:global.base + '/admin/progress/getTaskReportView?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
			json.reportList=jsonstr.reportList//报告列表
			json.opinionList=jsonstr.opinionList //意见列表
			json.sampleInfo=jsonstr.sampleInfo//样品信息
			json.plan=jsonstr.plan//项目计划
			json.basicInfo=jsonstr.basicInfo//基础信息
			json.delegateNum=delegateNum
			json.page=page
			json.keyword=keyword
			json.startDate=startDate
			json.endDate=endDate
			json.backUrl = url;
			res.render('modular_progress/report', json);
		} else {
			console.log(error);
		}
	});
})
//查看分单报告
app.get('/subReport', function (req, res) {
	console.log("查看委托单报告");
	var subTaskNumber=req.query.subTaskNumber
	var page=req.query.page
	var keyword=req.query.keyword
	var startDate=req.query.startDate
	var endDate=req.query.endDate
	console.log(subTaskNumber)
	var json={}
	request({url:global.base + '/admin/progress/getSubTaskReportView?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
			json.reportList=jsonstr.reportList//报告列表
			json.opinionList=jsonstr.opinionList //意见列表
			json.sampleInfo=jsonstr.sampleInfo//样品信息
			json.plan=jsonstr.plan//项目计划
			json.basicInfo=jsonstr.basicInfo//基础信息
			json.subTaskNumber=subTaskNumber
			json.page=page
			json.keyword=keyword
			json.startDate=startDate
			json.endDate=endDate
			res.render('modular_progress/subReport', json);
		} else {
			console.log(error);
		}
	});
})
//查看测试项原始记录
app.get('/getTestCourseOriginalData', function (req, res) {
	console.log("查看测试项原始记录");
	var testCourseId=req.query.testCourseId
	console.log(testCourseId)
	var json={}
	request({url:global.base + '/admin/progress/getTestCourseOriginalData?testCourseId=' + testCourseId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//查看分单原始记录
app.get('/record', function (req, res) {
	console.log("查看分单原始记录");
	var subTaskNumber=req.query.subTaskNumber
	var page=req.query.page
	var keyword=req.query.keyword
	var startDate=req.query.startDate
	var endDate=req.query.endDate
	console.log(subTaskNumber)
	var json={}
	request({url:global.base + '/admin/progress/getSubTaskOriginalData?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonstr = JSON.parse(body).message;
			json.testCourseList=jsonstr.testCourseList//测试项列表
			json.basicInfo=jsonstr.basicInfo//基础信息
			json.originalData={}
			json.templateUrl=''
			json.subTaskNumber=subTaskNumber
			json.page=page
			json.keyword=keyword
			json.startDate=startDate
			json.endDate=endDate
			res.render('modular_progress/record', json);
		} else {
			console.log(error);
		}
	});
})
//获取打印流转单页面
app.get('/circulation', function (req, res) {
	console.log("获取打印流转单页面");
	var subTaskNumber=req.query.subTaskNumber
	var page=req.query.page
	var keyword=req.query.keyword
	var startDate=req.query.startDate
	var endDate=req.query.endDate
	console.log(req.query)
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

				json.page=page
				json.keyword=keyword
				json.startDate=startDate
				json.endDate=endDate
				console.log(jsonstr.list)
				res.render('modular_progress/circulation',json);
			}
		} else {
			console.log(error);
		}
	});
})
//查看报告逾期列表页
app.get('/reportoverdue', function (req, res) {
	console.log("查看报告逾期列表页");
	res.render('modular_progress/reportoverdue');
})
//查看报告逾期列表
app.get('/listOverdueTaskReport', function (req, res) {
	console.log("查看报告逾期列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/progress/listOverdueTaskReport?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//报告查询进度总览列表页
app.get('/reportquery', function (req, res) {
	console.log("报告查询进度总览列表页");
	var page=req.query.page?req.query.page:1
	var keyword=req.query.keyword?req.query.keyword:''
	var startDate=req.query.startDate?req.query.startDate:''
	var endDate=req.query.endDate?req.query.endDate:''
	res.render('modular_progress/reportquery',{page:page,keyword:keyword,startDate:startDate,endDate:endDate});
})
//报告查询
app.get('/listTaskReport', function (req, res) {
	console.log("报告查询");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var startDate = req.query.startDate ? req.query.startDate : '';
	var endDate = req.query.endDate ? req.query.endDate : '';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/progress/listTaskReport?page=' + page + '&limit=' + limit + '&keyword=' + keyword+"&startDate="+startDate+"&endDate="+endDate,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//报告高级查询
app.get('/listTaskReportAdv', function (req, res) {
	console.log("报告高级查询");
	var page = req.query.page;
	var limit = req.query.limit;
	var startDate = req.query.createTimeStart;
	var endDate = req.query.createTimeEnd;
	var IssueDateStart = req.query.IssueDateStart;
	var IssueDateEnd = req.query.IssueDateEnd;
	var delegateNumber = req.query.delegateNumber?urlencode(req.query.delegateNumber):'';
	var testItemDesc = req.query.testItemDesc?urlencode(req.query.testItemDesc):'';
	var reportNumber = req.query.reportNumber?urlencode(req.query.reportNumber):'';
	var proposer = req.query.proposer?urlencode(req.query.proposer):'';
	var proposerDepartment = req.query.proposerDepartment?urlencode(req.query.proposerDepartment):'';
	var projFrom = req.query.projFrom?urlencode(req.query.projFrom):'';
	var state = req.query.state?urlencode(req.query.state):'';
	var projectManager = req.query.projectManager?urlencode(req.query.projectManager):'';
	var cnas = req.query.cnas;
	var cma = req.query.cma;
	var testSpec = req.query.testSpec;
	console.log(req.query,delegateNumber,testItemDesc,reportNumber);
	request({url:global.base + '/admin/progress/listTaskReportAdv?page=' + page + '&limit=' + limit + "&startDate=" + startDate + "&endDate=" + endDate + "&delegateNumber=" + delegateNumber +	"&testItemDesc=" + testItemDesc +	"&reportNumber=" + reportNumber +	"&proposer=" + proposer + "&proposerDepartment=" + proposerDepartment + "&projFrom=" + projFrom + "&state=" + state + "&cnas=" + cnas + "&cma=" + cma + "&testSpec=" + testSpec + "&projectManager=" + projectManager + "&IssueDateStart=" + IssueDateStart + "&IssueDateEnd=" + IssueDateEnd,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//项目管理高级检索
app.get('/listTaskProgressAdv', function (req, res) {
	console.log("报告高级查询");
	var page = req.query.page;
	var limit = req.query.limit;
	var startDate = req.query.createTimeStart;
	var endDate = req.query.createTimeEnd;
	var delegateNumber = req.query.delegateNumber?urlencode(req.query.delegateNumber):'';
	var sampleNumber = req.query.sampleNumber?urlencode(req.query.sampleNumber):'';
	var testProj = req.query.testProj?urlencode(req.query.testProj):'';
	var state = req.query.state?urlencode(req.query.state):'';
	var proposer = req.query.proposer?urlencode(req.query.proposer):'';
	var projectManagerName = req.query.projectManagerName?urlencode(req.query.projectManagerName):'';
	console.log(req.query);
	request({url:global.base + '/admin/progress/listTaskProgressAdv?page=' + page + '&limit=' + limit + "&startDate=" + startDate + "&endDate=" + endDate + "&delegateNumber=" + delegateNumber +	"&sampleNumber=" + sampleNumber +	"&testProj=" + testProj +	"&proposer=" + proposer + "&state=" + state + "&projectManagerName=" + projectManagerName,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//查看报告逾期列表高级检索
app.get('/listOverdueTaskReportAdv', function (req, res) {
	console.log("查看报告逾期列表高级检索");
	var page = req.query.page;
	var limit = req.query.limit;
	var completeDateLimit = req.query.completeDateLimit;
	var delegateNumber = req.query.delegateNumber?urlencode(req.query.delegateNumber):'';
	var testProj = req.query.testProj?urlencode(req.query.testProj):'';
	var sampleNumber = req.query.sampleNumber?urlencode(req.query.sampleNumber):'';
	var proposer = req.query.proposer?urlencode(req.query.proposer):'';
	var proposerDepartment = req.query.proposerDepartment?urlencode(req.query.proposerDepartment):'';
	var phoneNumber = req.query.phoneNumber?urlencode(req.query.phoneNumber):'';
	var state = req.query.state?urlencode(req.query.state):'';
	var projectManager = req.query.projectManager?urlencode(req.query.projectManager):'';
	console.log(req.query);
	request({url:global.base + '/admin/progress/listOverdueTaskReportAdv?page=' + page + '&limit=' + limit + '&completeDateLimit=' + completeDateLimit + "&delegateNumber=" + delegateNumber +	"&testProj=" + testProj +	"&sampleNumber=" + sampleNumber +	"&proposer=" + proposer + "&proposerDepartment=" + proposerDepartment + "&phoneNumber=" + phoneNumber + "&state=" + state + "&projectManager=" + projectManager,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message.data);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
module.exports = app;