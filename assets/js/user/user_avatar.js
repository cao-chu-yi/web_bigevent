$(function() {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
        // 绑定上传
    $("#upimg").click(function() {
            $("#file").click();
        })
        // 为文件选择框绑定change事件
    $("#file").on('change', function(e) {
            console.log(e);
            var filefirst = e.target.files;
            if (filefirst.length === null) {
                return layer.msg("请上传图片")
            }
            // 拿到用户的选择文件
            var file = e.target.files[0];
            //根据选择的文件创建一个对应的url地址
            var newImgURL = URL.createObjectURL(file);
            // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 上传图片到服务器
    $("#upbtn").on('click', function(res) {
        // 获取用户头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        console.log(dataURL);
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更换头像失败！")
                }
                layer.msg("更换头像成功！");
                window.parent.getuserInform();
            }
        })
    })

})