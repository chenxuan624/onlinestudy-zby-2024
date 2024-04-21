import request from '@/utils/request'

export default {
    // 1 讲师列表（条件查询分页）
    getTeacherListPage(current, limit, teacherQuery) { // 当前页，每页记录数 条件对象
        return request({
            url: `/eduservice/edu-teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: teacherQuery
        })
    },

    // 2 删除讲师
    deleteTeacherById(id) {
        return request({
            url: `/eduservice/edu-teacher/${id}`,
            method: 'delete'
        })
    },

    // 3 添加讲师
    addTeacher(teacher) {
        return request({
            url: '/eduservice/edu-teacher/addTeacher',
            method: 'post',
            data: teacher
        })
    },

    // 4 讲师信息回显
    getTeacherInfoByIdApi(id) {
        return request({
            url: `/eduservice/edu-teacher/getTeacher/${id}`,
            method: 'get'
        })
    },

    // 5 修改讲师信息
    updateteacherApi(teacher) {
        return request({
            url: '/eduservice/edu-teacher/updateTeacher',
            method: 'post',
            data: teacher
        })
    }

}
