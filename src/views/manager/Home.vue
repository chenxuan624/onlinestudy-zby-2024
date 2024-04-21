<template>
  <div>
    <div style="display: flex;align-items: center;justify-content: center;margin-top: 10px;margin-bottom: 20px">
      <h1 style="font-size: 28px">
        欢迎来到云教育平台后台系统
      </h1>
    </div>
    <div style="box-shadow: 0 0 10px rgba(0, 0, 0, .1);font-size: 16px; padding: 10px 20px; border-radius: 5px;margin-bottom: 10px">
      {{ userInfo.name}}&nbsp;{{role}},您好！祝你开心每一天!
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      userInfo: {},
      role: ''
    }
  },

  created() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    this.role = localStorage.getItem("role")
  },

  methods: {

  }
}
</script>

<style scoped>

</style>
