<template>
  <div class="login-container">
    <!-- 头部导航 -->
    <van-nav-bar title="黑马头条-登录">
      <template #left>
        <img src="@/assets/images/toutiao_logo.png" alt="" class="logo">
      </template>
    </van-nav-bar>
    <!-- 表单 -->
    <van-form @submit="onSubmit">
      <van-field v-model="formLogin.mobile" label="手机号码" placeholder="手机号码" :rules="[{ required: true, message: '请填写手机号码' ,trigger:'onChange'},
      {pattern:/^1[3-9]\d{9}$/,message:'请输入正确手机号',trigger:'onChange'}]" required />
      <van-field v-model="formLogin.code" type="password" label="验证码" placeholder="验证码" :rules="[{ required: true, message: '请填写密码' ,trigger:'onChange'},
      {pattern:/^\d{6}$/,message:'请输入正确验证码',trigger:'onChange'}]" required />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" :disabled="isLoading" :loading="isLoading" loading-text="加载中...">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// import { loginApi } from '@/api'
import { Toast } from 'vant'
import { mapActions } from 'vuex'
export default {
  name: 'Login',

  data () {
    return {
      isLoading: false,
      formLogin: {
        mobile: '13812341234',
        code: '246810'
      }

    }
  },
  methods: {
    // ...mapMutations(['setToken', 'setRefreshToken']),
    ...mapActions('user', ['asyncLogin']),
    async onSubmit () {
      try {
        // 禁用按钮
        this.isLoading = true
        await this.asyncLogin(this.formLogin)
        // console.log(res)
        // const { refresh_token, token } = res.data.data
        // console.log(refresh_token)
        // console.log(token)
        // this.setToken(res.data.data.token)
        // this.setRefreshToken(res.data.data.refresh_token)
        Toast.success('登陆成功')
        this.$router.replace('/layout')
      } catch (err) {
        console.log(err)
        Toast.fail('登陆失败')
      } finally {
        // 无论是否成功都把按钮解禁
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.logo {
  width: 100px;
  height: 30px;
}
// .van-nav-bar {
//   background-color: #007bff;
//   /deep/ .van-nav-bar__title {
//     color: #fff;
//   }
// }
</style>
