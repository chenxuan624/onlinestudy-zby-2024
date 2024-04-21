import axios from 'axios'
import router from '@/router'
import {Message} from 'element-ui'

// 创建axios实例
const service = axios.create({
    baseURL: 'http://localhost:8008', // 后端的接口地址
    timeout: 20000 // 请求超时时间，20秒
})

// request拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
service.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json;charset=utf-8'
        config.headers['token'] = localStorage.getItem("token") // 设置请求头
        return config
    },
    error => {
        // Do something with request error
        console.error('request error: ' + error) // for debug
        return Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data

        if (res.code === 401) {
            router.push('/login')
        }

        return res

        // debugger
        /*if (res.code !== 20000) {
            Message({
                message: res.message,
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject('error')
        } else {
            return response.data
        }*/
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
