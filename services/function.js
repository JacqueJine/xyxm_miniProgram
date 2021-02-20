import request from '../utils/request.js'

/**
 * 任务列表   1:快递帮  2:跑腿  3:其他
 */
// 添加任务
export function addTask(data) {
    return request('/xcx/task/addTask.html', 'post', data)
}
// 发布列表  task_state:0待接单，1进行中，2待结算，3已取消，4已完成
export function taskList(data) {
    return request('/xcx/task/listTask.html', 'post', data)
}
// 任务大厅
export function taskHall(data) {
    return request('/xcx/task/taskHall.html', 'post', data)
}
// 任务详情
export function getInfoTask(data) {
    return request('/xcx/task/getInfoTask.html', 'post', data)
}
// 任务状态统计
export function countTask(data) {
    return request('/xcx/task/countTask.html', 'post', data)
}
//获取系统设置
export function getInfoSystem(data) {
    return request('/xcx/system/getInfoSystem.html', 'post', data)
}
// 任务评论列表 
export function listComment(data) {
    return request('/xcx/TaskComment/listComment.html', 'post', data)
}

// 添加评论 
export function insertComment(data) {
    return request('/xcx/TaskComment/insertComment.html', 'post', data)
}
// 删除评论
export function delComment(data) {
    return request('/xcx/TaskComment/delComment.html', 'post', data)
}
// 点赞 
export function Praise(data) {
    return request('/xcx/TaskComment/praise.html', 'post', data)
}
// 举报 任务
export function Inform(data) {
    return request('/xcx/task/inform.html', 'post', data)
}
//举报 留言
export function liuInform(data) {
    return request('/xcx/taskComment/inform.html', 'post', data)
}
// 创建任务订单 
export function createOrder(data) {
    return request('/xcx/TaskOrder/createOrder.html', 'post', data)
}
//任务订单列表 
export function listOrder(data) {
    return request('/xcx/taskOrder/listOrder.html', 'post', data)
}
// 任务订单详情 
export function getInfoOrder(data) {
    return request('/xcx/TaskOrder/getInfoOrder.html', 'post', data)
}
//我的订单统计 
export function countTaskOrder(data) {
    return request('/xcx/TaskOrder/countTaskOrder.html', 'post', data)
}
// 骑手修改订单状态    
export function OrderupdateTaskState(data) {
    return request('/xcx/taskOrder/OrderupdateTaskState.html', 'post', data)
}
// 发布人修改任务状态 
export function taskUpdateState(data) {
    return request('/xcx/task/taskUpdateState.html', 'post', data)
}
// 发布人拒绝取消订单 
export function refuseCancel(data) {
    return request('/xcx/Task/refuseCancel.html', 'post', data)
}
// 订单任务删除
export function delOrder(data) {
    return request('/xcx/TaskOrder/delOrder.html', 'post', data)
}
// 删除任务 
export function delTask(data) {
    return request('/xcx/task/delTask.html', 'post', data)
}
// 余额支付和收益 支付
export function payTask(data) {
    return request('/xcx/task/payTask.html', 'post', data)
}
// 任务设置获取多个
export function taskComplete(data) {
    return request('/xcx/system/taskComplete.html', 'post', data)
}
//  骑手同意发布人取消任务
export function taskOrderCancel(data) {
    return request('/xcx/TaskOrder/taskOrderCancel.html', 'post', data)
}
//发布人同意取消订单
export function taskCancel(data) {
    return request('/xcx/Task/taskCancel.html', 'post', data)
}
// 该任务是否在5分钟内
export function taskCancelIsTime(data) {
    return request('/xcx/task/taskCancelIsTime.html', 'post', data)
}