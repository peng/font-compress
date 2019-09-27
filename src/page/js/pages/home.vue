<template>
  <div>
    <el-row>
      <el-col :span="4" >
        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <el-menu :collapse="isCollapse" default-active="1-1">
          <el-submenu index="1" >
            <el-menu-item index="1-1" >
              <i class="el-icon-document" ></i>
              <router-link to="/home/font" slot="title">字体</router-link>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" >
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less">
  
</style>

<script>
export default {
  name: 'home',
  data() {
    return {
      isCollapse: false
    };
  }
}
</script>