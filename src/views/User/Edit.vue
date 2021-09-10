<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="userProfileObj.photo" @click="selectAva" />
          <!-- 文件域 -->
          <input type="file" ref="photo" hidden @change="uploadPhotoFn">
        </template>
      </van-cell>
      <!-- 名称 -->
      <van-cell title="名称" is-link :value="userProfileObj.name" @click="showDialog" />
      <!-- 用户名提示弹窗 -->
      <van-dialog v-model="showName" title="修改用户名" show-cancel-button :before-close="uploadUserName">

        <van-field v-model="value" placeholder="请输入用户名" input-align="center" v-focus />

      </van-dialog>
      <!-- 性别 -->
      <van-cell title="性别" is-link :value="userProfileObj.gender === 1 ? '男' : '女' " @click="showSexDialog" />
      <!-- 性别提示弹窗 -->
      <van-dialog v-model="showSex" title="修改用户性别" show-cancel-button :before-close="uploadUserSex">
        <van-radio-group v-model="radio" direction="horizontal">
          <van-radio :name="1">男</van-radio>
          <van-radio :name="0">女</van-radio>
        </van-radio-group>
      </van-dialog>
      <!-- 生日 -->
      <van-cell title="生日" is-link :value="userProfileObj.birthday" @click="showBirthday" />
      <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
        <van-datetime-picker v-model="currentDate" type="date" title="选择生日" :min-date="minDate" :max-date="maxDate" @confirm="updateBirthday" />
      </van-popup>
    </van-cell-group>

  </div>
</template>

<script>
import moment from 'moment'
import { editUserAPI, updateUserPhotoAPI, updateUserProfileAPI } from '@/api/user'
import { Toast } from 'vant'
export default {
  name: 'UserEdit',
  data () {
    return {
      userProfileObj: {}, // 用户个人资料
      showName: false, // 提示框显示参数
      value: '', // 输入框值
      showSex: false,
      radio: 1,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      show: false
    }
  },
  async created () {
    // 渲染编辑页面
    const res = await editUserAPI()
    // console.log(res)
    this.userProfileObj = res.data.data
  },
  methods: {
    // 文件域选择图片
    selectAva () {
      // 获取input对象
      const el = this.$refs.photo
      // console.log(el)
      el.click()
    },
    // 上传用户头像并修改
    async uploadPhotoFn (e) {
      // 获取用户选择的图片对象
      const form = e.target.files[0]
      const { name, size } = form // size 的单位为一个字节 byte
      // 判断文件类型，只有是图片才能上传，看扩展名
      if (!/\.(png|jpe?g||gif||webp||svg)$/i.test(name)) {
        Toast('请选择正确图片类型')
      }
      if (size / 1024 / 1024 > 2) {
        Toast('图片大小太大')
        return
      }
      // 创建符合条件的formdata对象
      const formData = new FormData()
      // 将获取到的图片添加到formdata对象中
      formData.append('photo', form)
      // 调接口上传图片
      const res = await updateUserPhotoAPI({ form: formData })
      // console.log(res)
      this.userProfileObj.photo = res.data.data.photo
    },
    // 显示修改name弹出层
    showDialog () {
      this.showName = true
      this.value = this.userProfileObj.name
    },
    // 更新用户名
    async uploadUserName (action, done) {
      // console.log(action, done)
      // 判断点击取消还是确认按钮，确认才提交数据给后台
      if (action === 'confirm') {
        if (this.value === '') {
          Toast('用户名不能为空')
          done(false)
        } else if (!/^[a-zA-Z\u4E00-\u9FA5]{1,7}$/i.test(this.value)) {
          Toast('请输入正确用户名，用户名1到7位,只支持英文和数字')
          done(false)
        } else {
          try {
            await updateUserProfileAPI({ name: this.value })
            // console.log(res)
            done()
            // 修改页面name
            this.userProfileObj.name = this.value
            Toast.success('用户名修改成功')
          } catch (err) {
            Toast.fail('用户名修改出错')
          } finally {
            done()
          }
        }
      } else {
        done()
      }
    },
    // 显示修改sex弹出层
    showSexDialog () {
      this.showSex = true
      this.radio = this.userProfileObj.gender
    },
    // 更新页面的sex
    uploadUserSex (action, done) {
      if (action === 'confirm') {
        if (this.radio === this.userProfileObj.gender) {
          Toast('您未修改性别哦')
          done()
        } else {
          this.userProfileObj.gender = this.radio
          done()
          Toast('修改性别成功')
        }
      } else {
        done()
      }
    },
    // 显示生日日期
    showBirthday () {
      this.show = true
      // 同步时间日期组件的时间
      this.currentDate = new Date(this.userProfileObj.birthday)
    },
    // 更新生日
    async updateBirthday (value) {
      const dateTime = moment(value).format('yy-MM-DD')
      await updateUserProfileAPI({ birthday: dateTime })
      // 同步页面的生日时间
      this.userProfileObj.birthday = dateTime
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
.van-radio-group {
  justify-content: center;
}
</style>
