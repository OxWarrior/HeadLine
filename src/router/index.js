import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载 --- 匹配路径，return引入的组件
// 可以分为正常加载和懒加载，此处的login,home,layout可以首次直接加载

// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Search from '@/views/Search'
// import SearchResult from '@/views/Search/SearchResult'
// import Article from '@/views/Article'
// import Edit from '@/views/User/Edit'
// import Chat from '@/views/Chat'

import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login')
  },
  {
    path: '/layout',
    component: () => import('@/views/Layout'),
    redirect: '/layout/home',
    children: [{
      path: 'home',
      component: () => import('@/views/Home')
    },
    {
      path: 'user',
      component: () => import(/* webpackChunkName: 'User' */'@/views/User')
    }]
  },
  {
    path: '/search',
    component: () => import('@/views/Search')
  },
  {
    path: '/search:name', // 动态路由
    component: () => import('@/views//Search/SearchResult')
  },
  {
    path: '/article',
    component: () => import('@/views/Article')
  },
  {
    path: '/user/edit',
    component: () => import('@/views/User/Edit')
  },
  {
    path: '/chat',
    component: () => import('@/views/Chat')
  }

]

const router = new VueRouter({
  routes
})

// 路由守卫

const unAtho = ['/login']
router.beforeEach((to, from, next) => {
  const { token } = store.state.user
  // 有token
  if (token) {
    // 去login页面阻止，没必要跳转
    if (unAtho.includes(to.path)) {
      next(false)
    } else {
      // 其他页面正常跳转
      next()
    }
    // 无token
  } else {
    if (unAtho.includes(to.path)) {
      next()
    } else {
      // 跳转到登录页，登陆成功回跳
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
