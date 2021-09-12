import { loginAPI } from '@/api/login'
import Storage from '../../utils/storage'

// 定义user模块
const userModule = {
  namespaced: true,
  strict: true,
  state: {
    // 绑定用户登录返回的token,保存至本地
    token: Storage.get('token') || '',
    refresh_token: Storage.get('refresh_token') || '',
    user: {
      photo: Storage.get('userInfo') || ''
    }

  },
  mutations: {
    // 设置token
    setToken (state, val) {
      state.token = val
      // 本地存储
      Storage.set('token', val)
    },
    setRefreshToken (state, val) {
      state.refresh_token = val
      // 本地存储
      Storage.set('refresh_token', val)
    },
    // 设置用户信息
    setUser (state, val) {
      state.user.photo = val
      Storage.set('userInfo', val)
    },
    setUserInfo (state, val) {
      state.user = {
        ...state.user,
        ...val
      }
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
