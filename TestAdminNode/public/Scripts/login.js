function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if (isEdge) {
        return 'edge';//edge
    } else if (isIE11) {
        return 11; //IE11  
    } else {
        return -1;//不是ie浏览器
    }
}

//验证浏览器版本
if (IEVersion() < 9 && IEVersion() != -1) {
    window.location.href = "index.html";
}
//登录操作
$('#loginForm').submit(function (e) {
    var acc = $("input[name='account']").val();
    var pwd = $("input[name='password']").val();
    if (acc != null && pwd != "" && acc != "" && pwd != null) {
        e.preventDefault();
        $('input[type="submit"]').attr('disabled', true);
        $('input[type="submit"]').val('登录中....');
        $.ajax({
            type: "POST",
            url: "/login/login",
            data: $("#loginForm").serialize(),
            success: function (msg) {
                console.log(msg);
                if (msg.errcode == 0) {
                    //认证中..
                    //fullscreen();
                    var chosen=msg.chosen
                    console.log(chosen)
                    $('.login').addClass('test'); //倾斜特效
                    setTimeout(function () {
                        $('.login').addClass('testtwo'); //平移特效
                    }, 100);

                    setTimeout(function () {
                        $('.authent').show().animate({ right: -320 }, {
                            easing: 'easeOutQuint',
                            duration: 160,
                            queue: false
                        });
                        $('.authent').animate({ opacity: 1 }, {
                            duration: 160,
                            queue: false
                        }).addClass('visible');
                    }, 100);
                    //显示登录成功进入
                    setTimeout(function () {
                        $('.authent').hide();
                        $('.authent_').show().animate({ right: -320 }, {
                            easing: 'easeOutQuint',
                            duration: 260,
                            queue: false
                        });
                        $('.authent_').animate({ opacity: 1 }, {
                            duration: 260,
                            queue: false
                        }).addClass('visible');
                    }, 900);
                    if(chosen.length>1){
                    	setTimeout(() => {
	                        window.location.href = "/login/chosen";
	                    }, 1000);
                    }else{
                    	setTimeout(() => {
	                        window.location.href = "/home";
	                    }, 1000);
                    }
                } else {
                    $('input[type="submit"]').attr('disabled', false);
                    $('input[type="submit"]').val('登录');
                    alert(msg.errmsg);

                }
            }
        });
    } else {
        event.preventDefault();
        alert('请输入用户名和密码!');
    }

});



$(document).keypress(function (e) {
    // 回车键事件  
    if (e.which == 13) {
        $('input[type="submit"]').click();
    }
});


//	    进入全屏模式

var fullscreen = function () {
    elem = document.body;
    if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.requestFullScreen) {
        elem.requestFullscreen();
    } else {
        //浏览器不支持全屏API或已被禁用  
    }
}  