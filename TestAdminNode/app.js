/*
 * 全局变量 后端请求地址同台服务器建议使用localhost 前端直接请求地址需使用ip：端口访问
 * */
//global.userurl = "http://192.168.1.171:8001"; 用户模块接口请求地址
global.base="http://server.damai-tech.com:8298"//http://192.168.1.161:9080  http://server.damai-tech.com:8298  http://192.168.1.161:8045/trinasolar_test
global.moban="http://server.damai-tech.com:8298"//http://192.168.1.161:9080  http://server.damai-tech.com:8298
global.Template="http://116.62.224.147:4006"//
global.Record="http://116.62.224.147:4006"//原始记录
//global.userurl1 = "http://192.168.1.171:8001"; 用户模块前端请求地址
//global.basicsurl = "http://192.168.1.102:81"; 基础模块接口请求地址
//global.basicsurl2 = "http://192.168.1.102:8040"; 基础模块接口请求地址2
global.equipment = "http://192.168.1.140:8325";//设备模块接口地址
//http://192.168.1.140:8325
//http://equipment.damai-tech.com:8298/equiomentinfo
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//路由路径
var demo = require('./routes/demo');
var login = require('./routes/login');
var home = require('./routes/home');
var HClogin = require('./routes/HClogin');
//基础模块
var modular_basics = require('./routes/modular_basics');
var modular_users = require('./routes/modular_users');
var modular_qualifications = require('./routes/modular_qualifications');
var modular_sample = require('./routes/modular_sample');
var modular_task = require('./routes/modular_task');
var modular_equipment = require('./routes/modular_equipment');
var modular_statistics = require('./routes/modular_statistics');
var modular_progress = require('./routes/modular_progress');
var other = require('./routes/other');//其他函数
//通用方法
var main = require('./routes/main');

var app = express();


// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/', routes.index);
app.get('/users', user.list);
//路由使用
app.use('/demo', demo);
app.use('/login', login);
app.use('/HClogin', HClogin);
app.use('/home', home);

//基础模块
app.use('/modular_basics', modular_basics);//基础模块
app.use('/modular_users', modular_users);//基础模块
app.use('/modular_qualifications', modular_qualifications);//资质管理
app.use('/modular_task', modular_task);//任务管理
app.use('/modular_sample', modular_sample);//样品管理
app.use('/modular_equipment', modular_equipment);//设备管理
app.use('/modular_statistics', modular_statistics);//设备管理
app.use('/modular_progress', modular_progress);//设备管理
app.use('/other', other);//其他
app.use('/main', main);

// 守护错误进程 全局捕获未捕获的Error
function errorHandler(err, req, res, next) {
  console.error(err.stack);
}
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
//全局监听错误
process.on('uncaughtException', function (err) {
  //打印出错误
  console.log("*********************************************出现错误*********************************************"+err);
  //打印出错误的调用栈方便调试
  console.log("*********************************************错误堆栈*********************************************"+err.stack);
});