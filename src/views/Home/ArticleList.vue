<template>
  <div>
    <ArticleItem v-for="(obj,index) in articleList" :key="obj.art_id" :obj="obj" @dislikeArt="dislikeArt" :index="index" showCross></ArticleItem>

  </div>
</template>

<script>
// import { Notify } from 'vant'
// import ArticleItem from '@/components/ArticleItem'

export default {
  name: 'ArticleList',
  // components: {
  //   ArticleItem
  // },
  props: {
    articleList: Array
  },
  data () {
    return {

    }
  },
  methods: {
    dislikeArt (index, height) {
      this.$emit('dislikeArt', index, height)
    }
  }

}
</script>

<style>
</style>
