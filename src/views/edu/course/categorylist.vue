<template>
  <div class="app-container">

    <!-- 检索输入项 -->
    <el-input v-model="filterText" placeholder="关键词搜索" style="margin-bottom:30px;" />

    <!--
        树形结构
        ref  表示组件的唯一标识，类似于HTML中的id值
        :data 表示要显示的数据
        :props 属性
        :filter-node-method 检索功能方法
        class 相关样式
        default-expand-all 布局
    -->
    <el-tree
        ref="tree2"
        :data="list"
        :props="defaultProps"
        :filter-node-method="filterNode"
        class="filter-tree"
        default-expand-all
    />

  </div>
</template>

<script>

import subject from '@/api/edu/subject'

export default {

  data() {
    return {
      filterText: '',
      list: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },

  created () {
    this.getAllSubjectList()
  },

  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {

    getAllSubjectList() {
      subject.getAllSubjectTree()
          .then( response => {
            this.list = response.data.list
          })

    },

    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }

}
</script>