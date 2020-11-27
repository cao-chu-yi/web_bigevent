$(function() {
    var layer = layui.layer;
    // 点击去注册账号的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $(".reg-box").show();
    });
    // 点击去登录的链接
    $('#link_login').on('click', function() {
            $('.login-box').show();
            $(".reg-box").hide();
        })
        // 从layui中获取form对象
        // 只要导入了layui，就有了layui对象
    var form = layui.form
        // 通过form.verify()函数自定义校验规则
    form.verify({
            //    自定义了一个叫做pwd校验规则
            // 数组的两个值分别代表：[正则匹配,匹配不符时的提示文字]
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 校验两次密码是否一致的规则
            repwd: function(value) {
                //通过形参拿到的是确认密码框中的内容
                // 还需要拿到密码框中的内容
                // 然后两次的内容进行判断，如果判断失败，则return一个提示消息即可
                var val = $("#pwd").val();
                if (val !== value) {
                    return '两次密码不一致';
                }
            }
        })
        // 注册提交事件
    $('.regform').on('submit', function(e) {
            e.preventDefault();
            console.log('12');
            var datas = $(this).serialize();
            console.log(datas);
            $.ajax({
                method: 'POST',
                url: '/api/reguser',
                data: datas,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('注册失败')
                    }
                    layer.msg('注册成功');
                    $('#link_login').click();
                }
            })
        })
        // 登录事件
    $('.loginform').on('submit', function(e) {
        e.preventDefault();
        // console.log('12');
        var datas = $(this).serialize();
        console.log(datas);
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: datas,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                console.log(res);
                layer.msg('登录成功');
                // 登录成功后，跳转到后台主页
                location.href = '/index.html';
                // 将登录成功后的token存储到localstroage中
                localStorage.setItem('token', res.token)

            }
        })

    })
})