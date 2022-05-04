// 负责管理所有的自定义指令
export const imagerror = {
  //指令对象,钩子函数inserted：一旦元素插入父 DOM 就会发生这种情况
  inserted(dom, options) {
    //dom为当前指令作用的dom对象,options.val是指用户传递的变量的值
    // 先判断dom的src是否为空,如果是null则显示默认图片
    dom.src = dom.src === null ? options.value : dom.src
    // dom.src = dom.src || options.value
    //如果图片有地址但是没有加载成功会触发图片的错误事件 onerror
    dom.onerror = function () {
      // 给一张默认图片
      dom.src = options.value
    }
  },
  // componentUpdated和inserted区别，inserted只会在组件初始化的时候执行一次，当组件产生变化就不会执行了
  // 这样就会出现一个问题，我点下一页或者再返回上一页，头像还是不显示
  componentUpdated(dom, options) {
    dom.src = dom.src === null ? options.value : dom.src
  }
}