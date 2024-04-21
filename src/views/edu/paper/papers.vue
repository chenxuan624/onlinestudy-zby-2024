<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="paperQuery.papername" placeholder="试卷名称" />
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="paperQuery.status"
          clearable
          placeholder="试卷状态"
          style="width: 110px"
        >
          <el-option :value="1" label="启用" />
          <el-option :value="0" label="禁用" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="paperQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          style="width: 210px"
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="paperQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          style="width: 210px"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()"
        >查询</el-button
      >
      <el-button type="info" @click="resetData()">清空</el-button>
      <el-button
        type="success"
        icon="el-icon-edit"
        @click="dialogTableVisible = true"
        >添加</el-button
      >
    </el-form>

    <!-- 添加课程弹框开始 -->
    <el-dialog
      title="添加试卷"
      :visible.sync="dialogTableVisible"
      :before-close="cancel"
    >
      <el-form label-width="150px" :rules="rules">
        <el-form-item label="试卷名称" prop="papername">
          <el-input
            v-model="eduPaper.papername"
            placeholder=" 示例: 某课程考试，某章节测验"
          />
        </el-form-item>

        <el-form-item label="试卷状态" prop="status">
          <el-select v-model="eduPaper.status" clearable placeholder="试卷状态">
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="禁用" />
          </el-select>
        </el-form-item>

        
        <el-form-item label="课程所属课程与章节" prop="courseId">
          <el-select
            v-model="eduPaper.courseId"
            placeholder="试卷所属课程"
            @change="paperCourseChanged"
          >
            <el-option
              v-for="course in courseList"
              :key="course.id"
              :label="course.title"
              :value="course.id"
            />
          </el-select>

          <el-select
            v-model="eduPaper.chapterId"
            placeholder="试卷所属章节(可不选)"
          >
            <el-option
              v-for="chapter in chapterList"
              :key="chapter.id"
              :label="chapter.title"
              :value="chapter.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="考试时长(分钟)" prop="examDuration">
          <el-input v-model="eduPaper.examDuration" placeholder=" 示例: 100" />
        </el-form-item>

        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="info" @click="cancel"
            >取消</el-button
          >
          <el-button
            :disabled="saveBtnDisabled"
            type="primary"
            @click="saveOrUpdate"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加课程弹框结束 -->

    <!-- 表格 -->
    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        label="序号"
        width="50"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        prop="papername"
        label="试卷名称"
        width="160"
        header-align="center"
        align="center"
      />

      <el-table-column
        prop="courseTitle"
        label="所属课程"
        width="170"
        header-align="center"
      />
      <el-table-column
        prop="chapterTitle"
        label="所属章节(为空则为课程考试,否则为章节小测)"
        width="170"
        header-align="center"
      />

      <el-table-column
        prop="name"
        label="讲师"
        width="95"
        header-align="center"
        align="center"
      />

      <el-table-column
        label="状态"
        width="50"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? "启用" : "禁用" }}
        </template>
      </el-table-column>

      <el-table-column
        prop="examDuration"
        label="考试时长(分钟)"
        header-align="center"
        align="center"
      />

      <el-table-column
        prop="gmtCreate"
        label="添加时间"
        width="155"
        header-align="center"
        align="center"
      />

      <el-table-column
        label="操作"
        width="200"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="getPaperOne(scope.row.id)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
// 引用调用paper.js
import paperApi from "@/api/edu/paper";
import courseApi from "@/api/edu/course";
import chapterApi from "@/api/edu/chapter";

export default {
  // 定义变量初始值
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用,
      list: null, // 查询之后返回的结果放在这里
      page: 1, // 当前页
      limit: 10, // 每页记录数
      total: 0, // 总记录数
      paperQuery: {}, // 条件封装对象
      dialogTableVisible: false, // 添加弹框是否可见
      eduPaper: {
        papername: "",
        status: "",
        courseId: "",
        chapter: "",
        examDuration: "",
      }, // 添加试卷对象
      courseList: {},
      chapterList: {},
      flag: 0, // 参数校验，默认不通过，校验完后改为1
      /* rules: {
          papername: [{ required: true, message: "请填写试卷名!", trigger: "blur" }],
          status: [{ required: true, message: "请选择试卷状态!", trigger: "blur" },],
          courseId: [{ required: true, message: "请选择试卷所属课程!", trigger: "blur" }],
          examDuration: [{ required: true, message: "请设置考试时长!", trigger: "blur" },],
      }, */
    };
  },
  // 调用方法
  created() {
    // 调用
    this.getList();
    this.resetData();
    this.paperListCourse();
  },
  // 写具体方法
  methods: {
    // 判断必填项是否为空
    judgment() {
      if (this.eduPaper.papername == "") {
        this.$message({
          type: "warning",
          message: "请填写试卷名!",
        });
      } else if (this.eduPaper.status == "") {
        this.$message({
          type: "warning",
          message: "请选择试卷状态!",
        });
      } else if (this.eduPaper.courseId == "") {
        this.$message({
          type: "warning",
          message: "请选择试卷所属课程!",
        });
      } else if (
        this.eduPaper.examDuration == "" ||
        this.eduPaper.examDuration == "0"
      ) {
        this.$message({
          type: "warning",
          message: "请设置考试时长!",
        });
      } else {
        this.flag = 1;
      }
    },

    updatePaper() {
      paperApi.updatePaper(this.eduPaper).then((response) => {
        if (response.success) {
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          this.getList();
          this.eduPaper = {};
          this.dialogTableVisible = false;
        } else {
          this.$message({
            type: "error",
            message: "修改失败!",
          });
        }
      });
    },

    addPaper() {
      paperApi.addExamPaper(this.eduPaper).then((response) => {
        console.log(this.eduPaper);
        if (response.success) {
          this.$message({
            type: "success",
            message: "添加成功!",
          });
          this.getList();
          this.eduPaper = {};
          this.dialogTableVisible = false;
        } else {
          this.$message({
            type: "error",
            message: response.message,
          });
        }
      });
    },

    // 数据回显
    getPaperOne(paperId) {
      paperApi.getOnePaperById(paperId).then((response) => {
        this.eduPaper = response.data.paper;
        this.getChapterList(this.eduPaper.courseId);

        if (!this.eduPaper.chapterId == "") {
          this.getChapterTitleByChapterId(this.eduPaper.chapterId);
        }

        this.dialogTableVisible = true;
      });
    },

    cancel() {
      this.dialogTableVisible = false;
      this.eduPaper = {};
      this.chapterList = {};
    },

    saveOrUpdate() {
      this.judgment();
      if (this.flag == 1) {
        if (!this.eduPaper.id == "") {
          // 不为空则表示修改
          this.updatePaper();
        } else {
          this.addPaper(); // 添加
        }
      }
    },

    // 根据章节id查章节名
    getChapterTitleByChapterId(chapterId) {
      chapterApi.getChapterById(chapterId).then((response) => {
        console.log(this.chapterList);
        this.chapterList = {
          0: {
            id: chapterId,
            title: response.data.chapter.title,
          },
        };
      });
    },

    getCourseList(value) {
      courseApi.getCourseListByTeacherId(value).then((response) => {
        this.courseList = response.data.courseList;
      });
    },
    getChapterList(value) {
      chapterApi.getChapterListByCourseId(value).then((response) => {
        this.chapterList = response.data.chapterList;
      });
    },

    // 课程发生变化后，去查询该课程下的章节
    paperCourseChanged(value) {
      chapterApi.getChapterListByCourseId(value).then((response) => {
        this.chapterList = response.data.chapterList;
        this.eduPaper.chapterId = "";
      });
    },

    paperListCourse() {
      courseApi.getListCourseByStatus().then((response) => {
        this.courseList = response.data.list;
        console.log(response);
        console.log(response.data.list);
      });
    },

    // 试卷列表
    getList(page = 1) {
      this.page = page;
      paperApi.pagePaperCondition(this.page, this.limit, this.paperQuery).then(
        // 请求成功
        (response) => {
          // response接口返回的数据
          this.list = response.data.records;
          this.total = response.data.total;
        }
      );
    },
    resetData() {
      this.paperQuery = {};
      this.getList();
    },

    // 删除试卷方法
    removeDataById(id) {
      this.$confirm("此操作将永久删除该试卷及其试题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        paperApi.deletePaperById(id).then((response) => {
          // 删除成功
          // 提示信息
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          // 回到页面
          this.getList(this.page);
        });
      });
    },
  },
};
</script>
