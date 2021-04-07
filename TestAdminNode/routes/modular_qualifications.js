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
//人员列表页
app.get('/personnel', function (req, res) {
	console.log("人员列表页");
	res.render('modular_qualifications/personnel');
})
//人员列表
app.get('/personnellist', function (req, res) {
	console.log("人员列表");
	var page = req.query.page;
	var limit = req.query.limit;
	var keyword = req.query.keyword?urlencode(req.query.keyword):'';
	var role=req.query.role?urlencode(req.query.role):''
	var testCourseId=req.query.testCourseId?req.query.testCourseId:'';
	console.log(req.query,keyword);
	request({url:global.base + '/admin/staff/list?page=' + page + '&limit=' + limit + '&keyword=' + keyword+'&testCourseId='+testCourseId+'&role='+role,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body));
			res.json(JSON.parse(body));
		} else {
			console.log(error);
		}
	});
})
//人员导入页
app.get('/Import', function (req, res) {
	console.log("人员导入页");
	res.render('modular_qualifications/Import');
})
//上传导入页面
app.post('/Import', function (req, res, next) {
	console.log("上传导入页面");
	var fileurl = req.query.url
	console.log(fileurl);
	var options = {
		method: 'POST',
		url: global.base + '/admin/staff/importStaff',
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
//导出人员信息
app.post('/exportStaff', function (req, res, next) {
	console.log("导出人员信息");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/staff/exportStaff',
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
//获取人员详情
app.get('/personneledit', function (req, res) {
	console.log("获取人员详情");
	var rid = req.query.id;
	console.log(req.query);
	var json = {
		id: 0,
		name: "",
		roleArray:[],
		departmentArray:[],
		number:"",
		sex: "",
		age:"",
		birthDate:"",
		educationBg:"",
		major:"",
		professionalTitle:"",
		postCertificateNum:"",
		workingYears:"",
		joinDate:"",
		college:"",
		graduateDate:"",
		eSignFile:"",
		contractValidDate:"",
		workStatus:"",
		archiveNumber:"",
		attachmentArray:"[]"
	};
	if (rid > 0) {
		var url = global.base;
		request({url:url + '/admin/staff/getStaff?id=' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(JSON.parse(body).message);
				var jsonstr = JSON.parse(body).message;
				if(JSON.parse(body).status=="fail"){
					res.render('home/error', {msg:jsonstr});
				}else{
					json.id = jsonstr.id;
					json.name = jsonstr.name;
					json.number = jsonstr.number;
					json.sex = jsonstr.sex;
					json.age = jsonstr.age;
					json.educationBg = jsonstr.educationBg
					json.major = jsonstr.major
					json.professionalTitle = jsonstr.professionalTitle;
					json.postCertificateNum = jsonstr.postCertificateNum;
					
					json.contractValidDate= jsonstr.contractValidDate;
					json.workingYears = jsonstr.workingYears
					json.joinDate = jsonstr.joinDate
					json.college = jsonstr.college;
					json.graduateDate = jsonstr.graduateDate;
					
					json.eSignFile = jsonstr.eSignFile
					json.workStatus = jsonstr.workStatus
					json.archiveNumber = jsonstr.archiveNumber;
					json.attachmentArray = JSON.stringify(jsonstr.attachmentArray);
					json.roleArray = jsonstr.roleArray;
					json.departmentArray = jsonstr.departmentArray;
					json.birthDate=jsonstr.birthDate;
					res.render('modular_qualifications/personneledit', json);
				}
			} else {
				console.log(body);
			}
		});
	} else {
		console.log(json)
		res.render('modular_qualifications/personneledit', json);
		//添加页
	}
});
//上传人员的添加或编辑
app.post('/personneledit', function (req, res, next) {
	console.log("上传人员的添加或编辑");
	var rid = req.body.id;
	var name = req.body.name;
	var number = req.body.number
	var sex = req.body.sex
	var roleArray = req.body.roleArray.split(",")
	var departmentArray = req.body.departmentArray.split(",")
	var age = req.body.age;
	var educationBg = req.body.educationBg
	var major = req.body.major
	var professionalTitle = req.body.professionalTitle;
	var postCertificateNum = req.body.postCertificateNum
	var workingYears = req.body.workingYears
	var joinDate = req.body.joinDate;
	var college = req.body.college
	var graduateDate = req.body.graduateDate
	var birthDate= req.body.birthDate
	var contractValidDate=req.body.contractValidDate
	var archiveNumber = req.body.archiveNumber
	var workStatus = req.body.workStatus
	
	var eSignFile = req.query.eSignFile
	var attachmentArray = req.query.attachmentArray
	console.log(req.body)
	console.log(req.query)
	if(rid>0){
		//编辑人员
		var options = {
			method: 'POST',
			url: global.base + '/admin/staff/updateStaff',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'token':req.cookies.sessionId,
			},
			form: {
				id: rid,
				name: name,
				number: number,
				sex: sex,
				roleArray: JSON.stringify(roleArray),
				departmentArray: JSON.stringify(departmentArray),
				age: age,
				educationBg: educationBg,
				major: major,
				professionalTitle: professionalTitle,
				postCertificateNum: postCertificateNum,
				workingYears: workingYears,
				joinDate: joinDate,
				college: college,
				graduateDate: graduateDate,
				birthDate:birthDate,
				contractValidDate:contractValidDate,
				workStatus: workStatus,
				archiveNumber: archiveNumber,
				eSignFile: eSignFile,
				attachmentArray:attachmentArray
			}
		};	
	}else{
		//添加人员
		var options = {
			method: 'POST',
			url: global.base + '/admin/staff/add',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				'token':req.cookies.sessionId,
			},
			form: {
				name: name,
				number: number,
				sex: sex,
				roleArray: JSON.stringify(roleArray),
				departmentArray: JSON.stringify(departmentArray),
				age: age,
				educationBg: educationBg,
				major: major,
				professionalTitle: professionalTitle,
				postCertificateNum: postCertificateNum,
				workingYears: workingYears,
				joinDate: joinDate,
				college: college,
				graduateDate: graduateDate,
				birthDate:birthDate,
				contractValidDate:contractValidDate,
				workStatus: workStatus,
				archiveNumber: archiveNumber,
				eSignFile: eSignFile,
				attachmentArray:attachmentArray
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
//上传base64文件
app.post('/uploadBase64File', function (req, res, next) {
	console.log("上传base64文件");
	var file = req.body.file;
	console.log(req.body);
	var options = {
		method: 'POST',
		url: global.base + '/admin/upload/uploadBase64File',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {file:file}
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
//删除人员
app.post('/personneldel', function (req, res, next) {
	console.log("删除人员");
	var ids = req.query.ids;
	console.log(req.query);
	var options = {
		method: 'POST',
		url: global.base + '/admin/staff/deleteStaff',
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
//获取人员能力范围
app.get('/ability', function (req, res) {
	console.log("获取人员能力范围");
	var rid = req.query.id;
	console.log(req.query);
	var url = global.base;
	var json={
		id:rid
	}
	request({url:url + '/admin/staff/getStaffAbility?id=' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var jsonstr=JSON.parse(body).message
			if(JSON.parse(body).status=="fail"){
				res.render('home/error', {msg:jsonstr});
			}else{
				json.testItemList=encodeURIComponent(JSON.stringify(jsonstr)) 
			}
			console.log(jsonstr)
			res.render('modular_qualifications/ability', json);
		} else {
			console.log(body);
		}
	});
});
//设置人员能力范围
app.post('/setability', function (req, res, next) {
	console.log("设置人员能力范围");
	var rid = req.query.id;
	var ids = req.query.ids;
	console.log(req.query)
	//设置人员能力范围
	var options = {
		method: 'POST',
		url: global.base + '/admin/staff/setStaffAbility',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			id: rid,
			ids: ids,
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
//查询某个部门的某个角色人员信息
app.post('/DepartmentAndRole', function (req, res, next) {
	console.log("查询某个部门的某个角色人员信息");
//	console.log(req.cookies)
	var group=req.cookies.group
	var role=req.query.role
	var department=[]
	if(group!="undefined"&&group.length>0){
		for(var i=0;i<group.length;i++){
			department[i]=group[i].name
		}
	}
	console.log(department)
	var options = {
		method: 'POST',
		url: global.base + '/admin/staff/getStaffByDepartmentAndRole',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			'token':req.cookies.sessionId,
		},
		form: {
			department: JSON.stringify(department),
			role:role,
		}
	};	
	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body,"11");
			res.json(JSON.parse(body));
		} else {
			console.log(error,"11");
		}
	});
});
//部门管理
app.get('/department', function (req, res) {
	console.log("部门列表");
	res.render('modular_qualifications/department');
});
//部门的列表
app.get('/departmentlist', function (req, res) {
	var id = req.query.id;
	fly.get({url:global.base + '/admin/department/listStaff?id=' + id,headers: {"content-type": "application/json",'token':req.cookies.sessionId}})
		.then(function (response) {
			res.json(response.data);
		})
		.catch(function (error) {
			console.log(error);
		});
});
//全部部门的下拉
app.get('/getFullTree', function (req, res) {
	console.log("全部部门的下拉");
	fly.get({url:global.base + '/admin/department/getFullTree',headers: {"content-type": "application/json",'token':req.cookies.sessionId}})
		.then(function (response) {
			console.log(response.data)
			res.json(response.data);
		})
		.catch(function (error) {
			console.log(error);
		});
});
//部门的树形列表
app.get('/departmenttreelist', function (req, res) {
	console.log("部门的树形列表");
	fly.get({url:global.base + '/admin/department/getTree',headers: {"content-type": "application/json",'token':req.cookies.sessionId}})
		.then(function (response) {
			console.log(response.data)
			res.json(response.data);
		})
		.catch(function (error) {
			console.log(error);
		});
});
//部门管理中点击树形结构所做操作
app.get('/departmenttreeitem', function (req, res) {
	var rid = req.query.id;
	fly.get({url:global.base + '/admin/department/get?id=' + rid,headers: {"content-type": "application/json",'token':req.cookies.sessionId}})
		.then(function (response) {
			res.json(response.data);
		})
		.catch(function (error) {
			console.log(error);
		});
});
//修改部门信息
app.get('/modify', function (req, res) {
	console.log("修改部门信息");
	var rid = req.query.id;
	var name = urlencode(req.query.name);
	var email = req.query.email;
	console.log(req.query);
	var url = global.base;
	request({url:url + '/admin/department/modify?id=' + rid+'&email='+email+'&name='+name,headers: {"content-type": "application/json",'token':req.cookies.sessionId}}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(JSON.parse(body))
			res.json(JSON.parse(body));
		} else {
			console.log(body);
		}
	});
});
module.exports = app;