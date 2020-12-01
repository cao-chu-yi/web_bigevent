$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initAtr();

    function initAtr() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }
                console.log(res);
                // layer.msg('获取数据成功！')
                console.log(res.data);
                var htmlstr = template('tpl-article', res);
                $('tbody').html(htmlstr);
            }
        })
    }
    // 添加类别,利用layui弹出层
    var indexadd = null;
    $('.btn-add').on('click', function() {
            // console.log(12);
            indexadd = layer.open({
                type: 1,
                area: ['500px', '300px'],
                title: '添加文章分类',
                content: $("#tpl-add").html()
            });
        })
        // 给添加按钮绑定事件
        // 因为是动态创建在页面上，所以要使用代理的方式绑定事件
    $('body').on('submit', '#art_add', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg("添加数据失败！")
                    }
                    initAtr();
                    layer.msg("添加数据成功！");
                    layer.close(indexadd);

                }
            })

        })
        // 给编辑按钮绑定事件，因为是动态创建，所以采用代理绑定事件
    var inidexedit = null;
    $('tbody').on('click', '#btn-edit', function() {
            var id = $(this).attr('data-id');
            // console.log(id);
            indexedit = layer.open({
                type: 1,
                area: ['500px', '300px'],
                title: '修改文章分类',
                content: $("#tpl-edit").html()
            });
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('获取数据失败！')
                    }
                    // 快速填充表单数据
                    form.val('form-add', res.data);
                }
            })

        })
        // 监听表单事件
    $('body').on('submit', '#art_edit', function(e) {
            e.preventDefault();
            // console.log(1);
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("更新数据失败！")
                    }
                    layer.msg("更新数据成功！");
                    initAtr();
                    layer.close(indexedit);
                }
            })
        })
        // 删除按钮  代理
    $('tbody').on('click', '.btn-remove', function() {
        var id = $(this).attr('data-id');
        // console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除数据失败")
                    }
                    layer.msg("删除数据成功！");
                    initAtr();
                    layer.close(index);
                }
            })

        });

    })
})