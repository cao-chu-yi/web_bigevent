$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义查询参数，将来请求数据时，需要将参数传递给服务器
    var q = {
        pagenum: 1, //页码值,默认请求第一页
        pagesize: 2, //每页显示多少条数据，默认每页显示2条
        cate_id: '', //文章分类的Id
        state: '', //文章的状态
    }
    initList();
    initCate();
    // 获取数据
    function initList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取数据失败！")
                }
                // layer.msg("获取数据成功！")
                var htmlstr = template('tpl-list', res);
                $('tbody').html(htmlstr);
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    // 定义时间过滤器
    template.defaults.imports.dataFormat = function(data) {
            const dt = new Date(data);
            var y = dt.getFullYear(); //年
            var m = padZero(dt.getMonth() + 1); //月
            var d = padZero(dt.getDate()); //日
            var h = padZero(dt.getHours()); //时
            var mm = padZero(dt.getMinutes()); //分
            var s = padZero(dt.getSeconds()); //秒
            return y + '-' + m + '-' + d + '  ' + h + ':' + mm + ':' + s
        }
        // 补零函数
    function padZero(n) {
        return n > 10 ? n : '0' + n;
    }
    // 获取分类的值
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类列表失败！")
                }
                console.log(res);
                var htmlsrt = template('tpl_options', res);
                // console.log(htmlstr);
                $('#options').html(htmlsrt);
                //必须重新渲染，否则不会有数据显示
                form.render();
            }
        })
    }
    // 为表单绑定事件
    $('#option_list').on('submit', function(e) {
            e.preventDefault();
            // console.log(1);
            var cate_id = $('[name=cate_id]').val();
            var state = $('[name=state]').val();
            q.cate_id = cate_id;
            q.state = state;
            // 然后重新调用initList()函数
            initList()
        })
        // 定义渲染分页的方法
        // 1.点击会触发jump回调函数
        // 2.laypage.render()也会触发jump函数
        // first是布尔值，如果值为true就是第二种方式触发了jump回调
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'Pagebox',
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum,
            limits: [2, 3, 4, , 5, 6],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                q.pagenum = obj.curr; //得到当前点击的页码数
                q.pagesize = obj.limit;
                if (!first) {
                    initList();
                }
                // console.log(obj.limit); //得到每页显示的条数

            }
        });
    }
    // 删除按钮
    $('tbody').on('click', '.btn-delete', function() {
            var id = $(this).attr('data-id');
            console.log(id);
            var len = $('.btn-delete');
            // console.log(len.length);
            // console.log(1);
            layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除失败！')
                        }
                        layer.msg('删除成功！');
                        // 当删除完成后，要判断当前页面是否还存在数据，如果没有，则页码-1，然后调用initList()
                        if (len.length === 1) {
                            // 页码的最小值就是1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        }
                        initList();
                    }

                })

                layer.close(index);
            });
        })
        // 编辑功能
    $('body').on('click', '.btn_edit', function() {
        console.log(1);
        location.href = '/article/art_edit.html?id=' + $(this).attr('data-id');
        // console.log(url);
        // var url = '/article/art_edit.html?id=' + $(this).attr('data-id');
        // console.log(url);
    })
})