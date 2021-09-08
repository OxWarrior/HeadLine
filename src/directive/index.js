import Vue from 'vue'

Vue.directive('focus', {
  inserted (el) {
    focus(el)
  },
  // 组件更新时的钩子函数update
  update (el) {
    focus(el)
  }
})

function focus (el) {
  // 判断是否包含
  if (['INPUT', 'TEXTAREA'].includes(el.tagName)) {
    el.focus()
    return
  }
  let node = el.querySelector('textarea')
  if (node) {
    node.focus()
    return
  }
  node = el.querySelector('input')
  if (node) {
    node.focus()
    return
  }
  throw Error('请把聚焦指令用在指定位置')
}
