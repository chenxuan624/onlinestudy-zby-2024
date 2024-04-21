import request from '@/utils/request'

export default {

    // 1 添加试题
    addExamPaperQuestion(EduPaperQuestion) { 
        return request({
            url: `/eduservice/edu-paper-question/addExamPaperQuestion`,
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: EduPaperQuestion
        })
    },
    // 2. 查询试卷详情
    getOnePaperQuestionById(paperQuestionId) {
        return request({
            url: `/eduservice/edu-paper-question/getOnePaperQuestion/${paperQuestionId}`,
            method: 'get'
        })
    },

    // 3. 带条件查询试卷列表
    pagePaperQuestionCondition(page, limit,paperQuestionQuery) {   // 当前页，每页记录数 条件对象
        return request({
            url: `/eduservice/edu-paper-question/${page}/${limit}`,
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: paperQuestionQuery
        })
    },

    // 4. 修改试卷
    updatePaperQuestion(EduPaperQuestion) { 
        return request({
            url: `/eduservice/edu-paper-question/updatePaperQuestion`,
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: EduPaperQuestion
        })
    },

    // 5. 删除试卷
    deletePaperQuestionById(paperQuestionId){
        return request({
            url: `/eduservice/edu-paper-question/deletePaperQuestion/${paperQuestionId}`,
            method: 'delete'
        })
    },
    
}