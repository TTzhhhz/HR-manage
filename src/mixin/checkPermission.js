import store from "@/store"
// 做混入对象
export default {
  // 混入对象是组件的选项对象
  methods: {
    checkPermission(key) {
      // key是要检查的目标，从用户的roles中的points中找，有则有权限，无则没权限禁止点
      const { userInfo } = store.state.user
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false // 没进入if肯定没权限
    }
  }
}