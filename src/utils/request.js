import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置5s认为超时
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use()
// 响应拦截器，用来返回错误信息
service.interceptors.response.use(function (response) {
  const { success, message, data } = response.data
  // 根据success正确与否返回data
  if (success) {
    return data
  } else {
    Message.error(message)
    // 这里返回这玩意之后，axios就得不到一个promise对象，
    return Promise.reject(new Error(message))
  }

}, function (error) {
  //Message.error是饿了么组件的一个提示错误的方法,拦截后error是一个错误对象，并不是axios返回的data
  Message.error(error.Message)
  //提示了错误信息之后，还需要reject表明执行promise中错误后的操作(.catch中的操作)
  return Promise.reject(error)

})
export default service
