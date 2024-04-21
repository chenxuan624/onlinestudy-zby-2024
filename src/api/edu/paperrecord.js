import request from '@/utils/request'

export default {
   
    // 3. 带条件查询考试记录列表
    pageExamRecordCondition(page, limit, examQuery) {
        return request({
            url: `/eduservice/edu-paper-score/${page}/${limit}`,
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: examQuery
        })
    },

}