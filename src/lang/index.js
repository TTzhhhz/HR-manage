import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的包
import Cookie from 'js-cookie' // 引入cookie包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import elementJA from 'element-ui/lib/locale/lang/ja' // 引入饿了么的中文包
import customZH from './zh'
import customEN from './en' // 两个自定义语言包,自定义语言包需要给使用的模块

Vue.use(VueI18n) // 全局注册国际化包
export default new VueI18n({
  locale: Cookie.get('language') || 'en', // 从cookie中获取语言类型 获取不到就是中文
  messages: {
    en: {
      ...elementEN, ...customEN// 将饿了么的英文语言包引入
    },
    zh: {
      ...elementZH, ...customZH// 将饿了么的中文语言包引入
    },
    ja: {
      ...elementJA
    }
  }
})