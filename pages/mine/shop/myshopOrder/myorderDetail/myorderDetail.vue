<template>
	<view class="content" v-if="info!=''">
		<view class="top1">
			<view>{{info.status==1?'卖家已发货，待收货':info.status==2?'已完成':'待发货'}}</view>
			<view><text>买家名称：</text><text>{{info.UserAddress.linkman}}</text></view>
			<view><text>收货地址：</text><text>{{info.UserAddress.address.pickerText}}{{info.UserAddress.detail}}</text></view>
			<view><text>联系电话：</text><text>{{info.UserAddress.phone}}</text></view>
		</view>
		<view class="top2">
			<view v-for="(item,index) in info.StoreOrderDetails" :key="index">
				<view>
					<view>
						<image :src="imgBaseUrl+item.StoreGoods.goodsimage"></image>
					</view>
					<view>{{item.StoreGoods.name}}</view>
				</view>
				<view><text>￥{{item.goods_price}}</text><text>*{{item.goods_num}}</text></view>
			</view>
		</view>
		<view class="top3">
			<view><text>订单编号</text><text>{{info.order_sn}}</text></view>
			<view><text>下单时间</text><text>{{info.create_time}}</text></view>
			<view><text>配送费</text><text>￥{{info.order_freight}}</text></view>
			<view><text>实付金额</text><text>￥{{info.pay_total}}</text></view>
		</view>
		<view class="top5">
			<view>备注</view>
			<view>{{info.note}}</view>
		</view>
		<view class="top4" v-if="info.status!=2">
			<view @click="call">联系商家</view>
			<view>{{info.status==1?'确认收货':'退款'}}</view>
		</view>
	</view>
</template>

<script>
	import {
		orderInfo
	} from '../../../../../services/shop.js';
	export default {
		data() {
			return {
				imgBaseUrl: getApp().globalData.imgBaseUrl,
				order_id: "",
				info: "",
			}
		},
		methods: {
			call() {
				uni.makePhoneCall({
					phoneNumber: this.info.store_phone,
				});
			},
		},
		onLoad(options) {
			// 1 进行中 2 已完成 3 待发货
			this.order_id = options.id;
			orderInfo({
				id: this.order_id,
			}).then(res => {
				if (res.code == 200) {
					this.info = res.result;
				}
			});
		}

	}
</script>

<style scoped>
	.content {
		min-height: 100vh;
		background: #F2F2F2;
		padding-bottom: 146rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.top1 {
		background: #FEC200;
		padding: 0 40rpx 36rpx;
	}

	.top1>view:nth-of-type(1) {
		text-align: center;
		font-size: 48rpx;
		padding: 60rpx 0 32rpx;
	}

	.top1>view {
		font-size: 24rpx;
		padding-top: 20rpx;
	}

	.top1>view text:nth-of-type(1) {
		color: rgba(33, 33, 33, .4);
	}

	.top2 {
		margin-top: 28rpx;
	}

	.top2>view {
		padding: 28rpx 24rpx;
		margin-top: 4rpx;
		background: #FFFFFF;
	}

	.top2>view>view {
		display: flex;
	}

	.top2>view>view:nth-of-type(2) {
		padding: 32rpx 0 0 164rpx;
		justify-content: space-between;
	}

	.top2>view>view image {
		width: 140rpx;
		height: 140rpx;
		margin-right: 24rpx;
	}

	.top3 {
		background: #FFFFFF;
		padding: 28rpx 24rpx 50rpx;
		height: 298rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-top: 28rpx;
	}

	.top3>view {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
	}

	.top3>view>text:nth-of-type(1) {
		color: rgba(33, 33, 33, .4);
	}

	.top3>view:nth-of-type(4)>text:nth-of-type(2) {
		font-size: 36rpx;
		color: #FF3939;
	}

	.top5 {
		background: #FFFFFF;
		padding: 24rpx;
		margin-top: 28rpx;
		font-size: 24rpx;
	}

	.top5>view:nth-of-type(1) {
		color: rgba(33, 33, 33, .4);
	}

	.top4 {
		width: 100%;
		box-sizing: border-box;
		height: 98rpx;
		background: #FFFFFF;
		position: fixed;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 24rpx 0 50rpx;
		font-size: 28rpx;
	}

	.top4>view:nth-of-type(1) {
		color: #979797;
		margin-right: 70rpx;
	}

	.top4>view:nth-of-type(2) {
		color: #FFFFFF;
		background: linear-gradient(137deg, #FEC200 0%, #FE8800 100%);
		border-radius: 16px;
		padding: 12rpx 180rpx;
	}
</style>
