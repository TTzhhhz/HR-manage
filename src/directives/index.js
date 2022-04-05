// 负责管理所有的自定义指令
export const imagerror = {
  //指令对象,钩子函数inserted：一旦元素插入父 DOM 就会发生这种情况
  inserted(dom, options) {
    //dom为当前指令作用的dom对象,options.val是指用户传递的变量的值
    //如果图片有地址但是没有加载成功会触发图片的错误事件 onerror
    dom.onerror = function () {
      // 给一张默认图片
      dom.src = options.value
    }
  }
}