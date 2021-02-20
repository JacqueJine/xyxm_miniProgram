<template>
	<view class="content" v-if="shop!=''">
		<view class="top1">
			<view>
				<view>
					<image :src="imgBaseUrl+shop.header"></image>{{shop.name}}
				</view>
				<view @click="showStatus = !showStatus">
					<view :style="shop.state==2?'background:#FF3939':''"></view>
					<view :class="shop.state==2?'red':''">{{shop.state==1?'营业中':'暂停营业'}}</view>
				</view>
			</view>
			<view @click="topage(0)">
				<u-icon name="setting" size="48rpx"></u-icon>
				<!-- <image src="/static/mine/set.png"></image> -->
			</view>
		</view>
		<view class="top2">
			<view>
				<view>
					<text :class="is_today==1?'avtive':''" @click="tochange">今日</text>
					<text :class="is_today==0?'avtive':''" @click="tochange">昨日</text>
				</view>
				<view class="mx" @click="topage(6)">
					<text>收款明细</text>
				</view>
			</view>
			<view>
				<view>
					<text>{{is_today==1?'今日':'昨日'}}收款</text>
					<text>55555555.00<text style="font-size: 24rpx;">元</text> </text>
				</view>
				<view>
					<text>{{is_today==1?'今日':'昨日'}}订单</text>
					<text>55555<text style="font-size: 24rpx;">笔</text> </text>
				</view>
			</view>
			<view @click="topage(7)">
				<text>总收益</text>
				<text>5646126.00元</text>
				<u-icon name="arrow-right" color="#B3B2B2" style="margin-left:8rpx"></u-icon>
			</view>
		</view>
		<view class="top3">
			<!-- <van-notice-bar backgroundColor="#ffffff" text="" color="#838282">
				<view slot="left-icon" style="color: #FF3939;margin-right:10rpx;">公告</view>
			</van-notice-bar> -->
			<u-notice-bar mode="horizontal" :list="list"></u-notice-bar>
			<view class="top3_2">
				<view @click="topage(3)">
					<!-- <image src="/static/mine/up.png"></image> -->
					<text style="color: #0096FF;font-size: 50rpx; font-weight: bold;">{{up_good}}</text>
					<view>上架商品 </view>
				</view>
				<view @click="topage(5)">
					<image src="/static/mine/add.png"></image>
					<view>添加商品</view>
				</view>
				<view @click="topage(4)">
					<!-- <image src="/static/mine/down.png"></image> -->
					<text style="color: #FF3E3C;font-size: 50rpx; font-weight: bold;">{{down_good}}</text>
					<view>下架商品</view>
				</view>

			</view>
		</view>
		<view class="top4">
			<view class="top4_1">
				<view>最新消息</view>
				<view @click="topage(1)">
					<text> 全部订单</text>
					<van-icon name="arrow" color="#A6A5A5" />
				</view>
			</view>
			<view class="top4_2" v-for="(item,index) in goods" @click="topage(2,item.id)" :key="index">
				<view><text>{{item.create_time}}</text><text>订单内包含{{item.StoreOrderDetails.length}}种商品</text></view>
				<view>
					<view>
						<image :src="imgBaseUrl+item.StoreOrderDetails[0].StoreGoods.goodsimage"></image>
					</view>
					<view>
						<view><text class="act1">{{item.status==3?'待发货':item.status==1?'已发货':item.status==2?'已完成':''}}</text><text>{{item.StoreOrderDetails[0].StoreGoods.name}}</text></view>
						<view style="margin-top:20rpx">买家名称：{{item.UserAddress.linkman}}</view>
						<view>收货地址：{{item.UserAddress.address.pickerText}}{{item.UserAddress.detail}}</view>
					</view>
				</view>
				<view>
					<view>￥{{item.pay_total}}</view>
					<view :class="item.status==3?'yifu1':item.status==2?'yifu2':item.status==1?'yifu3':''">{{item.status==3?'发货':item.status==2?'查看':item.status==1?'已发货':''}}</view>
				</view>
			</view>
		</view>
		<!-- 弹窗 -->
		<u-popup v-model="showStatus" mode="center" border-radius="8">
			<view class="top5">
				<view style="color: rgba(51, 51, 51, .6);">店铺状态</view>
				<view @click="changeStatus(1)"><text class="green">营业中</text>
					<image :src="statusType==1?'/static/mine/checked.png':'/static/mine/check.png'"></image>
				</view>
				<view @click="changeStatus(2)"><text class="red">暂停营业</text>
					<image :src="statusType==2?'/static/mine/checked.png':'/static/mine/check.png'"></image>
				</view>
				<view style="color: #47AFFF;" @click="setItem">保存设置</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import {
		hotCount,
		storeDetail,
		CreateStore,
		orderList
	} from '../../../services/shop.js';
	export default {
		data() {
			return {
				imgBaseUrl: getApp().globalData.imgBaseUrl,
				shopId: "",
				up_good: 0,
				down_good: 0,
				is_today: 1,
				statusType: 0,
				showStatus: false,
				list: ["在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"],
				shop: "",
				goods: [],
			}
		},
		methods: {
			tochange() {
				if (this.is_today == 1) {
					this.is_today = 0;
				} else {
					this.is_today = 1;
				}
			},
			// 修改店铺是否营业
			setItem() {
				CreateStore({
					id: this.shopId,
					data: {
						state: this.statusType,
					}
				}).then(res => {
					uni.showToast({
						title: res.message,
						icon: 'none',
					});
					if (res.code == 200) {
						this.getDetail();
						this.showStatus = !this.showStatus;
					}
				})
				// 
			},
			changeStatus(index) {
				this.statusType = index;
			},
			getDetail() {
				storeDetail({
					id: this.shopId, //店铺id
				}).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						this.shop = res.result;
						this.statusType = res.result.state;
					}
				});
			},
			// 获取最新商品订单
			getList() {
				orderList({
					page: 1,
					limit: 10,
					where: {
						store_id: this.shopId,
					}
				}).then(res => {
					if (res.code == 200) {
						this.goods = res.result.data;
					}
				});
			},
			topage(index,id) {
				let url = "";
				// 设置
				if (index == 0) {
					url = "/pages/mine/shop/shopSetting/shopSetting?shopId=" + this.shopId;
				}
				//订单列表
				else if (index == 1) {
					url = "/pages/mine/shop/shopOrder/shopOrder?shop_id="+this.shopId;
				}
				//订单详情
				else if (index == 2) {
					url = "/pages/mine/shop/shopOrder/shopDetail/shopDetail?id="+id;
				}
				//上架商品
				else if (index == 3) {
					url = `/pages/mine/shop/shopGoods/goodsList/goodsList?id=1`;
				}
				//下架商品
				else if (index == 4) {
					url = `/pages/mine/shop/shopGoods/goodsList/goodsList?id=0`;
				}
				//添加商品
				else if (index == 5) {
					url = `/pages/mine/shop/shopGoods/addGoods/addGoods`;
				}
				//收款明细
				else if (index == 6) {
					url = `/pages/mine/shop/financial/financial`;
				}
				// 总收益
				else if (index == 7) {
					url = `/pages/mine/shop/shopEarnings/shopEarnings`;
				}
				uni.navigateTo({
					url: url,
				})
			},
		},
		onLoad(options) {
			uni.showLoading({
				title:"加载中"
			});
			this.shopId = options.store_id;
		},
		onShow() {
			// 上下架商品统计
			hotCount({
				id: this.shopId, //店铺id
			}).then(res => {
				if (res.code == 200) {
					this.down_good = res.result.down_good;
					this.up_good = res.result.up_good;
				}
			});
			// 店铺详情
			this.getDetail();
			// 订单
			this.getList();
		},
	}
</script>

<style scoped>
	/* pages/mine/shop/shop.wxss */

	.content {
		min-height: 100vh;
		background: #f2f2f2;
		padding-bottom: 30rpx;
	}

	.top1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 36rpx 36rpx 194rpx 36rpx;
		background: #fec200;
		font-size: 34rpx;
		font-weight: 500;
	}

	.top1>view:nth-of-type(1) {
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		padding-right: 28rpx;
		flex: 1;
	}

	.top1>view:nth-of-type(2) {
		display: flex;
	}

	.top1>view:nth-of-type(1)>view:nth-of-type(1) {
		display: flex;
		align-items: center;
		margin-right: 20rpx;
	}

	.top1>view:nth-of-type(1)>view:nth-of-type(2) {
		display: flex;
		align-items: center;
		font-size: 20rpx;
		border-radius: 18rpx;
		background: #fff;
		padding: 6rpx 16rpx;
		color: #00c85b;
	}

	.top1>view:nth-of-type(1)>view:nth-of-type(2)>view:nth-of-type(1) {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background: #00c85b;
		margin-right: 8rpx;
	}

	.top1 image:nth-of-type(1) {
		margin-right: 16rpx;
	}

	.top1 image {
		width: 40rpx;
		height: 40rpx;
		border-radius: 2px;
	}

	.top2 {
		padding: 32rpx 28rpx;
		background: #fff;
		border-radius: 8px;
		width: 702rpx;
		box-sizing: border-box;
		position: absolute;
		top: 106rpx;
		left: 24rpx;
	}

	.top2>view:nth-of-type(1) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
	}

	.top2>view:nth-of-type(1)>view:nth-of-type(1) text {
		display: inline-block;
		border-radius: 8px;
		padding: 4rpx 14rpx;
	}

	.top2>view:nth-of-type(1)>view:nth-of-type(1) text:nth-of-type(1) {
		margin-right: 20rpx;
	}

	.top2 .mx text {
		display: inline-block;
		color: #0091ff;
		border-radius: 8px;
		padding: 4rpx 18rpx;
		background: #e5f4ff;
	}

	.avtive {
		color: #fec200;
		background: #2a2828;
	}

	/* .top2 .mx text:nth-of-type(1) {
    margin-right: 28rpx;
} */

	.top2>view:nth-of-type(2) {
		display: flex;
		justify-content: space-between;
		margin: 46rpx 0 38rpx;
		font-size: 24rpx;
		color: rgba(33, 33, 33, 0.6);
	}

	.top2>view:nth-of-type(2)>view {
		display: flex;
		justify-content: space-around;
		flex-direction: column;
	}

	.top2>view:nth-of-type(2)>view>text:nth-of-type(2) {
		color: #15b998;
		font-size: 48rpx;
		margin-top: 8rpx;
	}

	.top2>view:nth-of-type(3) {
		font-size: 28rpx;
		display: flex;
		align-items: center;
	}

	.top2>view:nth-of-type(3) text:nth-of-type(1) {
		color: rgba(33, 33, 33, 0.4);
		margin-right: 16rpx;
		font-size: 24rpx;
	}

	.top3 {
		padding: 0 24rpx;
		margin-top: 214rpx;
	}

	.top3_2 {
		margin-top: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.top3_2>view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		font-size: 24rpx;
		width: 220rpx;
		height: 164rpx;
		border-radius: 4px;
		color: #909090;
		box-sizing: border-box;
		padding: 20rpx 0;
	}

	.top3_2>view:nth-of-type(1) {
		background: #dfeef9;
	}

	.top3_2>view:nth-of-type(3) {
		background: #f9e9e7;
	}

	.top3_2>view:nth-of-type(2) {
		background: #f8f0df;
		color: #fe9300;
	}

	.top3_2>view image {
		width: 62rpx;
		height: 62rpx;
	}

	.top4 {
		margin-top: 80rpx;
	}

	.top4_1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 24rpx;
		font-size: 32rpx;
	}

	.top4_1>view:nth-of-type(2) {
		display: flex;
		align-items: center;
		color: #a6a5a5;
	}

	.top4_1>view:nth-of-type(2) text {
		margin-right: 18rpx;
	}

	.top4_2 {
		margin-top: 28rpx;
		padding: 28rpx 24rpx;
		background: #fff;
		font-size: 24rpx;
		color: rgba(33, 33, 33, 0.4);
	}

	.top4_2>view:nth-of-type(1) {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.top4_2>view:nth-of-type(2) {
		display: flex;
		align-items: center;
	}

	.top4_2>view:nth-of-type(2) image {
		width: 140rpx;
		height: 140rpx;
		margin: 16rpx 34rpx;
	}

	.top4_2>view:nth-of-type(2)>view:nth-of-type(2) {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 140rpx;
		flex: 1;
		padding: 0 0 10rpx;
	}

	.top4_2>view:nth-of-type(2)>view:nth-of-type(2) view {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 506rpx;
	}

	.top4_2>view:nth-of-type(2)>view:nth-of-type(2)>view:nth-of-type(1) {
		font-size: 28rpx;
		color: #2a2828;
	}

	.top4_2>view:nth-of-type(2)>view:nth-of-type(2)>view:nth-of-type(1)>text:nth-of-type(1) {
		display: inline-block;
		font-size: 20rpx;
		border-radius: 10px;
		padding: 2rpx 12rpx;
		margin-right: 4rpx;
	}

	.top4_2>view:nth-of-type(2)>view:nth-of-type(2)>view:nth-of-type(1) .act1 {
		background: #fec200;
		color: #333;
	}

	.top4_2>view:nth-of-type(2)>view:nth-of-type(2)>view:nth-of-type(1) .act2 {
		background: #ff594a;
		color: #fff;
	}

	.top4_2>view:nth-of-type(3) {
		padding-left: 196rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.top4_2>view:nth-of-type(3)>view:nth-of-type(1) {
		color: #ff3939;
		font-size: 32rpx;
	}

	.top4_2>view:nth-of-type(3)>view:nth-of-type(2) {
		font-size: 28rpx;
		padding: 8rpx 38rpx;
		border-radius: 14px;
	}

	.top4_2>view:nth-of-type(3) .yifu1 {
		color: #fff;
		background: linear-gradient(137deg, #fec200 0%, #fe8800 100%);
	}

	.top4_2>view:nth-of-type(3) .yifu2 {
		color: #979797;
		border: 1px solid #979797;
	}

	.top4_2>view:nth-of-type(3) .yifu3 {
		color: #fec200;
		background: #000;
	}

	/* 弹窗 */

	.green {
		color: #00c85b;
	}

	.red {
		color: #ff3939;
	}

	.top5 image {
		width: 32rpx;
		height: 32rpx;
	}

	.top5 {
		width: 492rpx;
		height: 444rpx;
		background: #fff;
		border-radius: 4px;
		padding: 34rpx 38rpx 48rpx;
		box-sizing: border-box;
	}

	.top5>view:nth-of-type(1),
	.top5>view:nth-of-type(4) {
		text-align: center;
	}

	.top5>view:nth-of-type(2),
	.top5>view:nth-of-type(3) {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.top5>view:nth-of-type(2),
	.top5>view:nth-of-type(3),
	.top5>view:nth-of-type(4) {
		margin-top: 60rpx;
	}
</style>
