<template>
    <div class="app-container">
        <h2 style="text-align: center;">发布新课程</h2>
        <!--
            :active="2" 表示选中第二个步骤
         -->
        <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 20px;">
            <el-step title="填写课程基本信息"/>
            <el-step title="创建课程大纲"/>
            <el-step title="提交申请"/>
        </el-steps>

        <el-button type="text" @click="openChapterDialog()" class="addChapter">添加章节</el-button>

        <ul class="chapterList">
            <li style="list-style-type:none" v-for="chapter in chapterVideoList" :key="chapter.id">
                <p>
                    {{chapter.sort}} : {{ chapter.title }}

                    <span class="acts">
                        <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                        <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                        <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                    </span>
                </p>
                <ul class="chanterList videoList">
                    <li style="list-style-type:none" v-for="video in chapter.children" :key="video.id">
                        <p>
                            {{video.sort}}:{{ video.title }}

                            <span class="acts">
                                <el-button style="" type="text" @click="openEditVideo(video.id)">编辑</el-button>
                                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                            </span>
                        </p>
                    </li>
                </ul>
            </li>
        </ul>

        <div>
            <el-button @click="previous">上一步</el-button>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
        </div>


        <!-- 添加和修改章节表单 -->
        <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
            <el-form :model="chapter" label-width="120px">
                <el-form-item label="章节标题">
                    <el-input v-model="chapter.title"/>
                </el-form-item>
                <el-form-item label="章节排序">
                    <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
            </div>

        </el-dialog>

        <!-- 添加和修改课时表单 -->
        <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
            <el-form :model="video" label-width="120px">
                <el-form-item label="课时标题">
                <el-input v-model="video.title"/>
                </el-form-item>
                <el-form-item label="课时排序">
                <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
                </el-form-item>

                <el-form-item label="上传视频">

                    <el-upload
                        :on-success="handleVodUploadSuccess"
                        :on-remove="handleVodRemove"
                        :before-remove="beforeVodRemove"
                        :on-exceed="handleUploadExceed"
                        :file-list="fileList"
                        :action="BASE_API+'/edu-vod/video/uploadAliyunVideo'"
                        :limit="1"
                        class="upload-demo">
                        <el-button size="small" type="primary">上传视频</el-button>
                        <div slot="tip" class="el-upload__tip">当出现绿色小勾时才代表上传完成</div>
                        <el-tooltip placement="right-end">
                        <div slot="content">单次只允许上传一个视频，最大支持2G，<br>
                            支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                            GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                            MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                            SWF、TS、VOB、WMV、WEBM 等视频格式上传
                        </div>
                        <i class="el-icon-question"/>
                        </el-tooltip>
                    </el-upload>

                </el-form-item>

                <el-form-item label="上传课件">
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
                    accept 能接受的文件的格式
                -->
                <el-upload
                    ref="upload"
                    :auto-upload="false"
                    :on-success="fileUploadSuccess"
                    :on-error="fileUploadError"
                    :disabled="importBtnDisabled"
                    :limit="1"
                    :action="BASE_API+'/edu-oss/file-oss/material'"
                    accept=".doc, .docx, .xls, .xlsx, .pdf, .ppt, .pptx">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <div slot="tip" class="el-upload__tip">只接受.doc/.docx/.xls/.xlsx/.pdf/.ppt/.pptx文件</div>
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

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
                <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>


<script>

import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'

export default {

    data() {
        return {
            saveBtnDisabled: false, // 保存按钮是否禁用
            courseId: '', // 课程id初始值
            chapterVideoList:[],
            chapter: { // 封装章节数据
                title: '',
                sort: 0
            },
            video: {
                title: '',
                sort: 0,
                videoSourceId: '',
                videoOriginalName:'', // 上传视频的原始名称
                materialPath:'',
                materialOriginalName:''

            },
            dialogChapterFormVisible: false, // 表示章节弹窗是否可见
            dialogVideoFormVisible: false, // 表示小节弹窗是否可见

            fileList:[], //文件列表
            BASE_API: process.env.BASE_API,

            importBtnDisabled: false, // 按钮是否禁用,
            loading: false,
            material:''

        }
    },

    created() {
        // 获取到路由当中的id值
        if (this.$route.params && this.$route.params.id) {
            this.courseId = this.$route.params.id
        }

        this.getChapterVideo()
    },

    methods: {

        // 点击“上传到服务器”按钮上传文件到接口中
        submitUpload() {
            this.importBtnDisabled = true
            this.loading = true
            this.$refs.upload.submit()
        },

        // 上传成功之后操作的方法
        fileUploadSuccess(response,file) {

            this.material = response.data.url
            this.video.materialPath = response.data.url

            console.log(file.name);

            // 上传之后的视频名称
            this.video.materialOriginalName = file.name

            // 提示上传成功
            this.loading = false
            this.$message({
                type: 'success',
                message: '课程资料上传成功!'
            })


        },

        // 上传失败之后操作的方法
        fileUploadError() {
            // 提示失败信息
            this.loading = false
            this.$message({
                type: 'error',
                message: '课程资料上传失败，请检查...'
            })

            // 留在当前页面

        },


        // 上传视频成功调用的方法
        handleVodUploadSuccess(response, file, fileList) {
            // 上传之后的视频id赋值
            this.video.videoSourceId = response.data.videoId

            // 上传之后的视频名称
            this.video.videoOriginalName = file.name

        },

        // 上传视频之前调用的方法
        handleUploadExceed() {
            this.$message.warning('想要重新上传视频，请先删除原有视频')
        },

        // 删除上传视频调用的方法
        handleVodRemove(file,fileList) {
             // 调用接口根据视频id删除阿里云里面的视频
             video.deleteAliyunVideo(this.video.videoSourceId)
                .then( response => {
                    // 刷新文件列表
                    this.fileList = []
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '删除视频成功!'
                    })

                    // 清空视频id，视频名称
                    this.video.videoSourceId = ''
                    this.video.videoOriginalName = ''

                })
        },

        // 删除上传视频之前调用的方法
        beforeVodRemove(file,fileList) {
            return this.$confirm(`确定移除 ${file.name} 吗？`)

        },

        // 添加小节弹框
        openVideo(chapterId) {
            // 弹框可见
            this.dialogVideoFormVisible = true

            // 清空表单
            this.video = {
                title: '',
                sort: 0,
                videoSourceId: ''
            }

            this.fileList = []

            // 设置章节id
            this.video.chapterId = chapterId

            // 设置课程id
            this.video.courseId = this.courseId

        },

        // 添加小节
        addVideo(){
            video.addVideo(this.video)
                .then( response => {
                  if (response.success) {
                    // 关闭弹窗
                    this.dialogVideoFormVisible = false
                    // 提示信息
                    this.$message({
                      type: 'success',
                      message: '添加课程小节成功!'
                    })
                    // 刷新页面
                    this.getChapterVideo()
                  }else {
                    this.$message({
                      type: 'error',
                      message: response.message
                    })
                  }
                })
        },

        // 弹窗数据回显
        openEditVideo(videoId) {
            // 开启弹窗
            this.dialogVideoFormVisible = true
            // 调用回显接口
            video.getVideoById(videoId)
                .then( response => {
                    this.video = response.data.video
                })
        },

        updateVideo() {
            video.updateVideo(this.video)
                .then( response => {
                  if (response.success) {
                    // 关闭弹窗
                    this.dialogVideoFormVisible = false
                    // 提示信息
                    this.$message({
                      type: 'success',
                      message: '修改课程章节成功!'
                    })
                    // 刷新页面
                    this.getChapterVideo()
                  }else {
                    this.$message({
                      type: 'error',
                      message: response.message
                    })
                  }

                })
        },

        saveOrUpdateVideo() {
            if (!this.video.id) {
                this.addVideo()
            } else {
                this.updateVideo()
            }
        },


        // 删除小节
        removeVideo(videoId) {
            this.$confirm('此操作将删除该小节及其关联视频, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(
                () => {
                    video.deleteVideo(videoId)
                        .then(
                            response => { // 删除成功
                                // 提示信息
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                                // 刷新页面
                                this.getChapterVideo()
                            }
                        )
                }
            )
        },


        // 弹出添加章节窗口
        openChapterDialog(){
            this.dialogChapterFormVisible = true
            // 清空表单
            this.chapter.title = ''
            this.chapter.sort = 0
        },

        // 添加章节
        addChapter() {
            this.chapter.courseId = this.courseId // 设置课程id到chapter中
            chapter.addChapter(this.chapter)
                .then( response => {
                  if (response.success) {
                    // 关闭弹窗
                    this.dialogChapterFormVisible = false
                    // 提示信息
                    this.$message({
                      type: 'success',
                      message: '添加课程章节成功!'
                    })
                    // 刷新页面
                    this.getChapterVideo()
                  }
                  else {
                    this.$message({
                      type: 'error',
                      message: response.message
                    })
                  }

                })
        },

        // 弹窗数据回显
        openEditChapter(chapterId) {
            // 开启弹窗
            this.dialogChapterFormVisible = true
            // 调用回显接口
            chapter.getChapterById(chapterId)
                .then( response => {
                    this.chapter = response.data.chapter
                })
        },

        // 修改章节
        updateChapter() {
            chapter.updateChapter(this.chapter)
                .then( response => {
                  if (response.success){
                    // 关闭弹窗
                    this.dialogChapterFormVisible = false
                    // 提示信息
                    this.$message({
                      type: 'success',
                      message: '修改课程章节成功!'
                    })
                    // 刷新页面
                    this.getChapterVideo()
                  }else{
                    this.$message({
                      type: 'error',
                      message: response.message
                    })
                  }

                })
        },

        // 删除章节
        removeChapter(chapterId) {
            this.$confirm('此操作将删除该章节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(
                () => {
                    chapter.deleteChapter(chapterId)
                        .then(
                            response => { // 删除成功
                                // 提示信息
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                                // 刷新页面
                                this.getChapterVideo()
                            }
                        )
                }
            )
        },

        // 确定保存按钮事件
        saveOrUpdate() {
            if (!this.chapter.id) {
                this.addChapter()
            } else {
                this.updateChapter()
            }

        },

        // 根据课程id得到该课程的章节和小节
        getChapterVideo() {
            chapter.getAllChapterVideo(this.courseId)
                .then(response => {
                    this.chapterVideoList = response.data.allChapterVideo
                })
        },

        previous() {
            console.log('previous')
            this.$router.push({ path: '/course/courseInfo/' + this.courseId })
        },

        next() {
            console.log('next')
            this.$router.push({ path: '/course/submit/' + this.courseId })
        }
    }
}
</script>

<style scoped>

.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}

.addChapter{
    font-size: 18px;
}

.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 25px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
    float: right;
    font-size: 16px;
}

.videoList{
  padding-left: 30px;
}
.videoList p{
  float: left;
  font-size: 16px;
  margin: 10px 0;
  padding: 10px;
  height: 35px;
  line-height: 15px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
