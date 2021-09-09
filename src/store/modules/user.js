import { loginAPI } from '@/api/login'

// 定义user模块
const userModule = {
  namespaced: true,
  strict: true,
  state: {
    // 绑定用户登录返回的token,保存至本地
    token: window.localStorage.getItem('token') || '',
    refresh_token: window.localStorage.getItem('refresh_token') || '',
    user: JSON.parse(window.localStorage.getItem('userInfo')) || {}
  },
  mutations: {
    // 设置token
    setToken (state, val) {
      state.token = val
      // 本地存储
      localStorage.setItem('token', val)
    },
    setRefreshToken (state, val) {
      state.refresh_token = val
      // 本地存储
      localStorage.setItem('refresh_token', val)
    },
    // 设置用户信息
    setUser (state, val) {
      state.user = val
      localStorage.setItem('userInfo', JSON.stringify(val))
    }
  },
  actions: {
    // 异步请求赋值token和refresh_token
    async asyncLogin (store, val) {
      const res = await loginAPI(val)
      store.commit('setToken', res.data.data.token)
      store.commit('setRefreshToken', res.data.data.refresh_token)
      // 返回一个promise对象在login页面错误处理
      return Promise.resolve(res)
    }

  },
  modules: {
  }
}
export default userModule
