layui.define(['jquery'], function (exports) {
    var $ = layui.$;
    var obj={
        ENTER_KEY_CODE:13,
        bindEnterKey:function($obj, that, active){
            if ($obj && $obj.length > 0) {
                $obj.bind('keypress', function (e) {
                    if (that.validate(e, that.ENTER_KEY_CODE)) {
                        var temp = $(this).attr('keyenter');
                        if (active[temp] && typeof active[temp] === 'function') {
                            active[temp]();
                        }
                    }
                });
            }
        },
        bindDefaultSearchInput: function (that,active) {
            var $obj=$("#search[placeholder='关键词检索']");
            if ($obj && $obj.length > 0) {
                $obj.bind('keypress', function (e) {
                    if (that.validate(e, that.ENTER_KEY_CODE)){
                        if (active.reload && typeof active.reload === 'function') {
                            active.reload();
                        }
                    }
                });
            }
        },
        autoBind: function (active) {
            var that=this;
            var $obj = $("input[keyenter]");
            this.bindEnterKey($obj, that, active);
            this.bindDefaultSearchInput(that,active);
        },
        bind:function (elementId,keyCode,func) {
            var $obj = $(elementId);
            if ($obj) {
                $obj.bind('keypress', function (e) {
                    var tempKeyCode = null;
                    if (e.which) {
                        tempKeyCode = e.which;
                    } else if (e.keyCode) {
                        tempKeyCode = e.keyCode;
                    }
                    if (tempKeyCode === keyCode) {
                        func();
                        return false;
                    }
                    return true;
                });
            }
        },
        validate:function (e,keyCode) {
            var tempKeyCode = null;
            if (e.which) {
                tempKeyCode = e.which;
            } else if (e.keyCode) {
                tempKeyCode = e.keyCode;
            }
            return tempKeyCode === keyCode;
        }
    };
    exports('bindKey', obj);
});