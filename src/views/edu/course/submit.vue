<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <!--
        :active="3" 表示选中第三个步骤
     -->
    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交申请"/>
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublishCourseInfo.cover">
      <div class="main">
        <h2>{{ coursePublishCourseInfo.title }}</h2>
        <p class="gray"><span>共{{ coursePublishCourseInfo.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ coursePublishCourseInfo.subjectLevelOne }} — {{ coursePublishCourseInfo.subjectLevelTwo }}</span></p>
        <p>课程讲师：{{ coursePublishCourseInfo.teacherName }}</p>
      </div>
    </div>

    <div>
      <el-form label-width="120px">
        <el-form-item>
          <el-button @click="previous">返回修改</el-button>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="submit">提交申请</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>


<script>

import course from '@/api/edu/course'

export default {


  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '',
      coursePublishCourseInfo: {}
    }
  },
  created() {

    // 获取到路由当中的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id

      this.getCoursePublishInfo()
    }

  },
  methods: {

    // 发布课程
    submit() {

      this.$confirm('是否确认提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(
              () => {
                course.submitCourseInfo(this.courseId)
                    .then( response => {
                      // 提示信息
                      this.$message({
                        type: 'success',
                        message: '提交成功，请耐心等待审核!'
                      })

                      // 回到课程列表页面
                      this.$router.push({ path: '/course/courses' })
                    })
              }
          )


    },

    // 根据课程id查询课程发布信息
    getCoursePublishInfo() {
      course.getPublishCourseInfoById(this.courseId)
          .then( response => {
            this.coursePublishCourseInfo = response.data.coursePublishVO
          })
    },

    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/chapter/' + this.courseId})
    },

  }
}
</script>

<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #DDD;
  margin-bottom: 40px;
  position: relative;
}
.ccInfo img {
  background: #e0e0e0;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}
.ccInfo .main {
  margin-left: 520px;
}

.ccInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}
.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}
.ccInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>

