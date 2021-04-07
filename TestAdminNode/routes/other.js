/**
 * 其他验证方法
 */
var express = require('express');
var request = require('request'); //方式2
var urlencode = require('urlencode');
var cookieParser = require('cookie-parser');
var path = require('path');
var main = require('./main');
var app = express();

app.use(cookieParser()); //使用cookie中间件

//验证任务是否办理过
app.get('/checkishandle', function (req, res) {
	console.log("验证任务是否办理过");
	var tid = req.query.tid;
	var url = req.cookies.taskurl + '/api/Task_Others/CheckHandle?tid=' + tid;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})


//验证任务是否办理过【批量】
app.get('/list_checkishandle', function (req, res) {
	console.log("验证任务是否办理过【批量】");
	var idlist = req.query.idlist;
	var url = req.cookies.taskurl + '/api/Task_Others/List_CheckHandle?idlist=' + idlist;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})

//接受任务
app.get('/accepttask', function (req, res) {
	console.log("接受任务");
	var tid = req.query.tid;
	var url = req.cookies.taskurl + '/api/Task_Others/AcceptTask?tid=' + tid;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})

//完成任务的数据采集
app.get('/acceptdata', function (req, res) {
	console.log("完成任务的数据采集");
	var tid = req.query.tid;
	var url = req.cookies.taskurl + '/api/Task_Others/AcceptData?tid=' + tid;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})

//完成报告生成办理
app.get('/acceptreport', function (req, res) {
	console.log("完成报告生成办理");
	var tid = req.query.tid;
	var url = req.cookies.taskurl + '/api/Task_Reports/AcceptReportForDeyang?tid=' + tid;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})

//批量下发
app.get('/batch_allocation', function (req, res) {
	console.log("批量下发");
	var idlist = req.query.idlist;
	var userid = req.query.userid;
	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
	var nowdid = cookie.user_did;
	var name = urlencode(req.query.name);
	var nextdid = req.query.nextdid;
	var nextdname = urlencode(req.query.nextdname);
	var url = req.cookies.taskurl + '/api/Task_Others/List_Allocation?idlist=' + idlist + '&userid=' + userid + "&nowdid=" + nowdid + "&name=" + name + "&nextdid=" + nextdid + "&nextdname=" + nextdname;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})

//批量签发
app.get('/Issuance', function (req, res) {
	console.log("批量签发");
	var idlist = req.query.idlist;
	var url = req.cookies.taskurl + '/api/Task_Others/List_Issuance?idlist=' + idlist;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})


//批量打印
app.get('/Print', function (req, res) {
	console.log("批量签发");
	var idlist = req.query.idlist;
	var url = req.cookies.taskurl + '/api/Task_Others/List_Print?idlist=' + idlist;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})


//结束项目
app.get('/EndProject', function (req, res) {
	console.log("结束项目");
	var idlist = req.query.idlist;
	var url = req.cookies.taskurl + '/api/Task_Others/EndProject?idlist=' + idlist;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})

//文件预览页
app.get('/fileview', function (req, res) {
	console.log("文件预览页");
	var url = req.query.url;//微软服务只能使用域名对公地址
	var type = 0; //文件类型 0)pdf 1)xls word ppt 2)其他文件
	var hz = path.extname(url);
	if (hz == ".pdf") {
		type = 0;
	} else if (hz == ".xls" || hz == ".xlsx" || hz == ".doc" || hz == ".docx") {
		type = 1;
	} else if (hz == ".png" || hz == ".jpg" || hz == ".jpeg" || hz == ".fig") {
		type = 2;
	} else {
		type = 3;
	}
	var json = {
		url: url,
		type: type
	}
	res.render('other/fileview', json);
})


//通用上传
app.get('/fileupload', function (req, res) {
	res.render('other/fileupload');
})


//方案修改页
app.get('/programme_edit', function (req, res) {
	console.log("方案修改页");
	var tid = req.query.tid; //项目编号
	var json = {
		tid: tid,
	}
	var url = req.cookies.taskurl + '/api/Task_Others/Programme_Info?id=' + tid;

	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			json.Data = JSON.parse(body);
			console.log(json);
			res.render('other/programme_edit', json);
		} else {
			console.log(body);
		}
	})
})

//方案文件替换
app.get('/file_replace', function (req, res) {
	console.log("方案文件替换");
	var id = req.query.id; //项目编号
	var json = {
		id: id
	}
	res.render('other/file_replace', json);
})

//方案文件替换编辑
app.post('/file_replace_edit', function (req, res) {
	console.log("方案文件替换编辑");
	var id = req.body.id;
	var url = req.body.url;
	var name = req.body.name;
	var body = {
		id: id,
		url: url,
		name: name
	}
	console.log(body);
	var options = {
		method: 'Post',
		url: req.cookies.taskurl + '/api/Task_Others/Programme_Replace',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(body)
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
})

//报告修改页
app.get('/report_edit', function (req, res) {
	console.log("报告修改页");
	var tid = req.query.tid; //项目编号
	var json = {
		tid: tid,
	}
	var url = req.cookies.taskurl + '/api/Task_Others/Report_Info?id=' + tid;

	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			json.Data = JSON.parse(body);
			console.log(json);
			res.render('other/report_edit', json);
		} else {
			console.log(body);
		}
	})
})
//报告文件替换页
app.get('/report_replace', function (req, res) {
	console.log("报告文件替换页");
	var id = req.query.id; //项目编号
	var json = {
		id: id
	}
	res.render('other/report_replace', json);
})

//报告文件替换编辑
app.post('/report_replace_edit', function (req, res) {
	console.log("报告文件替换编辑");
	var id = req.body.id;
	var url = req.body.url;
	var name = req.body.name;
	var reason = req.body.reason;
	var body = {
		id: id,
		url: url,
		name: name,
		reason: reason
	}
	console.log(body);
	var options = {
		method: 'Post',
		url: req.cookies.taskurl + '/api/Task_Others/Report_Replace',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(body)
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
})


//打印标签
app.get('/print_list', function (req, res) {
	console.log("打印标签");
	var no = req.query.nolist; //标签
	var json = {
		no: no
	}
	res.render('other/print_list', json);
})


//任务单流转单
app.get('/print_task', function (req, res) {
	console.log("任务单流转单");
	var id = req.query.id; //标签
	//远程拉取数据
	var url = global.entrusturl + '/api/PrintEntrust/GetTaskOrder?pid=' + id;
	//console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			console.log(json);
			res.render('other/print_task', json);
		} else {
			console.log(body);
		}
	})

})

//样品预算单
app.get('/print_sample', function (req, res) {
	console.log("样品预算单");
	var id = req.query.id; //标签
	var url = global.entrusturl + '/api/PrintEntrust/GetTaskCost?pid=' + id;
	//console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			console.log(json);
			res.render('other/print_sample', json);
		} else {
			console.log(body);
		}
	})


})

//样品批量留样操作
app.post('/sample_retain', function (req, res) {
	console.log("样品批量留样操作");
	var idlist = req.body.idlist;
	var tid = req.body.tid;
	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
	var userid = cookie.user_no;
	var body = {
		idlist: idlist,
		tid: tid,
		userid: userid
	}
	console.log(body);
	var options = {
		method: 'Post',
		url: global.entrusturl + '/api/AddEntrust/Sample_Retain',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(body)
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


})


//样品打标json
app.post('/sample_sign', function (req, res) {
	console.log("样品打标json");
	var idlist = req.body.idlist;
	var tid = req.body.tid;
	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
	var userid = cookie.user_no;
	var body = {
		idlist: idlist,
		tid: tid,
		userid: userid
	}
	console.log(body);
	var options = {
		method: 'Post',
		url: global.entrusturl + '/api/AddEntrust/Sample_Sign',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(body)
	};
	request.post(options, function (error, response, body) {
		console.log(body);
		if (!error && response.statusCode == 200) {
			//console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});


})


//项目对比合并功能
app.get('/merge', function (req, res) {
	console.log("项目对比合并功能");
	var id = req.query.id; //样品单编号
	var url = global.entrusturl + '/api/MergeProject/GetSampleInfo?id=' + id;
	//console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			console.log(json);
			res.render('other/merge', json);
		} else {
			console.log(body);
		}
	})
})


//合并功能
app.post('/mergeadd', function (req, res) {
	console.log("合并功能");
	var id = req.body.id;

	var oldproject = req.body.oldproject;
	var newproject_id = req.body.newproject_id;
	var newproject_name = req.body.newproject_name;

	var oldvarieties = req.body.oldvarieties;
	var newvarieties_id = req.body.newvarieties_id;
	var newvarieties_name = req.body.newvarieties_name;

	var oldstandard = req.body.oldstandard;
	var newstandard_id = req.body.newstandard_id;
	var newstandard_name = req.body.newstandard_name;

	var oldparameter = req.body.oldparameter;//参数对应关系列表

	var body = {
		id: id,
		oldproject: oldproject,
		newproject_id: newproject_id,
		newproject_name: newproject_name,
		oldvarieties: oldvarieties,
		newvarieties_id: newvarieties_id,
		newvarieties_name: newvarieties_name,
		oldstandard: oldstandard,
		newstandard_id: newstandard_id,
		newstandard_name: newstandard_name,
		oldparameter: oldparameter
	}
	console.log(body);
	var options = {
		method: 'Post',
		url: global.entrusturl + '/api/MergeProject/AddMerge',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(body)
	};
	request.post(options, function (error, response, body) {
		console.log(body);
		if (!error && response.statusCode == 200) {
			//console.log(body);
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});


})


//上传excel页面
app.get('/excelto', function (req, res) {
	console.log("上传excel页面");
	res.render('other/excel');
})


//拉取德阳设备采集数据
app.get('/getdeyangdata', function (req, res) {
	console.log("拉取德阳设备采集数据");
	var XMBH = req.query.XMBH;
	var url = global.dyeq + '/DesunIntefaceControl?method=getDe2000d&XMBH=' + XMBH;
	console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			res.json(json);
		} else {
			console.log(body);
		}
	})
})

//拉取德阳生成报告接口
app.get('/geBGPDF', function (req, res) {
	console.log("拉取德阳生成报告接口");
	var XCXMBH = req.query.XCXMBH;
	var url = global.dyeq + '/DesunIntefaceControl?method=geBGPDF&XCXMBH=' + XCXMBH;
	console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(body);
		} else {
			console.log(body);
		}
	})
})

//保存生成的编号
app.get('/addreportno', function (req, res) {
	console.log("保存生成的编号");
	var pid = req.query.pid;
	var BGBH = req.query.BGBH;//报告编号
	var QFRQ = req.query.QFRQ;//审核日期
	var QFRY_NAME = urlencode(req.query.QFRY_NAME);//审核人姓名
	var QFRY_ZGBH = req.query.QFRY_ZGBH;//审核人编号
	var SHRQ = req.query.SHRQ;//签发时间
	var SHRY_NAME = urlencode(req.query.SHRY_NAME);//签发人名称
	var SHRY_ZGBH = req.query.SHRY_ZGBH;//签发编号
	var url = req.cookies.taskurl + '/api/Task_Reports/AddReportNo?pid=' + pid + '&BGBH=' + BGBH + "&QFRQ=" + QFRQ + "&QFRY_NAME=" + QFRY_NAME + "&QFRY_ZGBH=" + QFRY_ZGBH + "&SHRQ=" + SHRQ + "&SHRY_NAME=" + SHRY_NAME + "&SHRY_ZGBH=" + SHRY_ZGBH;
	console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(body);
		} else {
			console.log(body);
		}
	})
})


//另存检测中心报告
app.get('/AddReportForActive', function (req, res) {
	console.log("另存检测中心报告");
	var tid = req.query.tid;
	var name = urlencode(req.query.name);
	var fileurl = urlencode(req.query.url);
	var url = req.cookies.taskurl + '/api/Task_Reports/AddReportForActive?tid=' + tid + '&url=' + fileurl + '&name=' + name;
	console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(body);
		} else {
			console.log(body);
		}
	})
})


//另存到报告文件
app.get('/addreportfile', function (req, res) {
	console.log("另存到报告文件");
	var tid = req.query.tid;
	var name = urlencode(req.query.name);
	var fileurl = urlencode(req.query.url);
	var url = req.cookies.taskurl + '/api/Task_Reports/AddReportForDeyang?tid=' + tid + '&url=' + fileurl + '&name=' + name;
	console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(body);
		} else {
			console.log(body);
		}
	})
})


//查看原始记录
app.get('/showdata', function (req, res) {
	console.log("查看原始记录");
	var id = req.query.id;//数据编号
	var json = {
		id: id,
		name: "",//模版名称
		json_data: {},
	}
	//获取模版名称及数据
	var url = req.cookies.taskurl + '/api/Task_Data/GetShowData?id=' + id;
	console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			var data = JSON.parse(body);
			json.json_data = data.json_data;
			json.name = data.name;
			console.log(data);
			res.render('other/showdata', json);
		} else {
			console.log(body);
		}
	})

});

//根据参数获取设备及时间
app.get('/GetEqOrTime', function (req, res) {
	console.log("根据参数获取设备及时间");
	var pid = req.query.pid;//数据编号
	var url = req.cookies.taskurl + '/api/EqBind/GetEqOrTime?pid=' + pid;
	console.log(url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(body);
		} else {
			console.log(body);
		}
	})

});

//工程名称记录
app.get('/samplingrecord', function (req, res) {
	console.log("工程名称记录");
	var type = req.query.type;
	var json = {
		type: type
	}
	res.render('other/samplingrecord', json);
})

//获取第三方对应的工程名称列表
app.get('/samplingrecordlist', function (req, res) {
	console.log("获取第三方对应的工程名称列表");
	var pageSize = req.query.pageSize;
	var startIndex = req.query.startIndex;
	var pageIndex = req.query.pageIndex;
	var name = urlencode(req.query.name);
	var type = req.query.type;
	var customerids = req.query.customerids;
	console.log(req.query);
	request(global.sampleurl + '/api/EngineeringName/GetAllEngineeringNameList?pageSize=' + pageSize + '&startIndex=' + startIndex + '&pageIndex=' + pageIndex + '&name=' + name + '&type=' + type + '&customerids=' + customerids, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body).Data);
			res.json(JSON.parse(body).Data);
		} else {
			console.log(body);
		}
	});
})
//打标签页
app.get('/printlabel', function (req, res) {
	console.log("打标签页");
	var tid = req.query.tid;
	var json = req.query.json;
	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
	var userid = cookie.user_no;
	var body = {
		idlist: json,
		tid: tid,
		userid: userid
	}
	console.log(body);
	var options = {
		method: 'Post',
		url: global.entrusturl + '/api/AddEntrust/Sample_Sign',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(body)
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var data1 = JSON.parse(body);
			var json = {
				data: JSON.stringify(data1.data)
			}
			console.log(json)
			res.render('other/printlabel', json);
		} else {
			console.log(error);
		}
	});
})


//打印设备编码
app.get('/printeq', function (req, res) {
	console.log("打印设备编码");
	var num = req.query.num;
	var data = [];
	//模拟返回值
	for (var i = 0; i < num; i++) {
		var eqjson = {
			no: "0000" + i,
			name: "千斤顶" + i
		}
		data.push(eqjson)
	}
	var json = {
		data: JSON.stringify(data)
	}
	console.log(json)
	res.render('other/printeq', json);
})



//打印报告
app.get('/printreport', function (req, res) {
	console.log("打印报告");
	var tid = req.query.tid;
	var json = {
		tid: tid,
		url: ""
	}
	request(req.cookies.taskurl + '/api/Task_Reports/GetReportPdf?tid=' + tid, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var body = JSON.parse(body);
			json.url = body.errmsg;
			console.log(json);
			res.render('other/printreport', json);
		} else {
			console.log(body);
		}
	});
})


//打印报告根据报告编号
app.get('/printreportbyid', function (req, res) {
	console.log("打印报告");
	var id = req.query.id;
	var json = {
		id: id,
		url: ""
	}
	request(req.cookies.taskurl + '/api/Task_Reports/GetReportPdfByid?id=' +id, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var body = JSON.parse(body);
			json.url = body.errmsg;
			console.log(json);
			res.render('other/printreport', json);
		} else {
			console.log(body);
		}
	});
})


//标记已打印
app.get('/printok', function (req, res) {
	console.log("标记已打印");
	var idlist = req.query.idlist;
	request(req.cookies.taskurl + '/api/Task_Reports/ReportPrintok?idlist=' + idlist, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			console.log(json);
			res.json(json);
		} else {
			console.log(body);
		}
	});
})

//批量签发页
app.get('/listuse', function (req, res) {
	console.log("批量签发页");
	var idlist = req.query.idlist;
	var json = {
		idlist: idlist
	}
	res.render('other/listuse', json);
})


//添加发放记录
app.post('/adduselist', function (req, res) {
	console.log("添加发放记录");
	var idlist = req.body.idlist;

	var send_type = req.body.send_type;
	var sender = req.body.sender;
	var recipient = req.body.recipient;
	var recipient_tel = req.body.recipient_tel;
	var recipient_address = req.body.recipient_address;
	var waybill_information = req.body.waybill_information;
	var remarks = req.body.remarks; //备注信息

	var body = {
		idlist: idlist,
		send_type: send_type,
		sender: sender,
		recipient: recipient,
		recipient_tel: recipient_tel,
		recipient_address: recipient_address,
		waybill_information: waybill_information,
		remarks: remarks
	}
	console.log(body);
	var options = {
		method: 'Post',
		url: req.cookies.taskurl + '/api/Task_Issue/AddIssueList',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(body)
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
})

//获取新的拼接pdf
app.post('/getsplicingpdf', function (req, res) {
	console.log("获取新的拼接pdf");
	var fileList = req.body.fileList;//报告列表
	var body = {
		fileList: fileList
	}
	var json = {
		url: ""
	}
	console.log(body);
	var options = {
		method: 'Post',
		url: global.uploadurl + '/webuploadertest/mergePDFFiles',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(body)
	};
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			if (body != null) {
				json.url = body;
			}
			res.json(json);
		} else {
			console.log(error);
		}
	});
})

//批量接受任务
app.get('/BatchAccept', function (req, res) {
	console.log("批量接受任务");
	var type = req.query.type;
	var idlist = req.query.idlist;
	var url = req.cookies.taskurl + '/api/Task_Others/BatchAccept?type=' + type + '&idlist=' + idlist;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
})


//查看任务进度
app.get('/taskspeed', function (req, res) {
	console.log("查看任务进度");
	var tid = req.query.tid;
	var url = req.cookies.taskurl + '/api/Task_Others/TaskSpeed?tid=' + tid;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			console.log(json);
			res.render('other/taskspeed', json);
		} else {
			console.log(body);
		}
	})
})


///高级检索 所长查看进度 带检索
app.get('/selectlist', function (req, res) {
	console.log("高级检索");
	var type = req.query.type;
	res.render('other/selectlist', {
		type: type
	});
})

//高级检索列表获取
app.get('/getselectlist', function (req, res) {
	var pageSize = req.query.pageSize;
	var startIndex = req.query.startIndex;
	var pageIndex = req.query.pageIndex;
	var starttime = req.query.starttime;
	var endtime = req.query.endtime;
	var name = urlencode(req.query.name);
	var type = req.query.type;
	var typex = req.query.typex;
	//反序列話json
	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
	var url = req.cookies.taskurl + '/api/Select/GetList?type=' + type + '&typex=' + typex + '&pageSize=' + pageSize + '&startIndex=' + startIndex + '&pageIndex=' + pageIndex + '&starttime=' + starttime + '&endtime=' + endtime + '&name=' + name;
	console.log(url);
	var option = {
		url: url,
		headers: {
			token: cookie.token,
		}
	}
	request(option, function (error, response, body) {
		//console.log(response);
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
});


//高级检索 检测员进度查询 
app.get('/tasklist', function (req, res) {
	console.log("检测员进度查询");
	var type = req.query.type;//0)全部 1）已撤销 2）已完成 3）未完成 
	res.render('other/tasklist', {
		type: type
	});
})


//高级检索检测员进度查询列表获取
app.get('/gettasklist', function (req, res) {
	var pageSize = req.query.pageSize;
	var startIndex = req.query.startIndex;
	var pageIndex = req.query.pageIndex;
	var starttime = req.query.starttime;
	var endtime = req.query.endtime;
	var name = urlencode(req.query.name);
	var type = req.query.type;
	//反序列話json
	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
	var url = req.cookies.taskurl + '/api/Select/GetTaskListNew?type=' + type + '&userid=' + cookie.user_no + '&pageSize=' + pageSize + '&startIndex=' + startIndex + '&pageIndex=' + pageIndex + '&starttime=' + starttime + '&endtime=' + endtime + '&name=' + name;
	console.log(url);
	request(url, function (error, response, body) {
		//console.log(response);
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
});

//收样室查询获取任务进度
app.get('/gettaskstatus', function (req, res) {
	var url = req.query.url;
	var wtid = req.query.wtid;//委托单号
	//反序列話json
	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
	var url = url + '/api/Select/GeTaskSpeed?wtid=' + wtid;
	console.log(url);
	request(url, function (error, response, body) {
		//console.log(response);
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
});


//高级检索所长查询报告逾期
app.get('/reportovertime', function (req, res) {
	console.log("高级检索所长查询报告逾期");
	var type = req.query.type;//0)全部 1）已撤销 2）已完成 3）未完成 
	res.render('other/reportovertime', {
		type: type
	});
})



//高级检索所长查询报告逾期
app.get('/getreportovertime', function (req, res) {
	var pageSize = req.query.pageSize;
	var startIndex = req.query.startIndex;
	var pageIndex = req.query.pageIndex;
	var starttime = req.query.starttime;
	var endtime = req.query.endtime;
	var name = urlencode(req.query.name);
	var type = req.query.type;
	//反序列話json
	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
	var url = req.cookies.taskurl + '/api/Select/GetReportOvertime?pageSize=' + pageSize + '&startIndex=' + startIndex + '&pageIndex=' + pageIndex + '&starttime=' + starttime + '&endtime=' + endtime + '&name=' + name;
	console.log(url);
	var option = {
		url: url,
		headers: {
			token: cookie.token,
		}
	}
	request(option, function (error, response, body) {
		//console.log(response);
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
});


///报告修改列表
app.get('/reportedit', function (req, res) {
	console.log("报告修改列表");
	var type = req.query.type;//0)全部 1）已撤销 2）已完成 3）未完成 
	res.render('other/reportedit', {
		type: type
	});
})


//获取修改列表数据
app.get('/getreporteditlist', function (req, res) {
	var pageSize = req.query.pageSize;
	var startIndex = req.query.startIndex;
	var pageIndex = req.query.pageIndex;
	var starttime = req.query.starttime;
	var endtime = req.query.endtime;
	var name = urlencode(req.query.name);

	var url = req.cookies.taskurl + '/api/Select/SelectReportEdit?pageSize=' + pageSize + '&startIndex=' + startIndex + '&pageIndex=' + pageIndex + '&starttime=' + starttime + '&endtime=' + endtime + '&name=' + name;
	//console.log(url);
	request(url, function (error, response, body) {
		//console.log(response);
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
});


//修改查询列表
app.get('/reporteditselect', function (req, res) {
	console.log("修改查询列表");
	var type = req.query.type;//0)全部 1）已撤销 2）已完成 3）未完成 
	res.render('other/reporteditselect', {
		type: type
	});
})


//高级检索报告修改历史
app.get('/getreporteditselect', function (req, res) {
	console.log("高级检索报告修改历史");
	var pageSize = req.query.pageSize;
	var startIndex = req.query.startIndex;
	var pageIndex = req.query.pageIndex;
	var starttime = req.query.starttime;
	var endtime = req.query.endtime;
	var name = urlencode(req.query.name);
	var type = req.query.type;
	//反序列話json
	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
	var url = req.cookies.taskurl + '/api/Select/GetReportEditSelect?type=' + type + '&pageSize=' + pageSize + '&startIndex=' + startIndex + '&pageIndex=' + pageIndex + '&starttime=' + starttime + '&endtime=' + endtime + '&name=' + name;
	console.log(url);
	request(url, function (error, response, body) {
		//console.log(response);
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
});


///报告列表 暂时多有已出具的报告
app.get('/reportlist', function (req, res) {
	console.log("报告列表");
	var type = req.query.type;
	res.render('other/reportlist', {
		type: type
	});
})




//获取报告列表
app.get('/getreportlist', function (req, res) {
	console.log("获取报告列表");
	var pageSize = req.query.pageSize;
	var startIndex = req.query.startIndex;
	var pageIndex = req.query.pageIndex;
	var starttime = req.query.starttime;
	var endtime = req.query.endtime;
	var name = urlencode(req.query.name);
	var type = req.query.type;//0)用户 1）所长
	//反序列話json
	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
	var url = req.cookies.taskurl + '/api/Select/GetReportList?pageSize=' + pageSize + '&startIndex=' + startIndex + '&pageIndex=' + pageIndex + '&starttime=' + starttime + '&endtime=' + endtime + '&type=' + type + '&key=' + name;
	var option = {
		url: url,
		headers: {
			token: cookie.token,
		}
	}
	console.log(url);
	request(option, function (error, response, body) {
		//console.log(response);
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
});

//获取计划默认的签字人员
app.get('/loadsign_default', function (req, res) {
	console.log("获取计划默认的签字人员");
	var id = req.query.id;
	//反序列話json
	var url = global.basicsurl+'/api/DetectionCategory/GetTestPeopleFromType?testprojectid='+id;
	var option = {
		url: url,
	}
	console.log(url);
	request(option, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
});

//获取当前所下个节点名称
app.get('/getnextstate', function (req, res) {
	console.log("获取当前所下个节点名称");
	var state = req.query.state;//当前节点编号
	var cookie = JSON.parse(main.aesDecode(req.cookies.cookie_auth, "userlogin"));
	var depid = cookie.user_did;//当前部门
	//反序列話json
	var url = global.userurl+"/api/GetState/GetNextForUser?depid=" + depid + "&state=" + state;
	var option = {
		url: url,
	}
	console.log(url);
	request(option, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	})
});


module.exports = app;