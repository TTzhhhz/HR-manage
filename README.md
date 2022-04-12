该项目是基于vue-element-admin基础模版搭建的后台管理项目
   原模版的github地址：[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
   线上demo地址:https://panjiachen.github.io/vue-element-admin/#/login?redirect=%2Fdashboard
   
使用的接口和技术
   后台接口:使用的是传智播客所提供的接口。
   ui界面：基于vue和element-ui搭建的前端页面，使用到的技术包括vue脚手架、vue-router、vuex，axios(进行了二次封装)，scss。
   由于格式化工具配置问题有一些问题，所以我暂时关闭了eslint语法检查

   由于研一有专业课要上，并且导师那边要求写论文以及各种各样的事情，所以我这个项目耗时比较长，但是每天都会至少做一部分，毕竟一天不学前端我浑身难受啊

进度
   2022-4-1:写了登陆模块
            1、scss中要使用@作为src路径需要在前面加上～
            2、两个事件修饰符.native和.enter,enter是键盘事件修饰符，判断按键为enter,native是进行组件穿透，饿了么组件他是封装的，真正的事件是添加到内部真正的button按钮等
            3、用proxy代理服务器在vue配置文件中配置，解决了开发过程中的跨域问题
            4、process.env是环境变量，能够去到开发/上线环境文件中对应的值
            5、token字符串保存到cookie和vuex中
   
   2022-4-3:写了主页模块
            1、在axios请求拦截器中把token注入，这个传智播客的每个接口都需要请求头携带token
            2、免登录：在前置导航守卫中，判断如果有token，并且访问的是登录页，就直接跳转到主页
            3、token的被动判断，由后台判断并传来的状态码进行判断，写在响应拦截器
            4、头像获取异常的问题：vue自定义指令，写在src下面的directives文件夹下面，具体可看一下，main.js中批量导入（自定义指令我不太熟悉，而且导入配置时用的也比较新奇,复习的话可以看一下main中的配置），img标签如果有路径但是没有获取到图片就会触发onerror事件，es6新增的Object.keys(对象)方法，能够将对象中的键作为新的数组返回
            5、为什么data中的路径数据要求用require（）引入，这是为了防止在上线后由于路径改变变化引起的错误

   2002-4-6:写了路由和页面跳转
            1、这个模版是通过遍历路由来创建左侧导航栏的，里面用到了函数式组件（没有data，this等，只有props，没有用过）
            2、两个命令，touch创建文件、mkdir创建文件夹，主要是在创建不同的页面组件时候用到

   2022-4-7:开始写组织架构模块
            1、后台得到的组织架构数据是数组，使用element-ui组件的树插件
            2、写了一个递归函数把数组转化成树格式的数据
            3、匿名插槽、具名插槽、作用域插槽、饿了么组件的树插件和table中使用到的插槽https://blog.csdn.net/qq_38800316/article/details/122989563，忘记的话可以看一下这个博客
        4-8:1、封装删除组织架构部门的请求函数
            2、使用了this.$confirm方法提示用户是否确认删除
            3、使用自定义方法对删除后的数据重新获取，页面渲染，否则每次删除后都要刷新
        4-9:1、封装新增部门的请求
            2、封装新增弹窗编辑组件
       4-10:1、对新增部门的表单进行了验证，点击确定后，对后数据改变后，自定义事件重新渲染数据
            2、sync修饰符，是自定义事件的一个简易版本，当想要更新父组件中的数据时
               (1)、直接this.$emit("update:要改的数据名",要改成的值)
               (2)、父组件调用时,在父传子该该属性的时候加.sync后缀,:showDialog.sync="showDialog"
               这里用到sync修饰符是为了点击确定后关闭弹窗
       4-12:1、部门的编辑功能，遇到的问题在add-depts组件中定义获取部门详情的方法为什么不能传子组件的节点id
               (这是因为props是异步的，在父组件修改了值以后有可能还没传给子组件)
            2、父组件调用子组件方法，通过ref属性选中子组件
            3、一个bug，根据计算属性在add-dept弹窗中显示编辑部门还是新增部门的标题的时候点击编辑部门之后标题
               在点击新增还是会显示编辑，因为我们是根据formdata有无id属性判断的，而表单的清除方法只能清除表单具有的属性，在点击编辑之后fromData新增了id属性，关闭时清除不了id，所有在清除之前要手动清除一下formData，在用表单的方法取消验证规则
                     this.formData = {
                        name: "",
                        code: "",
                        manager: "",
                        introduce: "",
                     };
            4、今天还碰到git提交一直卡住没反应的问题
               解决：添加sendpack.sideband属性并置为false就解决了。
                     全局的：git config --global sendpack.sideband false
                     仓库的：git config --local sendpack.sideband false
                     可以通过git config --local -l 查看该属性


    
            



