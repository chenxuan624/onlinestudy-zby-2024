import request from '@/utils/request'

export default {

    // 6. 添加节
    addVideo(video) {
        return request({
            url: '/eduservice/edu-video/addVideo',
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: video
        })
    },

    // 7.根据id查询节
    getVideoById(videoId) {
        return request({
            url: `/eduservice/edu-video/getVideoInfo/${videoId}`,
            method: 'get'
        })
    },

    // 8.修改节
    updateVideo(video) {
        return request({
            url: '/eduservice/edu-video/updateVideo',
            method: 'post',
            // 后端使用RequestBody获取数据，所以要用data，目的是把对象转换成json
            data: video
        })
    },

    // 9.删除节
    deleteVideo(videoId) {
        return request({
            url: `/eduservice/edu-video/deleteVideo/${videoId}`,
            method: 'delete'
        })
    },

    // 10. 删除阿里云中的视频
    deleteAliyunVideo(videoId) {
        return request({
            url: `/edu-vod/video/deleteAliyunVideo/${videoId}`,
            method: 'delete'
        })
    },

}