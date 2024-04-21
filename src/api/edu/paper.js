import request from '@/utils/request'

export default {
    // 1 添加试卷
    addExamPaper(EduPaper) {
        return request({
            url: `/eduservice/edu-paper/addExamPaper`,
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: EduPaper
        })
    },
    // 2. 查询试卷详情
    getOnePaperById(paperId) { // 当前页，每页记录数 条件对象
        return request({
            url: `/eduservice/edu-paper/getOnePaper/${paperId}`,
            method: 'get'
        })
    },

    // 查询所有试卷
    getAllPaper() {
        return request({
            url: '/eduservice/edu-paper/findAll',
            method: 'get'
        })
    },

    // 3. 带条件查询试卷列表
    pagePaperCondition(page, limit, PaperQuery) {
        return request({
            url: `/eduservice/edu-paper/${page}/${limit}`,
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: PaperQuery
        })
    },

    // 4. 修改试卷
    updatePaper(EduPaper) {
        return request({
            url: `/eduservice/edu-paper/updatePaper`,
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: EduPaper
        })
    },

    // 5. 删除试卷
    deletePaperById(paperId) {
        return request({
            url: `/eduservice/edu-paper/deletePaper/${paperId}`,
            method: 'delete'
        })
    },

}