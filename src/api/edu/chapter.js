import request from '@/utils/request'

export default {

    // 1 根据课程id得到该课程的章节和小节
    getAllChapterVideo(courseId) {
        return request({
            url: `/eduservice/edu-chapter/getChapterVideo/${courseId}`,
            method: 'get'
        })
    },

    // 2. 添加章
    addChapter(chapter) {
        return request({
            url: '/eduservice/edu-chapter/addChapter',
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: chapter
        })
    },

    // 3.根据id查询章
    getChapterById(chapterId) {
        return request({
            url: `/eduservice/edu-chapter/getChapterInfo/${chapterId}`,
            method: 'get'
        })
    },

    // 4.修改章
    updateChapter(chapter) {
        return request({
            url: '/eduservice/edu-chapter/updateChapter',
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: chapter
        })
    },

    // 5.删除章
    deleteChapter(chapterId) {
        return request({
            url: `/eduservice/edu-chapter/deleteChapter/${chapterId}`,
            method: 'delete'
        })
    },

    // 6. 根据课程id查询章节，返回章节id,章节名
    getChapterListByCourseId(courseId) {
        return request({
            url: `/eduservice/edu-chapter/getChapterListByCourseId/${courseId}`,
            method: 'get'
        })
    },


}