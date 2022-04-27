import request from '@/utils/request'
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
// 获取员工列表
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}
// 删除员工
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
// 新增员工
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}
// 上传excel数据
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data // 要求数组类型
  })
}