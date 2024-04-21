<template>
    <div class="app-container">
        <el-form label-width="120px">
            <el-form-item label="信息描述">
                <el-tag type="info">excel模版说明</el-tag>
                <el-tag>
                    <i class="el-icon-download"/>
                    <a :href="'https://onlinestudy-useravatar-biyunzou.oss-cn-hangzhou.aliyuncs.com/default/Subject.xlsx'">点击下载模版</a>
                </el-tag>
            </el-form-item>
                
            <el-form-item label="选择Excel">
                <!-- 
                    上传组件
                    ref  表示组件的唯一标识，类似于HTML中的id值
                    :auto-upload 是否自动上传
                    :on-success 上传成功调用的方法
                    :on-error 上传失败调用的方法
                    :disabled 是否能点第二次
                    :limit 每次上传的文件数量，文件限制
                    :action 后端接口地址
                    name 将原本文件的名称改为file
                    accept 能接受的文件的格式 accept="application/vnd.ms-excel">
                -->
                <el-upload
                    ref="upload"
                    :auto-upload="false"
                    :on-success="fileUploadSuccess"
                    :on-error="fileUploadError"
                    :disabled="importBtnDisabled"
                    :limit="1"
                    :action="BASE_API+'/eduservice/edu-subject/addSubject'"
                    name="file"
                    accept="application/vnd.ms-excel">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

                    <el-button
                        :loading="loading"
                        style="margin-left: 10px;"
                        size="small"
                        type="success"
                        @click="submitUpload">上传到服务器
                    </el-button>
                </el-upload>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {

    data() {
        return {
            BASE_API: process.env.BASE_API, // 接口API地址
            importBtnDisabled: false, // 按钮是否禁用,
            loading: false
        }
    },

    created () {
        
    },

    methods: {
        // 点击“上传到服务器”按钮上传文件到接口中
        submitUpload() {
            this.importBtnDisabled = true
            this.loading = true
            this.$refs.upload.submit()
        },
        // 上传成功之后操作的方法
        fileUploadSuccess(response) {
            // 提示上传成功
            this.loading = false
            this.$message({
                type: 'success',
                message: '添加课程分类成功!'
            })

            // 跳转课程分类列表,路由跳转
            this.$router.push({ path:'/subject/subjects' })
        },

        // 上传失败之后操作的方法
        fileUploadError() {
            // 提示失败信息
            this.loading = false
            this.$message({
                type: 'error',
                message: '添加课程分类失败，请检查...'
            })

            // 留在当前页面

        }

    }

}
</script>