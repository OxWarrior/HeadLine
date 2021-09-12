<template>
  <div id="hm-toutiao__container">
    <!-- keep-alive组件包裹动态挂载点 -->
    <keep-alive :exclude="['ResultList']">
      <router-view />

    </keep-alive>

  </div>
</template>

<script>

export default {

}
</script>

<style>
#hm-toutiao__container {
  height: 100px;
}
</style>
