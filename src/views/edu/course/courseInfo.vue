<template>
    <div class="app-container">
        <h2 style="text-align: center;">发布新课程</h2>
        <!--
            :active="1" 表示选中第一个步骤
         -->
        <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息"/>
            <el-step title="创建课程大纲"/>
            <el-step title="最终发布"/>
        </el-steps>

        <el-form label-width="120px">

            <el-form-item label="课程标题" :rules="[{ required: true, message: '请输入课程标题', trigger: 'blur' }]">
                <el-input v-model="courseInfo.title" placeholder=" 示例：Java SE基础教学"/>
            </el-form-item>

            <!-- 课程分类 -->
            <!-- @change 框中的值改变了就会调用这个方法-->
            <el-form-item label="课程分类">
                <el-select
                    v-model="courseInfo.subjectParentId"
                    placeholder="一级分类" @change="subjectLevelOneChanged">
                    <el-option
                    v-for="subject in subjectOneList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
                </el-select>

                <el-select
                    v-model="courseInfo.subjectId"
                    placeholder="二级分类">
                    <el-option
                    v-for="subject in subjectTwoList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
                </el-select>
            </el-form-item>

            <!-- 课程简介  -->
            <el-form-item label="课程简介" :rules="[{ required: true, message: '请输入课程简介', trigger: 'blur' }]">
                <el-input v-model="courseInfo.description" :rows="6" type="textarea" placeholder=" "/>
            </el-form-item>

            <!-- 课程封面-->
            <el-form-item label="课程封面">
                <el-upload
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :action="BASE_API+'/edu-oss/file-oss'"
                    class="avatar-uploader">
                    <img
                    style="height: 200px; width: 300px;"
                     :src="courseInfo.cover">
                  <div slot="tip" class="el-upload__tip">点击图片更换封面,封面图比例尽量控制在3:2</div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>

import course from '@/api/edu/course'
import subject from '@/api/edu/subject'

export default {
    name:'CourseInfo',
    data() {
        return {
          userInfo:{},
          role:'',
            saveBtnDisabled: false, // 保存按钮是否禁用

            courseInfo: {
                title: '',
                subjectId: '',//二级分类id
                subjectParentId:'',//一级分类id
                teacherId: '',
                applicationStatus: 0,
                checkStatus: 0,
                lessonNum: 0,
                viewCount: 0,
                commentCount: 0,
                description: '',
                cover: 'https://onlinestudy-useravatar-biyunzou.oss-cn-hangzhou.aliyuncs.com/default/JavaCourseDefaultCover.png'
            },

            courseId: '',

            subjectOneList: [], // 一级分类集合

            subjectTwoList: [], // 二级分类集合

            BASE_API: 'http://localhost:8008', // 接口API地址
        }
    },
    created() {

      this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
      this.role = localStorage.getItem("role")

      this.init()

    },

    watch: { // 路由监听
        $route(to, from) { // 路由变化的方式，路由发生变化，此方法就会执行
            this.init()
        }
    },

    methods: {

        init() {
            // 获取到路由当中的id值
            if (this.$route.params && this.$route.params.id) { // 修改操作
                this.courseId = this.$route.params.id
                // 调用
                this.getInfo()
            } else { // 添加操作
                // 初始化一级分类
                this.getOneSubject()
                this.courseInfo.cover = 'https://onlinestudy-useravatar-biyunzou.oss-cn-hangzhou.aliyuncs.com/default/JavaCourseDefaultCover.png'
            }
        },

        // 根据课程id查寻信息
        getInfo() {
            course.getCourseInfoById(this.courseId)
                .then( response => {
                    this.courseInfo = response.data.courseInfoVO

                    // 要解决回显时二级分类不正常显示问题
                    // 1.查询出所有分类
                    subject.getAllSubjectTree()
                        .then(response => {
                            // 2.获取到所有一级分类
                            this.subjectOneList = response.data.list

                            // 3. 把所有的一级分类遍历，比较当前的courseInfo中的一级分类id和所有的一级分类进行比较
                            for( var i = 0; i < this.subjectOneList.length; i++) {
                                var oneSubject = this.subjectOneList[i]
                                if( this.courseInfo.subjectParentId == oneSubject.id ) {
                                    // 获取当前一级分类当中的所有二级分类
                                    this.subjectTwoList = oneSubject.children
                                }
                            }
                        })
                        // 初始化所有讲师
                        // this.getListTeacher()
                })
        },

        // 上传封面成功调用
        handleAvatarSuccess(res, file) {
            this.courseInfo.cover = res.data.url
        },

        // 上传封面之前，可以规定文件类型和文件大小
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt10M = file.size / 1024 / 1024 < 10

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt10M) {
                this.$message.error('上传头像图片大小不能超过 10MB!')
            }
            return isJPG && isLt10M
        },

        // 当选择了某一个一级分类后会触发此方法，目的时为了找到当前一级分类底下的二级分类
        subjectLevelOneChanged(value) { // value就是一级分类的ID值，是框架实现的
            // 遍历所有一级分类
            for(var i = 0; i < this.subjectOneList.length; i ++) {

                var oneSubject = this.subjectOneList[i]

                // 当前选框中的一级分类与所有分类进行对比
                if(value === oneSubject.id) {
                    this.subjectTwoList = oneSubject.children

                    // 清空上一次选择的二级分类
                    this.courseInfo.subjecId = ''
                }

            }
        },

        // 查询所有的一级分类
        getOneSubject() {
            subject.getAllSubjectTree()
                .then( response => {
                    this.subjectOneList = response.data.list
                })
        },

        // 添加课程
        addCourse() {
          this.courseInfo.teacherId = this.userInfo.id
          console.log(this.courseInfo)
            course.addCourseInfo(this.courseInfo)
                .then( response => {
                  if (response.success) {
                    // 提示信息
                    this.$message({
                      type: 'success',
                      message: '添加课程基础信息成功!'
                    })
                    // 跳转到第二步
                    this.$router.push({ path: '/course/chapter/' + response.data.courseId })
                  }else{
                    this.$message({
                      type: 'error',
                      message: response.message
                    })
                  }
                })
        },

        // 修改课程
        updateCourse() {
            course.updateCourseInfo(this.courseInfo)
                .then(response => {
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '修改课程基础信息成功!'
                    })
                    // 跳转到第二步
                    this.$router.push({ path: '/course/courses' })
                })
        },

        saveOrUpdate() {
          if (this.courseInfo.title === ''){
            this.$message.error("课程标题不能为空")
          }else if(this.courseInfo.subjectParentId === '' || this.courseInfo.subjectId === ''){
            this.$message.error("课程分类不能为空")
          }else if (this.courseInfo.description === ''){
            this.$message.error("课程简介不能为空")
          }else if (this.courseInfo.id) { // 有id,修改操作
             this.updateCourse()
          }else { // 无id，添加操作
                this.addCourse()
            }
        }
    }
}
</script>
