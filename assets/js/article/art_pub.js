$(function() {
    var layer = layui.layer;
    var form = layui.form;
    // 初始化富文本编辑器
    initEditor();
    // 调用渲染分类列表函数
    ininCate();
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    // 上传图片
    $('#img').on('click', function() {
            $('#file').click();
        })
        // 监听file区域的事件改变
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
        // 渲染分类列表
    function ininCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表项失败！')
                }
                var htmlstr = template('tpl-pub', res);
                console.log(htmlstr);
                $('#option').html(htmlstr);
                form.render();

            }
        })
    }
    // 定义一个变量，来表示状态
    var cata_state = '已发布';
    // 如果点击存为草稿就改为草稿
    $('#btn_sava').on('click', function(e) {
            // e.preventDefault();
            cata_state = '草稿'
        })
        // 监听表单事件
    $('#form_pub').on('submit', function(e) {
        e.preventDefault();
        // console.log(1);
        // 基于from表单，快速创建一个formData对象
        // formData是一个document对象，需要将jQuery对象转换为dom对象
        var fd = new FormData($(this)[0])
            // 将文章的状态存到fd中
        fd.append('state', cata_state);
        // 将裁剪后的图片转换为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将得到的文件对象，追加到fd中
                fd.append('cover_img', blob);
                pubArt(fd);
            })
    })

    function pubArt(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果是向服务器提交的是formdata格式的数据
            // 必须有以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功');
                // 发布文章成功后，跳转到文章列表页
                location.href = "/article/art_list.html"

            }
        })
    }

})