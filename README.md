这是一个没有后端代码的动态网站,
采用AngularJs+AVOS Cloud实现。只有前端代码,没有后端代码。前端页面托管在Github Page上。 大家可以用它来搭建一个免费的不用备案的博客，也把它当作学习AngularJs的同学当例子看。
演示网站:http://luofei.co
###运行原理
* AVOS 是一个后端及服务的BAAS云计算， 提供了很多后端服务，用户不用开发后端代码。本博客系统用了AVOS的数据存储接口，用户管理接口。所以用户登录、文章的添加修改等功能都没有开发后端代码。AVOS因为支持HTML5跨域ajax请求。 所以这些接口我们可以用angularjs直接调用。
* angularjs负责了前端的接口调用、页面路由、模板渲染。你所看见的网站路径，如http://luofei.co/about , 并不是后端实现的路径解析，而是在前端用angularjs的路由功能实现的。
* angularjs+AVOS的开发体验非常棒，个人认为纯前端+纯后端API的开发方式会是以后的趋势。

###如何将本博客系统搭建在AVOS和GitHub Page上

####1，GitHub Page的使用
GitHub page 是GitHub的免费静态文件托管服务,  它会为你分配一个二级域名，如 luofei614.github.io 。 你可以绑定自己的一级域名， 因为我已经绑定一级域名， 所以访问 luofei614.github.io会跳到到我的一级域名。  
Github Page 使用十分简单，可参考官方教程：https://pages.github.com/ ， 就是在github上建立一个名为：yourname.github.com 的项目， 然后把本博客系统的代码提交到刚建立的项目中， 第一次提交后大概等待10分钟左右， 然后可访问 yourname.github.com 。 以后提交代码就几乎会实时生效，只是第一次提交等待时间会长一些。 

####2，博客设置
在script/app.js 文件中 有一些设置需要你修改。 

    blog.constant('blogConfig',{
    //AVOS应用的ID和KEY
    "AVOS_ID":"l33c40ot1nhdgzkc5ljh2dzn2i8z4jaxlr40zyhmqbxjc1lp",
    "AVOS_KEY":"fzho7uxsmpqwsvvopblxyd3ma6d25u999ena17hyuid7865y",
    //网站名称
    "site_name":"罗飞的技术分享博客",
    //每页显示文章数
    "pagesize":10,
    //多说评论，你在多说上申请的二级域名
    "duoshuo_domain":"luofeico",
    //文章分类
    "categories":["PHP","ThinkPHP","服务器","数据库","前端","HTML5","CSS","javascript","jQuery","bootstrap","angularjs","phonegap","go","python","工具","编辑器"],
    //主题图片
    "header_pics":[
        {name:"图片1",url:"/image/header_pic/1.png"},
        {name:"图片2",url:"/image/header_pic/2.png"},
        {name:"图片3",url:"/image/header_pic/3.png"},
        {name:"图片4",url:"/image/header_pic/4.png"}
    ]
    });

你需要将AVOS_ID和AOVS_KEY更换为你在AVOS上建立的应用的ID和KEY。稍后讲如何获得这个ID和KEY。 另外文章的评论系统是用的多说多说评论，你需要去多说创建一个应用，并修改duoshou_domain配置项为你多说的二级域名名称。 多说官网：http://duoshuo.com/

####3，使用AVOS Cloud
请大家先到AVOS Cloud https://cn.avoscloud.com/ 上注册一个用户，并创建一个应用。
 
 

 - 获得应用KEY
进入应用， 在设置-->应用key ， 能获得ID和KEY。修改源码script/app.js文件中的相应配置.

![enter image description here][1]
![enter image description here][2]
 - 建立用户， 在数据-->_User 中手动添加一行数据，输入用户名和密码。 添加完数据后，为了安全，我们要设置_User对象的权限。

 ![enter image description here][3]
![enter image description here][4]

 设置_User对象的add_fields,create,delete,update的操作权限只能为刚才创建的用户。get和find的权限为public。
 - 发布文章
    进行完上面的设置后，现在访问网站，会提示

![enter image description here][5]

这是因为我们还没有创建文章的数据对象， 在网站的底部点击“管理员登陆”，然后输入之前你创建的用户名和密码，进行登陆。 登陆再在网站底部点击“发布文章”， 发布你的第一篇文章， 文章发布后同时会在AVOS创建一个名为article的数据对象。  为了安全，我们同样要设置这个数据对象的权限和_User数据对象的权限设置一样，add_fields,create,delete,update的操作权限只能为刚才创建的用户。get和find的权限为public。

####4，绑定一级域名。 
你可以再绑定自己的一级域名，  在CNAME文件中输入你的一级域名。 只能输入一个域名，如输入 yourdomin.com ,   然后 我们将域名yourdomain.com CNAME到yourname.github.io ， 你还可以做 www.yourdomain.com 的CNAME,  www.yourdomain.com 访问时会跳转到 yourdomin.com。

到现在，你已经搭建好了一个免费的不用备案的个人博客网站。


  [1]: http://bcs.duapp.com/luofeiblog/1.png
  [2]: http://bcs.duapp.com/luofeiblog/2.png
  [3]: http://bcs.duapp.com/luofeiblog/3.png
  [4]: http://bcs.duapp.com/luofeiblog/4.png
  [5]: http://bcs.duapp.com/luofeiblog/5.png
