/*
*注意：当前脚本不可修改,但可以在页面中重写方法[damai]
2020-03-10：修改增加图片上传 修改【宋米粒】 标记1.1
*/

//1.1
var btncache;
//1.1
document.write("<script src='../Scripts/const.js'></script>");
//1.1
document.write("<script src='../layer/2.4/layer.js'></script>");
document.write("<script src='../layer/laydate/laydate.js'></script>");

function loadJS( url, callback ){
    var script = document.createElement('script'), fn = callback || function(){};
    script.type = 'text/javascript';
    //IE
    if(script.readyState){
        script.onreadystatechange = function(){
            if( script.readyState == 'loaded' || script.readyState == 'complete' ){
                script.onreadystatechange = null;
                fn();
            }
        };
    }else{
        //其他浏览器
        script.onload = function(){
            fn();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}
//项目保存参考的方法，按需修改
function TestSub() {
    //固定JSON格式
    var json = {
        "type": 1, //json样式 无特殊情况使用1即可
        "isqualified": true, //当前检测项是否合格
        "remark": "", //备注
        "info": {
            //项目基础部分json
            "list": [],
            "other": ""//基础信息部分拓展数据可无限增长 格式为  [name1:张三][name2:张四][name3:张五]
        },
        "list": [
            //遍历信息部分json
        ],
    }

    //检测结论
    json.isqualified = $("input[name='isqualified']").val();
    //备注
    json.remark = $("input[name='remark']").val();
    //基础信息json
    //数组
    var namearray = [];
    for (var i = 1; i <= 30; i++) {
        namearray.push("attch" + i);
    }

    var info = serializeJson($("#info").serializeArray());
    //处理相同name数值存放在一个数组内
    console.log(info);
    var str = "";
    for (x in info) {
        // console.log("x" + x)
        // console.log("v" + info[x])
        var name = x;
        var value = info[x];
        var lowname = name != null ? name.toLowerCase() : name;
        if (namearray.indexOf(lowname) > -1) {
            //存在元素
            var values = {
                name: "",
                value: ""
            };
            values.name = name;
            values.value = value;
            json.info.list.push(values);
        } else {
            if (name != null) {
                //拓展元素
                str += "[" + name + ":" + value + "]";
            }
        }

    }
    json.info.other = str;
    //列表部分json
    //数组
    var namearray1 = [];
    for (var i = 1; i <= 10; i++) {
        namearray1.push("parameter" + i);
        namearray1.push("result" + i);
    }

    $(".needcopy").each(function () {
        var itemjson = {
            "info": "",//特殊预留-拓展字段
            "item": [] //遍历项详情
        }
        var str1 = "";
        //获取input,其他控件需自行补充
        var copydata = serializeJson($(this).find("input").serializeArray());
        console.log(copydata);
        for (x in copydata) {
            console.log("x" + x)
            console.log("v" + copydata[x])
            var name = x;
            var value = copydata[x];
            var lowname = name != null ? name.toLowerCase() : name;
            if (namearray1.indexOf(lowname) > -1) {
                var values = {
                    name: "",
                    value: ""
                }
                values.name = name;
                values.value = value;
                itemjson.item.push(values);
            } else {
                //过滤没有名字的
                if (name != null) {
                    //拓展元素
                    str1 += "[" + name + ":" + value + "]";
                }

            }

        }
        itemjson.info = str1;
        json.list.push(itemjson);
    });

    //调试脚本
    console.log(json);
    console.log(JSON.stringify(json));
    //执行父级脚本【废弃】
    //parent.addjson(json);
    //执行父级脚本
    window.parent.postMessage({
        msg: "sava",
        json: json,
    }, "*");
}

//处理重复name
function serializeJson(obj) {
    var info = {}
    $(obj).each(function () {
        if (info[this.name]) {
            if ($.isArray(info[this.name])) {
                info[this.name].push(this.value);
            } else {
                info[this.name] = [info[this.name], this.value];
            }
        } else {
            info[this.name] = this.value;
        }
    })
    return info;
}


function parseData($tr) {
    var result = [];
    for (var i = 0; i < $tr.length; i++) {
        var $trEl = $tr[i];
        var $tds = $($trEl).find('td');
        var childArray = [];
        var allBlank = true;
        if ($tds && $tds.length > 0) {
            for (var j = 0; j < $tds.length; j++) {
                var items = $($tds[j]).text();
                if (items != '') {
                    allBlank = false;
                }
                childArray.push(items);
            }
        }
        if (allBlank) {
            break;
        }
        result[i] = childArray;
    }
    return result;
}

//添加
var addTime = 0;

function clearData(dom) {
    $(dom).find("input[type!='checkbox']").val();
    $(dom).find("select").val();
    //处理复选框
    $(dom).find("input[type=\"checkbox\"]").each(function (i, v) {
        $(v).prop("checked", false);
    })
    $(dom).find("input[type='hidden' ]").next("img").attr("src", "../Images/图片上传.png");
}

function add() {
    $("#copybody").append("<tbody class='needcopy'>" + $(".needcopy").eq(0).html() + "</tbody>");
    clearData($("#copybody").find('.needcopy:last'));
    foreachCellBindPasteMethod();
    normalNameCellBindPasteMethod();
}

//删除
function remove(btn) {
    //alert($(".needcopy").length);
    if ($(".needcopy").length == 1) {
        alert("仅此一项,请勿删除");
    } else {
        $(btn).parent().parent().parent().remove();
    }
}

//提交
function remove(btn) {
    //alert($(".needcopy").length);
    if ($(".needcopy").length == 1) {
        alert("仅此一项,请勿删除");
    } else {
        $(btn).parent().parent().parent().remove();
    }
}

function normalCellBindPasteMethod() {
    $("input[name^=attch]").unbind('paste').bind('paste', dealWithExcelPaste);
}

function foreachCellBindPasteMethod() {
    $("input[name^=Parameter]").unbind('paste').bind('paste', dealWithExcelPaste);
}


function normalNameCellBindPasteMethod() {
    $("input[name^=name]").unbind('paste').bind('paste', dealWithExcelPaste);
}


function dealWithNormalCell(parent, array, e, startIndex, namePrefix) {
    var newFlatArray = [];
    for (var i = 0; i < array.length; i++) {
        var temp = array[i];
        if (temp) {
            for (var secondIndex = 0; secondIndex < temp.length; secondIndex++) {
                if (temp[secondIndex] && '' != temp[secondIndex]) {
                    newFlatArray.push(temp[secondIndex]);
                }
            }
        }
    }
    var elements = $(parent).find("td input[name^=" + namePrefix + "]");

    var filtered = [];
    for (var elementIndex = 0; elementIndex < elements.length; elementIndex++) {
        var nameValue = $(elements[elementIndex]).attr("name");
        var nameIndex = nameValue.substr(namePrefix.length);
        try {
            var number = Number.parseInt(nameIndex);
            if (number >= parseInt(startIndex)) {
                filtered.push(elements[elementIndex]);
            }
        } catch (e) {

        }

    }
    for (var k = 0; k < newFlatArray.length; k++) {
        var el = filtered[k];
        if (el) {
            try {
                $(el).val(newFlatArray[k]);
            } catch (e) {

            }
        }
    }
}


function dealWithForeachCell(array, e, startIndex) {
    var selectedTbody;
    var iterIndex;
    for (var i = 0; i < array.length; i++) {
        if (!selectedTbody) {
            selectedTbody = $(e.currentTarget).parents('tbody.needcopy');
        } else {
            var tempNext = $(selectedTbody).next('tbody.needcopy');
            if (!tempNext || tempNext.length === 0) {
                add();
            }
            selectedTbody = $(selectedTbody).next('tbody.needcopy');
        }
        iterIndex = 0;
        var $inputs = $(selectedTbody).find("td input");
        for (var j = 0; j < $inputs.length; j++) {
            var $tempInput = $($inputs[j]);
            var tempName = $tempInput.attr("name");
            var index = tempName.substr("Parameter".length);
            if (parseInt(index) >= parseInt(startIndex)) {
                if (array[i][iterIndex]) {
                    $tempInput.val(array[i][iterIndex]);
                }
                iterIndex++;
            }
        }
    }
}

function dealWithExcelPaste(e) {
    var event = e.originalEvent;
    var htmlData = event.clipboardData.getData('text/html');
    var $data = $(new DOMParser().parseFromString(htmlData, 'text/html'));
    var $tr = $data.find("table tr");
    if ($tr && $tr.length > 0) {
        var array = parseData($tr);
        if (array && array.length !== 0) {
            var currentName = e.currentTarget.name;
            var startIndex;
            if (currentName.indexOf("Parameter") >= 0) {
                startIndex = currentName.substr("Parameter".length);
                dealWithForeachCell(array, e, startIndex);
                return event.preventDefault();
            } else if (currentName.indexOf("attch") >= 0) {
                startIndex = currentName.substr("attch".length);
                dealWithNormalCell($(e.currentTarget).parents('tbody'), array, e, startIndex, "attch");
                return event.preventDefault();
            } else if (currentName.indexOf("name") >= 0) {
                startIndex = currentName.substr("name".length);
                dealWithNormalCell($(e.currentTarget).parents('tbody'), array, e, startIndex, "name");
                return event.preventDefault();
            }
        }
    }
}


function addDocumentLoadedListener() {
    setInterval(function () {
        var tbody = document.body;
        var width = tbody.clientWidth;
        var height = tbody.clientHeight;
        window.parent.postMessage({msg: 'setHeight', height: height, width: width}, '*');
    }, 500);
}

addDocumentLoadedListener();


//初始化
function init() {
    //alert("123123");
    var type = getUrlParam("type");
    //alert(type);
    if (type != "" && type != null) {
        if (type == 1) {
            $("table").eq(0).find("img").attr("src", "../Images/image_hc.png");
            $("table").eq(0).find("img").css("height", "60px");
        }
    }
    //通知父级可以传递
    window.parent.postMessage({
        msg: "get",
    }, "*");
    normalCellBindPasteMethod();
    normalNameCellBindPasteMethod();
    foreachCellBindPasteMethod();
}

function refreshData(){ //让innerHTML获取的内容包含input和select(option)的最新值
    var allInputObject=document.body.getElementsByTagName("input");
    for (let i = 0; i < allInputObject.length; i++) {
        if(allInputObject[i].type==="checkbox")  {
            if (allInputObject[i].checked ) {
                allInputObject[i].setAttribute("checked", "checked");
            }
            else{
                allInputObject[i].removeAttribute("checked");
            }
        } else if(allInputObject[i].type==="radio")  {
            if (allInputObject[i].checked ) {
                allInputObject[i].setAttribute("checked","checked");
            } else{
                allInputObject[i].removeAttribute("checked");
            }
        }else {
            $(allInputObject[i]).attr("value",$(allInputObject[i]).val());
        }
    }
    for (let i = 0; i < document.getElementsByTagName("select").length; i++) {
        var sl=document.getElementsByTagName("select")[i];
        for (let j = 0; j < sl.options.length; j++) {
            if (sl.options[j].selected){
                sl.options[j].setAttribute("selected","selected");}
            else {
                sl.options[j] = new Option(sl.options[j].text, sl.options[j].value);
            }
        }
    }
}


//获取父窗体中已采集的数据
//var strval = $(window.parent.document).find("input[name='json']").val();
//监听父级模块返回值
window.addEventListener('message', function (event) {
    console.log(event);
    if (event.data.msg === 'edit') {
        if (event.data.json != null) {
            var strval = event.data.json;
            console.log(strval);
            //编辑操作
            var json = JSON.parse(strval);
            //项目基础信息部分
            var type = json.type;
            /*
            逻辑处理
            ...
            */

            $("input[name='isqualified']").val(json.isqualified);
            $("input[name='remark']").val(json.remark);

            //基础信息部分-list
            if (json.info){
                if (json.info.list) {
                    $.each(json.info.list, function (i, v) {
                        inputset(v.name, v.value);
                    });
                }
                if (json.info.other) {
                    //基础信息部分-other
                    var array = json.info.other.split(']');
                    $.each(array, function (i, v) {
                        //console.log(v);
                        //删除]
                        v = v.replace("[", "");
                        var varry = v.split(':');
                        inputset(varry[0], varry[1]);
                    });
                }
            }


            //处理项目部分
            $.each(json.list, function (index, value) {
                if (index > 0) {
                    //复制一行
                    if ($('.needcopy').length - 1 < index) {
                        add();
                    }
                }

                //单行信息列表
                $.each(value.item, function (i, v) {
                    //当前行赋值
                    var dom = $(".needcopy").eq(index);
                    dominputset(dom, v.name, v.value);
                });

                //无限拓展位置
                //var itemarray = value.info.split(']');
                wxtz(value.info, index);
                //$.each(itemarray, function (i, v) {
                //    console.log("无限拓展" + v);
                //    //删除]
                //    v = v.replace("[", "");
                //    //找到第一个位置
                //    var a = v.indexOf(":");

                //    var b = v.substring(0, a);
                //    var c = v.substring((a + 1), v.length);
                //    //当前行赋值
                //    var dom = $(".needcopy").eq(index);
                //    dominputset(dom, b, c);
                //});
            });
        }
        if (event.data.type==='disabled'){
            loadJS("http://localhost:8000/CLodopFuncs.js");
            loadJS("../Scripts/LodopFuncs.js");
            $("body").append('    <object  id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=0 height=0>\n' +
                '        <embed id="LODOP_EM" type="application/x-print-lodop" width=0 height=0></embed>\n' +
                '    </object>');
            $("input").attr("disabled",true);
            $("select").attr("disabled",true);
            var $img = $("img");
            $img.attr("disabled",true);
            $img.attr("onclick", null);
            $(".subbutton").css("display","none");
            $("#addlist button.addbtn").css("display","none");
            $("img[src='../Images/删除.png']").css("display","none");
            $("tr th:contains('删除')").css("display","none");
            $("tr th:contains('样品编号')").css("width","18%");
        }
    } else if (event.data.msg === 'uploadimgages') {
        //1.1

        //关闭页面
        layer.closeAll();
        //解析返回值
        if (event.data.json != null) {
            var strval = event.data.json;
            //序列化
            console.log(strval);
            var json = JSON.parse(strval);
            //alert(json.url);
            console.log(btncache);
            //图片展示
            $(btncache).attr("src", json.url);
            //隐藏域赋值
            $(btncache).siblings("input").val(json.url);
            //改变尺寸
            $(btncache).css("width", "100%");
            $(btncache).css("height", "100%");
        }
    }else if(event.data.msg === 'printPage') {
        // window.print();
        refreshData();
        var strHTML=$("html").html();
        var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
        LODOP.PRINT_INIT("打印原始记录");
        LODOP.SET_PRINT_PAGESIZE(2,0,0,'A4');
        LODOP.SET_PRINT_STYLE("ItemType",1);
        LODOP.ADD_PRINT_HTM('95%', "5%","20%",30,'<style>td{font-size: 16px;font-weight: bold}</style><table><tr><td>委托单号：'+event.data.delegateNum+'</td></tr></table>');
        LODOP.SET_PRINT_STYLE("ItemType",1);
        LODOP.SET_PRINT_STYLE("Alignment",2);
        LODOP.SET_PRINT_STYLE("HOrient",2);
        LODOP.ADD_PRINT_HTM('95%', "40%","40%",30,'<style>td{font-size: 16px;font-weight: bold}</style><table><tr><td>测试人：'+event.data.testMan+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td><td>复核人：'+event.data.verifyMan+'</td></tr></table>');
        LODOP.SET_PRINT_STYLE("ItemType",1);
        LODOP.SET_PRINT_STYLE("Alignment",3);
        LODOP.SET_PRINT_STYLE("HOrient",1);
        LODOP.ADD_PRINT_HTM('95%', "85%","15%",30,"<style>span{font-size: 16px;font-weight: bold}</style><td><font format='Num'><span tdata='pageCount'>共##页</span>&nbsp;<span tdata='pageNO'>第##页</span></font></td>");
        LODOP.SET_PRINT_STYLE("ItemType",0);
        LODOP.SET_PRINT_STYLE("FontSize",14);
        LODOP.ADD_PRINT_HTM(30, 5, "95%", "90%", strHTML);
        LODOP.PREVIEW();
    }


});



//无限拓展序列化
function wxtz(info, index) {
    var itemarray = info.split(']');
    $.each(itemarray, function (i, v) {
        if (v != null && v != "") {
            console.log("无限拓展" + v);
            //删除]
            v = v.replace("[", "");
            //找到第一个位置
            var a = v.indexOf(":");

            var b = v.substring(0, a);
            var c = v.substring((a + 1), v.length);
            //当前行赋值
            var dom = $(".needcopy").eq(index);
            dominputset(dom, b, c);
        }
    });
}

//赋值方法
function inputset(name, val) {
    console.log(name);
    console.log(val);
    $("input[name='" + name + "' ][type!='checkbox' ]").val(val);
    $("select[name='" + name + "' ]").val(val);
    //处理复选框
    $("input[type=\"checkbox\"][name='" + name + "']").each(function (i, v) {
        var array = undefined;
        if (Array.isArray(val)) {
            array = val;
        } else {
            array = val.split(',');
        }
        $.each(array, function (index, value) {
            if ($(v).val() == value) {
                $(v).prop("checked", true);
            }
        });

    })
    //处理展示图片
    $("input[name='" + name + "' ][type='hidden' ]").next("img").attr("src", val == "" ? "../Images/图片上传.png" : val);
}

//赋值方法-固定容器下
function dominputset(dom, name, val) {
    console.log(name);
    console.log(val);
    $(dom).find(("input[name='" + name + "' ][type!='checkbox' ]")).val(val);
    $(dom).find("select[name='" + name + "' ]").val(val);
    //处理复选框
    $(dom).find(("input[type=\"checkbox\"][name='" + name + "']")).each(function (i, v) {
        var array = val.split(',');
        $.each(array, function (index, value) {
            if ($(v).val() == value) {
                $(v).prop("checked", true);
            }
        });

    })
    //处理展示图片
    $(dom).find("input[name='" + name + "' ][type='hidden' ]").next("img").attr("src", val == "" ? "../Images/图片上传.png" : val);
}

//1.1
//处理全局上传方法
function addimg(btn) {
    btncache = btn;
    var type = decodeURIComponent(getUrlParam("type"));//0)天合 1）合创  
    if (type == null || type == "null") {
        alert("天合还是合创未知");
    } else {
        layer.open({
            type: 2,
            title: '上传图片',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            area: ['400px', '300px'],
            skin: 'layui-layer-rim', //加上边框
            content: posturl + '/UploadImages/Index?type=' + type,
        });
    }
}

//1.1
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}