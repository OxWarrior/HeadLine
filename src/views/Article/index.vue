<template>
  <div class="article-detail__container">
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{articleObj.title}}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="articleObj.aut_name" :label="articleObj.pubdate">
        <template #icon>
          <img :src="articleObj.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <van-button type="info" size="mini" v-if="articleObj.is_followed" @click="followOrUnFollow(true)">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else @click="followOrUnFollow(false)">关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider>start</van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="articleObj.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small" v-if="articleObj.attitude>=0" @click="likeOrDislike(true)">已点赞</van-button>
        <van-button icon="good-job-o" type="danger" plain size="small" v-else @click="likeOrDislike(false)">点赞</van-button>
      </div>
    </div>

    <!-- 评论 -->
    <Comment :obj="articleObj"></Comment>
  </div>
</template>

<script>
import { getArticleAPI, followAuthorAPI, unFollowAuthorAPI, likeArticleAPI, disLikeArticleAPI } from '@/api/article'
import { Toast } from 'vant'
import Comment from './Comment.vue'
export default {
  name: 'ArticleDetail',
  data () {
    return {
      articleObj: {}
    }
  },
  components: {
    Comment
  },
  async created () {
    const res = await getArticleAPI({ artId: this.$route.query.id })
    // console.log(res)
    this.articleObj = res.data.data
  },
  methods: {
    // 关注 or 取关作者
    followOrUnFollow (flag) {
      try {
        // falg -> 标记 true-关注作者 点击取关 false-未关注 点击关注
        flag ? unFollowAuthorAPI({ autId: this.articleObj.aut_id }) : followAuthorAPI({ autId: this.articleObj.aut_id })
        // 关注状态取反
        this.articleObj.is_followed = !this.articleObj.is_followed
        Toast.success(flag ? '取关成功' : '关注成功')
      } catch (err) {
        Toast.fail(flag ? '取关错误' : '关注错误')
      }
    },
    // 喜欢 or 不喜欢文章
    likeOrDislike (flag) {
      try {
        flag ? disLikeArticleAPI({ artId: this.articleObj.art_id }) : likeArticleAPI({ artId: this.articleObj.art_id })
        if (flag) {
          this.articleObj.attitude = -1
        } else {
          this.articleObj.attitude = 1
        }
        Toast.success(flag ? '取消喜欢' : '已点赞')
      } catch (err) {
        Toast.fail(flag ? '点赞错误' : '取消喜欢错误')
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
