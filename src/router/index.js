import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载 --- 匹配路径，return引入的组件

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
      component: () => import('@/views/User')
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
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && store.state.user.token === null) return next(false)
  next()
})

export default router
