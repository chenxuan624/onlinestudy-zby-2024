<template>
    <div class="app-container">
        讲师表单
        <el-form label-width="120px">
            <el-form-item label="讲师名称">
                <el-input v-model="teacher.name"/>
            </el-form-item>

            <el-form-item label="讲师排序">
                <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
            </el-form-item>

            <el-form-item label="讲师头衔">
                <el-select v-model="teacher.level" clearable placeholder="请选择">
                    <el-option :value="1" label="高级讲师"/>
                    <el-option :value="2" label="首席讲师"/>
                </el-select>
            </el-form-item>

            <!-- 讲师头像 -->
            <el-form-item label="讲师头像">
                <!-- 头衔缩略图 -->
                <pan-thumb :image="teacher.avatar"/>
                <!-- 文件上传按钮 -->
                <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>
                <!--
                    v-show：是否显示上传组件
                    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                    :url：后台上传的url地址
                    field: 将原本文件的名称改为file，格式改为png,预防中文并统一文件格式
                    @close：关闭上传组件
                    @crop-upload-success：上传成功后的回调
                -->
                <image-cropper
                    v-show="imagecropperShow"
                    :width="300"
                    :height="300"
                    :key="imagecropperKey"
                    :url="BASE_API+'/edu-oss/file-oss/uploadUserAvatar'"
                    field="file"
                    @close="close"
                    @crop-upload-success="cropSuccess"
                />
            </el-form-item>
            
            <el-form-item label="讲师资历">
                <el-input v-model="teacher.career"/>
            </el-form-item>
            <el-form-item label="讲师简介">
                <el-input v-model="teacher.intro" :rows="8" type="textarea"/>
            </el-form-item>

            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>

// 引用调用teacher.js
import teacherApi from '@/api/edu/teacher'

// 引入上传头像相关组件
import ImageCropper from '@/components/ImageCropper'

import PanThumb from '@/components/PanThumb'

export default {
    components: { ImageCropper, PanThumb}, // 组件声明
    data() {
        return {
            teacher: {
                name:'',
                sort: 0,
                level: 1,
                career: '',
                intro: '',
                avatar: 'https://onlinestudy-useravatar-biyunzou.oss-cn-hangzhou.aliyuncs.com/default/OnlineStudyAvatar.png'
            },
            saveBtnDisabled: false,  // 保存按钮是否禁用
            imagecropperShow: false, // 上传弹框组件是否显示
            imagecropperKey: 0, // 上传组件key的值
            BASE_API: process.env.BASE_API, // 获取dev.env.js中的地址


        }
    },
    created () { // 页面渲染之前执行,多次路由跳转到同一个页面，created方法则只执行一次
        this.init()
    },
    watch: { // 路由监听
        $route(to, from) { // 路由变化的方式，路由发生变化，此方法就会执行
            this.init()
        }
    },
    methods: {

        // 关闭上传弹框方法
        close() {
            this.imagecropperShow = false // 关闭弹窗
            this.imagecropperKey = this.imagecropperKey + 1 // 上传组件初始化
        },

        // 上传成功回显方法
        cropSuccess(data) {
            this.imagecropperShow = false, // 关闭弹窗
            // 上传之后返回的是图片的地址
            this.teacher.avatar = data.url,
            this.imagecropperKey = this.imagecropperKey + 1 // 上传组件初始化
        },


        init() {
            // 判断路径中是否有id值, 有则为修改
            if (this.$route.params && this.$route.params.id) {
                // 从路径中获得id值
                const id = this.$route.params.id
                // 调用方法
                this.getTeacherInfoById(id)
            } else { // 无则为添加，需清空teacher对象
                this.teacher = {sort: 0,level: 1,}
            }
        },

        // 根据讲师id查询的方法
        getTeacherInfoById(id) {
            teacherApi.getTeacherInfoByIdApi(id)
            .then(
                response => {
                    this.teacher = response.data.teacher
                }
            )
        },

        saveOrUpdate() {
            // 判断是修改还是添加
            if (!this.teacher.id) {
                // teacher对象中没有id则为添加
                this.saveTeacher()
            } else {
                // teacher对象中有id则为修改
                this.updateteacher()
            }
            
        },

        // 修改讲师方法
        updateteacher() {
            teacherApi.updateteacherApi(this.teacher)
            .then(
                response => { // 修改成功
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    })
                    // 回到列表，路由跳转,重定向
                    this.$router.push({path:'/teacher/teachers'})
                }
            )
        },

        // 添加讲师方法
        saveTeacher() {
            teacherApi.addTeacher(this.teacher)
            .then( 
                response => { // 添加成功
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    })
                    // 回到列表，路由跳转,重定向
                    this.$router.push({path:'/teacher/teachers'})
                }
            )
        },

    }
}
</script>
