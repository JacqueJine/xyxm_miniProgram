import request from '../utils/request.js';

// +----------------------------------------------------------------------
// | 消息模块
// +----------------------------------------------------------------------

// 是否有新消息
export function getUnreadOrEmpty(data) {
	return request('/xcx/Message/getUnreadOrEmpty.html', 'post', data)
}
// 消息列表 
export function getUnread(data) {
	return request('/xcx/Message/getUnread.html', 'post', data)
}
// 获取未读消息数量
export function getUnreadCount(data) {
	return request('/xcx/Message/getUnreadCount.html', 'post', data)
}
// 修改消息状态
export function readMessage(data) {
	return request('/xcx/Message/read.html', 'post', data)
}
// 删除消息
export function deleteMessage(data) {
	return request('/xcx/Message/delete.html', 'post', data)
}
// 获取手机号验证码
export function sendSms(data) {
	return request('/xcx/Message/sendSms.html', 'post', data)
}