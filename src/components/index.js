// 负责全局自定义组件的注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
export default {
  // 这里为什么要写一个install方法，因为配置给vue的时候会调用install方法并且传入一个vue全局对象
  install(Vue) {
    // 组件注册
    Vue.component("PageTools", PageTools)
    Vue.component("UploadExcel", UploadExcel)
  }
}