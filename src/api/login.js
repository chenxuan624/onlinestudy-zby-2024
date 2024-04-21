import request from '@/utils/request'



export default {

    // 1. 登录的方法
    submitLoginUser(userInfo) {
        return request({
            url: '/tcenter/login',
            method: 'post',
            data: userInfo
        })
    },

    // 2. 根据token值获取用户信息
    getLoginUserInfo() {
        return request({
            url: '/tcenter/getMemberInfo',
            method: 'get'
        })
    },
}