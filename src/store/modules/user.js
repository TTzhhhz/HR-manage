import { getToken, setToken, removeToken, setTimeKey } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user.js'
const state = {
  //放置状态
  //vuex一初始化，就要从缓存cookie中获取token
  token: getToken(), //设置token为共享状态
  userInfo: {} //这里为什么null不行呢？因为要在getters中做快捷访问，null.属性会报错
}
const mutations = {
  //当vuex中的token变化了，需要将新的token存入缓存
  setToken(state, token) {
    //这里是当token变化了以后，要将新获得的token重新赋值给vuex
    state.token = token;
    //vuex获得新的token之后，需要更新到cookie中
    setToken(token)
  },
  removeToken(state) {
    // vuex中的token置空
    state.token = null
    // 缓存置空
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    //在这里我们需要发axios请求进行登陆，获取到token，并使用mutaions中的方法保存
    //调用封装的axios方法发登陆请求，返回一个promise对象
    const result = await login(data) //拿到token
    //axios会默认加一层data,data中包含真实返回数据的data

    // 这里可以优化，因为我们在返回拦截器中已经处理好了，只有正确返回数据之后才会执行正确的逻辑，否则直接进入到catch错误处理
    // if (result.data.success) {
    //   //登陆成功，拿到后台返回的token字符串，进行保存
    // context.commit("setToken", result.data.data)
    // }
    context.commit("setToken", result) //vuex存储token
    setTimeKey() // 存入当前时间戳
  },
  async getUserInfo(context) {
    const result = await getUserInfo() //拿到用户信息
    //用户的详情，包括头像数据
    const baseInfo = await getUserDetailById(result.userId)
    //将接口合并后再存入vuex
    console.log({ ...result, ...baseInfo });
    context.commit('setUserInfo', { ...result, ...baseInfo }) //vuex存储用户信息
    return result //这里为什么要返回result，暂时不清楚
  },
  logout(context) {
    //删token
    context.commit('removeToken')
    //删用户资料
    context.commit('removeUserInfo')

  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
