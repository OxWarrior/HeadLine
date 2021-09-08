<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed />
    </div>
    <!-- ArticleItem文章详情 -->
    <div class="search-result-content_container">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
              <ArticleItem v-for="obj in resultLists" :key="obj.art_id" :obj="obj"></ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script>
// import ArticleItem from '@/components/ArticleItem'
import { getSearchResultAPI } from '@/api/search'
let page = 1
export default {
  name: 'SearchResult',
  data () {
    return {
      resultLists: [], // 文章结果数组
      loading: false, // 加载状态
      finished: false // 加载是否触底
    }
  },
  // components: {
  //   ArticleItem
  // },
  created () {
    this.getSearchResult()
  },
  methods: {
    // 获取文章结果方法
    async getSearchResult () {
      const res = await getSearchResultAPI({
        q: this.$route.params.name,
        page: page++
      })
      const { results } = res.data.data
      // 返回的结果数组长度判断
      if (results.length < 10) {
        // 加载完成不再触发load事件
        this.finished = true
        return
      }
      // console.log(res)
      this.resultLists = [...this.resultLists, ...results]
      // 加载状态
      this.loading = false
    },
    onLoad () {
      this.getSearchResult()
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
