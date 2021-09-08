import axios from 'axios'

import router from '@/router'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  // console.log(config)
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么

  if (error.response.status === 401) {
    // localStorage.removeItem(store.state.user.token)
    // 清空token
    store.commit('user/setToken', '')
    router.replace('/login')
  }

  return Promise.reject(error)
})

export default request
