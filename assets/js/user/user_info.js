$(function() {
    var form = layui.form;
    var layer = layui.layer;
    // 给昵称设置验证
    form.verify({
        nickname: function(value) { //value：表单的值、item：表单的DOM对象
            if (value.length > 6) {
                return '昵称必须在0-6位字符之间';
            }
        }
    })
    getInfo();
    // 绑定重置事件
    $('#rebtn').on('click', function(e) {
        e.preventDefault();
        getInfo();
    });
    // 获得用户初始化信息
    function getInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户数据失败")
                }
                form.val('formUserinfo', res.data);
            }
        })
    }
    // 监听表单的提交事件
    $(".layui-form").on('submit', function(e) {
        e.preventDefault();
        // 发起post请求
        var datas = $(this).serialize();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: datas,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改失败')
                }
                layer.msg('修改成功')
                window.parent.getuserInform();
            }
        })
    })
})