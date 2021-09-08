import request from '@/utils/request'

// 文章详情页 -- 获取详情
const getArticleAPI = ({ artId }) => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${artId}`

  })
}

// 文章详情页 -- 关注作者
const followAuthorAPI = ({ autId }) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: autId
    }
  })
}

// 文章详情页 -- 取关作者
const unFollowAuthorAPI = ({ autId }) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${autId}`
  })
}

// 文章详情页 -- 喜欢点赞
const likeArticleAPI = ({ artId }) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target: artId
    }
  })
}

// 文章详情页 -- 不喜欢取消赞
const disLikeArticleAPI = ({ artId }) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${artId}`
  })
}

// 文章详情页 -- 文章评论
const getCommentListAPI = ({ artId, offset, limit = 10 }) => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params: {
      type: 'a',
      source: artId,
      offset,
      limit
    }
  })
}

// 文章详情页 -- 评论点赞
const commentLikeAPI = ({ cmtId }) => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target: cmtId
    }

  })
}
// 文章详情页 -- 评论取消点赞
const commentDisLikeAPI = ({ cmtId }) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${cmtId}`
  })
}

// 文章详情页 -- 发表评论
const commitCommentAPI = ({ artId, content }) => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data: {
      target: artId,
      content
    }
  })
}

export { getArticleAPI, followAuthorAPI, unFollowAuthorAPI, likeArticleAPI, disLikeArticleAPI, getCommentListAPI, commentLikeAPI, commentDisLikeAPI, commitCommentAPI }
