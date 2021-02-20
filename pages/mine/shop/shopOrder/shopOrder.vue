<template>
	<view class="content">
		<view class="tabBar" :style="'padding-top:'+(navTop+5)+'px;height:'+navHeight+'px;'">
			<u-icon name="arrow-left" size="50rpx" @click="back" style="margin-right: 30rpx;"></u-icon>
			<u-search placeholder="搜索订单" v-model="value" bg-color="#FFFFFF" @search="onSearch" :show-action="false"></u-search>
		</view>
		<view class="tab" :style="'margin-top:'+navHeight+'px'">
			<view :class="act==index?'act':''" v-for="(item,index) in tab" :key="index" @click="tochange(index)">
				{{item}}
			</view>
		</view>
		<view>
			<view class="top4_2" v-for="(item,index) in list" @click="toDetail(item.id)" :key="index">
				<view><text>{{item.create_time}}</text><text>订单内包含{{item.StoreOrderDetails.length}}种商品</text></view>
				<view>
					<view>
						<image :src="imgBaseUrl+item.StoreOrderDetails[0].StoreGoods.goodsimage"></image>
					</view>
					<view>
						<view><text class="act1">{{act==0?'待发货':act==1?'已发货':act==2?'已完成':''}}</text><text>{{item.StoreOrderDetails[0].StoreGoods.name}}</text></view>
						<view style="margin-top:20rpx">买家名称：{{item.UserAddress.linkman}}</view>
						<view>收货地址：{{item.UserAddress.address.pickerText}}{{item.UserAddress.detail}}</view>
					</view>
				</view>
				<view>
					<view>￥{{item.pay_total}}</view>
					<view :class="act==0?'yifu1':act==2?'yifu2':act==1?'yifu3':''">{{act==0?'发货':act==2?'查看':act==1?'已发货':''}}</view>
				</view>
			</view>
			<u-loadmore margin-top="24" margin-bottom="24" :status="orderstatus" :icon-type="iconType" :load-text="loadText" />
		</view>
	</view>
</template>

<script>
	import {
		orderList
	} from '../../../../services/shop.js';
	export default {
		data() {
			return {
				imgBaseUrl: getApp().globalData.imgBaseUrl,
				value: "",
				tab: ["待处理", "已发货", "已完成"],
				act: 0,
				navTop: getApp().globalData.navTop,
				navHeight: getApp().globalData.navHeight,
				store_id: "",
				page: 1,
				status: 3,
				list: [],
				is_show: false,
				orderstatus: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
			}
		},
		methods: {
			onSearch() {

			},
			back() {
				uni.navigateBack();
			},
			tochange(index) {
				this.orderstatus = 'loading';
				this.list = [];
				this.act = index;
				this.is_show = true;
				this.page = 1;
				if (index == 0) {
					this.status = 3;
				} else if (index == 1) {
					this.status = 1;
				} else {
					this.status = 2;
				}
				this.getList();
			},
			getList() {
				orderList({
					page: this.page,
					limit: 10,
					where: {
						store_id: this.shop_id,
						status: this.status,
					}
				}).then(res => {
					if (this.is_show) {
						this.list = [];
					}
					if (res.code == 200) {
						this.list = this.list.concat(res.result.data);
						this.page++;
						if (res.result.count <= 10) {
							this.orderstatus = "nomore";
						}
					} else {
						this.orderstatus = "nomore";
					}
				});
			},
			toDetail(id) {
				uni.navigateTo({
					url: "/pages/mine/shop/shopOrder/shopDetail/shopDetail?id=" + id,
				});
			},
		},
		onReachBottom() {
			if (this.orderstatus == "nomore") {
				return false;
			}
			this.is_show = false;
			this.getList();
		},
		onLoad(options) {
			this.shop_id = options.shop_id;
		},
		onShow() {
			this.orderstatus = 'loading';
			this.page = 1;
			this.is_show = true;
			this.list = [];
			this.getList();
		},
	}
</script>

<style scoped>
	/* pages/mine/shop/shopOrder/shopOrder.wxss */

	.content {
		min-height: 100vh;
		background: #F2F2F2;
		padding-bottom: 30rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.tabBar {
		background: #FEC200;
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx 25rpx;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 999;
	}

	.tab {
		display: flex;
		align-items: center;
		justify-content: space-around;
		font-size: 24rpx;
		height: 104rpx;
		background: #FEC200;
	}

	.act {
		font-size: 32rpx;
		border-bottom: 4rpx solid;
		padding: 8rpx 0;
	}

	.top4_2 {
		margin-top: 28rpx;
		padding: 28rpx 24rpx;
		background: #FFFFFF;
		font-size: 24rpx;
		color: rgba(33, 33, 33, .4);
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
		margin: 16rpx 034rpx;
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
		color: #2A2828;
	}

	.top4_2>view:nth-of-type(2)>view:nth-of-type(2)>view:nth-of-type(1)>text:nth-of-type(1) {
		display: inline-block;
		font-size: 20rpx;
		border-radius: 10px;
		padding: 2rpx 12rpx;
		margin-right: 4rpx;
	}

	.top4_2>view:nth-of-type(2)>view:nth-of-type(2)>view:nth-of-type(1) .act1 {
		background: #FEC200;
		color: #333333;
	}

	.top4_2>view:nth-of-type(2)>view:nth-of-type(2)>view:nth-of-type(1) .act2 {
		background: #FF594A;
		color: #FFFFFF;
	}

	.top4_2>view:nth-of-type(3) {
		padding-left: 196rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.top4_2>view:nth-of-type(3)>view:nth-of-type(1) {
		color: #FF3939;
		font-size: 32rpx;
	}

	.top4_2>view:nth-of-type(3)>view:nth-of-type(2) {
		font-size: 28rpx;
		padding: 8rpx 38rpx;
		border-radius: 14px;
	}

	.top4_2>view:nth-of-type(3) .yifu1 {
		color: #FFFFFF;
		background: linear-gradient(137deg, #FEC200 0%, #FE8800 100%);
	}

	.top4_2>view:nth-of-type(3) .yifu2 {
		color: #979797;
		border: 1px solid #979797;
	}

	.top4_2>view:nth-of-type(3) .yifu3 {
		color: #FEC200;
		background: #000000;
	}
</style>
