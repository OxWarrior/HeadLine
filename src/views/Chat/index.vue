<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(obj,index) in list" :key="index">
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left" v-if="obj.name === 'xs'">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{obj.msg}}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-if="obj.name === 'me'">
          <div class="chat-pao">{{obj.msg}}</div>
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field placeholder="说点什么..." v-model="value">
        <template #button>
          <span style="font-size:12px;color:#999" @click="sendMessage">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'

// 表示连接状态
var socket = null

// 服务端
// socket.emit 表示触发某个事件  ---- 给浏览器发送数据
// socket.on 表示注册某个事件  --- 获取浏览器的数据

// socket.on('事件名任意'，data => { 获取到的数据 }) - 接收服务器返回数据

// 浏览器
// socket.emit('服务端注册事件名',{})

export default {
  name: 'Chat',
  data () {
    return {
      value: '', // 输入框内容
      list: [
        { name: 'xs', msg: 'Hi，我是小思，我能帮你什么呢' }
        // { name: 'me', msg: '我是编程小王子，我要找老板加薪' }
      ]
    }
  },
  created () {
    socket = io('http://toutiao.itheima.net', {
      query: {
        token: this.$store.state.user.token
      },
      transports: ['websocket'] // ?
    })
    // 监听连接服务端
    socket.on('connect', () => {
      console.log('连接服务端WebSocket成功')
    })
    // 监听服务端消息(接收消息)
    socket.on('message', (data) => {
      console.log(data.msg)
      this.list.push({
        name: 'xs',
        msg: data.msg
      })
    })
  },
  // 关闭连接, 清空socket
  beforeDestroy () {
    // 关闭连接
    socket.close()

    // 销毁 websocket 实例对象
    socket = null
  },
  methods: {
    // 发送信息给后台
    sendMessage () {
      // 将消息传给后台，message为后台设置字段
      socket.emit('message', {
        msg: this.value,
        timestamp: new Date().getTime()
      })

      this.list.push({
        name: 'me',
        msg: this.value
      })
      this.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        // &表示嵌套层次中回溯上一层，表示串联选择器，否则是后代
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
