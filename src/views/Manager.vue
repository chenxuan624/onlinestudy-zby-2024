<template>
  <div>
    <el-container>
      <!--侧边栏-->
      <el-aside :width="asideWidth" style="min-height: 100vh;background-color: #c6dcc4">
        <div style="height: 50px;display: flex;align-items: center;justify-content: center;">
          <img src="@/assets/logo-zoubiyun.png" alt="" style="height: 50px">
        </div>
        <el-menu :collapse="isCollapsed" :collapse-transition="false" router
                 :default-active="$route.path" background-color="#c6dcc4">
          <el-menu-item  index="/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">系统首页</span>
          </el-menu-item>
          <el-submenu index="coursecenter" v-if="this.role === '教师'">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>
              <span>课程中心</span>
            </template>
            <el-menu-item index="/course/courses">我的课程</el-menu-item>
            <el-menu-item index="/course/courseInfo">添加课程</el-menu-item>
          </el-submenu>
          <el-submenu index="categorylist" v-if="this.role === '教师'">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>
              <span>课程分类</span>
            </template>
            <el-menu-item index="/course/categorylist">课程分类列表</el-menu-item>
            <el-menu-item index="/course/applycategory">申请新增分类</el-menu-item>
            <el-menu-item index="/course/mycategoryapply">我的分类申请</el-menu-item>
          </el-submenu>
          <el-submenu index="papercenter" v-if="this.role === '教师'">
            <template slot="title">
              <i class="el-icon-medal-1"></i>
              <span>试卷中心</span>
            </template>
            <el-menu-item index="/paper/papers">试卷管理</el-menu-item>
            <el-menu-item index="/paper/question">试题管理</el-menu-item>
            <el-menu-item index="/paper/examrecord">成绩记录</el-menu-item>
          </el-submenu>

          <el-submenu index="checker" v-if="this.role === '管理员'">
            <template slot="title">
              <i class="el-icon-reading"></i>
              <span>审核中心</span>
            </template>
            <el-menu-item index="/company/check/teacher">教师审核</el-menu-item>
            <el-menu-item index="/company/check/course">课程审核</el-menu-item>
            <el-menu-item index="/company/check/subject">分类审核</el-menu-item>
          </el-submenu>

          <el-submenu index="/company/HRD" v-if="this.role === '管理员'">
            <template slot="title">
              <i class="el-icon-office-building"></i>
              <span>人力资源部</span>
            </template>
            <el-menu-item index="/company/staff">我司员工</el-menu-item>
            <el-menu-item index="/company/teacher">教师列表</el-menu-item>
            <el-menu-item index="/company/addEmployee">添加员工</el-menu-item>
          </el-submenu>

          <el-menu-item  index="/company/boss" v-if="this.role === '管理员' && this.userInfo.role === 1">
            <i class="el-icon-s-custom"></i>
            <span slot="title">大BOSS</span>
          </el-menu-item>

          <el-menu-item  index="/message">
            <i class="el-icon-message"></i>
            <span slot="title">消息中心</span>
          </el-menu-item>

          <el-menu-item  index="/usercenter">
            <i class="el-icon-user"></i>
            <span slot="title">个人中心</span>
          </el-menu-item>
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
                <img :src="userInfo.avatar"
                     alt="" style="width: 40px; height: 40px">
                <span style="margin-left: 10px;">{{ this.role }}：{{this.userInfo.name}}</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

        </el-header>

        <!--主体区域-->
        <el-main>
          <div>
            <router-view/>
          </div>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Manager',
  data() {
    return {
      isCollapsed: false, // 不收缩
      asideWidth:'200px',
      collapseIcon:'el-icon-s-fold',
      userInfo:{},
      role:''
    }
  },

  created() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    this.role = localStorage.getItem("role")
  },

  methods: {

    handleCollapse() {
      this.isCollapsed = !this.isCollapsed
      this.asideWidth = this.isCollapsed ? '64px' : '200px'
      this.collapseIcon = this.isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    },

    logout(){
      localStorage.removeItem('token') // 清数据
      localStorage.removeItem('userInfo') // 清数据
      localStorage.removeItem('role') // 清数据
      this.$router.push('/login')

    },
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