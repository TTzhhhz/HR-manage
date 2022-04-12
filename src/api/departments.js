import request from '@/utils/request.js'
// 封装获取组织架构信息的接口
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
// 封装删除部门的接口
export function delDepartments(id) {
  return request({
    method: 'delete', // 接口满足restful规范，同一个接口不同方法，可以执行不同操作
    url: `/company/department/${id}`
  })
}
// 封装新增部门的接口
export function addDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
// 封装获取部门详情的接口，用于编辑时显示在表单中
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}