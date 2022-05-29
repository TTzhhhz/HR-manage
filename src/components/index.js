// 负责全局自定义组件的注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import print from 'vue-print-nb' // 打印的组件
import ScreenFull from './screenFull'
import ThemePicker from './ThemePicker'
import LangSelect from './lang'
import TagsView from './TagsView'
export default {
  // 这里为什么要写一个install方法，因为配置给vue的时候会调用install方法并且传入一个vue全局对象
  install(Vue) {
    // 组件注册
    Vue.component("PageTools", PageTools)
    Vue.component("UploadExcel", UploadExcel)
    Vue.component("ImageUpload", ImageUpload)
    Vue.use(print)
    Vue.component("ScreenFull", ScreenFull)
    Vue.component("ThemePicker", ThemePicker)
    Vue.component("LangSelect", LangSelect)
    Vue.component("TagsView", TagsView)
  }
}