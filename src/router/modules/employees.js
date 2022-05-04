// 引入layout组件
import Layout from '@/layout'
// 员工模块的路由规则
export default {
  path: '/employees',
  name: 'employees', // 后面权限管理会用到
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/employees'),
    // meta是路由原信息，可以放数据,这里是通过循环路由来渲染左侧导航栏的
    meta: {
      title: '教职工管理',
      icon: 'people'
    }
  }, {
    path: 'detail/:id', // 动态路由参数/detail/123，加了问号表明又没有id都可以访问
    component: () => import('@/views/employees/detail.vue'),
    hidden: true, // 该内容不在左侧菜单显示，只能有一个子路由，所以要加hidden
    meta: {
      title: '教职工详情'
    }
  }, {
    path: 'print/:id?',
    component: () => import('@/views/employees/print.vue'),
    hidden: true,
    meta: {
      title: "员工打印"
    }
  }]
}