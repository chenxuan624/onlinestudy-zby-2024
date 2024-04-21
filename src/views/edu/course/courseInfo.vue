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

            <el-form-item label="课程标题">
                <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
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

            <!-- 课程讲师 -->
            <el-form-item label="课程讲师">
                <el-select
                    v-model="courseInfo.teacherId"
                    placeholder="请选择">
                    <el-option
                    v-for="teacher in teacherList"
                    :key="teacher.id"
                    :label="teacher.name"
                    :value="teacher.id"/>
                </el-select>
            </el-form-item>


            <!-- <el-form-item label="总课时">
                <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placceholder="请填写课程的总课时数"/>
            </el-form-item> -->

            <!-- 课程简介  -->
            <el-form-item label="课程简介">
                <el-input v-model="courseInfo.description" :rows="6" type="textarea" placeholder=" "/>
            </el-form-item>

            <!-- 课程封面-->
            <el-form-item label="课程封面(比例尽量控制在2：3)">
                <el-upload
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :action="BASE_API+'/edu-oss/file-oss'"
                    class="avatar-uploader">
                    <img
                    style="height: 200px; width: 300px;"
                     :src="courseInfo.cover">
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
            saveBtnDisabled: false, // 保存按钮是否禁用

            courseInfo: {
                title: '',
                subjectId: '',//二级分类id
                subjectParentId:'',//一级分类id
                teacherId: '',
                lessonNum: 0,
                viewCount: 0,
                commentCount: 0,
                description: '',
                cover: 'https://onlinestudy-useravatar-biyunzou.oss-cn-hangzhou.aliyuncs.com/default/JavaCourseDefaultCover.png'
            },

            courseId: '',

            teacherList: [], // 封装所有的讲师

            subjectOneList: [], // 一级分类集合



            subjectTwoList: [], // 二级分类集合

            BASE_API: process.env.BASE_API, // 接口API地址
        }
    },
    created() {

        /* // 获取到路由当中的id值
        if (this.$route.params && this.$route.params.id) { // 修改操作
            this.courseId = this.$route.params.id

            // 调用
            this.getInfo()
        } else { // 添加操作
            // 初始化所有讲师
            this.getListTeacher()

            // 初始化一级分类
            this.getOneSubject()
        } */

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
                // 初始化所有讲师
                this.getListTeacher()

                // 初始化一级分类
                this.getOneSubject()

                this.courseInfo = {
                    cover: 'https://onlinestudy-useravatar-biyunzou.oss-cn-hangzhou.aliyuncs.com/default/JavaCourseDefaultCover.png',
                    lessonNum: 0,
                    viewCount: 0,
                    commentCount: 0
                }
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
                        this.getListTeacher()
                })
        },

        // 上传封面成功调用
        handleAvatarSuccess(res, file) {
            this.courseInfo.cover = res.data.url
        },

        // 上传封面之前，可以规定文件类型和文件大小
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2 // TODO 有bug

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
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

        // 查询所有讲师
        getListTeacher() {
            course.getAllTeacher()
                .then( response => {
                    this.teacherList = response.data.items
                })
        },

        // 添加课程
        addCourse() {
            course.addCourseInfo(this.courseInfo)
                .then( response => {

                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '添加课程基础信息成功!'
                    })
                    // 跳转到第二步
                    this.$router.push({ path: '/course/chapter/' + response.data.courseId })
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
            if (this.courseInfo.id) { // 有id,修改操作
                this.updateCourse()
            }else { // 无id，添加操作
                this.addCourse()
            }
        }
    }
}
</script>
