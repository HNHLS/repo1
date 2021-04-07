//返回列表
function returnback() {
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


//详情页通用驳回
function Reject() {
    //输入驳回原因
    layer.prompt({
        title: '输入任何驳回原因，并确认',
        formType: 2
    }, function (pass, index) {
        layer.close(index);
        console.log(pass);
        $.ajax({
            type: "POST",
            url: "/modular_task/reject?tid=" + tid + "&reason=" + pass,
            data: $("#ajaxForm").serialize(),
            success: function (msg) {
                console.log(msg);
                if (msg.errcode == 0) {
                    layer.msg('已驳回!', {
                        icon: 1,
                        time: 4000
                    });
                    setTimeout(function () {
                        golist(backtype);
                    }, 1000)
                } else {
                    alert(msg.errmsg);
                }
            }
        });

    });
}


//详情页通用下发
//验证此任务是否办理过
function gonextselectuser(attch) {
    //询问
    layer.confirm('确认下发给默认人操作吗？', function (index) {
        $.ajax({
            type: 'get',
            url: '/other/checkishandle?tid=' + attch,
            dataType: 'json',
            success: function (msg) {
                console.log(msg);
                if (msg) {
                    //验证默认情况 已人还是项目
                    checkuse(attch);
                } else {
                    layer.msg('请先完成办理，才可以下发哦!', {
                        icon: 5,
                        time: 4000
                    });
                }
            },
            error: function (msg) {
                //var msgdata = JSON.parse(msg);
                console.log(msg.errmsg);
            },
        });
    });

}

//选择下发
//验证此任务是否办理过
function gonext(attch) {
    $.ajax({
        type: 'get',
        url: '/other/checkishandle?tid=' + attch,
        dataType: 'json',
        success: function (msg) {
            console.log(msg);
            if (msg) {
                showstate(backtype)
                getback(attch);
            } else {
                layer.msg('请先完成办理，才可以下发哦!', {
                    icon: 5,
                    time: 4000
                });
            }
        },
        error: function (msg) {
            //var msgdata = JSON.parse(msg);
            console.log(msg.errmsg);
        },
    });
}


//直接下发
//下发
function checkuse(attch) {
    $.ajax({
        type: 'Post',
        url: '/modular_task/checknext?tid=' + attch,
        dataType: 'json',
        success: function (msg) {
            console.log(msg);
            if (msg.errcode == 0) {
                if (msg.errmsg == "no-user") {
                    showstate(backtype)
                    getback(attch);
                } else {
                    //table.ajax.reload();
                    window.parent.redpoint();//重置小红点
                    layer.msg('已下发!', {
                        icon: 1,
                        time: 4000
                    });
                    setTimeout(() => {
                        golist(backtype);
                    }, 1000);
                }
            }
        },
        error: function (msg) {
            //var msgdata = JSON.parse(msg);
            console.log(msg.errmsg);
        },
    });

}
var isopen = true;
/*获取简化版带回用户*/
function getback(attch) {
    if (isopen) {
        isopen=false;
        var index = layer.open({
            type: 2,
            title: "查找用户",
            content: "/modular_users/gettaskuser?attch=" + attch,
            area: ['1000px', '80%'],
            end: function () {
                isopen=true;
            }
        });
    }

}
//主窗体处理带回参数
function getbackdata(attch, id, name, nextdid, nextdname) {
    layer.closeAll()
    console.log("attch" + attch + "id:" + id + "name:" + name + "nextdid" + nextdid + "nextdname" + nextdname);
    //异步处理
    $.ajax({
        type: 'POST',
        url: '/modular_task/assign?tid=' + attch + '&uid=' + id + "&name=" + name + "&nextdid=" + nextdid + "&nextdname=" + nextdname,
        dataType: 'json',
        success: function (msg) {
            console.log(msg);
            if (msg.errcode == 0) {
                console.log("已指派!");
                layer.msg('已指派!', {
                    icon: 1,
                    time: 4000
                });
                setTimeout(() => {
                    window.parent.redpoint();//重置小红点
                    golist(backtype);
                }, 1000);
                // table.ajax.reload();

            }
        },
        error: function (msg) {
            //var msgdata = JSON.parse(msg);
            console.log(msg.errmsg);
        },
    });

}

//预览
function view_show(url) {
    window.open("/other/fileview?url=" + url, "_blank", 'width=1300,height=700,menubar=no,toolbar=no,status=no,scrollbars=yes');
}


//继续下发给自己
function gonexttome(btn, attch) {
    showstate(backtype)
    //添加提示
    layer.confirm('确认下发给自己继续操作吗？', function (index) {
        $(btn).attr("onclick", "");
        //异步处理是否完成办理
        $.ajax({
            type: 'get',
            url: '/other/checkishandle?tid=' + attch,
            dataType: 'json',
            success: function (msg) {
                console.log(msg);
                if (msg) {
                    $.ajax({
                        type: 'POST',
                        url: '/modular_lateredit/ToMeAssign?tid=' + attch,
                        dataType: 'json',
                        success: function (msg) {
                            console.log(msg);
                            if (msg.errcode == 0) {
                                $(btn).text("已下发");
                                console.log("已下发给自己!");
                                //打开下一步操作界面
                                ToUrlNext(msg.errmsg)
                                setTimeout(() => {
                                    window.parent.redpoint();//重置小红点
                                }, 1000);
                            }
                        },
                        error: function (msg) {
                            //var msgdata = JSON.parse(msg);
                            console.log(msg.errmsg);
                        },
                    });
                } else {
                    $(btn).text("指派自己并处理");
                    $(btn).attr("onclick", "gonexttome(this,'" + attch + "')");
                    layer.msg('请先完成办理，才可以下发哦!', {
                        icon: 5,
                        time: 4000
                    });
                }
            },
            error: function (msg) {
                //var msgdata = JSON.parse(msg);
                console.log(msg.errmsg);
            },
        });
    });

}


//跳转页面
function ToUrlNext(state) {
    if (state == 1) {
        //委托单接收
        window.location.href = "/modular_task/checkentrust?tid=" + tid;
    }
    if (state == 2) {
        //检测接样
        window.location.href = "/modular_task/receive?tid=" + tid;
    } else if (state == 3) {
        //现场探勘
        window.location.href = "/modular_task/survey?tid=" + tid;
    } else if (state == 4) {
        //检测方案
        window.location.href = "/modular_task/programme?tid=" + tid;
    } else if (state == 5) {
        //方案评审
        window.location.href = "/modular_task/contract?tid=" + tid;
    } else if (state == 6) {
        //检测计划
        window.location.href = "/modular_task/plan?tid=" + tid;
    } else if (state == 7) {
        //检测开始
        window.location.href = "/modular_lateredit/teststart2?tid=" + tid;
    } else if (state == 8) {
        //报告编写
        window.location.href = "/modular_task/report?tid=" + tid;
    } else if (state == 9) {
        //项目成本单
        window.location.href = "/modular_task/accountsheet?tid=" + tid;
    } else if (state == 10) {
        //报告一审
        window.location.href = "/modular_task/reportreview?batch=1&tid=" + tid;
    } else if (state == 11) {
        //报告二审
        window.location.href = "/modular_task/reportreview?batch=2&tid=" + tid;
    } else if (state == 12) {
        //项目归档
        //window.location.href = "/modular_task/archive?tid=" + tid;
    }
    else if (state == 13) {
        //报告签发
        window.location.href = "/modular_task/reportuse?tid=" + tid;
    }
    else if (state == 14) {
        //报告打印 
    } else if (state == 15) {
        //报告发放
    } else {
        layer.msg('已指派!', {
            icon: 1,
            time: 4000
        });
        golist();
    }
    //  else if (type == 16) {
    // 	//退库申请
    // 	window.location.href = "/modular_task/cancelstocks?tid=" + tid;
    // }
}

//拉取指派的下个节点名称
function showstate(state) {
    $.get("/other/getnextstate?state=" + state, function (result) {
        //alert(result.processname);
        toastr.info('指派的下个节点为"' + result.processname + '",请注意调配节点', { timeOut: 9000 })
    });
}

function bindLayuiTableRowClick(obj) {
    // var $checkbox=$(obj.tr).find("td div.laytable-cell-checkbox div.layui-form-checkbox I");
    // if ($checkbox&&$checkbox.length > 0) {
    //     $checkbox.click();
    // }
}

function bindLayuiDefaultTableRowClick(table) {
    // table.on('row(tb)', function (obj) {
    //     bindLayuiTableRowClick(obj);
    // });
}












