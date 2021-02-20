import request from '../utils/request.js'

// 社区模块

// 删除图片
export function delImages(data) {
	return request('/common/upload/delImages.html', 'post', data)
}
// 获取社区分类
export function getCommunityClassify(data) {
	return request('/xcx/community/getCommunityClassify.html', 'post', data)
}
// 发布社区帖子
export function posts(data) {
	return request('/xcx/community/posts.html', 'post', data)
}
// 帖子详情
export function getPostsInfo(data) {
	return request('/xcx/community/getPostsInfo.html', 'post', data)
}
// 动态列表（帖子列表）
export function getPostsLists(data) {
	return request('/xcx/community/getPostsLists.html', 'post', data)
}
// 分享帖子
export function sharePosts(data) {
	return request('/xcx/community/sharePosts.html', 'post', data)
}
// 点赞取消帖子
export function praisePosts(data) {
	return request('/xcx/community/praisePosts.html', 'post', data)
}
// 评论帖子
export function comment(data) {
	return request('/xcx/community/comment.html', 'post', data)
}
// 列表评论
export function getPostsComment(data) {
	return request('/xcx/community/getPostsComment.html', 'post', data)
}
// 点赞取消评论
export function praiseComment(data) {
	return request('/xcx/community/praiseComment.html', 'post', data)
}
// 创建社团
export function foundCulb(data) {
	return request('/xcx/community/foundCulb.html', 'post', data)
}
// 社团详情
export function getCulbInfo(data) {
	return request('/xcx/community/getCulbInfo.html', 'post', data)
}
// 社团成员列表
export function getClubMember(data) {
	return request('/xcx/community/getClubMember.html', 'post', data)
}
// 修改社团信息
export function editClubInfo(data) {
	return request('/xcx/community/editClubInfo.html', 'post', data)
}
// 社团排行榜（获取社团列表）
export function getClubLists(data) {
	return request('/xcx/community/getClubLists.html', 'post', data)
}
// 社团列表（已加入的社团）
export function getMyClub(data) {
	return request('/xcx/community/getMyClub.html', 'post', data)
}
// 申请加入社团
export function joinClub(data) {
	return request('/xcx/community/joinClub.html', 'post', data)
}
// 同意拒绝加入社团
export function joinAudit(data) {
	return request('/xcx/community/joinAudit.html', 'post', data)
}
// 解散社团
export function delCulb(data) {
	return request('/xcx/community/delCulb.html', 'post', data)
}
// 退出社团
export function outClub(data) {
	return request('/xcx/community/outClub.html', 'post', data)
}
// 删除帖子
export function delPosts(data) {
	return request('/xcx/community/delPosts.html', 'post', data)
}
// 删除评论
export function delComment(data) {
	return request('/xcx/community/delComment.html', 'post', data)
}
// 删除社团成员
export function delClubMember(data) {
	return request('/xcx/community/delClubMember.html', 'post', data)
}
// 搜索用户列表
export function listUser(data) {
	return request('/xcx/user/listUser.html', 'post', data)
}

