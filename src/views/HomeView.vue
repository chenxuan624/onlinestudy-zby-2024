<template>
  <div>
    <el-container>
    <!--侧边栏-->
      <el-aside :width="asideWidth" style="min-height: 100vh;background-color: #c6dcc4">
        <div style="height: 50px;display: flex;align-items: center;justify-content: center;">
          <img src="@/assets/logo-zoubiyun.png" alt="" style="height: 50px">
        </div>
        <el-menu :collapse="isCollapsed" :collapse-transition="false" router :default-active="$route.path" background-color="#c6dcc4">
          <el-menu-item  index="/">
            <i class="el-icon-house"></i>
            <span slot="title">系统首页</span>
          </el-menu-item>
          <el-submenu>
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>系统首页</span>
            </template>
            <el-menu-item index="/">个人中心</el-menu-item>
          </el-submenu>
          <el-submenu>
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>课程中心</span>
            </template>
            <el-menu-item index="/courses">我的课程</el-menu-item>
            <el-menu-item>添加课程</el-menu-item>
          </el-submenu>
          <el-submenu>
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>课程分类</span>
            </template>
            <el-menu-item>课程分类列表</el-menu-item>
            <el-menu-item>申请新增分类</el-menu-item>
            <el-menu-item>我的分类申请</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <!--头部区域-->
        <el-header>
          <i :class="collapseIcon" style="font-size: 26px; margin-top: 10px" @click="handleCollapse"></i>
          <el-breadcrumb separtor-class="el-icon-arrow-right" style="margin-left: 20px">
            <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/course'}">课程中心</el-breadcrumb-item>
          </el-breadcrumb>

          <div style="flex: 1;width: 0; display: flex;align-items: center; justify-content: flex-end">
            <el-dropdown placement="bottom">
              <div style="display: flex;align-items: center; cursor: default">
                <img src="https://onlinestudy-useravatar-biyunzou.oss-cn-hangzhou.aliyuncs.com/avatar/2024/04/12/2d57bbe9135e4676abc51c7dc1381f811681557739736.jpg"
                     alt="" style="width: 40px; height: 40px">
                <span style="margin-left: 10px;">管理员</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

        </el-header>

        <!--主体区域-->
        <el-main>

        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      isCollapsed: false, // 不收缩
      asideWidth:'200px',
      collapseIcon:'el-icon-s-fold'
    }
  },

  methods: {
    handleCollapse() {
      console.log(123)
      this.isCollapsed = !this.isCollapsed
      this.asideWidth = this.isCollapsed ? '64px' : '200px'
      this.collapseIcon = this.isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    }
  }
}
</script>

<style>
.el-menu--inline .el-menu-item {
  background-color: #b6d9b4 !important;
}

.el-menu-item.is-active {
  background-color: #97c093 !important;
}

.el-menu-item {
  margin: 4px !important;
  height: 50px !important;
  line-height: 50px !important;
}

.el-submenu__title {
  height: 45px !important;
  line-height: 45px !important;
}

.el-header {
  box-shadow: 2px 0 6px rgba(0,21,41,.35);
  display: flex;
  align-items: center;
}


</style>