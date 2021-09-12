<template>
  <div>
    <div class="main-container">
      <keep-alive>
        <router-view />

      </keep-alive>
      <!-- <p v-color="color"></p> -->

    </div>

    <!-- 导航栏 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item name="home" icon="home-o" to="/layout/home">首页</van-tabbar-item>
      <van-tabbar-item name="search" icon="user-o" to="/layout/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 'home'
      // color: 'red'
    }
  }
}
</script>

<style scoped>
.main-container {
  padding-bottom: 50px;
}
::v-deep .van-hairline--top-bottom {
  border-top: 1px solid #f8f8f8;
}
</style>
