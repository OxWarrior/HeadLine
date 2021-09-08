<template>
  <div>
    <!-- 头部-->
    <van-nav-bar fixed>
      <template #left>
        <img src="@/assets/images/toutiao_logo.png" alt="" class="logo">
      </template>
      <template #right>
        <van-icon name="search" size="0.48rem" color="#fff" @click="$router.push('/search')" />
      </template>
    </van-nav-bar>

    <!-- tab栏 -->
    <van-tabs v-model="activeId" sticky offset-top="1.226667rem" animated>
      <van-tab :title="obj.name" v-for="obj in channelList" :key="obj.id" :name="obj.id">
        <!-- 文章 -->

        <!-- 下拉刷新组件 -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" :disabled="disabled">

          <!-- 滚动加载组件 -->
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" offset="50" :immediate-check="false">
            <!-- immediate-check --- 初始化不检查 -->
            <ArticleList :articleList="articleLists" @dislikeArt="dislikeArtFn"></ArticleList>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>

    <!-- 增加频道按钮 -->
    <van-icon name="plus" size="0.45rem" class="moreChannels" @click="show = true" />

    <!-- 弹出层 -->
    <van-popup v-model="show" get-container="body" class="edit_wrap">
      <ChannelEdit :userChannelLists="channelList" @close="show = false" @addChannelItem="addChannelItemFn" @delChannelItem="delChannelItemFn" @closePopup="show = false" @enterChannel="enterChannelFn"></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
// import moment from 'moment'
import { Toast } from 'vant'
import ArticleList from './ArticleList'
import { getSelectChannelAPI, getArticleListAPI, updateChannelListAPI } from '@/api/home'
import ChannelEdit from './ChannelEdit.vue'
export default {
  name: 'Home',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      activeId: 0,
      channelList: [], // 用户选择的频道列表
      articleLists: [], // 文章列表
      loading: false, // 滚动加载是否处于加载状态
      finished: false, // 滚动加载是否已加载完成
      // preTimestamp: null, // 下一页时间戳,用于做分页
      isLoading: false, // 下拉加载是否处于加载中状态
      // timestamp: undefined
      show: false, // 频道管理弹出层可见性
      disabled: false

    }
  },
  async created () {
    // 获取已选文章列表
    const res = await getSelectChannelAPI()
    // console.log(res)
    this.channelList = res.data.data.channels

    // 调用获取文章
    this.getArticleList()
  },
  watch: {
    // 检测文章id变化
    activeId () {
      // id 变化  --- 清空文章获取过的数组和保存的过上一页值
      this.finished = false // 旧频道加载完成没有更多数据，将加载完成改为false，重新加载
      this.articleLists = []
      this.timestamp = undefined
      // 调用获取文章
      this.getArticleList()
    }
  },
  methods: {
    // 定义获取文章的方法函数方便调用，异步
    async getArticleList (isPullUp = true) {
      // 获取用户选中的文章
      const resp = await getArticleListAPI({
        channel_id: this.activeId,
        timestamp: this.timestamp // this指向当前组件实例，data里是响应式，需要在模板中使用才声明。要使用这个变量要用this.来调用
      })
      // console.log(resp)

      // 把上一次后台返回的pre_timestamp值解构 存
      const { pre_timestamp, results } = resp.data.data

      // 加载结束标志判断
      if (pre_timestamp === null || results.length < 10) {
        this.finished = true
        return
      }
      if (pre_timestamp === '1552266000128') {
        // this.disabled = true
      }

      // 将上一次请求的值保存给变量timestamp
      this.timestamp = pre_timestamp
      // 数据预处理
      results.forEach(obj => {
        obj.pubdate = this.$time(obj.pubdate)
      })
      // 加载和下拉刷新传参判断
      if (isPullUp) {
        this.articleLists = [...this.articleLists, ...results]
        // 重置滚动加载状态，不然只加载第二页
        this.loading = false
      } else {
        // 替换

        this.articleLists = results

        this.isLoading = false
        Toast.success('刷新成功')
      }
    },
    // 时间处理函数，时间处理用moment
    // getTimeAgo (targetDate) {
    //   // 中文
    //   moment.locale('zh-cn')
    //   // 当前时间与传入时间对比
    //   return moment(targetDate).fromNow()
    // },
    // async changeArticle (id) {
    //   // 切换页面更新页面文章
    //   const res = await getArticleListAPI({
    //     channel_id: id, // name值绑定
    //     timestamp: Date.now()
    //   })
    //   // console.log(111)
    //   // console.log(res)
    //   this.articleLists = res.data.data.results
    // },

    // 滚动加载
    async onLoad () {
      // 只有在文章数组有值才会触发触底函数
      if (this.articleLists.length > 0) {
        this.getArticleList()
      }
      // const res = await getArticleListAPI({
      //   channel_id: this.activeId,
      //   timestamp: this.preTimestamp // 分页
      // })
      // // console.log(res)
      // if (res.data.data.results.length === 0) {
      //   this.finished = true
      // } else {
      //   // Toast.loading({
      //   //   message: '加载中...',
      //   //   forbidClick: true
      //   // })
      //   // this.preTimestamp = res.data.data.pre_timestamp

      //   // this.articleLists = [...this.articleLists, ...res.data.data.results]

      //   // 重置滚动加载状态，不然只加载第二页
      //   this.loading = false
      // }
    },

    // 下拉刷新
    onRefresh () {
      this.getArticleList(false)
    },
    // 反馈不喜欢文章在数据中删除
    dislikeArtFn (index, height) {
      // console.log(1)
      // console.log(index)
      console.log(height)
      this.articleLists.splice(index, 1)

      // console.log(window.innerHeight)
      const count = parseInt(window.innerHeight / height)
      if (this.articleLists.length < count) {
        this.getArticleList()
      }
    },
    // 添加频道
    addChannelItemFn (obj) {
      // console.log(obj)
      this.channelList.push(obj)
      this.updateUserChannelList()
    },
    // 删除频道
    delChannelItemFn (i) {
      this.channelList.splice(i, 1)
      this.updateUserChannelList()
    },
    // 更新用户已选择频道
    async updateUserChannelList () {
      const arr = this.channelList.reduce((total, obj, index) => {
        const item = {
          id: obj.id,
          seq: index + 1
        }
        if (obj.id !== 0) {
          total.push(item)
        }
        return total
      }, [])
      const res = await updateChannelListAPI({
        channels: arr
      })
      console.log(res)
    },
    // 进入频道
    enterChannelFn (channelId) {
      // 传入当前频道id赋值给v-model绑定的变量
      this.activeId = channelId
      // 关闭弹层
      this.show = false
    }

  }
}
</script>

<style scoped lang="less">
.logo {
  width: 100px;
  height: 30px;
}
// 内容
/deep/ .van-tabs__content {
  padding-top: 44px;
}

// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 20px;
  background-color: #fff;
}
// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 60px;
  right: 8px;
  z-index: 999;
}
/* 频道编辑弹出层铺满屏幕 */
.edit_wrap {
  width: 100%;
  height: 100%;
}
</style>
