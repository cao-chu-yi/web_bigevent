$(function() {
    // 定义校验规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            newpwd: function(value) {
                var oldval = $("#oldpwd").val();
                if (value === oldval) {
                    return '两次密码不能相同';
                }
            },
            repwd: function(value) {
                var newval = $("#newpwd").val();
                if (value !== newval) {
                    return '两次密码不一致';
                }
            }
        })
        // 监听事件
    $('.layui-form').on('submit', function(e) {
            e.preventDefault();
            var datas = $(this).serialize();
            $.ajax({
                method: 'POST',
                url: '/my/updatepwd',
                data: datas,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('修改密码失败')
                    }
                    layer.msg('修改密码成功');
                    $('.layui-form')[0].reset();
                    window.parent.getuserInform();
                }
            })
        })
        // 重置表单事件
    $('#rebtn').on('click', function(e) {
        e.preventDefault();
        // 重置表单，将jQuery元素转换为document元素
        $('.layui-form')[0].reset();
    })
})