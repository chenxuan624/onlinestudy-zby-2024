<template>
  <div style="height: 100vh;display: flex;align-items: center;justify-content: center;background-color: #6ea46e">
    <div style="display: flex;background-color: white;width: 50%; border-radius: 5px;overflow: hidden">
      <div style="flex: 1">
        <img src="@/assets/img/cloudClass.jpg" alt="" style="width: 100%;">
      </div>
      <div style="flex: 1; display: flex;align-items: center;justify-content: center">
        <el-form label-position="right" :model="loginForm" style="width: 90%">
          <div style="font-size: 20px;font-weight: bold;text-align: center;margin-bottom: 20px">云教育平台后台系统登录</div>

          <el-form-item label="账号" prop="mobile"
                        :rules="[
            {
              required: true,
              message: '请输入手机号码',
              trigger: 'blur',
            },
            { validator: checkPhone, trigger: 'blur' },
          ]"
          >
            <div style="display: flex">
              <el-input prefix-icon="el-icon-user" placeholder="请输入手机号" label="手机号" v-model="loginForm.mobile" />
            </div>

          </el-form-item>

          <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
            <div style="display: flex">
              <el-input prefix-icon="el-icon-lock" show-password placeholder="请输入密码" label="密码" v-model="loginForm.password" />
            </div>
          </el-form-item>

          <el-form-item label="验证码" prop="validCode" >
            <div style="display: flex">
              <el-input prefix-icon="el-icon-circle-check" placeholder="不分大小写" style="flex: 1;margin-left: -3px" v-model="loginForm.code" />
              <div style="flex: 1;height: 36px">
                <valid-code @update:value="getCode" />
              </div>
            </div>
          </el-form-item>

          <el-form-item label="角色" class="role" :rules="[{ required: true, message: '请选择您的角色', trigger: 'blur' }]">
            <el-radio-group v-model="loginForm.role">
              <el-radio label="管理员">管理员</el-radio>
              <el-radio label="教师">教师</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login()" style="width: 100%;text-align: center">登录</el-button>
          </el-form-item>
          <div>还不是教师？&nbsp;请到&nbsp;<a href="http://localhost:3000" target="_blank" style="color: #6ea46e">前台个人中心</a>&nbsp;申请</div>
        </el-form>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>

import ValidCode from "@/components/ValidCode.vue";

import loginApi  from "@/api/login";

import cookie from "js-cookie";
import login from "@/api/login";


export default {
  name:"Login",
  components: {
    ValidCode
  },
  data() {
    return {
      code:'', // 验证码组件传过来的code  :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]"
      loginForm:{
        mobile:'',
        password:'',
        code:'', // 表单中用户输入的code
        role:''
      },
    }
  },

  created() {
  },
  methods: {

    getCode(code) {
      this.code = code.toLowerCase()
    },

    login(){

      if (!this.loginForm.mobile) {
        this.$message.error("请输入账号");
        return;
      }
      if (!this.loginForm.password) {
        this.$message.error("请输入密码");
        return;
      }
      if (!this.loginForm.role) {
        this.$message.error("请选择角色");
        return;
      }

      if (this.loginForm.code.toLowerCase() === this.code){
        loginApi.submitLoginUser(this.loginForm).then( response => {
          if (response.success) {
            localStorage.setItem("token",response.data.token)
            loginApi.getLoginUserInfo().then( response => {
              localStorage.setItem("userInfo", JSON.stringify(response.data.userInfo))
              localStorage.setItem("role", response.data.role)
              this.$router.push({path:'/home'})
              this.$message.success("登录成功...")
            })
          }else {
            this.$message.error(response.message)
          }

          // 将信息放到cookie中
          /*this.loginInfo = response.data.userInfo
          //this.loginInfo = JSON.stringify(response.data.data.userInfo)
          cookie.set('onlinestudy_tcenter', this.loginInfo, { domain: 'localhost' } )

          // 根据token拿到用户信息
          loginApi.getLoginUserInfo()
              .then( response => {
                // 将信息放到cookie中
                this.loginInfo = response.data.userInfo
                //this.loginInfo = JSON.stringify(response.data.data.userInfo)
                cookie.set('onlinestudy_tcenter', this.loginInfo, { domain: 'localhost' } )

                // 回到首页
                /!* window.location.href = "/"*!/
                this.$router.push({path:'/'})
              })*/

        })
      }
      else {
        this.$message.error("验证码错误,请重试...或点击验证码区域更换验证码")
        this.loginForm.code = ''
      }
    },

    checkPhone (rule, value, callback) {
      //debugger
      if (!(/^1[345678]\d{9}$/.test(value))) {
        return callback(new Error('手机号码格式不正确'))
      }
      return callback()
    }
  }
}

</script>

<style scoped>

</style>