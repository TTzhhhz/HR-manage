// 引入layout组件
import Layout from '@/layout'
// 员工模块的路由规则
export default {
  path: '/permission',
  name: 'permission', // 后面权限管理会用到
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/permission'),
    // meta是路由原信息，可以放数据,这里是通过循环路由来渲染左侧导航栏的
    meta: {
      title: '权限管理',
      icon: 'lock'
    }
  }]
}