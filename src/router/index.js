import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        name:'Manager',
        redirect: '/login', // 重定向到主页
        component: () => import('@/views/Manager.vue'),
        children: [
            { path: 'home', name: 'Home', component: () => import('@/views/manager/Home.vue') },
            {
                path:'403',
                name: 'Auth',
                component: () => import('@/views/manager/Auth.vue')
            },
            {
                path: 'course/courses',
                name: 'Courses',
                component: () => import('@/views/edu/course/courses.vue')
            },
            {
                path: 'course/courseInfo',
                name: 'CourseInfo',
                component: () => import('@/views/edu/course/courseInfo.vue')
            },
            {
                path: 'course/courseInfo/:id',
                name: '编辑课程基本信息',
                component: () => import('@/views/edu/course/courseInfo'),
                hidden: true  /* 隐藏路由 */
            },
            {
                path: 'course/chapter/:id',
                name: '编辑课程大纲',
                component: () => import('@/views/edu/course/chapter'),
                hidden: true  /* 隐藏路由 */
            },
            {
                path: 'course/submit/:id',
                name: '提交审核',
                component: () => import('@/views/edu/course/submit'),
                hidden: true  /* 隐藏路由 */
            },
            {
                path: 'course/categorylist',
                name: '课程分类列表',
                component: () => import('@/views/edu/course/categorylist.vue'),
            },
            {
                path: 'course/applycategory',
                name: '申请新增分类',
                component: () => import('@/views/edu/course/applycategory'),
            },
            {
                path: 'course/mycategoryapply',
                name: '我的分类申请',
                component: () => import('@/views/edu/course/mycategoryapply'),
            },
            {
                path: 'paper/papers',
                name: '试卷管理',
                component: () => import('@/views/edu/paper/papers'),
            },
            {
                path: 'paper/question',
                name: '试题管理',
                component: () => import('@/views/edu/paper/question'),
            },
            {
                path: 'paper/examrecord',
                name: '考试记录',
                component: () => import('@/views/edu/paper/examrecord'),
            },
            {
                path: 'message',
                name: '消息中心',
                component: () => import('@/views/message/message.vue'),
            },
            {
                path: 'usercenter',
                name: '个人中心',
                component: () => import('@/views/usercenter/user.vue'),
            },
            {
                path: 'company/check/teacher',
                name: '教师审核',
                component: () => import('@/views/company/check/teacherCheck.vue'),
            },
            {
                path: 'company/check/course',
                name: '课程审核',
                component: () => import('@/views/company/check/courseCheck.vue'),
            },
            {
                path: 'company/check/subject',
                name: '分类审核',
                component: () => import('@/views/company/check/subjectCheck.vue'),
            },
            {
                path: 'company/staff',
                name: '我司员工',
                component: () => import('@/views/company/HRD/staff.vue'),
            },
            {
                path: 'company/teacher',
                name: '教师列表',
                component: () => import('@/views/company/HRD/teacher.vue'),
            },
            {
                path: 'company/addEmployee',
                name: '添加员工',
                component: () => import('@/views/company/HRD/addEmployee.vue'),
            },
            {
                path: 'company/boss',
                name: '大BOSS',
                component: () => import('@/views/company/boss/boss.vue'),
            },

        ]
    },
    /*{
        path:'/elementTest',
        name:'elementTest',
        component: () => import('@/views/test/Element.vue')
    },*/
    {
        path:'/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path:'*',
        name: '404',
        component: () => import('@/views/404.vue')
    },

]

const router = new VueRouter({
        mode:"history",
        base: process.env.BASE_URL,
        routes
    }
)

// 路由守卫
router.beforeEach((to, from, next) => {
    // to 是到达的路由信息
    // from 是来源的路由信息
    // next 是帮助跳转的函数

    /*console.log("to")
    console.log(to)
    console.log("from")
    console.log(from)
    console.log("next")
    console.log(next)*/

    let user = localStorage.getItem("role")

    let allPaths = [
        '/home',
        '/course/courses',
        '/course/courseInfo',
        '/course/courseInfo/:id',
        '/course/chapter/:id',
        '/course/submit/:id',
        '/course/categorylist',
        '/course/applycategory',
        '/course/mycategoryapply',
        '/paper/papers',
        '/paper/question',
        '/paper/examrecord',
        '/message',
        '/usercenter',
        '/company/check/teacher',
        '/company/check/course',
        '/company/check/subject',
        '/company/staff',
        '/company/teacher',
        '/company/addEmployee',
        '/company/boss',
    ]

    let adminPaths = [
        '/company/check/teacher',
        '/company/check/course',
        '/company/check/subject',
        '/company/staff',
        '/company/teacher',
        '/company/addEmployee',
        '/company/boss',
    ]

    if (user === null && allPaths.includes(to.path)) {
        next("/login")
    }else if( user !== '管理员' && adminPaths.includes(to.path)) { // 如果当前登录的用户不是管理员，当前到达的路径是管理员才有权限访问的路径，则让用户跳转到另一个新的页面
        // 跳转到新的页面
        next("/403")
    } else {
        next()
    }


})

export default router
