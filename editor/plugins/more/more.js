KindEditor.plugin('more', function(K) {
        var editor = this, name = 'more';
        // 点击图标时执行
        editor.clickToolbar(name, function() {
                editor.insertHtml('[more]');
        });
});

