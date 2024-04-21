import request from '@/utils/request'

export default {

    // 1 添加课程
    addCourseInfo(courseInfo) {
        return request({
            url: '/eduservice/edu-course/addCourseInfo',
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: courseInfo
        })
    },

    // 2. 查询所有讲师用于课程显示
    getAllTeacher() {
        return request({
            url: '/eduservice/edu-teacher/findAll',
            method: 'get'
        })
    },

    // 3. 课程基本信息回显
    getCourseInfoById(courseId) {
        return request({
            url: `/eduservice/edu-course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },

    // 4. 修改课程基本信息
    updateCourseInfo(courseInfo) {
        return request({
            url: '/eduservice/edu-course/updateCourseInfo',
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: courseInfo
        })
    },

    // 3. 课程确认信息回显
    getPublishCourseInfoById(courseId) {
        return request({
            url: `/eduservice/edu-course/getPublishCourseInfo/${courseId}`,
            method: 'get'
        })
    },

    // 4. 修改课程发布状态
    submitCourseInfo(courseId) {
        return request({
            url: `/eduservice/edu-course/submitCourse/${courseId}`,
            method: 'post'
        })
    },

    // 5. 查询所有课程
    getListCourse(){
        return request({
            url: `/eduservice/edu-course/getCourseList`,
            method: 'get'
        })
    },

    // 5. 查询所有已开课的课程
    getListCourseByStatus(){
        return request({
            url: `/eduservice/edu-course/getCourseListByStatus`,
            method: 'get'
        })
    },

    // 条件分页查询
    getCourseListPage(current, limit, courseQuery) { // 当前页，每页记录数 条件对象
        return request({
            url: `/eduservice/edu-course/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: courseQuery
        })
    },

    // 2 删除讲师
    deleteCourseById(courseId) {
        return request({
            url: `/eduservice/edu-course/deleteCourse/${courseId}`,
            method: 'delete'
        })
    },

    // 根据讲师id查询课程，返回课程id,课程名
    getCourseListByTeacherId(teacherId) {
        return request({
            url: `/eduservice/edu-course/getCourseListByTeacherId/${teacherId}`,
            method: 'get'
        })
    },


}
