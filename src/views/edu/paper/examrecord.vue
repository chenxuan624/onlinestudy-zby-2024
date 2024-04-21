<template>
    <div class="app-container">
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline">

        <el-form-item>
          <el-input v-model="examQuery.nickname" placeholder="考生名称" />
        </el-form-item>

        <el-form-item>
          <el-input v-model="examQuery.papername" placeholder="试卷名称" />
        </el-form-item>
  
        <el-form-item label="考试得分区间">
            <el-input v-model="examQuery.minscore" placeholder="最低分" />
        </el-form-item>

        <el-form-item>
            <el-input v-model="examQuery.maxscore" placeholder="最高分" />
        </el-form-item>
  
        <el-button type="primary" icon="el-icon-search" @click="getList()"
          >查询</el-button
        >
        <el-button type="info" @click="resetData()">清空</el-button>
      </el-form>
  
      <!-- 表格 -->
      <el-table
        :data="list"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="序号" width="50" align="center" header-align="center">
          <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
          </template>
        </el-table-column>
  
        <el-table-column prop="memberId" label="考生ID" width="170" header-align="center" align="center"/>

        <el-table-column prop="nickname" label="考生昵称" width="170" header-align="center" align="center"/>

        <el-table-column prop="papername" label="试卷名称" header-align="center" align="center"/>
  
        <el-table-column prop="totalScore" label="考试得分" width="170" header-align="center" align="center"/>
  
        <el-table-column prop="gmtCreate" label="考试时间" width="170" header-align="center" align="center"/>
  
        <el-table-column label="操作" width="150" header-align="center" align="center">
          <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="getPaperOne(scope.row.id)"
                >查看详情</el-button
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
  import paperRecordApi from "@/api/edu/paperrecord";
  
  export default {
    // 定义变量初始值
    data() {
      return {
        list: null, // 查询之后返回的结果放在这里
        page: 1, // 当前页
        limit: 10, // 每页记录数
        total: 0, // 总记录数
        examQuery: {}, // 条件封装对象
      };
    },
    // 调用方法
    created() {
      // 调用写具体方法
      this.getList();
      this.resetData();
    },
    // 写具体方法
    methods: {
  
      // 数据回显
      getPaperOne(id){
        console.log("跳转到详情");
      },
  
      // 试卷列表
      getList(page = 1) {
        this.page = page;
        console.log(this.examQuery);
        paperRecordApi.pageExamRecordCondition(this.page, this.limit, this.examQuery).then(
          // 请求成功
          (response) => {
            // response接口返回的数据
            this.list = response.data.records;
            this.total = response.data.total;
          }
        );
      },

      resetData() {
        this.examQuery = {};
        this.getList();
      },
  
    },
  };
  </script>
  