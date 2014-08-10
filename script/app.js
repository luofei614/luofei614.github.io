var blog=angular.module('blog',['ngRoute','ngResource','ngSanitize','checklist-model','angularMoment']);
//###########站点配置
blog.constant('blogConfig',{
    "site_name":"罗飞的技术分享博客",
    "pagesize":10,//每页显示文章数
    "duoshuo_domain":"luofeico",//多说评论，你在多说上申请的二级域名
    "categories":["PHP","ThinkPHP","服务器","数据库","前端","HTML5","CSS","javascript","jQuery","bootstrap","angularjs","phonegap","go","python","工具","编辑器"],
    //数据存储到AVOS中
    //AVOS相关配置,请到https://cn.avoscloud.com/,创建应用
    "AVOS_ID":"l33c40ot1nhdgzkc5ljh2dzn2i8z4jaxlr40zyhmqbxjc1lp",
    "AVOS_KEY":"fzho7uxsmpqwsvvopblxyd3ma6d25u999ena17hyuid7865y",
    //编辑器图片上传到sinastroage中。
    //sinastorage相关配置， 请到http://open.sinastorage.com/ 创建应用
    "sinastorage_bucket":"blogimg",
    "sinastorage_ak":"qzig55nG0OMQg0mkmrDM",
    "sinastorage_sk":"851480070f8b80891e19d1dffd824186c0161b0c",
    "header_pics":[
        {name:"图片1",url:"/image/header_pic/1.png"},
        {name:"图片2",url:"/image/header_pic/2.png"},
        {name:"图片3",url:"/image/header_pic/3.png"},
        {name:"图片4",url:"/image/header_pic/4.png"}
    ]
});
blog.constant('angularMomentConfig', {
        timezone: 'Atlantic/Azores' 
});
//##########服务
blog.factory('article',function($resource){
   return $resource('https://cn.avoscloud.com/1/classes/article/:objectId',{objectId:'@objectId'},{
            "delete":{
                method:"DELETE"
            },
            "update":{
                method:"PUT"
            }
       });
});


blog.factory('userlogin',function($resource){
   return $resource('https://cn.avoscloud.com/1/login');
})

blog.factory('blogInterceptor',function($q){
    return function(promise)
    {
       return promise.then(function(response){
            if(typeof(response.data)!='object')
            {
                return response; 
            }
            if(response.data.code)
            {
                //调用接口错误
                alert(response.data.error);
                return $q.reject(); 
            }
            if(response.data.results)
            {
                //AVOS结果的特殊处理,让其支持resource的query方法
                response.data=response.data.results;
            } 
            return response;
        },function(response){
            if(typeof(response.data)!='object')
            {
                return response; 
            }
            if(response.data.code)
            {
                //调用接口错误
                alert(response.data.error);
                return $q.reject(); 
            }
        });
    }
});
//对bootstrap的弹窗口的封装
blog.factory('blogModal',function($rootScope,$http,$templateCache,$compile,$controller){
    if($('#blog-modal').size()==0)
    {
        $('<div class="modal fade" id="blog-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"></div></div></div>').appendTo('body');
    }
    return  function(templateUrl,controller,scope)
    {
       scope=scope || $rootScope.$new(); 
       $http.get(templateUrl,{cache:$templateCache}).success(function(data){
            var modal_content=$('#blog-modal').find('.modal-content'); 
            modal_content.html(data);
            var link=$compile(modal_content);
            if(controller)
            {
                var ctrl=$controller(controller,{$scope:scope});
                modal_content.data('$ngControllerController',ctrl);
            }
            link(scope);
            $('#blog-modal').modal('show');
       }).error(function(){
          alert('请求模板地址：'+templateUrl+'失败');
       });
    }; 
});

//##########过滤
blog.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);

//文章正文分隔显示
blog.filter('more',function(){
    return function(content)
    {
        if(typeof(content)!='string')
        {
            return content;
        }
        return content.split('[more]')[0]; 
    }
});
//文章全部显示
blog.filter('all',function(){
    return function(content)
    {
        if(typeof(content)!='string')
        {
            return content;
        }
        return content.replace('[more]',''); 
    }
});


//##########指令
blog.directive('blogEditor',function($timeout,blogConfig){
    return {
        restrict:"EA",
        require:"?ngModel",
        link:function(scope,element,attrs,ngModel){
            	KindEditor.basePath = '/editor/';
                var inited=false;
                //使用$timeout，保证模板变量被渲染后才执行编辑器初始化， 防止编辑器中没有数据。
                $timeout(function(){
                    KindEditor.create(element,{
                        minWidth :560,
                        allowPreviewEmoticons : false,
                        allowImageUpload : false,
                        sinastorage_bucket:blogConfig.sinastorage_bucket,
                        sinastorage_ak:blogConfig.sinastorage_ak,
                        sinastorage_sk:blogConfig.sinastorage_sk,
                        afterChange:function(){
                           KindEditor.sync(element); 
                           if(ngModel)
                           {
                               // ngModel.$setViewValue(element.val());
                               if(inited)
                               {
                                    //第一次加载不执行change ，否则 formname.fieldname.$dirty 判断会有误。 
                                    element.trigger('change');
                               }
                           }
                           inited=true;
                        },
                        items : [
                            'source','|','fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                            'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                            'insertunorderedlist', '|', 'emoticons', 'sinaupload', 'link','more','fullscreen'] 
                    });
                },0);
        }
    };
});
//##########控制器
blog.config(function($routeProvider,$locationProvider,$httpProvider,blogConfig){
    $httpProvider.defaults.headers.common={
        "X-AVOSCloud-Application-Id": blogConfig.AVOS_ID,
        "X-AVOSCloud-Application-Key": blogConfig.AVOS_KEY,
        "Content-Type":"application/json"
    }
    if(sessionStorage.getItem('session_token'))
    {
        $httpProvider.defaults.headers.common['X-AVOSCloud-Session-Token']=sessionStorage.getItem('session_token'); 
    }
    $httpProvider.defaults.transformRequest=function(request){
        if(typeof(request)!='object')
        {
            return request; 
        }
        //AVOS的特殊处理， 在更新数据时，不能传递createAt和updateAt
        for(k in request)
        {
            //删除$resource 对象自带的key
            if(k.charAt(0)=='$')
                delete request[k];
        }
        delete request.createdAt;
        delete request.updatedAt;
        return JSON.stringify(request);
    };

    $httpProvider.responseInterceptors.push('blogInterceptor');
    $locationProvider.html5Mode(true).hashPrefix('!');
    $routeProvider.when('/',{
        templateUrl:"/view/home.tpl.html",
        controller:"home"
    }).when('/about',{
        templateUrl:"/view/about.tpl.html",
        controller:"about"
    }).when('/works',{
        templateUrl:"/view/works.tpl.html",
        controller:"works"
    }).when('/video',{
        templateUrl:"/view/video.tpl.html",
        controller:"video"
    }).when('/guestbook',{
        templateUrl:"/view/guestbook.tpl.html",
        controller:"guestbook"
    }).when('/article/:objectId',{
        templateUrl:'/view/article.tpl.html',
        controller:"article"
    }).otherwise({
        redirectTo:"/"
    })
});

blog.run(function($rootScope,blogConfig,blogModal){
    $rootScope.categories=blogConfig.categories;
    $rootScope.site_name=blogConfig.site_name;
    $rootScope.login=function(){
        blogModal('/view/login.tpl.html','modal.login');
    }
    if(sessionStorage.getItem('username'))
    {
        $rootScope.username=sessionStorage.getItem('username');
    }
    $rootScope.edit=function(article){
        var scope=$rootScope.$new();
        scope.article=article || {};
        scope.header_pics=blogConfig.header_pics;
        blogModal('/view/edit.tpl.html','modal.edit',scope); 
    }
});

blog.controller('home',function($scope,$rootScope,article,$location,blogConfig,$http){
    $rootScope.nav="home";
    $rootScope.top_title="首页";
    //分页逻辑
    var limit=blogConfig.pagesize;//每页显示调试
    var search=$location.search();
    var p=parseInt(search.p) || 1; 
    var skip=(p-1)*limit;
    //标识上一页和下一页按钮是否可用
    $scope.disable_page_prev=true;
    $scope.disable_page_next=true;
    var where={};
    if(search.cate)
    {
        $rootScope.cate=search.cate; 
        where.cate={'$all':[search.cate]}
    }
    if(search.kw)
    {
        $rootScope.kw=search.kw; 
        where.title={"$regex":"\\Q"+search.kw+"\\E"};
    }
    article.query({skip:skip,limit:limit,order:"-is_top,-createdAt",where:where},function(data){
        $scope.articles=data;
        if(p>1)
        {
            $scope.disable_page_prev=false;
        }
        if(data.length==limit)
        {
            $scope.disable_page_next=false; 
        }
    });

    $scope.del=function(index){
        if(!confirm('是否确认删除？'))
        {
            return ; 
        }
        $scope.articles[index].$delete(function(){
            $scope.articles.splice(index,1); 
        });
    }

    $scope.page_prev=function()
    {
        search.p=p-1;
        //上一页
        $location.search(search);
    }

    $scope.page_next=function()
    {
        if($scope.disable_page_next)
            return ;
        //下一页
        search.p=p+1;
        $location.search(search);
    }

});

blog.controller('article',function($scope,$rootScope,article,$routeParams,blogConfig,$location){
   article.get({objectId:$routeParams.objectId},function(data){
        $scope.article=data; 
        $rootScope.top_title=data.title;
        $scope.script=['<div class="ds-thread" data-thread-key="'+data.objectId+'" data-title="'+data.title+'" data-url="'+$location.absUrl()+'"></div>',
'<script type="text/javascript">',
'var duoshuoQuery = {short_name:"'+blogConfig.duoshuo_domain+'"};',
	'(function() {',
		"var ds = document.createElement('script');",
		"ds.type = 'text/javascript';ds.async = true;",
		"ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';",
		"ds.charset = 'UTF-8';",
		"(document.getElementsByTagName('head')[0] ",
		 "|| document.getElementsByTagName('body')[0]).appendChild(ds);",
	"})()",
"</script>"].join('');

   }); 
});

//登录弹窗口的控制器
blog.controller('modal.login',function($scope,userlogin,$route,$http,$rootScope){
    $scope.login=function(){
        userlogin.get($scope.user,function(data){
           //添加token的header传递
           sessionStorage.setItem('session_token',data.sessionToken);
           $http.defaults.headers.common['X-AVOSCloud-Session-Token']=data.sessionToken;
           //用户名
           sessionStorage.setItem('username',data.username);
           $rootScope.username=data.username;
           $('#blog-modal').modal('hide');
           $route.reload();
        });
    }
});

//发布文章弹窗口
blog.controller('modal.edit',function($scope,article,$location,$route){
    $scope.save=function()
    {
        if($scope.article.objectId)
        {
            article.update($scope.article,function(){
                alert('修改成功'); 
                $('#blog-modal').modal('hide');
            }); 
        }
        else
        {
            article.save($scope.article,function(){
                alert('发布成功'); 
                $('#blog-modal').modal('hide');
                $location.path('/');
                $route.reload();
            }); 
        }
    }
});

blog.controller('works',function($scope,$rootScope){
    $rootScope.nav="works";
    $rootScope.top_title="开源作品";
});


blog.controller('video',function($scope,$rootScope){
    $rootScope.nav="video";
    $rootScope.top_title="视频教程";
});


blog.controller('about',function($scope,$rootScope){
    $rootScope.nav="about";
    $rootScope.top_title="关于我";
});


