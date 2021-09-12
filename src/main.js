import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 后台在发布文章时候，预先给标签添加了相应的class类名
import 'highlight.js/styles/default.css'
import 'amfe-flexible'
import './directive'
import './vant'
import My from './plugins'

Vue.use(My)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
