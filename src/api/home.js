import request from '@/utils/request'

// 首页--获取用户已选频道
const getSelectChannelAPI = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
    // 这里不是组件，获取state不能用映射，并且this.$store只能在组件内使用

  })
}

// 首页--获取文章列表
const getArticleListAPI = ({ channel_id, timestamp = (new Date()).getTime() }) => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params: {
      channel_id,
      // 用作分页，第一次传系统时间，请求分页用pre_timestamp
      timestamp
    }
  })
}

// 首页--反馈不感兴趣
const dislikeArticleAPI = ({ id }) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/dislikes',
    data: {
      target: id
    }

  })
}

// 首页--反馈举报
const reportArticleAPI = ({
  target,
  type,
  remark
}) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/reports',

    data: {
      target,
      type,
      remark
    }
  })
}

// 首页--获取所有文章列表
const getAllChannelListAPI = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}

// 更新频道
const updateChannelListAPI = ({ channels }) => {
  return request({
    method: 'PUT',
    url: '/v1_0/user/channels',
    data: {
      channels
    }
  })
}

export { getSelectChannelAPI, getArticleListAPI, dislikeArticleAPI, reportArticleAPI, getAllChannelListAPI, updateChannelListAPI }
