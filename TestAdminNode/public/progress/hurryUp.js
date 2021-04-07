layui.define(['layer'],function (exports) {
    var layer=layui.layer;
    var $ = layui.$;
    var obj = {
        batchRequestHurryUp: function (table, ids, url,tableId) {
            if (ids.length === 0) {
                layer.msg('批量催单至少选择一项数据', function () {
                });
                return false;
            }
            var layerIndex = layer.open({
                type: 1,
                title: '催单',
                skin: 'layui-layer-rim', //加上边框
                area: ['420px', '240px'], //宽高
                content: '<textarea class="layui-textarea extra" placeholder="催单备注，选填" style="width:80%;margin:20px auto;" ></textarea>',
                btn: ['确定', '取消'],
                btn1: function (index) {
                    $.ajax({
                        type: 'POST',
                        url: url,
                        data: {
                            ids: ids,
                            extra: $(".extra").val()
                        },
                        success: function (data) {
                            layer.close(layerIndex);
                            layer.msg(data.message);
                            if (tableId) {
                                table.reload(tableId);
                            }else{
                                table.reload('tabReload');
                            }
                        }
                    });
                },
                btn2: function () {

                },
            });
        }
    };
    exports('hurryUp', obj);
});


