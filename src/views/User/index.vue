<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="userObj.photo" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{userObj.name}}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{userObj.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{userObj.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{userObj.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user/edit" />
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat"/>
      <van-cell icon="warning-o" title="退出登录" is-link @click="logOutFn" />
    </van-cell-group>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { Dialog } from 'vant'
import { getUserAPI } from '@/api/user'
export default {
  data () {
    return {
      // userObj: ''
    }
  },
  async created () {
    const res = await getUserAPI()
    // console.log(res)
    // this.userObj = res.data.data
    // this.setUser(this.userObj.photo)
    this.setUserInfo(res.data.data)
  },
  computed: {
    ...mapState('user', { userObj: 'user' })
  },
  methods: {
    ...mapMutations('user', ['setToken', 'setRefreshToken', 'setUser', 'setUserInfo']),
    logOutFn () {
      Dialog.confirm({
        title: '退出登录',
        message: '确定要退出吗'
      })
        .then(() => {
          // on confirm
          // 清空token
          this.setToken('')
          this.setRefreshToken('')
          // 跳转页面
          this.$router.push('/login')
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
