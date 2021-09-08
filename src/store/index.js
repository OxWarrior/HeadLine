import Vue from 'vue'
import Vuex from 'vuex'

// import { loginAPI } from '@/api/login'
import userModule from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  // strict: true,
  // state: {
  //   // 绑定用户登录返回的token,保存至本地
  //   token: window.localStorage.getItem('token') || '',
  //   refresh_token: window.localStorage.getItem('refresh_token') || ''
  // },
  // mutations: {
  //   // 设置token
  //   setToken (state, val) {
  //     state.token = val
  //     localStorage.setItem('token', val)
  //   },
  //   setRefreshToken (state, val) {
  //     state.refresh_token = val
  //     localStorage.setItem('refresh_token', val)
  //   }
  // },
  // actions: {
  //   // 异步请求赋值token和refresh_token
  //   async asyncLogin (store, val) {
  //     const res = await loginAPI(val)
  //     store.commit('setToken', res.data.data.token)
  //     store.commit('setRefreshToken', res.data.data.refresh_token)
  //     // 返回一个promise对象在login页面错误处理
  //     return Promise.resolve(res)
  //   }
  // },
  modules: {
    user: userModule
  }
})
export default store
