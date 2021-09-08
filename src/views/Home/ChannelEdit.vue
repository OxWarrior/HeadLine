<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-nav-bar title="频道管理">
      <template #right>
        <van-icon name="cross" size="0.37333334rem" color="white" @click="closeFn"/>
      </template>
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span>我的频道
          <span class="small-title">
            点击{{ isEdit ? '删除' : '进入' }}频道:
          </span>
        </span>
        <span @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="(obj,index) in userChannelLists" :key="obj.id" @click="enterChannel(obj.id)">
          <div class="channel-item van-hairline--surround">
            {{obj.name}}
            <!-- 删除的徽标 -->
            <van-badge color="transparent" class="cross-badge" v-if="isEdit && obj.id !== 0">
              <template #content>
                <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="0.32rem" @click="delChannel(index)"/>
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="obj in unSelectedChannelLists" :key="obj.id" @click="addChannel(obj)">
          <div class="channel-item van-hairline--surround">{{obj.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { getAllChannelListAPI } from '@/api/home'
import { Toast } from 'vant'
export default {
  name: 'ChannelEdit',
  props: {
    userChannelLists: Array
  },
  data () {
    return {
      allChannelLists: [], // 所有文章列表
      isEdit: false // 控制编辑状态
    }
  },
  async created () {
    // 获取所有文章列表
    const res = await getAllChannelListAPI()
    // console.log(res)
    this.allChannelLists = res.data.data.channels
  },
  computed: {
    // 未选列表
    unSelectedChannelLists () {
      return this.allChannelLists.filter(obj => {
        // 但是不能用indexOf或includes检测（indexOf和includes只能检测基本类型）
        const equal = this.userChannelLists.some(item => {
          return obj.id === item.id
        })
        if (equal === true) {
          return false
        } else {
          return true
        }
      })
    }
  },
  methods: {
    // 添加频道
    addChannel (obj) {
      if (this.isEdit) {
        this.$emit('addChannelItem', obj)
      } else {
        Toast('编辑状态下才可添加')
      }
    },
    // 删除频道
    delChannel (index) {
      this.$emit('delChannelItem', index)
    },
    // 关闭弹层
    closeFn () {
      this.$emit('closePopup')
      // 重置弹层状态
      this.isEdit = false
    },
    // 进入频道
    enterChannel (id) {
      this.$emit('enterChannel', id)
    }

  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>
