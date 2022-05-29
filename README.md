我就当笔记写了。

介绍：该项目是基于vue-element-admin基础模版搭建的后台管理项目
   原模版的github地址：[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
   线上demo地址:https://panjiachen.github.io/vue-element-admin/#/login?redirect=%2Fdashboard
   
使用的接口和技术
   后台接口:使用的是传智播客所提供的接口。
   ui界面：基于vue和element-ui搭建的前端页面，使用到的技术包括vue脚手架、vue-router、vuex，axios(进行了二次封装)，scss。
   由于格式化工具配置问题有一些问题，所以我暂时关闭了eslint语法检查

   <!-- 由于研一有专业课要上，并且导师那边要求写论文以及各种各样的事情，所以这个项目耗时比较长，但是每天都会至少做一部分，毕竟一天不学前端我浑身难受啊 -->

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
            4、今天还碰到git提交一直卡住没反应的问题(我怀疑是我网络问题。打扰了)
               解决：添加sendpack.sideband属性并置为false就解决了。
                     全局的：git config --global sendpack.sideband false
                     仓库的：git config --local sendpack.sideband false
                     可以通过git config --local -l 查看
       4-14:1、在弹窗中点击确定时，对于编辑和新增进行区分操作
               bug：在编辑时点击确定，会显示编码存在，这是因为使用按照新增的规则来校验的，要新增校验
            2、在code和name的自定义校验规则中区分编辑和新增的规则
   组织架构模块结束

   2022-4-15:公司角色模块
       4-15:使用table表格组件、form表单组件，Alert警告组件，Tabs标签页搭建了设置页面的基本结构
            <!-- 10点多了，我顶不住了我太困了，最近事情太多了 -->
       4-16:封装获取角色的api接口并调用，渲染到表格，并根据点击的页码重新获取渲染。一个总犯的错误，封装axios
            请求总是忘记return
       4-18:1、完成了删除功能，删除时的id时根据作用域插槽获取的，还有删除后台数据后重新渲染数据我觉得应该要加
            await强制等待
            2、完成了编辑功能，点击编辑时要先加载数据，再出弹层，否则会出现一个空白瞬间
            3、饿了么组件中table组件中的作用域插槽可以获取当前表格的行
            <!-- 11点多了，剩一个新增的接口明天写吧，偷个懒 -->
       4-20:完成了新增功能,弹层组件中点击确定不触发close事件，但是改变控制弹层的变量为false会触发close事件
   设置模块结束

   2022-4-22:人员管理模块
       4-22:1、具名插槽，使用的时候slot=“名字” 或者v-slot:名字，但是这里要用template包起来
            2、组件的统一注册,在component下的index.vue
            3、员工列表的布局,一样的套路 卡片+表格+分页
            4、使用到了枚举对象，把员工的聘用方式转换table-column的formatter属性
            5、使用过滤器filter+作用域插槽格式化时间格式
            6、删除员工功能
       4-23:1、console.loh(arguments)能打印出所有的参数。
            2、通过this.$parent可以获得父组件实例，能够去直接调用方法等
            3、利用element-ui-admin提供的文件组件模版进行改造。xlsx包,制作一个公共的文件上传页面
            4、对拿到的excel数组数据进行二次处理，转为英文，在views文件夹下的import中进行处理
            遇到的一些问题：1、xlsx的版本问题，在引入文件上传组件之后，一直显示未发现xlsx，经过一番百度之后发现是版本不兼容，更改版本为0.16.0后解决
                         2、（1）数组map方法，在将中文的key转换为英文的key时使用到map，数组遍历方法
                            （2）map方法返回是一个新数组，不会改变原数组，不对空数组遍历
                            （3）三个参数，item（必选，当前元素的值）。index（可选，当前元素索引）。arr（可选，数组本身）
                             (4)通过对原数组的item元素进行处理，将处理后的元素组合成新数组，以return返回
       4-26:1、通过懒加载的方式和vue-element-ui-admin提供的导出文件方法完成导出功能
            2、map方法如果回掉函数只有一行代码，可以省略return
       4-28:1、调整了导出excel中的时间格式和雇佣形式
            2、使用导出excel的复杂表头功能
            3、通过路由的/:id传递当前行的id进行查询，使用的时候this,$route.param.id获取
        5-2:1、动态组件component的使用  通过is属性绑定不同的组件，is要以v-bind形式赋值，赋值为data中的属
               性
            2、请求用户具体信息和岗位信息的接口一直报500错误，排查了半天发现是接口的问题，官方的线上项目也这 
               样
      完成了教职工管理模块
      5-3/4:1、通过腾讯云服务器保存头像图片，我发现文件在上传成功之后触发on-change事件，新的fileList会传进
               来，其中包含了上传成功的文件，直接赋值data中的fileList就可以了，图片可以显示。但是！！！这里我看到fileList里面存的地址是本地的地址，也就是说并没有吧服务器返回的图片地址赋值
            2、数据更新和页面渲染是异步的，如果必须要等到下一次页面渲染之后再执行，比如获取重新渲染后才显示的
               元素，需要用this/Vue.$nextTick()方法
            3、使用qrcode包生成获取头像的二维码

   2022-5-8:权限管理部分
         5-11:1、通过RBAC的模式  用户-角色-权限的模式分配权限
             2、一个小问题，在子组件中用到了父组件传递的props值作为axios请求的参数，由于props赋值是异步的
               如果直接在子组件中使用props值发请求，可能此时的值还是最初的值（未完成props传递就先弹窗了，弹窗就会渲染界面，此时props没传进来，就会报错，解决办法就是直接通过父组件调用子组件的方法，这时候父组件中的id它是已经有了的，直接作为参数发请求，是肯定可以发的，但是又出现一个闪烁的问题，就是props赋值弹窗和axios都是异步的，可能弹窗之后才发请求获取新数据，下次渲染页面时就会出现闪烁的过程。所以要强制等待axios请求完之后，再弹窗渲染界面
               问题：但是但是，我还发现了一个问题，只有第一次渲染的时候没有闪烁了，如果点了别的节目再点一次又会从别的界面的那个选中的位置闪烁到新位置
               可能：我估计是因为点了关闭之后，里面数据没清空，再点别的
         5-13:1、完成了角色分配
         5-16:1、新增，编辑权限的弹层
              2、完成了权限的增删改查
              遇到一个小问题：添加访问权限的按钮变成了文字和符号，然后我发现是双引号的问题，双引号里面套了双引号，应该是内外不一样。我太傻逼了。
      5-18/19:1、分配权限的弹层
              2、完成了整个用户-角色-权限的数据层的分配（遇到一个bug，给角色分配权限的时候，取消某个权限再点开弹层，刚取消的那个权限还渲染了，但是增了某个权限再这样操作就不会。不都是原先的数据没有清除吗，为什么一个可以一个不可以，但是数据没有清除的话，不是点击按钮之后重新获取数据之后才弹层的吗，在弹层展示之前数据已经改了啊，为什么还会出现这种情况，但是清除了数据确实解决了问题，我估计是饿了么组件的问题，还有就是一般在确定的时候不清除数据，通过close事件清除的，dialog隐藏后回自动触发close事件，前面写过，所以再碰到类似情况的话，不管是表单或者数之类的，关闭以后都要清除数据。还有就是如果组件隐藏，会走到生命周期渲染的阶段吗，还是说显示之后才会进入到渲染阶段，后面去看一下生命周期）
         5-22:1、如何根据设置动态路由，在路由前置导航守卫中，如果是第一次获取数据，此时根据用户的数据得到权限
              点，并匹配对应的动态路由表，通过vue-router的addRoutes方法配置动态路由
         5-23:1、完成了权限管理模块，解除合并的动态路由和静态路由，通过路由的前置导航解决权限对应的路由跳转问
              题，原本左侧菜单栏是通过循环渲染router中的route数据的，现在改为vuex中的合并的静态和动态路由
              出现的问题：1、刷新之后会出现404的页面,还有就是vuex的基础有点忘记了，如何定义和调用，还有就是路由的一些使用，比如路由跳转，还有this.$router.options.routes是能获得路由表？
                        2、还有就是通过addRoutes添加动态路由的时候，每次都添加，退出后没有清除
              2、vuex中子模块调用子模块的mutation，都启用了命名空间，在调用时要加入第三个参数，并且要写路径
                  context.commit('permission/setRoutes', [], { root: true })
              3、退出登录后，要重置初始路由和渲染左侧菜单的state
              4、页面刷新直接进入404页面，404的路由表要放在最好，删掉静态路由中的404
          5-25:按钮点击权限：通过mixin技术定义函数并注册为全局，通过权限标识解决按钮的操作权问题
权限管理部分结束，其他页面用的现成的组件、路由和api

     2022-5-26:首页布局以及封装日历组件
          5-27:1、完成日历的工作逻辑，日历需要new Date格式的事件
               2、通过自定义内容给周六周日特定标识,字符串转数组的方法 字符串.spilt('分隔符')
               3、字符串.startsWith()方法，判断是否以某个字符开头，字符串截取substr()
               4、封装雷达图插件
               5、离职审批弹层和api
          完成了首页模块

   2022-5-28/29:多语言Tab页
               1、使用screenfull插件完成全屏功能,在给自定义组件注册时间的时候要在子组件中定义，父组件定义是不生效的，看了半天
               2、引入screenfull组件后直接报错，没任何问题，百度发现是版本问题，切到5版本就可以了
               3、使用alement-ui-admin提供的换肤组件进行换肤
               4、vue-i18n包国际化,装包的时候一直报错，加sudo管理员也不可以npm install --force,适用于element-ui的语言，对于其他组件的语言还需要装自定义的语言包
               5、一个很容易出错的点，像是数组的filter方法或者i18n回掉函数这种，不要去额外的加{}会不生效
               Vue.use(ElementUI, {
                          i18n: (key, value) => i18n.t(key, value)
               })
               6、i18n全局注册之后，每个组件都会有一个$t方法用于自定义语言的切换
               7、使用admin提供的tabs栏切换组件和路由
     基本这个项目就结束了，明天搞一下打包上线就结束




    
            



