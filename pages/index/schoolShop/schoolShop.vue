<template>
	<view class="content" v-if="shop!=''">
		<image :src="
        shop.backimage == ''
          ? '/static/index/shopbg.png'
          : imgBaseUrl + shop.backimage
      "
		 class="bg" mode="widthFix"></image>
		<view class="bgz"></view>
		<view class="top">
			<view class="nav" :style="'padding-top:' + (navTop + 5) + 'px;height:' + navHeight + 'px'">
				<u-icon name="arrow-left" @click="back" size="50rpx" color="#FFFFFF"></u-icon>
			</view>
			<view class="cont">
				<view class="top1">
					<view class="top1_1">
						<view>
							<image :src="imgBaseUrl + shop.header"></image>
							<view style="height: 100rpx">
								<view class="name"><text>{{ shop.name }}</text>
									<button open-type="share" class="sharebtn">
										<image src="/static/index/share.png" class="share"></image>
									</button>
								</view>
								<view style="color: rgba(51, 51, 51, 0.6)">营业时间：{{ shop.start_time }}-{{ shop.end_time }}</view>
							</view>
						</view>
						<view @click="toCollect">{{shop.is_user_store_collect==1?'已收藏':'收藏'}}</view>
					</view>
					<view class="top1_2">
						<view>{{ shop.upsendmoney }}元起送</view>
						<view v-if="shop.send_status == 3">满{{ shop.discount }}元{{ shop.send_fee }}送费</view>
					</view>
					<view class="top1_3">
						<view>
							<image src="/static/mine/lb.png"></image>
						</view>
						<view>{{ shop.notice == null ? "暂无公告" : shop.notice }}</view>
					</view>
				</view>
				<view class="top2">
					<view class="tabBar">
						<view v-for="(item, index) in tab" :key="index" :class="act == index ? 'act' : ''" @click="changeitem(index)">{{ item }}</view>
					</view>
					<view class="list" v-if="act == 0">
						<view class="list_left">
							<view :class="act1 == 0 ? 'act1' : ''" id="hot" @click="changeitem1(0, '')">
								<image src="/static/mine/hot.png"></image>热销
							</view>
							<view v-for="(item, index) in list" :key="index" :class="act1 == index + 1 ? 'act1' : ''" @click="changeitem1(index + 1, item.id)">{{ item.name }}</view>
						</view>
						<view class="list_right">
							<!--  -->
							<view v-for="(item, index) in goods" :key="index" @click="toDetail(item.id)">
								<view>
									<image :src="imgBaseUrl + item.goodsimage" class="head"></image>
								</view>
								<view class="mess">
									<view>{{ item.name }}</view>
									<view><text style="margin-right: 20rpx">销量：{{ item.sales_num }}</text><text>剩余：{{ item.num }}</text></view>
									<view>
										<view style="color: #ff3939"><text>￥</text><text style="font-size: 36rpx; font-weight: bold">{{
                        item.price
                      }}</text></view>
										<view>
											<view v-for="(it, ind) in carList" :key="ind" style="display: flex; align-items: center">
												<image src="/static/mine/jian.png" v-if="item.id == it.id" @click.stop="jian(item)"></image>
												<text v-if="item.id == it.id">{{ it.carnum }}</text>
											</view>
											<image src="/static/mine/jia.png" @click.stop="add(item)"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="list2" v-else>
						<view>
							<text style="width: 110rpx">店铺地址</text>
							<text>{{ shop.address }}</text>
						</view>
						<view>
							<text>联系方式</text>
							<text>{{ shop.phone }}</text>
						</view>
						<view>
							<text>店铺图片</text>
							<view class="img">
								<image v-for="(item, index) in shop.image" :key="index" :src="imgBaseUrl + item"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="top3" v-if="act == 0">
					<view>
						<view @click="getCar">
							<image src="/static/mine/car.png"></image>
							<text v-if="carList.length > 0">{{ carList.length }}</text>
						</view>
						<view>
							<view style="font-size: 24rpx"><text>合计：</text><text style="font-size: 36rpx">￥{{ allprice }}</text></view>
							<view style="font-size: 20rpx; color: rgba(25, 25, 25, 0.4)">另需配送费：￥{{ shop.base_send }}</view>
						</view>
					</view>
					<view @click="toOrder" :class="shop.state == 1 ? '' : 'nonexd'">{{
            shop.state == 1 && timeRange ? "去下单" : "暂停营业"
          }}</view>
				</view>

				<u-popup v-model="showCar" border-radius="14" mode="bottom">
					<view class="shopCar">
						<view class="title"><text>已选商品</text><text style="color: #ff3939" @click="delcar">清空</text></view>
						<view class="carall">
							<view class="carlist" v-for="(item, index) in carList" :key="index">
								<view>
									<image :src="imgBaseUrl + item.goodsimage" class="head"></image>
									<view>
										<view>{{ item.name }}</view>
										<view>￥{{ item.price }}</view>
									</view>
								</view>
								<view>
									<image src="/static/mine/jian.png" @click="jian(item)"></image>
									<text>{{ item.carnum }}</text>
									<image src="/static/mine/jia.png" @click="add(item)"></image>
								</view>
							</view>
						</view>
					</view>
				</u-popup>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getClass,
		getGood,
		storeDetail,
		UserStoreCollect,
	} from "../../../services/shop.js";
	export default {
		data() {
			return {
				tab: ["商品", "店铺详情"],
				act: 0,
				list: [],
				act1: 0,
				num: 0,
				goods: [],
				class_id: 0,
				showCar: false,
				navTop: getApp().globalData.navTop,
				windowHeight: getApp().globalData.windowHeight,
				navHeight: getApp().globalData.navHeight,
				page: 1,
				shop: "",
				shop_id: 1,
				timeRange: "",
				imgBaseUrl: getApp().globalData.imgBaseUrl,
				carList: [],
				allprice: 0,
			};
		},
		onShareAppMessage(res) {
			if (res.from === "button") {
				// 来自页面内转发按钮
				// console.log(1, res.target);
				return {
					title: this.shop.name,
					path: '/pages/index/schoolShop/schoolShop?store_id=' + this.shop_id,
				};
			}
			
		},
		methods: {
			toCollect(){
				UserStoreCollect({
					store_id:this.shop.id,
					status:this.shop.is_user_store_collect==0?1:0,
				}).then(res=>{
					uni.showToast({
						title:res.message,
						icon:'none',
					});
					if(res.code==200){
						this.getStore();
					}
				})
			},
			back() {
				uni.navigateBack();
			},
			// 当前时间在时间段内
			time_range(beginTime, endTime) {
				var strb = beginTime.split(":");
				if (strb.length != 2) {
					return false;
				}
				var stre = endTime.split(":");
				if (stre.length != 2) {
					return false;
				}
				var b = new Date();
				var e = new Date();
				var n = new Date();
				b.setHours(strb[0]);
				b.setMinutes(strb[1]);
				e.setHours(stre[0]);
				e.setMinutes(stre[1]);
				if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
					return true;
				} else {
					return false;
				}
			},
			toDetail(id) {
				uni.navigateTo({
					url: "/pages/index/schoolShop/goodsDetail/goodsDetail?id=" +
						id +
						"&shop_id=" +
						this.shop_id,
				});
			},
			toOrder() {
				if (this.shop.state == 1) {
					if (!this.time_range(this.shop.start_time, this.shop.end_time)) {
						uni.showToast({
							title: "该店铺已不营业",
							icon: "none",
						});
						return false;
					} else if (this.allprice < this.shop.upsendmoney) {
						uni.showToast({
							title: "未满起送金额",
							icon: "none",
						});
						return false;
					} else if (this.carList.length <= 0) {
						uni.showToast({
							title: "请选择商品",
							icon: "none",
						});
						return false;
					}
					uni.navigateTo({
						url: "/pages/index/schoolShop/goodsOrder/goodsOrder?shop_id=" +
							this.shop_id,
					});
				} else {
					return false;
				}
			},
			getgoods() {
				let data = {};
				if (this.act1 == 0) {
					data = {
						where: {
							store_id: this.shop_id,
							shelves: 1,
						},
						page: this.page,
						limit: 10000,
					};
				} else {
					data = {
						where: {
							store_id: this.shop_id,
							class_id: this.class_id,
							shelves: 1,
						},
						page: this.page,
						limit: 10,
					};
				}
				getGood(data).then((res) => {
					if (res.code == 200) {
						this.goods = this.goods.concat(res.result.data);
						// this.page++;
					}
				});
			},
			changeitem(index) {
				this.act = index;
			},
			changeitem1(index, id) {
				this.act1 = index;
				this.page = 1;
				this.goods = [];
				if (index != 0) {
					this.class_id = id;
				}
				this.getgoods();
			},

			// 添加购物车
			add(item) {
				let that = this;
				let car = uni.getStorageSync("car") || [];
				//判断购物车缓存中是否已存在该店铺
				let exist = car.find((ele) => {
					return ele.shop_id === this.shop_id;
				});
				// 存在该商铺
				if (exist) {
					// 库存为0不添加
					if (item.num == 0) {
						return false;
					}
					//如果存在，判断是否存在该商品 exist1是商品
					let exist1 = exist.cartItems.find((el) => {
						return el.id === item.id;
					});
					if (exist1) {
						// 等于库存小于不添加
						if (item.num <= exist1.carnum) {
							return false;
						}
						exist1.carnum++;
					} else {
						item.carnum = 1;
						exist.cartItems.push(item);
					}
				} else {
					item.carnum = 1;
					//如果不存在，传入该货品信息 和该店铺
					car.push({
						shop_id: this.shop_id,
						cartItems: [item],
					});
				}
				// 加入购物车数据， 存入缓存
				uni.setStorage({
					key: "car",
					data: car,
					success: function(res) {
						//添加购物车的消息提示框
						that.carList = uni.getStorageSync("car").find((ele) => {
							return ele.shop_id === that.shop_id;
						}).cartItems;
						that.allprice = 0;
						for (let i in that.carList) {
							that.allprice =
								that.allprice +
								that.carList[i].carnum * Number(that.carList[i].price);
						}
					},
				});
			},
			jian(item) {
				let that = this;
				let car = uni.getStorageSync("car") || [];
				//查找购物车中的该店铺
				let exist = car.find((ele) => {
					return ele.shop_id === this.shop_id;
				});
				let exist1 = exist.cartItems.find((el, index, arr) => {
					if (el.id === item.id) {
						if (el.carnum == 1) {
							// 删除该商品
							arr.splice(index, 1);
							if (arr.length < 1) {
								this.showCar = false;
							}
						} else {
							el.carnum--;
						}
					}
					return el.id === item.id;
				});
				// 减购物车数据， 存入缓存
				uni.setStorage({
					key: "car",
					data: car,
					success: function(res) {
						//获取购物车
						that.carList = uni.getStorageSync("car").find((ele) => {
							return ele.shop_id === that.shop_id;
						}).cartItems;
						that.allprice = 0;
						for (let i in that.carList) {
							that.allprice =
								that.allprice +
								that.carList[i].carnum * Number(that.carList[i].price);
						}
					},
				});
			},
			// 清空购物车
			delcar() {
				let that = this;
				let car = uni.getStorageSync("car") || [];
				//查找购物车中的该店铺
				let exist = car.find((ele) => {
					return ele.shop_id === this.shop_id;
				});
				exist.cartItems = [];
				this.showCar = false;
				// 减购物车数据， 存入缓存
				uni.setStorage({
					key: "car",
					data: car,
					success: function(res) {
						//获取购物车
						that.carList = uni.getStorageSync("car").find((ele) => {
							return ele.shop_id === that.shop_id;
						}).cartItems;
						that.allprice = 0;
					},
				});
			},
			getCar() {
				if (this.carList.length < 1) {
					return false;
				}
				this.showCar = !this.showCarl;
			},
			getStore(){
				storeDetail({
					id: this.shop_id, //店铺id
				}).then((res) => {
					if (res.code == 200) {
						this.shop = res.result;
						this.timeRange = this.time_range(
							this.shop.start_time,
							this.shop.end_time
						);
					}
				});
			},
		},
		onReachBottom() {
			// this.getgoods();
		},
		onLoad(options) {
			this.shop_id = options.store_id;
			// 清除缓存
			uni.removeStorageSync("issueInfo");
			uni.removeStorageSync("address_id");
			// 获取分类
			getClass({
				id: options.store_id, //店铺id
			}).then((res) => {
				if ((res.code = 200)) {
					this.list = res.result;
				}
			});
			this.getgoods();
			this.getStore();
		},
		onShow() {
			// 购物车
			let car = uni.getStorageSync("car") || [];
			//判断购物车缓存中是否已存在该店铺
			let exist = car.find((ele) => {
				return ele.shop_id === this.shop_id;
			});
			// 存在该商铺
			if (exist) {
				this.carList = exist.cartItems;
				if (this.carList.length > 0) {
					this.allprice = 0;
					for (let i in this.carList) {
						this.allprice =
							this.allprice +
							this.carList[i].carnum * Number(this.carList[i].price);
					}
				} else {
					this.allprice = 0;
				}
			} else {
				this.carList = [];
			}
		},
	};
</script>

<style scoped>
	/* pages/index/schoolShop/shopDetail/shopDetail.wxss */

	.content {
		position: relative;
	}

	.bg {
		position: absolute;
		z-index: 1;
		width: 100%;
		top: 0;
		left: 0;
	}

	.bgz {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 384rpx;
		background: rgba(0, 0, 0, 0.2);
		z-index: 2;
	}

	.top {
		position: absolute;
		z-index: 99;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		box-sizing: border-box;
		padding-bottom: 120rpx;
	}

	.nav {
		padding: 10rpx 20rpx 10rpx;
	}

	.cont {
		margin-top: 54rpx;
		background: #ffffff;
		border-radius: 18px 18px 0 0;
	}

	.top1 {
		padding: 36rpx 24rpx 28rpx;
	}

	.top1_1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
	}

	.top1_1 .name {
		position: relative;
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 8rpx;
		display: flex;
		align-items: center;
	}

	.sharebtn {
		background: transparent;
		z-index: 10;
		position: absolute;
		right: 10rpx;
		width: 90rpx;
		height: 36rpx;
		top: 8rpx;
		border-radius: 20rpx;
		padding-left: 0;
		padding-right: 0;
		line-height: 0;

	}

	button::after {
		border: none;
	}

	.top1_1 image {
		width: 100rpx;
		height: 100rpx;
		margin-right: 20rpx;
	}

	.top1_1 .share {
		width: 90rpx;
		height: 36rpx;
	}

	.top1_1>view:nth-of-type(1) {
		display: flex;
		align-items: center;
	}

	.top1_1>view:nth-of-type(2) {
		border-radius: 13px;
		border: 1px solid #333333;
		padding: 8rpx 44rpx;
	}

	.top1_2 {
		display: flex;
		align-items: center;
		padding: 8rpx 0 28rpx 120rpx;
	}

	.top1_2>view:nth-of-type(1) {
		margin-right: 20rpx;
	}

	.top1_2>view {
		font-size: 20rpx;
		color: #ff3939;
		border-radius: 10px;
		border: 1px solid #ff3939;
		padding: 2rpx 16rpx;
	}

	.top1_3 {
		display: flex;
		font-size: 24rpx;
		color: rgba(51, 51, 51, 0.6);
	}

	.top1_3 image {
		width: 38rpx;
		height: 38rpx;
		margin-right: 20rpx;
	}

	.top2 {
		border-top: 1px solid #f9f9f9;
		padding-top: 34rpx;
	}

	.tabBar {
		font-size: 28rpx;
		color: rgba(51, 51, 51, 0.8);
		padding: 0rpx 0 36rpx 58rpx;
		display: flex;
	}

	.tabBar>view {
		margin-right: 52rpx;
		padding: 4rpx 0;
	}

	.tabBar .act {
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		border-bottom: 2px solid;
	}

	.list {
		/* height: 600rpx; */
		height: 55vh;
		display: flex;
	}

	.list_left {
		background: #f3f3f3;
		font-size: 24rpx;
		color: rgba(51, 51, 51, 0.8);
		width: 144rpx;
		padding: 8rpx 0 120rpx;
		height: 100%;
		overflow-y: scroll;
	}

	.list_left>view {
		height: 90rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.list_left .act1 {
		background: #ffffff;
		color: rgba(51, 51, 51, 1);
	}

	#hot {
		color: #ff3028;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#hot image {
		width: 26rpx;
		height: 32rpx;
		margin-right: 12rpx;
	}

	.list_right {
		flex: 1;
		padding-bottom: 120rpx;
		font-size: 24rpx;
		color: rgba(51, 51, 51, 0.4);
		overflow-y: scroll;
	}

	.list_right>view {
		display: flex;
		margin-top: 24rpx;
		padding: 0 24rpx 24rpx;
	}

	.list_right>view:nth-of-type(1) {
		margin-top: 0;
	}

	.list_right .head {
		width: 192rpx;
		height: 192rpx;
		border-radius: 4px;
		margin-right: 20rpx;
	}

	.list_right .mess {
		flex: 1;
	}

	.list_right .mess>view:nth-of-type(1) {
		color: rgba(51, 51, 51, 1);
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 24rpx;
		height: 80rpx;
	}

	.list_right .mess image {
		width: 50rpx;
		height: 50rpx;
	}

	.list_right .mess>view:nth-of-type(3) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 8rpx;
	}

	.list_right .mess>view:nth-of-type(3) view:nth-of-type(2) {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.list_right .mess>view:nth-of-type(3) view:nth-of-type(2) text {
		margin: 0 16rpx;
		font-size: 32rpx;
		color: #000000;
	}

	.list2 {
		padding: 0 30rpx;
	}

	.list2>view {
		display: flex;
		font-size: 24rpx;
		margin-top: 40rpx;
		color: rgba(51, 51, 51, 0.6);
	}

	.list2>view>text:nth-of-type(1) {
		color: #333333;
		margin-right: 28rpx;
		width: 110rpx;
	}

	.list2 image {
		width: 124rpx;
		height: 124rpx;
		margin: 0 10rpx 10rpx 0;
	}

	.list2 .img {
		display: flex;
	}

	.top3 {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 116rpx;
		display: flex;
		z-index: 200;
	}

	.top3 image {
		width: 68rpx;
		height: 64rpx;
		margin: 0 60rpx 0 36rpx;
	}

	.top3>view:nth-of-type(1) {
		width: 496rpx;
		background: #fec200;
		color: #191919;
		display: flex;
		align-items: center;
	}

	.top3>view:nth-of-type(1)>view:nth-of-type(1) {
		position: relative;
	}

	.top3>view:nth-of-type(1)>view:nth-of-type(1) text {
		position: absolute;
		font-size: 24rpx;
		color: #ffffff;
		padding: 2rpx 10rpx;
		background: #ff3939;
		border-radius: 8px;
		top: -13rpx;
		left: 75rpx;
	}

	.top3>view:nth-of-type(2) {
		flex: 1;
		background: #191919;
		color: #ffffff;
		line-height: 116rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: bold;
	}

	.nonexd {
		color: #808080;
	}

	/* 购物车 */

	.shopCar {
		margin-bottom: 116rpx;
		padding: 36rpx 24rpx;
	}

	.shopCar .title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		margin-bottom: 20rpx;
	}

	.shopCar .carall {
		max-height: 620rpx;
		overflow-y: scroll;
	}

	.shopCar .carlist {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 28rpx;
	}

	.shopCar .head {
		width: 124rpx;
		height: 124rpx;
		margin-right: 24rpx;
	}

	.shopCar .carlist>view:nth-of-type(1) {
		display: flex;
		align-items: center;
		font-size: 32rpx;
		font-weight: bold;
	}

	.shopCar .carlist>view:nth-of-type(1)>view:nth-of-type(1)>view:nth-of-type(2) {
		color: #ff3939;
		margin-top: 20rpx;
		font-size: 28rpx;
		font-weight: normal;
	}

	.shopCar .carlist>view:nth-of-type(2) {
		display: flex;
		align-items: center;
	}

	.shopCar .carlist>view:nth-of-type(2) image {
		width: 52rpx;
		height: 52rpx;
	}

	.shopCar .carlist>view:nth-of-type(2) text {
		font-size: 32rpx;
		margin: 0 16rpx;
	}
</style>
