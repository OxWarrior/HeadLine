import ArticleItem from '@/components/ArticleItem'
import { timeAgo } from '@/utils/dateTime'

const My = {
  install (Vue) {
    // 全局注册组件
    Vue.component('ArticleItem', ArticleItem)

    // 全局注册指令
    Vue.directive('color', {
      inserted (el, binding) {
        el.style.color = binding.value
      },
      updated (el, binding) {
        el.style.color = binding.value
      }
    })

    // 在Vue原型上添加方法属性
    Vue.prototype.$time = timeAgo

    // 给Vue添加过滤器
  }
}
export default My
