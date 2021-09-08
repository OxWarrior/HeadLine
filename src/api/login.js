import request from '@/utils/request'

// 登录接口
const loginAPI = ({
  mobile,
  code
}) => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}

export { loginAPI }
