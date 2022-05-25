// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 最开始肯定拥有静态路由权限
  routes: constantRoutes // 路由表，表示当前用户所拥有的所有路由的数组
}
const mutations = {
  // 定义修改routes的muatations
  // payload是登陆成功后需要添加的新路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由,第二个参数为当前用户拥有的菜单权限标识
  filterRoutes(context, menus) {
    // 筛选出动态路由中能和menus中的权限对上的路由
    const routes = []
    menus.forEach(key => {
      // 在asyncRoutes每个元素的name属性看有没有和key对应的，没有则没权限，找到了要筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    // 得到的routes是满足权限要求的路由表
    context.commit('setRoutes', routes)
    return routes // 这里为什么要return ,state是显示左侧菜单，return是给路由的addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}