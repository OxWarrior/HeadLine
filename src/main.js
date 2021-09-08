import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh, ActionSheet, Dialog, Popup, Row, Col, Badge, Search, Divider, Tag, CellGroup, Image, Radio, RadioGroup, DatetimePicker } from 'vant'
import 'amfe-flexible'
import './directive'
import { timeAgo } from './utils/dateTime'

import ArticleItem from '@/components/ArticleItem'
Vue.component('ArticleItem', ArticleItem)

Vue.use(NavBar)
Vue.use(Field)
Vue.use(Form)
Vue.use(Button)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Icon)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Cell)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(ActionSheet)
Vue.use(Dialog)
Vue.use(Popup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Search)
Vue.use(Divider)
Vue.use(Tag)
Vue.use(CellGroup)
Vue.use(Image)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(DatetimePicker)

Vue.prototype.$time = timeAgo

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
