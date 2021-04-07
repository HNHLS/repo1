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
//样品列表页
app.get('/sampling', function (req, res) {
	console.log("样品列表页");
	var chosen=decodeURIComponent(req.cookies.chosen)
	var page=req.query.page?req.query.page:1
	var keyword=req.query.keyword?req.query.keyword:''
	var startDate=req.query.startDate?req.query.startDate:''
	var endDate=req.query.endDate?req.query.endDate:''
	res.render('modular_sample/sampling',{chosen:chosen,page:page,keyword:keyword,startDate:startDate,endDate:endDate});
})
//样品列表
app.get('/samplelist', function (req, res) {
	console.log("样品列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var startDate= req.query.startDate?urlencode(req.query.startDate):'';
	var endDate= req.query.endDate?urlencode(req.query.endDate):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/sample/list?page=' + page + '&limit=' + limit + '&keyword=' + keyword+'&startDate='+startDate+'&endDate='+endDate+'&state=',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取委托单下的分单列表的样品信息
app.get('/listSubTaskUnderTask', function (req, res) {
	console.log("获取委托单下的分单列表的样品信息");
	var page = req.query.page;
	var limit = req.query.limit;
	var delegateNum = req.query.delegateNum;
	request({url:global.base + '/admin/sample/listSubTaskUnderTask?page=' + page + '&limit=' + limit + '&delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//获取样品详情
app.get('/samplingedit', function (req, res) {
	console.log("获取样品详情");
	var json={}
	var delegateNum = req.query.delegateNum;
	var page=req.query.page
	var keyword=req.query.keyword
	var startDate=req.query.startDate
	var endDate=req.query.endDate
	var url = global.base;
		request({url:url + '/admin/sample/getDelegateSample?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				if(JSON.parse(body).status=="fail"){
					res.render('home/error', {msg:jsonstr});
				}else{
					json.delegator = jsonstr.delegator;
					json.delegatorOrg = jsonstr.delegatorOrg;
					json.applyDate = jsonstr.applyDate;
					json.phoneNumber = jsonstr.phoneNumber;
					json.address = jsonstr.address;
					json.delegateNum = jsonstr.delegateNum
					json.testProj = jsonstr.testProj
					json.prior = jsonstr.prior;
					json.sampleName = jsonstr.sampleName;
					
					json.sampleNum= jsonstr.sampleNum;
					json.sampleCount = jsonstr.sampleCount
					json.sampleModel = jsonstr.sampleModel
					json.sampleSpecs = jsonstr.sampleSpecs;
					json.sampleFrom = jsonstr.sampleFrom;
					json.sampleState = jsonstr.sampleState;
					json.sampleArriveDate = jsonstr.sampleArriveDate
					json.storageNum = jsonstr.storageNum
					json.arriveWay = jsonstr.arriveWay;
					json.projFrom = jsonstr.projFrom;
					json.passState = jsonstr.passState;
					json.printState = jsonstr.printState;
					json.notifyState = jsonstr.notifyState;

					json.email= jsonstr.email
					json.page=page
					json.keyword=keyword
					json.startDate=startDate
					json.endDate=endDate
					res.render('modular_sample/samplingedit', json);
				}
			} else {
				console.log(body);
			}
		});
});

//获取分单样品详情
app.get('/subsamplingedit', function (req, res) {
	console.log("获取分单样品详情");
	var json={}
	var delegateNum = req.query.delegateNum;
	var subTaskNumber = req.query.subTaskNumber;
	var page=req.query.page
	var keyword=req.query.keyword
	var startDate=req.query.startDate
	var endDate=req.query.endDate
	var url = global.base;
		request({url:url + '/admin/sample/getSubTaskSamplePage?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				if(JSON.parse(body).status=="fail"){
					res.render('home/error', {msg:jsonstr});
				}else{
					json.delegator = jsonstr.delegator;
					json.delegatorOrg = jsonstr.delegatorOrg;
					json.applyDate = jsonstr.applyDate;
					json.phoneNumber = jsonstr.phoneNumber;
					json.address = jsonstr.address;
					json.delegateNum = delegateNum;
					json.subTaskNumber = subTaskNumber;
					json.testProj = jsonstr.testProj;
					json.prior = jsonstr.prior;
					json.sampleName = jsonstr.sampleName;
					json.sampleNum= jsonstr.sampleNum;
					json.sampleCount = jsonstr.sampleCount
					json.sampleModel = jsonstr.sampleModel
					json.sampleSpecs = jsonstr.sampleSpecs;
					json.sampleFrom = jsonstr.sampleFrom;
					json.sampleState = jsonstr.sampleState;
					json.sampleArriveDate = jsonstr.sampleArriveDate
					json.storageNum = jsonstr.storageNum
					json.arriveWay = jsonstr.arriveWay;
					json.projFrom = jsonstr.projFrom;
					json.state = jsonstr.state;
					json.passState = jsonstr.passState;
					json.printState = jsonstr.printState;
					json.notifyState = jsonstr.notifyState;
					json.email= jsonstr.email
					json.page=page
					json.keyword=keyword
					json.startDate=startDate
					json.endDate=endDate
					res.render('modular_sample/subsamplingedit', json);
				}
			} else {
				console.log(body);
			}
		});
});

//样品核对页
app.get('/checkSample', function (req, res) {
	console.log("样品核对页");
	var action=req.query.action
	var delegateNum=req.query.delegateNum
	var json={
		action:action,
		delegateNum:delegateNum
	}
	var url = global.base;
	request({url:url + '/admin/sample/listNeedCheckSample?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message);
			var jsonstr = JSON.parse(body).message;
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.sampleArray = jsonstr;
				console.log(json);
				res.render('modular_sample/checkSample',json);
			}
		} else {
			console.log(body);
		}
	});
})

//分单样品核对页
app.get('/subCheckSample', function (req, res) {
	console.log("样品核对页");
	var action=req.query.action
	var delegateNum = req.query.delegateNum
	var subTaskNumber=req.query.subTaskNumber
	var json={
		action:action,
		subTaskNumber:subTaskNumber
	}
	var url = global.base;
	request({url:url + '/admin/sample/listNeedCheckSampleUnderSubTask?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message);
			var jsonstr = JSON.parse(body).message;
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.sampleArray = jsonstr;
				json.delegateNum = delegateNum;
				console.log(json);
				res.render('modular_sample/subCheckSample',json);
			}
		} else {
			console.log(body);
		}
	});
})

//核对样品
app.post('/checkSample', function (req, res, next) {
	console.log("核对样品");
	var action = req.query.action;
	var extra=req.body.extra
	var delegateNum=req.query.delegateNum
	var storageNum=req.body.storageNum
	var sampleState=req.body.sampleState
	var sampleArriveWay=req.body.sampleArriveWay
	var sampleArray=req.query.sampleArray.split(",")
	console.log(req.query);
	console.log(req.body);
	var options = {
		method: 'POST',
		url: global.base + '/admin/sample/checkSample',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			action:action,
			delegateNum:delegateNum,
			storageNum:storageNum,
			sampleState:sampleState,
			sampleArriveWay:sampleArriveWay,
			extra:extra,
			sampleArray:JSON.stringify(sampleArray) 
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
//打印页获取样品详情
app.get('/QRcode', function (req, res) {
	console.log("打印页获取样品详情");
	var json={}
	var delegateNum = req.query.delegateNum;
	var page=req.query.page
	var keyword=req.query.keyword
	var startDate=req.query.startDate
	var endDate=req.query.endDate
	var chosen=decodeURIComponent(req.cookies.chosen)
	console.log(req.query,chosen)
	var url = global.base;
		request({url:url + '/admin/sample/getDelegateSample?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				if(JSON.parse(body).status=="fail"){
					res.render('home/error', {msg:jsonstr});
				}else{
					json.delegator = jsonstr.delegator;
					json.delegatorOrg = jsonstr.delegatorOrg;
					json.applyDate = jsonstr.applyDate;
					json.phoneNumber = jsonstr.phoneNumber;
					json.address = jsonstr.address;
					json.delegateNum = jsonstr.delegateNum
					json.testProj = jsonstr.testProj
					json.prior = jsonstr.prior;
					json.sampleName = jsonstr.sampleName;
					
					json.sampleNum= jsonstr.sampleNum;
					json.sampleCount = jsonstr.sampleCount
					json.sampleModel = jsonstr.sampleModel
					json.sampleSpecs = jsonstr.sampleSpecs;
					json.sampleFrom = jsonstr.sampleFrom;
					json.sampleState = jsonstr.sampleState;
					json.sampleArriveDate = jsonstr.sampleArriveDate
					json.storageNum = jsonstr.storageNum
					json.arriveWay = jsonstr.arriveWay;
					json.projFrom = jsonstr.projFrom;
					
					json.passState = jsonstr.passState;
					json.printState = jsonstr.printState;
					json.notifyState = jsonstr.notifyState;
					json.chosen=chosen

					json.email=jsonstr.email
					json.page=page
					json.keyword=keyword
					json.startDate=startDate
					json.endDate=endDate
					res.render('modular_sample/QRcode', json);
				}
			} else {
				console.log(body);
			}
		});
});
//打印页获取分单样品详情
app.get('/subQRcode', function (req, res) {
	console.log("打印页获取分单样品详情");
	var json={}
	var delegateNum = req.query.delegateNum;
	var subTaskNumber = req.query.subTaskNumber;
	var page=req.query.page
	var keyword=req.query.keyword
	var startDate=req.query.startDate
	var endDate=req.query.endDate
	var chosen=decodeURIComponent(req.cookies.chosen)
	var url = global.base;
		request({url:url + '/admin/sample/getSubTaskSamplePage?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				if(JSON.parse(body).status=="fail"){
					res.render('home/error', {msg:jsonstr});
				}else{
					json.delegator = jsonstr.delegator;
					json.delegatorOrg = jsonstr.delegatorOrg;
					json.applyDate = jsonstr.applyDate;
					json.phoneNumber = jsonstr.phoneNumber;
					json.address = jsonstr.address;
					json.delegateNum = delegateNum
					json.subTaskNumber = subTaskNumber
					json.testProj = jsonstr.testProj
					json.prior = jsonstr.prior;
					json.sampleName = jsonstr.sampleName;
					
					json.sampleNum= jsonstr.sampleNum;
					json.sampleCount = jsonstr.sampleCount
					json.sampleModel = jsonstr.sampleModel
					json.sampleSpecs = jsonstr.sampleSpecs;
					json.sampleFrom = jsonstr.sampleFrom;
					json.sampleState = jsonstr.sampleState;
					json.sampleArriveDate = jsonstr.sampleArriveDate
					json.storageNum = jsonstr.storageNum
					json.arriveWay = jsonstr.arriveWay;
					json.projFrom = jsonstr.projFrom;
					
					json.passState = jsonstr.passState;
					json.printState = jsonstr.printState;
					json.notifyState = jsonstr.notifyState;
					json.chosen=chosen

					json.email=jsonstr.email
					json.page=page
					json.keyword=keyword
					json.startDate=startDate
					json.endDate=endDate
					res.render('modular_sample/subQRcode', json);
				}
			} else {
				console.log(body);
			}
		});
});
//获取委托单样品信息(打印页表格，可靠性)
app.get('/getSampleCode', function (req, res) {
	console.log("获取委托单样品信息");
	var json={}
	var delegateNum = req.query.delegateNum;
	console.log(delegateNum)
	var url = global.base;
		request({url:url + '/admin/sample/getSampleCode?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				res.json(JSON.parse(body));
			} else {
				console.log(body);
			}
		});
});
//获取委托单样品信息(打印页表格，理化)
app.get('/getSubTaskSampleCode', function (req, res) {
	console.log("获取委托单样品信息");
	var json={}
	var delegateNum = req.query.delegateNum;
	console.log(delegateNum)
	var url = global.base;
		request({url:url + '/admin/sample/getSubTaskSampleCode?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				res.json(JSON.parse(body));
			} else {
				console.log(body);
			}
		});
});
//获取分单样品信息（可靠性）
app.get('/getSubTaskSample', function (req, res) {
	console.log("获取分单样品信息");
	var json={}
	var subTaskNumber = req.query.subTaskNumber;
	var delegateNum = req.query.delegateNum;
	console.log(subTaskNumber)
	var url = global.base;
	request({url:url + '/admin/sample/getSubTaskSample?subTaskNumber=' + subTaskNumber+'&delegateNum='+delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message);
			var jsonstr = JSON.parse(body).message;
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});

//获取分单样品信息（理化）
app.get('/getPCSubTaskSample', function (req, res) {
	console.log("获取理化分单信息");
	var json={}
	var subTaskNumber = req.query.subTaskNumber;
	var delegateNum = req.query.delegateNum;
	console.log(subTaskNumber)
	var url = global.base;
	request({url:url + '/admin/sample/getPCSubTaskSample?subTaskNumber=' + subTaskNumber+'&delegateNum='+delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message);
			var jsonstr = JSON.parse(body).message;
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
//获取可靠性样品打印信息
app.get('/getSamplePrint', function (req, res) {
	console.log("获取可靠性样品打印信息");
	var json={}
	var delegateNumArray = req.query.delegateNumArray?req.query.delegateNumArray.split(","):'';
	var subTaskNumberArray = req.query.subTaskNumberArray?req.query.subTaskNumberArray.split(","):'';
	var id = req.query.id;
	var url = global.base;
		request({url:url + '/admin/sample/getSamplePrint?delegateNumArray='+(delegateNumArray===''?'':JSON.stringify(delegateNumArray))+'&subTaskNumberArray='+(subTaskNumberArray===''?'':JSON.stringify(subTaskNumberArray))+(id?"&id="+id:"") ,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				res.json(JSON.parse(body));
			} else {
				console.log(body);
			}
		});
});
//获取理化样品打印信息
app.get('/getSubTaskPrint', function (req, res) {
	console.log("获取理化样品打印信息");
	var delegateNum = req.query.delegateNum?req.query.delegateNum.split(","):'';
	var subTaskNumberArray = req.query.subTaskNumberArray?req.query.subTaskNumberArray.split(","):'';
	var url = global.base;
		request({url:url + '/admin/sample/getSubTaskPrint?delegateNumArray=' +(delegateNum===''?'':JSON.stringify(delegateNum))+'&subTaskNumberArray='+(subTaskNumberArray===''?'':JSON.stringify(subTaskNumberArray)),headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				res.json(JSON.parse(body));
			} else {
				console.log(body);
			}
		});
});
//通知领样
app.post('/notificationUseSample', function (req, res) {
	console.log("通知领样");
	var delegateNumArray = req.query.delegateNumArray;
	console.log(delegateNumArray);
	request({
		url: global.base + '/admin/sample/notificationUseSample?delegateNumArray=' + delegateNumArray,
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
//领取样品页
app.get('/fetchSample', function (req, res) {
	console.log("领取样品页");
	var delegateNum=req.query.delegateNum
	var json={
		delegateNum:delegateNum
	}
	var url = global.base;
	request({url:url + '/admin/sample/listCanFetchSample?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message);
			var jsonstr = JSON.parse(body).message;
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.sampleArray = jsonstr;
				console.log(json)
				res.render('modular_sample/fetchSample',json);
			}
		} else {
			console.log(body);
		}
	});
})
//领取分单样品页
app.get('/subFetchSample', function (req, res) {
	console.log("领取分单样品页");
	var delegateNum = req.query.delegateNum;
	var subTaskNumber=req.query.subTaskNumber;
	console.log(delegateNum);
	console.log(subTaskNumber);
	var json={
		subTaskNumber:subTaskNumber,
		delegateNum:delegateNum
	}
	var url = global.base;
	request({url:url + '/admin/sample/listCanFetchSampleUnderSubTask?subTaskNumber=' + subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).message);
			var jsonstr = JSON.parse(body).message;
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.sampleArray = jsonstr;
				console.log(json);
				res.render('modular_sample/subFetchSample',json);
			}
		} else {
			console.log(body);
		}
	});
})

//领取样品
app.get('/fetchSampleApi', function (req, res) {
	console.log("领取样品");
	var delegateNum = req.query.delegateNum;
	var sampleArray=req.query.sampleArray.split(",")
	var staffId=req.query.staffId
	console.log(req.body)
	console.log(req.query)
	var url = global.base;
		request({url:url + '/admin/sample/fetchSample?delegateNum=' +delegateNum+'&sampleArray='+JSON.stringify(sampleArray)+'&staffId='+staffId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				res.json(JSON.parse(body));
			} else {
				console.log(body);
			}
		});
});
//样品退库列表页
app.get('/partwithdrawal', function (req, res) {
	console.log("样品退库列表页");
	res.render('modular_sample/partwithdrawal');
})
//样品退库列表
app.get('/listBackToStorageSubTask', function (req, res) {
	console.log("样品退库列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/sample/listBackToStorageSubTask?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//分单信息的样品信息页
app.get('/addwithdrawal', function (req, res) {
	console.log("分单信息的样品信息");
	var uniqueNumber = req.query.uniqueNumber;
	var subTaskId = req.query.ids;
	var subTaskNumber = req.query.subTaskNumber==undefined?"":req.query.subTaskNumber;
	var json = {
		uniqueNumber: uniqueNumber,
		subTaskId: subTaskId,
		subTaskNumber: subTaskNumber,
		chosen: req.cookies.chosen
	};
	console.log(json);
	res.render('modular_sample/addwithdrawal', json);
})
//分单信息的样品信息
app.get('/getSubTaskSampleInfo', function (req, res) {
	console.log("分单信息的样品信息");
	var subTaskId=req.query.subTaskId
	var uniqueNumber=req.query.uniqueNumber
	var json={
		subTaskNumber:"",
		delegateNum:"",
		testProj:"",
		sampleName:"",
		sampleCount:"",
		sampleModel:"",
		sampleSpecs:"",
		sampleNumber:"",
		sampleUniqueNumber:"",
		inStorage:"",
		sampleArray:"",
	}
	if(subTaskId>0){
		request({url:global.base + '/admin/sample/getSubTaskSampleInfo?subTaskId=' + subTaskId,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				res.json(JSON.parse(body));
			} else {
				console.log(error);
			}
		});
	}else{
		request({url:global.base + '/admin/sample/getSubTaskSampleInfo?uniqueNumber=' + uniqueNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				res.json(JSON.parse(body));
			} else {
				console.log(error);
			}
		});
	}
})

//分单退库
app.post('/returnSampleToStorage', function (req, res) {
	console.log("分单退库");
	var sampleArray = req.query.sampleArray;
	var subTaskNumber = req.query.subTaskNumber;
	var storageNum=req.query.storageNum;
	console.log(req.query);
	request({url:global.base + '/admin/sample/returnSampleToStorage?sampleArray=' + sampleArray+"&subTaskNumber="+subTaskNumber+"&storageNum="+encodeURIComponent(storageNum),headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//样品退样列表页
app.get('/withdrawal', function (req, res) {
	console.log("样品退样列表页");
	res.render('modular_sample/withdrawal');
})
//样品退样列表
app.get('/listReturnDelegateSample', function (req, res) {
	console.log("样品退样列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/sample/listReturnDelegateSample?page=' + page + '&limit=' + limit + '&keyword=' + keyword,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//分单样品退样列表
app.get('/listReturnSubTaskSample', function (req, res) {
	console.log("分单样品退样列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var delegateNum = req.query.delegateNum
	console.log(req.query,delegateNum);
	request({url:global.base + '/admin/sample/listReturnSubTaskSample?page=' + page + '&limit=' + limit  +'&delegateNum='+delegateNum ,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

//查询指定委托单退样情况
app.get('/widthdrawaledit', function (req, res) {
	console.log("查询指定委托单退样情况");
	var delegateNum = req.query.delegateNum;
	console.log(req.query)
	var url = global.base;
		request({url:url + '/admin/sample/getDelegateSampleReturn?delegateNum=' + delegateNum,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				jsonstr.chosen = decodeURIComponent(req.cookies.chosen);
				res.render('modular_sample/widthdrawaledit', jsonstr);
			} else {
				console.log(body);
			}
		});
});
//查询指定分单退样情况
app.get('/subwidthdrawaledit', function (req, res) {
	console.log("查询指定分单退样情况");
	var subTaskNumber = req.query.subTaskNumber;
	console.log(req.query)
	var url = global.base;
		request({url:url + '/admin/sample/getDelegateSampleReturn?subTaskNumber='+subTaskNumber,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				jsonstr.chosen = decodeURIComponent(req.cookies.chosen);
				res.render('modular_sample/subwidthdrawaledit', jsonstr);
			} else {
				console.log(body);
			}
		});
});
//退样
app.post('/returnSample', function (req, res) {
	console.log("退样");
	console.log(req.body)
	var delegateNum=req.body.delegateNum
	var receiver=req.body.receiver
	var department=req.body.department
	var phoneNumber=req.body.phoneNumber
	var address=req.body.address
	var returnDate=req.body.returnDate
	var options = {
		method: 'POST',
		url: global.base + '/admin/sample/returnSample',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			delegateNum:delegateNum,
			receiver:receiver,
			department:department,
			phoneNumber:phoneNumber,
			address:address,
			returnDate:returnDate
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
//分单退样
app.post('/returnSubSample', function (req, res) {
	console.log("分单退样");
	console.log(req.body)
	var subTaskNumber=req.body.delegateNum
	var receiver=req.body.receiver
	var department=req.body.department
	var phoneNumber=req.body.phoneNumber
	var address=req.body.address
	var returnDate=req.body.returnDate
	var options = {
		method: 'POST',
		url: global.base + '/admin/sample/returnSample',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			subTaskNumber:subTaskNumber,
			receiver:receiver,
			department:department,
			phoneNumber:phoneNumber,
			address:address,
			returnDate:returnDate
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
module.exports = app;