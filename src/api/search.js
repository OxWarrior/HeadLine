import request from '@/utils/request'

// 搜索--联想菜单
const searchLenovoAPI = ({ q }) => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 搜索--结果文章
const getSearchResultAPI = ({ q, page = 1 }) => {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params: {
      q,
      page
    }
  })
}

export { searchLenovoAPI, getSearchResultAPI }
