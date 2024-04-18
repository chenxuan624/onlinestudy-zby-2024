<template>
  <div>
    <el-row>
      <el-col :span="6">
        <div style="padding: 10px; border: 1px solid #ccc">
          <img style="width: 100%" src="@/assets/logo.png" alt="">
          <div style="text-align: center">这是一个element学习测试界面</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="padding: 10px; border: 1px solid #ccc">
          <img style="width: 100%" src="@/assets/logo.png" alt="">
          <div style="text-align: center">这是一个element学习测试界面</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="padding: 10px; border: 1px solid #ccc">
          <img style="width: 100%" src="@/assets/logo.png" alt="">
          <div style="text-align: center">这是一个element学习测试界面</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="padding: 10px; border: 1px solid #ccc">
          <img style="width: 100%" src="@/assets/logo.png" alt="">
          <div style="text-align: center">这是一个element学习测试界面</div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <el-input style="width: 200px" v-model="value" placeholder="请输入内容"></el-input>
        <el-input type="textarea" style="width: 200px" v-model="value"></el-input>

        <el-input clearable show-password style="width: 200px" v-model="password" placeholder="请输入密码"></el-input>
      </el-col>

      <el-select v-model="select" @change="changeSelect">
        <el-option v-for="item in fruits" :key="item.id" :label="item.name" :value="item.name"></el-option>
      </el-select>

      <el-select v-model="selectUser" @change="changeSelectUser">
        <el-option v-for="item in user" :key="item.card" :label="item.name" :value="item.card"></el-option>
      </el-select>

      <el-select v-model="select2" @change="changeSelect2" filterable>
        <el-option v-for="item in user2" :key="item.card" :label="item.label" :value="item.card"></el-option>
      </el-select>
    </el-row>
    <el-row>
      <el-radio-group v-model="radio" @change="selectRadio">
        <el-radio label="管理员"></el-radio>
        <el-radio label="教师"></el-radio>
      </el-radio-group>

      <el-checkbox-group v-model="checkList" @change="selectCheckbox">
        <el-checkbox label="A选项"></el-checkbox>
        <el-checkbox label="B选项"></el-checkbox>
        <el-checkbox label="C选项"></el-checkbox>
        <el-checkbox label="D选项"></el-checkbox>
      </el-checkbox-group>

      <el-date-picker v-model="date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" @change="changeDate"></el-date-picker>
      <el-date-picker v-model="datetime" type="datetime" placeholder="选择时间" value-format="yyyy-MM-dd HH:mm:ss" @change="changeDateTime"></el-date-picker>
    </el-row>

    <el-row style="margin: 50px 100px">
      <el-table :data="tableData" border :header-cell-style="{ background: 'aliceblue', fontSize:'16px'}">
        <el-table-column label="序号" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="年龄" prop="age"></el-table-column>
        <el-table-column label="地址" prop="address"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
export default {
  name:'ElementTest',
  data(){
    return {
      tableData:[
        { name: '邹碧云', address: '江西省南昌市', id: 1, age:'21'},
        { name: '曾春兰', address: '江西省吉安市', id: 2, age:'22'},
      ],
      value:'',
      password:'',
      select:'',
      select2:'',
      selectUser:'',
      fruits: [
        { name: '苹果', id: 1 },
        { name: '橘子', id: 2 },
        { name: '香蕉', id: 3 },
        { name: '草莓', id: 4 },
      ],
      user: [
        { name: '邹碧云0', card: "1234567890" },
        { name: '邹碧云1', card: "1234567891" },
        { name: '邹碧云2', card: "1234567892" },
        { name: '邹碧云3', card: "1234567893" },
      ],
      user2: [
        { label: '邹碧云0', card: "1234567890" },
        { label: '邹碧云1', card: "1234567891" },
        { label: '邹碧云2', card: "1234567892" },
        { label: '邹碧云3', card: "1234567893" },
      ],
      radio:'',
      checkList:[],
      date:'',
      datetime:'',
    }
  },
  methods: {
    changeSelect(){
      console.log(this.select)},
    changeSelectUser(){
      console.log(this.selectUser)},
    changeSelect2(){
      console.log(this.select2)},
    selectRadio(){
      console.log(this.radio)
    },
    selectCheckbox(){
      console.log(this.checkList)
    },
    changeDate(){
      console.log(this.date)
    },
    changeDateTime(){
      console.log(this.datetime)
    },
    edit(row){
      // alert(row.name)
      // this.$message.success(row.name)
      // this.$message.warning(row.name)
      // this.$notify.success(row.name)

      this.$confirm("你确定执行这个操作吗？", '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success(row.name + "操作执行了")
      }).catch(() => {
        this.$message.warning(row.name + "操作取消了")
      })
    },
  }
}
</script>

<style scoped>

</style>