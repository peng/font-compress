<template>
  <div id="root">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
#root {
  width: 100%;
  height: 100%;
  min-width: 800px;
}
</style>

<script>
export default {
  name: "App",
  mounted() {
    this.$router.push("/home/font");
    // this.$router.push('/admin');
  }
};
</script>