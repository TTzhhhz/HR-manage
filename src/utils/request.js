import { config } from '@vue/test-utils'
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeKey } from '@/utils/auth'
import router from '@/router'
const TimeOut = 3600
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置5s认为超时
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use((config) => {
  if (store.getters.token) {
    //在请求参数的header参数的authorization属性中注入token，并且要检查是否失效
    if (CheckTimeOut()) {
      store.dispatch('user/logout')//删除token
      router.push('/login')//跳转到登录页
      Message.error("登陆超时")
      return Promise.reject(new Error("登陆超时"))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  //config是请求的配置信息，必须返回，否则认为没有config
  return config
}, (error) => {
  return Promise.reject(error)
})
// 响应拦截器，用来返回错误信息
service.interceptors.response.use(function (response) {
  const { success, message, data } = response.data
  // 根据success正确与否返回data
  if (success) {
    return Promise.resolve(data)
  } else {
    Message.error(message)
    // 这里返回这玩意之后，axios就得不到一个promise对象，
    return Promise.reject(new Error(message))
  }

}, function (error) {
  //当超时之后，error的response的data的code
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')//删除token
    router.push('/login')//跳转到登录页
  } else {
    //Message.error是饿了么组件的一个提示错误的方法,拦截后error是一个错误对象，并不是axios返回的data
    Message.error(error.Message)
  }
  //提示了错误信息之后，还需要reject表明执行promise中错误后的操作(.catch中的操作)
  return Promise.reject(error)
})
//定义方法检查token是否超时
function CheckTimeOut() {
  var currentTime = Date.now()//当前时间戳
  var timeStamp = getTimeKey()//获取token时的时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
