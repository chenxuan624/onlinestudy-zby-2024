<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input
          v-model="paperQuestionQuery.papername"
          placeholder="试卷名称"
          style="width: 160px"
        />
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="paperQuestionQuery.questionName"
          placeholder="试题名称"
          style="width: 160px"
        />
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="paperQuestionQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          style="width: 190px"
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="paperQuestionQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          style="width: 190px"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getPageList()"
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

    <!-- 添加试卷弹框开始 -->
    <el-dialog
      title="添加试题"
      :visible.sync="dialogTableVisible"
      :before-close="cancel"
      width="720px"
    >
      <el-form
        class="detail-form-content"
        ref="paperQuestion"
        :model="paperQuestion"
        :rules="rules"
        label-width="80px"
      >
        <!-- @change 框中的值改变了就会调用这个方法-->
        <el-form-item label="选择试卷">
          <el-select
            v-model="paperQuestion.paperId"
            placeholder="请选择试卷"
            @change="paperChanged"
          >
            <el-option
              v-for="paper in paperList"
              :key="paper.id"
              :label="paper.papername"
              :value="paper.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="试题名称" prop="questionName">
          <el-input
            style="width: 600px"
            type="textarea"
            min="1"
            v-model="paperQuestion.questionName"
            placeholder="试题名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            @change="typeChange"
            v-model="paperQuestion.type"
            placeholder="类型"
          >
            <el-option label="单选题" value="0"></el-option>
            <el-option label="多选题" value="1"></el-option>
            <el-option label="判断题" value="2"></el-option>
            <el-option label="填空题" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="paperQuestion.type != 3 && paperQuestion.type != 2"
          label="选项"
          prop="options"
        >
          <div
            class="options"
            v-for="(item, index) in options"
            v-bind:key="index"
          >
            {{ item.text }}
            <el-button
              size="mini"
              @click="deleteOptions(index)"
              type="warning"
              round
              >删除</el-button
            >
          </div>
          <el-button size="small" @click="addOptionsDialog" type="primary" round
            >添加选项</el-button
          >
        </el-form-item>
        <el-form-item
          v-if="paperQuestion.type == 0 && options.length > 0"
          label="答案"
          prop="answer"
        >
          <el-select v-model="paperQuestion.answer">
            <el-option
              :label="item.code"
              :value="item.code"
              v-for="(item, index) in options"
              v-bind:key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="paperQuestion.type == 1 && options.length > 0"
          label="答案"
          prop="answer"
        >
          <el-select v-model="paperQuestion.answer" multiple>
            <el-option
              :label="item.code"
              :value="item.code"
              v-for="(item, index) in options"
              v-bind:key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="paperQuestion.type == 2 && options.length > 0"
          label="答案"
          prop="answer"
        >
          <el-select v-model="paperQuestion.answer">
            <el-option
              :label="item.text"
              :value="item.code"
              v-for="(item, index) in options"
              v-bind:key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="paperQuestion.type == 3" label="答案" prop="answer">
          <el-input
            v-model="paperQuestion.answer"
            placeholder="答案"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-input-number
            v-model="paperQuestion.score"
            :min="1"
            :max="100"
            label="分数"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="分析" prop="analysis">
          <el-input
            style="width: 600px"
            type="textarea"
            min="1"
            v-model="paperQuestion.analysis"
            placeholder="分析"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="题号" prop="sort">
          <el-input-number
            v-model="paperQuestion.sort"
            :min="1"
            :max="20"
            label="题号"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveOrUpdate">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        title="添加选项"
        :visible.sync="addOptionsDialogVisible"
        width="50%"
      >
        <el-form
          ref="dialogForm"
          :model="dialogForm"
          :rules="dialogRules"
          label-width="80px"
        >
          <el-form-item label="选项" prop="code">
            <el-select v-model="dialogForm.code" placeholder="选项">
              <el-option label="A" value="A"></el-option>
              <el-option label="B" value="B"></el-option>
              <el-option label="C" value="C"></el-option>
              <el-option label="D" value="D"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容" prop="text">
            <el-input
              type="textarea"
              min="1"
              v-model="dialogForm.text"
              placeholder="内容"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addOptionsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOptions">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <!-- 添加试卷弹框结束 -->

    <!-- 表格 -->
    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="50" text-align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column  prop="papername" label="试卷名称" width="150" header-align="center" align="center"/>

      <el-table-column prop="courseTitle" label="所属课程/章节" width="150" header-align="center" align="center"/>

      <el-table-column prop="chapterTitle" label="所属课程/章节" width="150" header-align="center" align="center"/>

      <el-table-column prop="teacherName" label="讲师" width="85" header-align="center" align="center"/>

      <el-table-column prop="questionName" label="试题名称" header-align="center" align="center"/>

      <el-table-column prop="sort" label="题号" width="50" header-align="center" align="center"/>

      <el-table-column prop="type" label="类型" width="80" header-align="center" align="center">
        <template slot-scope="scope">
              <el-tag v-if="scope.row.type==0">单选题</el-tag>
              <el-tag v-if="scope.row.type==1" type="info">多选题</el-tag>
              <el-tag v-if="scope.row.type==2" type="success">判断题</el-tag>
              <el-tag v-if="scope.row.type==3" type="warning">填空题</el-tag>
            </template>
      </el-table-column>

      <el-table-column prop="score" label="分值" width="50" header-align="center" align="center"/>

      <el-table-column prop="answer" label="答案" width="100" header-align="center" align="center"/>

      <el-table-column label="操作" width="200" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="getPaperQuestionOne(scope.row.id)"
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
      @current-change="getPageList"
    />
  </div>
</template>
  
  <script>
// 引用调用paper.js
import paperQuestionApi from "@/api/edu/paperQuestion";
import paperApi from "@/api/edu/paper";
import courseApi from "@/api/edu/course";
import chapterApi from "@/api/edu/chapter";

export default {
  // 定义变量初始值
  data() {
    return {
      dialogRules: {
        text: [{ required: true, message: "请填写内容", trigger: "blur" }],
        code: [{ required: true, message: "请选择选项", trigger: "blur" }],
      },
      rules: {
        paperId: [{ required: true, message: "请选择试卷", trigger: "blur" }],
        questionName: [
          { required: true, message: "试题名称不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择试题类型", trigger: "blur" }],
        sort: [{ required: true, message: "题号不能为空", trigger: "blur" }],
        analysis: [
          { required: true, message: "分析不能为空", trigger: "blur" },
        ],
        score: [{ required: true, message: "分数不能为空", trigger: "blur" }],
      },
      saveBtnDisabled: false, // 保存按钮是否禁用,
      list: null, // 查询之后返回的结果放在这里
      page: 1, // 当前页
      limit: 10, // 每页记录数
      total: 0, // 总记录数
      paperQuestionQuery: {}, // 条件封装对象
      dialogTableVisible: false, // 添加弹框是否可见
      addOptionsDialogVisible: false,
      options: [],
      paperOptions: [],
      paperList: {},
      dialogForm: {},
      paperQuestion: {
        paperId: "", //试卷id
        questionName: "",
        sort: 0,
        type: "",
        score: 0,
        answer: "",
        analysis: "",
      }, // 添加试卷对象
      teacherList: {},
      courseList: {},
      flag: 0, // 参数校验，默认不通过，校验完后改为1
    };
  },
  // 调用方法
  created() {
    // 调用
    this.getPageList();
    this.resetData();
    this.getListPaper();
  },
  // 写具体方法
  methods: {
    onPaperChange(e) {
      for (let item of this.paperList) {
        if (item.id == e) {
          this.paperQuestion.paperName = item.name;
        }
      }
    },

    paperChanged(value) {
      for (let item of this.paperList) {
        if (item.id == value) {
          this.paperQuestion.paperName = item.name;
        }
      }
    },

    typeChange(e) {
      console.log(e);
      if (e == 2) {
        this.options = [];
        this.options.push({
          text: "A.对",
          code: "A",
        });
        this.options.push({
          text: "B.错",
          code: "B",
        });
      } else {
        this.options = [];
      }
    },

    addOptionsDialog() {
      this.addOptionsDialogVisible = !this.addOptionsDialogVisible;
    },

    judgment() {
      if (!this.options && this.type != 3) {
        this.$message.error("请设置选项");
        return;
      }
      if (this.paperQuestion.type == 1) {
        this.paperQuestion.answer = this.paperQuestion.answer.join(","); // 多选题，将答案进行拼接
      }
      this.paperQuestion.options = JSON.stringify(this.options); // 将实体类型json化为string
    },

    onSubmit() {
      console.log(this.paperQuestion.answer);
      // return;
      if (!this.options && this.type != 3) {
        this.$message.error("请设置选项");
        return;
      }
      if (this.paperQuestion.type == 1) {
        this.paperQuestion.answer = this.paperQuestion.answer.join(",");
        console.log(this.paperQuestion.answer);
      }
      this.paperQuestion.options = JSON.stringify(this.options);
      this.$refs["paperQuestion"].validate((valid) => {
        if (valid) {
          this.$http({
            url: `${
              !this.paperQuestion.id
                ? `${this.$api.examquestionsave}`
                : `${this.$api.examquestionupdate}`
            }`,
            method: "post",
            data: this.paperQuestion,
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.parent.showFlag = false;
                  this.parent.search();
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },

    addOptions() {
      this.$refs["dialogForm"].validate((valid) => {
        if (valid) {
          this.options.push({
            text: this.dialogForm.code + "." + this.dialogForm.text,
            code: this.dialogForm.code,
          });
          this.dialogForm = {};
          this.addOptionsDialogVisible = !this.addOptionsDialogVisible;
        }
      });
    },

    updatePaperQuestion(){
          paperQuestionApi.updatePaperQuestion(this.paperQuestion).then( response => {
              if(response.success) {
                  this.$message({
                      type: "success",
                      message: "修改成功!",
                  });
                  this.getPageList();
                  this.paperQuestion = {}
                  this.dialogTableVisible = false
              }else {
                  this.$message({
                      type: "error",
                      message: "修改失败!",
                  });
              }
          })
          
      },

    addPaperQuestion() {
      paperQuestionApi
        .addExamPaperQuestion(this.paperQuestion)
        .then((response) => {
          if (response.success) {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.getPageList();
            this.paperQuestion = {};
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
    getPaperQuestionOne(paperQuestionId) {
      paperQuestionApi
        .getOnePaperQuestionById(paperQuestionId)
        .then((response) => {
          this.paperQuestion = response.data.paperQuestion;

          /* this.getCourseTitleByCourseId(this.paperQuestion.courseId)
             
              if(!this.eduPaper.chapterId == "") {
                  this.getChapterTitleByChapterId(this.paperQuestion.chapterId)
              }  */

          this.dialogTableVisible = true;
        });
    },

    cancel() {
      this.dialogTableVisible = false;
      this.paperQuestion = {};
    },

    saveOrUpdate() {
      this.judgment();/* 
      if (this.flag == 1) { */
        if (!this.paperQuestion.id == "") {
          // 不为空则表示修改
          this.updatePaper();
        } else {
          this.addPaperQuestion(); // 添加
          console.log(this.paperQuestion);
        }
      /* } */
    },

    // 根据课程id查课程名
    getCourseTitleByCourseId(courseId) {
      courseApi.getCourseInfoById(courseId).then((response) => {
        this.courseList = {
          0: {
            id: courseId,
            title: response.data.courseInfoVO.title,
          },
        };
      });
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

    // 查询所有试卷
    getListPaper() {
      paperApi.getAllPaper().then((response) => {
        this.paperList = response.data.items;
      });
    },

    // 试卷列表
    getPageList(page = 1) {
      this.page = page;
      paperQuestionApi
        .pagePaperQuestionCondition(
          this.page,
          this.limit,
          this.paperQuestionQuery
        )
        .then(
          // 请求成功
          (response) => {
            // response接口返回的数据
            this.list = response.data.records;
            this.total = response.data.total;
          }
        );
    },

    resetData() {
      this.paperQuestionQuery = {};
      this.getPageList();
    },

    // 删除试题方法
    removeDataById(id) {
      this.$confirm("此操作将永久删除该试题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        paperQuestionApi.deletePaperQuestionById(id).then((response) => {
          // 删除成功
          // 提示信息
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          // 回到页面
          this.getPageList(this.page);
        });
      });
    },
  },
};
</script>
  