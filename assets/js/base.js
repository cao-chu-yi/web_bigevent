//  在调用$.get(),$.post(),$.ajax()等之前，会先执行$.alaxPrefilter()这个函数
// 在这个函数里面，可以得到我们需要的配置对象。可以在发起请求之前，先获取根路径，然后在进行拼接
$.ajaxPrefilter(function(options) {
    // 在发起请求之前获取根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // 统一为有权限的接口发起headers请求
    // 首先判断是否需要发起请求头  options.url.indexOf('/my/') !== -1判断是否包含/my
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token' || '')
        }
    }
    // 无论成功和失败都会调用complete
    options.complete = function(res) {
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 强制清空token
            localStorage.removeItem('token');
            // 强制跳转
            location.href = '/login.html'
        }
    }
})