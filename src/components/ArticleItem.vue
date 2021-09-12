<template>
  <div id="cell">
    <!-- 一条文章单元格 -->
    <van-cell @click="$router.push(`/article?id=${obj.art_id}`)">
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{obj.title}}</span>
          <!-- 单图 -->
          <img class="thumb" v-lazy="obj.cover.images[0]" v-if="obj.cover.type === 1" />
        </div>
        <!-- 多张图片 -->
        <div class="thumb-box" v-if="obj.cover.type > 1">
          <img class="thumb" v-for="(item,index) in obj.cover.images" :key="index" v-lazy="item" />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>作者{{obj.aut_name}}</span>
            <span>{{obj.comm_count}}评论</span>
            <span>发布日期 {{obj.pubdate}}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="actionFn" v-if="showCross"/>
          <!-- 一级反馈面板 -->
          <van-action-sheet v-model="showFirst" :actions="actions" :cancel-text="cancelText" close-on-click-action @cancel="onCancel" get-container="body" @select="onSelect" />
          <!-- get-container 调整挂载点到body -->
          <!-- 二级反馈面板 -->
          <van-action-sheet v-model="showSecond" :actions="actions" :cancel-text="cancelText" close-on-click-action @cancel="onCancel" get-container="body" @select="onSelect" />
          <!-- 其他问题反馈 -->
          <van-dialog v-model="showThird" title="其他问题反馈" show-cancel-button get-container="body" :beforeClose="beforeCloseFn" v-focus>
            <van-field type="textarea" placeholder="其他问题" v-model="msg"></van-field>
          </van-dialog>
        </div>
      </template>

    </van-cell>
    <!-- <van-action-sheet v-model="show" :actions="actions" @select="onSelect" get-container="body" cancel-text="取消"/> -->
  </div>

</template>

<script>
import { Toast } from 'vant'
import { firstActions, secondActions } from '@/constant'
import { dislikeArticleAPI, reportArticleAPI } from '@/api/home'
export default {
  name: 'ArticleItem',
  props: {
    obj: Object,
    index: Number,
    // 属性控制，默认false，传则为true
    showCross: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showFirst: false, // 一级面板显示控制
      showSecond: false, // 二级面板显示控制
      actions: firstActions, // 面板选项列表
      cancelText: '取消',
      showThird: false, // 弹窗显示
      msg: ''
    }
  },
  methods: {
    // 几年前时间转换原生js
    // getTimeAgo (pubDate) {
    //   const difTime = new Date() - new Date(pubDate)
    //   // console.log(a)
    //   // console.log(parseInt(a / 1000 / 60 / 60 / 24 / 30 / 12))
    //   return parseInt(difTime / 1000 / 60 / 60 / 24 / 30 / 12)
    // },
    // 点击取消按钮时触发
    onCancel () {
      Toast('取消')
    },
    // 点击反馈按钮显示弹出层
    actionFn () {
      this.showFirst = true
    },
    // 选择不同的反馈
    async onSelect (action) {
      // action数组中对象 , index索引
      const { id, name } = action
      if (id === 22) {
        // 反馈垃圾内容 => 二级action
        this.actions = secondActions
        this.showSecond = true
        // 修改底部文字
        this.cancelText = '返回'
      } else if (id === 11) { // 不感兴趣
        // 通知后台删除
        // 反馈不感兴趣
        try {
          await dislikeArticleAPI({ id: this.obj.art_id })

          // vue变量中删除
          const cellHeight = document.getElementById('cell').clientHeight
          this.$emit('dislikeArt', this.index, cellHeight)

          Toast.success('反馈成功')
        } catch (err) {
          Toast.success('反馈错误')
        } finally {
          this.showFirst = false
        }
      } else if (id === 33) {

      } else {
        if (id === 0) {
          this.showThird = true
        } else {
          try {
            await reportArticleAPI({
              target: this.obj.art_id,
              type: id + '',
              remark: name
            })
            Toast.success('反馈成功')
          } catch (err) {
            Toast.fail('反馈错误')
          }
        }
      }
    },
    // 反馈其他内容发送请求
    async beforeCloseFn (action, done) {
      // console.log(action, done)
      // action 表示动作 confirm，cancel
      // done调用 done() 后关闭弹窗，调用 done(false) 阻止弹窗关闭
      if (action === 'confirm') { // 确认
        if (this.msg.length === 0) { // 判断输入框值
          Toast('请输入内容')
          done(false)
        } else {
          try {
            await reportArticleAPI({
              target: this.obj.art_id,
              type: '0',
              remark: this.msg
            })
            this.showThird = false
            Toast.success('举报成功')
          } catch (err) {
            Toast.fail('举报错误')
          }
        }
      } else {
        done()
      }
    }
  }
}

</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
