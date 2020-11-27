//  在调用$.get(),$.post(),$.ajax()等之前，会先执行$.alaxPrefilter()这个函数
// 在这个函数里面，可以得到我们需要的配置对象。可以在发起请求之前，先获取根路径，然后在进行拼接
$.ajaxPrefilter(function(options) {
    // 在发起请求之前获取根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
})