// 通过判断token的有无做一些路由跳转
import router from "./router";
import store from './store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
import Nprogress from "nprogress";
const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  Nprogress.start()
  //是否有token
  if (store.getters.token) {
    //去的地址如果是登录页，直接跳到主页，否则直接放行
    if (to.path === '/login') {
      next('/')
    } else {
      // 要获取用户资料，必须有token，同时跳转的页面不是登录页，并且在此之前没有获取过
      if (!store.getters.userId) {
        //获取资料,用户资料包含权限标识
        const { roles } = await store.dispatch('user/getUserInfo')
        console.log(roles);
        // 获取用户资料后进行路由筛选（根据标识筛选对应动态路由),
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // 把得到的动态路由添加到路由表,addRoutes的方法添加动态路由
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        // 一个已知缺陷，使用过addRoutes后要用next(to.path)
        next(to.path) // 跳转到对应地址
      }
      next()
    }
  } else {
    //没有token先判断是否去的是白名单的页面，是则放行，不是则跳转到登录页
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  Nprogress.done()//这是为了解决有token时候，往登录页跳转进度条不关闭的问题，此刻本身就在主页，又要返回主页，不经过后置导航
})
router.afterEach(() => {
  // Nprogress.done()
})