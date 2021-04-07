/**
 * New node file
 */
//express_demo.js 文件
var express = require('express');
var app = express();
//Get 请求
app.get('/index', function (req, res) {
	   console.log("主页 GET 请求");
	   var products=[];
	   products.push({name:"ZTE U880",price:899.8});
	   products.push({name:"HuWei 荣耀8",price:1899.8});
	   products.push({name:"iPhone 7 Plus 128G",price:5899.8});
	   
	   //将product视图与指定的对象渲染后输出到客户端
	   res.render('demo', { title: '天狗商城', pdts:products});
	});

//POST 请求
app.post('/index', function (req, res) {
   console.log("主页 POST 请求");
   res.send('Hello POST');
});
 
//  /del_user 页面响应
app.get('/del_user', function (req, res) {
   console.log("/del_user 响应 DELETE 请求");
   res.send('删除页面');
});
 
//  /list_user 页面 GET 请求
app.get('/list_user', function (req, res) {
   console.log("/list_user GET 请求");
   res.send('用户列表页面');
});
 
// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function(req, res) {   
   console.log("/ab*cd GET 请求");
   res.send('正则匹配');
});
module.exports = app;
//app.use(express.bodyParser());