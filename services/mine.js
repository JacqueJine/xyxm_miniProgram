import request from '../utils/request.js'

// 学校列表
export function getschoollist(data) {
	return request('/xcx/school/getSchoolList.html', 'post', data)
}
// 添加学校
export function createschool(data) {
	return request('/xcx/school/CreateSchool.html', 'post', data)
}
// 用户信誉分及列表
export function getUserCredits(data) {
	return request('/xcx/user/getUserCredits.html', 'post', data)
}
// 用户收益列表
export function getProfitNum(data) {
	return request('/xcx/User/getUserProfit.html', 'post', data)
}
// 用户余额列表
export function getWalletNum(data) {
	return request('/xcx/User/getUserWallets.html', 'post', data)
}
//登录
export function Login(data) {
	return request('/xcx/login.html', 'post', data)
}
// 获取去token 
export function getToken(data) {
	return request('/xcx/login/getToken.html', 'post', data)
}
// 获取个人信息
export function findUserInfo(data) {
	return request('/xcx/login/findUserInfo.html', 'post', data)
}
// 添加编辑收货地址 
export function createAddress(data) {
	return request('/xcx/address/createAddress.html', 'post', data)
}
// 地址列表 
export function getAddress(data) {
	return request('/xcx/address/getAddress.html', 'post', data)
}
//地址详情 
export function addressDetail(data) {
	return request('/xcx/address/addressDetail.html', 'post', data)
}
//地址删除 
export function delAddress(data) {
	return request('/xcx/address/delAddress.html', 'post', data)
}
// 修改个人信息 
export function saveUser(data) {
	return request('/xcx/user/saveUser.html', 'post', data)
}
// 完善个人信息 
export function perfectUserInfo(data) {
	return request('/xcx/login/perfectUserInfo.html', 'post', data)
}
// 实名认证 
export function identityAuthentication(data) {
	return request('/xcx/user/identityAuthentication.html', 'post', data)
}
// 骑手认证 
export function riderAuthentication(data) {
	return request('/xcx/user/riderAuthentication.html', 'post', data)
}
// 官方认证列表
export function getAuthenticationState(data) {
	return request('/xcx/user/getAuthenticationState.html', 'post', data)
}
// 切换官方认证图标
export function showAuthentication(data) {
	return request('/xcx/user/showAuthentication.html', 'post', data)
}
// 用户反馈建议 
export function addTickling(data) {
	return request('/xcx/System/addTickling.html', 'post', data)
}
// 退出登录 
export function logout(data) {
	return request('/xcx/login/logout.html', 'post', data)
}
// 收益转余额
export function transferProfit(data) {
	return request('/xcx/user/transferProfit.html', 'post', data)
}
// 收益提现 
export function extractProfit(data) {
	return request('/xcx/user/extractProfit.html', 'post', data)
}
// 余额提现
export function extractWallets(data) {
	return request('/xcx/user/extractWallets.html', 'post', data)
}
// 积分列表
export function getUserIntegral(data) {
	return request('/xcx/user/getUserIntegral.html', 'post', data)
}
// 忘记密码
export function changePassword(data) {
	return request('/xcx/user/changePassword.html', 'post', data)
}
// 获取个人消费记录
export function selfExpense(data) {
	return request('/xcx/user/selfExpense.html', 'post', data)
}
// 获取轮播图
export function carouselList(data) {
	return request('/xcx/System/carouselList.html', 'post', data)
}
// 修改学校 
export function updateUserSchool(data) {
	return request('/xcx/User/updateUserSchool.html', 'post', data)
}