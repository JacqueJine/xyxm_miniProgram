import request from '../utils/request.js';
// 创建 编辑店铺
export function CreateStore(data) {
    return request('/xcx/store/CreateStore.html', 'post', data)
}
// 获取店铺详情
export function storeDetail(data) {
    return request('/xcx/store/storeDetail.html', 'post', data)
}
// 店铺创建商品分类 
export function CreateClass(data) {
    return request('/xcx/store/CreateClass.html', 'post', data)
}
//获取店铺商品分类
export function getClass(data) {
    return request('/xcx/store/getClass.html', 'post', data)
}

//删除店铺商品分类 
export function delClass(data) {
    return request('/xcx/store/delclass.html', 'post', data)
}
//添加商品
export function createGood(data) {
    return request('/xcx/store/createGood.html', 'post', data)
}
//获取商品列表
export function getGood(data) {
    return request('/xcx/store/getGood.html', 'post', data)
}
// 编辑商品
export function editGoods(data) {
    return request('/xcx/store/editGoods.html', 'post', data)
}
// 获取去商品详情
export function goodsDetail(data) {
    return request('/xcx/store/goodsDetail.html', 'post', data)
}
//删除商品
export function delGoods(data) {
    return request('/xcx/store/delgoods.html', 'post', data)
}
//获取热销商品数量  上下架数量
export function hotCount(data) {
    return request('/xcx/store/hotCount.html', 'post', data)
}
// 店铺创建订单接口 
export function addOrderAll(data) {
    return request('/xcx/StoreOrder/addOrderAll.html', 'post', data)
}
// 店铺订单详情
export function orderInfo(data) {
    return request('/xcx/StoreOrder/orderInfo.html', 'post', data)
}
// 店铺订单列表
export function orderList(data) {
    return request('/xcx/StoreOrder/orderList.html', 'post', data)
}
//  店铺列表
export function listStore(data) {
    return request('/xcx/Store/listStore.html', 'post', data)
}
// 收藏或取消店铺 
export function UserStoreCollect(data) {
    return request('/xcx/Store/UserStoreCollect.html', 'post', data)
}
// 收藏列表
export function UserStoreCollectList(data) {
    return request('/xcx/Store/UserStoreCollectList.html', 'post', data)
}