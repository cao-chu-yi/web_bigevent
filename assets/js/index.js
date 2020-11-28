// 渲染用户头像
$(function() {
    var layer = layui.layer;
    getuserInform();
    // 给退出的绑定事件
    $('#t-login').on('click', function() {
        // console.log(12);
        // 提示用户是否退出
        layer.confirm('是否退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 确定退出，执行清空本地存储
            localStorage.removeItem('token');
            // 强制跳转到登录页面
            location.href = '/login.html';
            // 这是关闭询问框
            layer.close(index);
        });
    })

});
// 获取用户的基本信息
function getuserInform() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token' || '')
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('用户获取失败')
            }
            console.log(res.user_pic);
            renderavatar(res.data);
        }
    })
}

function renderavatar(user) {
    // 用户名称采取优先级
    var name = user.nickname || user.username;
    console.log(name);
    // 设置文本
    $('.welcome').html('欢迎&nbsp&nbsp' + name);
    console.log(user.user_pic);
    // 渲染用户头像
    if (user.user_pic !== null) {
        // 如果不为空，则渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 如果为空，则渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();

    }

}