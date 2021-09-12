import axios from 'axios'

// import router from '@/router'
import store from '@/store'

import { updateTokenAPI } from '@/api/user'
import router from '../router'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  // console.log(config)
  // 有token, 全局设置请求头
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
    // 如果token过期并且有refresh_token,更新token ----
  } else if (store.state.user.refresh_token) {
    config.headers.Authorization = `Bearer ${store.state.user.refresh_token}`
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
}, async function (error) {
  // 对响应错误做点什么

  /**
   * token过期两种处理：
   * 1. 重新登录（有感知的刷新）
   * 2. token续签（配合refreshToken)
   *  2.1 定义更新token的接口
   *  2.2 在token过期的401里面调接口
   *  2.3 把新的token同步给vuex及本地
   *  2.4 用新的token继续上次未遂的请求
   */
  if (error.response.status === 401) {
    // 清空token
    store.commit('user/setToken', '')
    const res = await updateTokenAPI()
    console.log(res)
    // 更新token,保存给vuex
    const { token } = res.data.data.token
    store.commit('user/setToken', token)
    return request(error.config)
    // router.replace('/login')
  }
  // refresh_token 过期判断
  // console.log(error.response)
  if (['refresh_token不存在', 'refresh_token失效'].includes(error.response.data.message)) {
    console.log(router)
    // 如果上面走完token和refresh_token都不能用了，那么清空vuex中的两个值
    store.commit('user/setToken', '')
    store.commit('user/setRefreshToken', '')
    // 定义一个重定向，此处打印出来router结果得到，知道是从哪儿跳到login才能回跳
    router.push('/login?redirect=' + router.currentRoute.fullPath)
  }

  return Promise.reject(error)
})

export default request
