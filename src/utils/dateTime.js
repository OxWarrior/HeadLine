import moment from 'moment'

const timeAgo = (targetDate) => {
  // 中文
  moment.locale('zh-cn')
  // 当前时间与传入时间对比
  return moment(targetDate).fromNow()
}
export {
  timeAgo
}
