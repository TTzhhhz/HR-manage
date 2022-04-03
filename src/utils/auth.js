import Cookies from 'js-cookie'

//token字符串是一个键值对的形式存储的，因为访问不同的地址需要不同的token
const TokenKey = 'hrsaas-ihrm-token'//这里就是设置一个token的键值（key）
const timeKey = 'hrsaas-timestamp-key'//得到token的时间戳

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTimeKey() {
  return Cookies.get(timeKey)
}
export function setTimeKey() {
  return Cookies.set(timeKey, Date.now())
}
