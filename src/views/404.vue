<template>

  <div>
    <div style="height: 100vh;overflow: hidden;display: flex;align-items: center;justify-content: center">
      <div> 找不到页面 <a style="color: blueviolet;text-decoration: underline;cursor: pointer" @click="logout">退出</a></div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {

    }
  },

  methods: {
    logout(){
      localStorage.removeItem('token') // 清数据
      localStorage.removeItem('userInfo') // 清数据
      localStorage.removeItem('role') // 清数据
      this.$router.push('/login')
    },
  }
}

</script>

<style scoped>

</style>