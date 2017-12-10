<template>
  <div id="wrap">
    <!-- 导航栏 -->
    <div class="menu-vertical">
      <el-menu 
        default-active="1" 
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1">
          <i class="el-icon-menu"></i>
          <span slot="title">统计</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 内容区域 -->
    <div id="content">
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'admin'
}
</script>

<style>
#wrap {
  overflow: hidden;
  height: 100%;
}
.menu-vertical {
  float: left;
  width: 200px;
  height: 100%;
}
.menu-vertical ul {
  height: 100%;
}
#content {
  overflow: hidden;
  height: 100%;
  padding: 20px;
}
</style>

