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
//首页统计
app.get('/index', function (req, res) {
	console.log("首页统计");
	res.render('modular_statistics/index');
})
//获取首页统计
app.get('/frontPage', function (req, res) {
	console.log("获取首页统计");
	request({url:global.base + '/admin/task/frontPage',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//项目统计列表页
app.get('/project', function (req, res) {
	console.log("项目统计列表页");
	var url = global.base;
		request({url:url + '/admin/stat/delegateStat',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr =JSON.parse(body).message;
				res.render('modular_statistics/project', jsonstr,);
			} else {
				console.log(body);
			}
		});
})
//任务统计
app.get('/taskbygroup', function (req, res) {
	console.log("任务统计");
	request({url:global.base + '/admin/stat/taskByGroup',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//工作量统计
app.get('/workstat', function (req, res) {
	var startDate=req.query.startDate?req.query.startDate:''
	var endDate=req.query.endDate?req.query.endDate:''
	var rangeType=req.query.rangeType?req.query.rangeType:''
	console.log("工作量统计");
	request({url:global.base + '/admin/stat/workStat?startDate='+startDate+'&endDate='+endDate+'&rangeType='+rangeType,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonbody = JSON.parse(body)
			res.json(jsonbody);
		} else {
			console.log(error);
		}
	});
})
//项目汇总
app.get('/taskSummary', function (req, res) {
	var startDate=req.query.startDate?req.query.startDate:''
	var endDate=req.query.endDate?req.query.endDate:''
	console.log("项目汇总");
	request({url:global.base + '/admin/stat/taskSummary?startDate='+startDate+'&endDate='+endDate,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			var jsonbody = JSON.parse(body)
			res.json(jsonbody);
		} else {
			console.log(error);
		}
	});
})


//委托统计表格导出
app.get('/exportTaskStat', function (req, res) {
	console.log("委托统计表格导出");
	var url = global.base;
	request({url:url + '/admin/stat/exportTaskStat',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

//费用统计列表页
app.get('/cost', function (req, res) {
	console.log("费用统计列表页");
	var url = global.base;
		request({url:url + '/admin/stat/costStat',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				res.render('modular_statistics/cost', jsonstr);
			} else {
				console.log(body);
			}
		});
})
//导出成本表格
app.get('/exportCost', function (req, res) {
	console.log("导出成本表格");
	var url = global.base;
	request({url:url + '/admin/stat/exportCost',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//成本趋势
app.get('/costTrend', function (req, res) {
	console.log("成本趋势");
	var url = global.base;
	var startDate = req.query.startDate
	var endDate = req.query.endDate
	request({url:url + '/admin/stat/costTrend?startDate='+startDate+'&endDate='+endDate,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//设备统计列表页
app.get('/equipment', function (req, res) {
	console.log("设备统计列表页");
	console.log(req.query);
	res.render('modular_statistics/equipment');
});
//设备数量统计
app.post('/equipment_eqnum', function (req, res,next) {
	console.log("设备数量统计");
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipment_eqnum',
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
			console.log(error);
		}
	});
})
//当月维修数量 (台件)
app.get('/maintenMonthNum', function (req, res,next) {
	console.log("当月维修数量 (台件)");
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/maintenMonthNum',
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
			console.log(error);
		}
	});
})
//维修完成率
app.get('/maintenPointAll', function (req, res,next) {
	console.log("维修完成率");
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/maintenPointAll',
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
			console.log(error);
		}
	});
})
// 关键设备满载率 (台件)
app.get('/equipmentAvgWorkingStat', function (req, res,next) {
	console.log("当月维修数量 (台件)");
	var options = {
		method: 'POST',
		url: global.base + '/admin/stat/equipmentAvgWorkingStat',
		headers: {"content-type": "application/json",'token':req.cookies.sessionId}
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


//核查当天预警
app.post('/equipment_checknow', function (req, res,next) {
	console.log("核查当天预警");
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipment_checknow',
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
			console.log(error);
		}
	});
})
//核查当月预警
app.post('/equipment_checkmonth', function (req, res,next) {
	console.log("核查当月预警");
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipment_checkmonth',
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
			console.log(error);
		}
	});
})
//检定当天预警
app.post('/equipment_recordnow', function (req, res,next) {
	console.log("检定当天预警");
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipment_recordnow',
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
			console.log(error);
		}
	});
})
//检定当月预警
app.post('/equipment_recordmonth', function (req, res,next) {
	console.log("检定当月预警");
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipment_recordmonth',
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
			console.log(error);
		}
	});
})
//设备使用群组
app.post('/equipment_useui', function (req, res,next) {
	console.log("设备使用群组");
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipment_useui',
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
			console.log(error);
		}
	});
})
//设备维修群组
app.post('/equipment_weiui', function (req, res,next) {
	console.log("设备维修群组");
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipment_weiui',
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
			console.log(error);
		}
	});
})
//七天内维修完成率
app.post('/equipment_maintenok', function (req, res,next) {
	console.log("七天内维修完成率");
	var startdate =req.query.today
	var enddate =req.query.endday
	var options = {
		method: 'POST',
		url: global.equipment + '/enquipmentinfo/equipment_maintenok?startdate='+startdate+'&enddate='+enddate,
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
			console.log(error);
		}
	});
})

//设备运行统计导出
app.get('/equipmentExport', function (req, res) {
	console.log("设备运行统计导出");
	var url = global.base;
	request({url:url + '/admin/stat/equipmentExport',headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

//设备运行状态统计
app.get('/equipmentWorkingStat', function (req, res) {
	console.log("设备运行状态统计");
	var url = global.base;
	var startDate=req.query.startDate;
	var endDate=req.query.endDate;
	request({url:url + '/admin/stat/equipmentWorkingStat?startDate='+startDate+'&endDate='+endDate,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})

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

//资质统计列表页
app.get('/qualifications', function (req, res) {
	console.log("资质统计列表页");
	res.render('modular_statistics/qualifications');
})
//样品统计列表页
app.get('/sample', function (req, res) {
	console.log("样品统计列表页");
	res.render('modular_statistics/sample');
})
module.exports = app;