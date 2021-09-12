<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">

        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in commentLists" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar">
              <span class="uname">{{obj.aut_name}}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon name="like" size="16" color="red" v-if="obj.is_liking" @click="likeOrDislike(obj)" />
              <van-icon name="like-o" size="16" color="gray" v-else @click="likeOrDislike(obj)" />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{obj.content}}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{$time(obj.pubdate)}}</div>
        </div>

      </van-list>
    </div>

    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="show === false">
      <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="show = true">发表评论</div>
      <div class="icon-box">
        <van-badge :content="totalCount">
          <van-icon name="comment-o" size="0.53333334rem" @click="scrollComment" />
        </van-badge>
        <van-icon name="star-o" size="0.53333334rem" color="orange" v-if="obj.is_collected" @click="obj.is_collected = !obj.is_collected"/>
        <van-icon name="star-o" size="0.53333334rem" v-else @click="obj.is_collected = !obj.is_collected"/>

        <van-icon name="share-o" size="0.53333334rem" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea placeholder="友善评论、理性发言、阳光心灵" v-focus @blur="onBlur" v-model="content" @keydown.enter="commitComment"></textarea>
      <van-button type="default" @click="commitComment">发布</van-button>
    </div>
  </div>
</template>

<script>
import { getCommentListAPI, commentLikeAPI, commentDisLikeAPI, commitCommentAPI } from '@/api/article'
import { Toast } from 'vant'
export default {
  props: {
    obj: Object
  },
  data () {
    return {
      commentLists: [], // 评论列表
      show: false, // 评论框显示
      totalCount: 0, // 评论总数
      content: '', // 文本域评论内容
      loading: false, // 滚动加载状态
      finished: false // 滚动加载是否结束

    }
  },
  deactivated () {
    // 缓存，评论组件的created只触发一次，切走并不会初始化
    this.commentLists = []
    this.totalCount = 0
    this.content = ''
    this.loading = false
    this.finished = false
  },
  activated () {
    this.getCommentList()
    // // 获取评论 渲染
    // const res = await getCommentListAPI({
    //   artId: this.$route.query.id
    // })
    // // console.log(res)
    // // 解构赋值获取评论结果数组和评论总数
    // const { total_count: totalCount, results, last_id: lastId } = res.data.data
    // // 总数默认为0，如果为0->false 则为空
    // this.totalCount = totalCount || ''
    // this.lastId = lastId
    // this.commentLists = results
  },
  methods: {
    // 评论点赞
    async likeOrDislike (obj) {
      try {
        // 评论已点赞-> 取消点赞接口
        // 评论未点赞-> 点赞接口  ---- 点赞状态is_liking 取反
        obj.is_liking ? await commentDisLikeAPI({ cmtId: obj.com_id }) : await commentLikeAPI({ cmtId: obj.com_id })
        Toast.success(obj.is_liking ? '取消点赞成功' : '点赞成功')
        obj.is_liking = !obj.is_liking
      } catch (err) {
        Toast.fail(obj.is_liking ? '取消点赞失败' : '点赞失败')
      }
    },
    // 滚动至评论区
    scrollComment () {
      const el = document.querySelector('.like-box')
      // scrollIntoView 滚动元素的父容器，使被调用scrollIntoView()的元素对用户可见,behavior默认auto
      el.scrollIntoView({ behavior: 'smooth' })
    },
    // 评论失焦
    onBlur () {
      // 延时执行隐藏textarea，不用给时间，浏览器默认有
      setTimeout(() => {
        this.show = false
      })
    },
    // 发表评论
    async commitComment () {
      if (!this.content) {
        Toast('评论不能为空')
        return
      }
      // 发布评论接口
      const res = await commitCommentAPI({
        artId: this.$route.query.id,
        content: this.content
      })
      // console.log(res)
      // 注意：解构出当前res下的new_obj给newContent，不用{}
      const newContent = res.data.data.new_obj
      // console.log(newContent)
      this.commentLists.unshift(newContent)
      // 清空文本域
      this.content = ''
      // 总评论数量+1
      this.totalCount++
    },
    // 滚动加载
    async onLoad () {
      // 有评论才滚动加载
      if (this.commentLists.length > 0) {
        this.getCommentList()
      }
    },
    // 获取评论
    async getCommentList () {
      const res = await getCommentListAPI({
        artId: this.$route.query.id,
        offset: this.lastId
      })
      // 解构赋值获取评论结果数组和评论总数
      // console.log(res)
      const { total_count: totalCount, results, last_id: lastId } = res.data.data
      if (lastId === null || results === []) {
        // Toast('没有更多评论了')
        this.finished = true
        return
      }
      this.lastId = lastId

      // 总数默认为0，如果为0->false 则为空
      this.totalCount = totalCount || ''

      this.commentLists = [...this.commentLists, ...results]
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}

</style>
