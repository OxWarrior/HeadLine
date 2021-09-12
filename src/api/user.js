import request from '@/utils/request'

// 用户 -- 基本资料
const getUserAPI = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
  })
}

// 用户 -- 编辑信息
const editUserAPI = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

// 用户 -- 更新头像
const updateUserPhotoAPI = ({ form }) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data: form
  })
}

// 用户 -- 更新资料（name,birthday）
const updateUserProfileAPI = ({ name, birthday }) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data: {
      name,
      birthday
    }
  })
}

// token续签
const updateTokenAPI = () => {
  return request({
    method: 'PUT',
    url: '/v1_0/authorizations'
  })
}

export { getUserAPI, editUserAPI, updateUserPhotoAPI, updateUserProfileAPI, updateTokenAPI }
