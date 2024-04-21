import request from '@/utils/request'

export default {
    // 1 课程分类
    getAllSubjectTree() {
        return request({
            url: '/eduservice/edu-subject/getAllSubjectTree',
            method: 'get'
        })
    }

}
