
// 视图配置统一设置，避免视图定义都要书写 `manage: true`，才可以使用扩展视图功能
fish.View.configure({manage: true});

// 加载主视图，进行页面渲染初始化
/*require(['modules/main/views/IndexView12306'], function(IndexView) {
    new IndexView().render();
});*/
define(['hbs!../html/my-template.hbs'],function (template) {
    console.log(template({name: 'Lilei'}));
});
