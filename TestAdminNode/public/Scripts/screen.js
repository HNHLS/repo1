var screenH = window.screen.height;
var screenW = window.screen.width
if(screenH <= 768 && screenW <= 1366) {
	$.fn.MyTable = $.fn.dataTable;
	$.fn.dataTable = function(opts) {
		if(!opts.hasOwnProperty("pageLength")) {
			console.log("hasOwnProperty")
			opts.pageLength = 8;
		}
		if(opts.sScrollY == 430) {
			opts.sScrollY = 340;
		}
		if(opts.sScrollY == 550) {
			opts.sScrollY = 360;
		}
		if(opts.sScrollY == 480) {
			opts.sScrollY = 320;
		}
		if(opts.sScrollY == 470) {
			opts.sScrollY = 320;
		}
		if(opts.pageLength == 5) {
			opts.pageLength = 3;
		}
		if(opts.pageLength == 8) {
			opts.pageLength = 6;
		}
		return $(this).MyTable(opts);
	};
}
var i = 1
$("body,div").scroll(function() {
	i++
	document.body.style.scrollbarTrackColor = "#000"
});
//返回列表
function returnback(page,keyword,url,startDate,endDate){
	console.log(page,keyword,url)
	if(startDate){
		window.location.href=url+'?page='+page+'&keyword='+keyword+'&startDate='+startDate+'&endDate='+endDate
	}else{
		window.location.href=url+'?page='+page+'&keyword='+keyword
	}
	
}
function golist() {
    //window.history.go(-1);
    try {
        var frameIndex = parent.layer.getFrameIndex(window.name);
        console.log(frameIndex);
        if (frameIndex && frameIndex > 0) {
            parent.layer.close(frameIndex);
            return;
        }
    } catch (err) {

    }
	window.history.go(-1);
}
function dropdown(category, elemt, selected) {
	$.ajax({
		type: "get",
		url: "/modular_users/listOption?category=" + category,
		async: true,
		success: function(res) {
			console.log(res)
			if(res.status == "ok") {
				var data = res.message
				for(var i = 0; i < data.length; i++) {
					if(selected == data[i]) {
						$(elemt).append('<option value="' + data[i] + '" selected>' + data[i] + '</option>')
					} else {
						$(elemt).append('<option value="' + data[i] + '">' + data[i] + '</option>')
					}
				}
				layui.form.render("select");
			} else {
				layer.msg(res.message)
			}
		}
	});
}
//上传文件
function thelist(idelem,id, fileType, fileNames, str, fileUrl) {
	if(fileType == "docx" || fileType == "doc") {
		$(idelem).append('<div id="' + id + '" class="item">' +
			'<a class="icon" tyle="text-decoration:none;" class="ml-5" onClick="article_del(this,\'' + fileUrl + '\')" href="javascript:;" title="删除"></a>' +
			'<img class="img" src="/Images/wd_tb.png" />' +
			'<p class="info" title=' + fileNames + '>' + str + '</p>' +
			'<div class="state">已上传</div>' +
			'</div>');
	} else if(fileType == "xls" || fileType == "xlsx") {
		$(idelem).append('<div id="' + id + '" class="item">' +
			'<a class="icon" tyle="text-decoration:none;" class="ml-5" onClick="article_del(this,\'' + fileUrl + '\')" href="javascript:;" title="删除"></a>' +
			'<img class="img" src="/Images/ex_tb.png" />' +
			'<p class="info" title=' + fileNames + '>' + str + '</p>' +
			'<div class="state">已上传</div>' +
			'</div>');
	} else if(fileType == "png" || fileType == "jpg") {
		$(idelem).append('<div id="' + id + '" class="item">' +
			'<a class="icon" tyle="text-decoration:none;" class="ml-5" onClick="article_del(this,\'' + fileUrl + '\')" href="javascript:;" title="删除"></a>' +
			'<img class="img" src="/Images/tp_tb.png" />' +
			'<p class="info" title=' + fileNames + '>' + str + '</p>' +
			'<div class="state">已上传</div>' +
			'</div>');
	} else {
		$(idelem).append('<div id="' + id + '" class="item">' +
			'<a class="icon" tyle="text-decoration:none;" class="ml-5" onClick="article_del(this,\'' + fileUrl + '\')" href="javascript:;" title="删除"></a>' +
			'<img class="img" src="/Images/fj_tb.png" />' +
			'<p class="info" title=' + fileNames + '>' + str + '</p>' +
			'<div class="state">已上传</div>' +
			'</div>');
	}
}

function downfile(idelem,id, fileType, fileNames, str, fileUrl) {
	if(fileType == "docx" || fileType == "doc") {
		$(idelem).append('<div class="item">' +
			'<a class="icon" tyle="text-decoration:none;" class="ml-5" onClick="article_del(this,\'' + fileUrl + '\')" href="javascript:;" title="删除"></a>' +
			'<img class="img" src="/Images/wd_tb.png" />' +
			'<p class="info" title=' + fileNames + '>' + str + '</p>' +
			'<a class="state" href="/modular_basics/downLoad?url=' + fileUrl + '&FileName=' + fileNames + '"download="">下载</a>' +
			'</div>');
	} else if(fileType == "xls" || fileType == "xlsx") {
		$(idelem).append('<div class="item">' +
			'<a class="icon" tyle="text-decoration:none;" class="ml-5" onClick="article_del(this,\'' + fileUrl + '\')" href="javascript:;" title="删除"></a>' +
			'<img class="img" src="/Images/ex_tb.png" />' +
			'<p class="info" title=' + fileNames + '>' + str + '</p>' +
			'<a class="state" href="/modular_basics/downLoad?url=' + fileUrl + '&FileName=' + fileNames + '"download="">下载</a>' +
			'</div>');
	} else if(fileType == "png" || fileType == "jpg") {
		$(idelem).append('<div class="item">' +
			'<a class="icon" tyle="text-decoration:none;" class="ml-5" onClick="article_del(this,\'' + fileUrl + '\')" href="javascript:;" title="删除"></a>' +
			'<img class="img" src="/Images/tp_tb.png" />' +
			'<p class="info" title=' + fileNames + '>' + str + '</p>' +
			'<a class="state" href="/modular_basics/downLoad?url=' + fileUrl + '&FileName=' + fileNames + '" download="">下载</a>' +
			'</div>');
	} else {
		$(idelem).append('<div class="item">' +
			'<a class="icon" tyle="text-decoration:none;" class="ml-5" onClick="article_del(this,\'' + fileUrl + '\')" href="javascript:;" title="删除"></a>' +
			'<img class="img" src="/Images/fj_tb.png" />' +
			'<p class="info" title=' + fileNames + '>' + str + '</p>' +
			'<a class="state" href="/modular_basics/downLoad?url=' + fileUrl + '&FileName=' + fileNames + '"download="">下载</a>' +
			'</div>');
	}
}
function getCookie(cookie_name) {
    var allcookies = document.cookie;
	//索引长度，开始索引的位置
    var cookie_pos = allcookies.indexOf(cookie_name);

    // 如果找到了索引，就代表cookie存在,否则不存在
    if (cookie_pos != -1) {
        // 把cookie_pos放在值的开始，只要给值加1即可
        //计算取cookie值得开始索引，加的1为“=”
        cookie_pos = cookie_pos + cookie_name.length + 1; 
        //计算取cookie值得结束索引
        var cookie_end = allcookies.indexOf(";", cookie_pos);
        
        if (cookie_end == -1) {
            cookie_end = allcookies.length;

        }
        //得到想要的cookie的值
        var value = unescape(allcookies.substring(cookie_pos, cookie_end)); 
    }
    return value;
}
console.log(getCookie("sessionId"))
if(getCookie("sessionId")==undefined){
	window.location.href="/login"
}
