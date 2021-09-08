<template>
  <div class="search-container">
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()" />
      <!-- this.$router.back / this.$router.go(-1) -->
      <!-- 搜索组件 -->
      <van-search placeholder="请输入搜索关键词" background="#007BFF" shape="round" v-focus @input="inputFn" v-model.trim="value" @search="goSearchResult(value)" />
    </div>

    <!-- 搜索建议列表 -->
    <ul class="sugg-list" v-if="value">
      <li class="sugg-item" v-for="(str, index) in searchLists" :key="index" v-html="highLight(str)" @click="goSearchResult(str)"></li>
    </ul>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearHistoryFn" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <!-- 原因是，你在同一dom层级写了两个for循环，两个循环的key，你都写成了index，你得改掉一个 -->
      <div class="history-list" v-for="(item,index) in historyLists" :key="index">
        <span class="history-item" @click="goSearchResult(item)" @touchstart="touchStartFn(index)" @touchmove="touchFinalFn" @touchend="touchFinalFn">{{item}}</span>
      </div>

    </div>

  </div>
</template>

<script>
import { searchLenovoAPI } from '@/api/search'
import { Toast, Dialog } from 'vant'
export default {
  data () {
    return {
      value: '', // 输入内容
      searchLists: [], // 搜索建议
      historyLists: JSON.parse(window.localStorage.getItem('history')) || ['API', 'java', 'css', '前端', '后台接口', 'python'] // 搜索历史

    }
  },
  created () {

  },
  methods: {
    // 输入框写入，发请求获取建议列表
    inputFn () {
      // 输入框防抖
      // 一个标记用来存放定时器的返回值
      // 每次输入触发函数，清空前一次的定时函数
      this.timeout && clearTimeout(this.timeout) // 有值才关闭定时函数
      // 每隔一段时间才允许执行
      this.timeout = setTimeout(async () => {
        // 输入框值不为空
        if (this.value.length === 0) {
          Toast('输入内容不能为空')
          return
        }
        const res = await searchLenovoAPI({ q: this.value })
        // console.log(res)
        // stringObj.replace(rgExp, replaceText)
        // map映射返回数组
        const options = res.data.data.options.map(str => str.replace(/[\s?'",]+/g, ''))
        this.searchLists = options
      }, 600)
    },
    // 匹配文字高亮
    highLight (str) {
      // 定义正则，第二个参数表示匹配，g-全局，i-不区分大小写
      const regExp = new RegExp(this.value, 'gi')
      // replace() 方法返回一个由替换值（replacement）替换部分或所有的模式（pattern）匹配项后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。如果pattern是字符串，则仅替换第一个匹配项。
      // match -- 匹配的子串
      return str.replace(regExp, match => {
        return `<span style="color:red">${match}</span>`
      })
    },
    // 文章结果页面跳转
    goSearchResult (val) {
      if (!this.historyLists.includes(val) && val !== '') {
        this.historyLists.push(val)
      }

      window.localStorage.setItem('history', JSON.stringify(this.historyLists))
      if (this.val !== '') { this.$router.push(`/search${val}`) }
    },
    // 清空历史记录
    clearHistoryFn () {
      Dialog.confirm({
        title: '清空历史记录',
        message: '确认删除吗'
      })
        .then(() => {
          // on confirm
          this.historyLists = []
          window.localStorage.removeItem('history')
        })
        .catch(() => {
          // on cancel
        })
    },
    // 触摸长按
    touchStartFn (i) {
      // 定时器记录1s后弹出，表示长按了
      this.timer = setTimeout(async () => {
        try {
          await Dialog.confirm({
            title: '清空历史记录',
            message: '确认删除此条记录吗'
          })
          this.historyLists.splice(i, 1)
          window.localStorage.setItem('history', JSON.stringify(this.historyLists))
        } catch (e) {

        }
      }, 1000)
    },
    // 移动和触摸结束抬起都阻止删除
    touchFinalFn () {
      // 移动和触摸都清空
      clearTimeout(this.timer)
    }

  }

}
</script>

<style scoped lang="less">
.search-header {
  display: flex;
  align-items: center;
  height: 46px;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    float: left;
    // display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
