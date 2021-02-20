<template>
	<view class="content" v-if="info!=''">
		<view class="top1">
			<image :src="imgBaseUrl+info.goodsimage"></image>
		</view>
		<view class="top2">
			<view>{{info.name}}</view>
			<view>
				<view>
					<view>销量：{{info.sales_num}}</view>
					<view><text>{{shop.upsendmoney}}元起送</text><text v-if="shop.send_status==3">满{{shop.discount}}元{{shop.send_fee}}送费</text></view>
				</view>
				<view>
					<view v-for="(it,ind) in carList" :key="ind" style="display: flex;align-items: center;">
						<image src="/static/mine/jian.png" v-if="info.id == it.id" @click.stop="jian(info)"></image>
						<text v-if="info.id == it.id">{{it.carnum}}</text>
					</view>
					<image src="/static/mine/jia.png" @click="add(info)"></image>
				</view>
			</view>
		</view>
		<view class="top4">
			<view>
				<image :src="imgBaseUrl+shop.header"></image>
				<text>{{shop.name}}</text>
			</view>
			<view @click="back">进店</view>
		</view>
		<view class="top5">
			<view>商品详情</view>
			<view>{{info.introduce}}</view>
			<view class="top5img" v-if="info.picture!=null">
				<image :src="imgBaseUrl+item" mode="widthFix" v-for="(item,index) in info.picture" :key="index"></image>
			</view>
		</view>
		<view class="top3">
			<view>
				<view @click="getCar">
					<image src="/static/mine/car.png"></image>
					<!--  -->
					<text v-if="carList.length>0">{{carList.length}}</text>
				</view>
				<view>
					<view style="font-size: 24rpx;"><text>合计：</text><text style="font-size: 36rpx;">￥{{allprice}}</text></view>
					<view style="font-size: 20rpx;color: rgba(25, 25, 25, .4);">另需配送费：￥{{shop.base_send}}</view>
				</view>
			</view>
			<view @click="toOrder" :class="shop.state==1?'':'nonexd'">{{shop.state==1 && timeRange?'去下单':'暂停营业'}}</view>
		</view>
		<!-- 弹出框 -->
		<u-popup v-model="showCar" border-radius="14" mode="bottom">
			<view class="shopCar">
				<view class="title"><text>已选商品</text><text style="color: #FF3939;" @click="delcar">清空</text></view>
				<view class="carall">
					<view class="carlist" v-for="(item,index) in carList" :key="index">
						<view>
							<image :src="imgBaseUrl+item.goodsimage" class="head"></image>
							<view>
								<view>{{item.name}}</view>
								<view>￥{{item.price}}</view>
							</view>
						</view>
						<view>
							<image src="/static/mine/jian.png" @click="jian(item)"></image>
							<text>{{item.carnum}}</text>
							<image src="/static/mine/jia.png" @click="add(item)"></image>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		goodsDetail,
		storeDetail
	} from "../../../../services/shop.js"
	export default {
		data() {
			return {
				num: 0,
				showCar: false,
				info: "",
				imgBaseUrl: getApp().globalData.imgBaseUrl,
				carList: [],
				shop_id: "",
				timeRange: "",
				shop: {
					upsendmoney: 0,
					base_send: 0,
					start_time: '00:00',
					end_time: '23:59',
				},
				allprice: 0,
			}
		},
		methods: {
			back() {
				uni.navigateTo({
					url: '/pages/index/schoolShop/schoolShop?store_id=' + this.shop_id,
				});
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
			// 去下单
			toOrder() {
				if (this.shop.state == 1) {
					if (!this.time_range(this.shop.start_time, this.shop.end_time)) {
						uni.showToast({
							title: "该店铺已不营业",
							icon: 'none',
						});
						return false;
					} else if (this.allprice < this.shop.upsendmoney) {
						uni.showToast({
							title: "未满起送金额",
							icon: 'none',
						});
						return false;
					} else if (this.carList.length <= 0) {
						uni.showToast({
							title: "请选择商品",
							icon: 'none',
						});
						return false;
					}
					uni.navigateTo({
						url: "/pages/index/schoolShop/goodsOrder/goodsOrder?shop_id=" + this.shop_id,
					});
				} else {
					return false;
				}

			},
			// 添加购物车
			add(item) {
				let that = this;
				let car = uni.getStorageSync('car') || [];
				//判断购物车缓存中是否已存在该店铺
				let exist = car.find(ele => {
					return ele.shop_id === this.shop_id;
				});
				// 存在该商铺
				if (exist) {
					// 库存为0不添加
					if (item.num == 0) {
						return false;
					}
					//如果存在，判断是否存在该商品 exist1是商品
					let exist1 = exist.cartItems.find(el => {
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
					})
				};
				// 加入购物车数据， 存入缓存
				uni.setStorage({
					key: 'car',
					data: car,
					success: function(res) {
						//添加购物车的消息提示框
						that.carList = uni.getStorageSync('car').find(ele => {
							return ele.shop_id === that.shop_id;
						}).cartItems;
						that.allprice = 0;
						for (let i in that.carList) {
							that.allprice = that.allprice + that.carList[i].carnum * Number(that.carList[i].price);
						}
					}
				});
			},
			jian(item) {
				let that = this;
				let car = uni.getStorageSync('car') || [];
				//查找购物车中的该店铺
				let exist = car.find(ele => {
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
					key: 'car',
					data: car,
					success: function(res) {
						//获取购物车
						that.carList = uni.getStorageSync('car').find(ele => {
							return ele.shop_id === that.shop_id;
						}).cartItems;
						// 计算价钱
						that.allprice = 0;
						for (let i in that.carList) {
							that.allprice = that.allprice + that.carList[i].carnum * Number(that.carList[i].price);
						}
					}
				});

			},
			// 清空购物车
			delcar() {
				let that = this;
				let car = uni.getStorageSync('car') || [];
				//查找购物车中的该店铺
				let exist = car.find(ele => {
					return ele.shop_id === this.shop_id;
				});
				exist.cartItems = [];
				this.showCar = false;
				// 减购物车数据， 存入缓存
				uni.setStorage({
					key: 'car',
					data: car,
					success: function(res) {
						//获取购物车
						that.carList = uni.getStorageSync('car').find(ele => {
							return ele.shop_id === that.shop_id;
						}).cartItems;
						that.allprice = 0;
					}
				});
			},
			getCar() {
				if (this.carList.length < 1) {
					return false;
				}
				this.showCar = !this.showCarl
			},
		},
		onLoad(options) {
			this.shop_id = Number(options.shop_id);
			goodsDetail({
				id: options.id,
			}).then(res => {
				if (res.code == 200) {
					this.info = res.result;
				}
			});
			storeDetail({
				id: this.shop_id,
			}).then(res => {
				if (res.code == 200) {
					this.shop = res.result;
					this.timeRange = this.time_range(this.shop.start_time, this.shop.end_time);
				}
			});
			// 购物车
			let car = uni.getStorageSync('car') || [];
			//判断购物车缓存中是否已存在该店铺
			let exist = car.find(ele => {
				return ele.shop_id === this.shop_id;
			});
			// 存在该商铺
			if (exist) {
				this.carList = exist.cartItems;
				if (this.carList.length > 0) {
					this.allprice = 0;
					for (let i in this.carList) {
						this.allprice = this.allprice + this.carList[i].carnum * Number(this.carList[i].price);
					}
				}
			} else {
				this.carList = [];
			};
		},
	}
</script>

<style scoped>

	.content {
		background: #F9F9F9;
		min-height: 100vh;
		padding-bottom: 120rpx;
	}

	.top1 image {
		width: 100%;
		height: 750rpx;
	}

	.top2 {
		background: #FFFFFF;
		padding: 32rpx 24rpx;
	}

	.top2>view:nth-of-type(1) {
		font-size: 36rpx;
		margin-bottom: 16rpx;
	}

	.top2>view:nth-of-type(2) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
	}

	.top2>view:nth-of-type(2)>view:nth-of-type(1)>view:nth-of-type(2) {
		margin-top: 16rpx;
	}

	.top2>view:nth-of-type(2)>view:nth-of-type(1)>view:nth-of-type(2) text {
		font-size: 20rpx;
		color: #FF3939;
		padding: 2rpx 16rpx;
		border-radius: 10px;
		border: 1px solid #FF3939;
		margin-right: 20rpx;
	}

	.top2>view:nth-of-type(2)>view:nth-of-type(2) {
		display: flex;
		align-items: center;
	}

	.top2>view:nth-of-type(2)>view:nth-of-type(2) image {
		width: 64rpx;
		height: 64rpx;
	}

	.top2>view:nth-of-type(2)>view:nth-of-type(2) text {
		margin: 0 24rpx;
		font-size: 32rpx;
	}

	.top4 {
		margin-top: 28rpx;
		padding: 36rpx 24rpx;
		font-size: 28rpx;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
		background: #FFFFFF;
		align-items: center;
	}

	.top4>view:nth-of-type(1) {
		display: flex;
		align-items: center;
	}

	.top4 image {
		width: 72rpx;
		height: 72rpx;
		margin-right: 20rpx;
	}

	.top4>view:nth-of-type(2) {
		border-radius: 14px;
		border: 1px solid #979797;
		padding: 6rpx 26rpx;
		font-size: 24rpx;
		font-weight: normal;
	}

	.top5 {
		margin-top: 28rpx;
		padding: 36rpx 24rpx;
		font-size: 28rpx;
		font-weight: bold;
		background: #FFFFFF;
	}

	.top5>view:nth-of-type(2) {
		color: rgba(51, 51, 51, .8);
		margin-top: 16rpx;
		font-weight: normal;
	}


	/* 合计 */

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
		background: #FEC200;
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
		color: #FFFFFF;
		padding: 2rpx 10rpx;
		background: #FF3939;
		border-radius: 8px;
		top: -13rpx;
		left: 75rpx;
	}

	.top3>view:nth-of-type(2) {
		flex: 1;
		background: #191919;
		color: #FFFFFF;
		line-height: 116rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: bold;
	}

	.nonexd {
		color: #808080;
	}

	.top5img image {
		display: block;
		width: 100%;
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
		color: #FF3939;
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
