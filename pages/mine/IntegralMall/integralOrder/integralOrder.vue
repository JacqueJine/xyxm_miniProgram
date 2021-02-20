<template>
	<view class="content">
		<view class="tabBar" :style="'padding-top:'+(navTop+5)+'px;height:'+navHeight+'px;line-height:'+navHeight+'px'">
			<u-icon name="arrow-left" size="50rpx" @click="back" style="margin-right: 30rpx;"></u-icon>
			<u-search placeholder="搜索订单" v-model="value" bg-color="#FFFFFF" @search="onSearch" :show-action="false"></u-search>
		</view>
		<view class="tab" :style="'margin-top:'+navHeight+'px'">
			<view :class="act==index?'act':''" v-for="(item,index) in tab" :key="index" @click="tochange(index)">
				{{item}}
			</view>
		</view>
		<view>
			<view class="top4_2" @click="toDetail" v-for="(item,index) in 10" :key="index">
				<view>2020-9-18 16:00:00</view>
				<view>
					<view>
						<image src="/static/mine/name1.png"></image>
					</view>
					<view>
						<view class="title">商品名称显示一排</view>
						<view class="title2">
							<view><text style="color: #FF3939;font-size: 38rpx;">666积分</text><text>+12元</text></view>
							<view :class="act==1?'yifu1':act==2 || act==0?'yifu2':''">{{act==1?'确认收货':act==2 || act==0?'查看':''}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: "",
				tab: ["待发货", "待收货", "已完成"],
				act: 0,
				navTop: getApp().globalData.navTop,
				navHeight: getApp().globalData.navHeight
			}
		},
		methods: {
			onSearch() {
				// uni.showToast({
				// 	title: '搜索' + this.data.value,
				// 	icon: 'none'
				// })
			},
			back() {
				uni.navigateBack();
			},
			tochange(index) {
				this.act = index;
			},
			toDetail() {
				uni.navigateTo({
					url: "/pages/mine/IntegralMall/integralOrder/orderDetail/orderDetail",
				});
			},
		}
	}
</script>

<style scoped>
	.content {
		min-height: 100vh;
		background: #F2F2F2;
		padding-bottom: 30rpx;
		box-sizing: border-box;
	}

	.tabBar {
		background: #FEC200;
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx 25rpx;
		position: fixed;
		left: 0;
		top: 0;
		width:100%;
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

	.top4_2>view:nth-of-type(2) {
		display: flex;
		align-items: center;
		font-size: 28rpx;
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
	}

	.top4_2 .title {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		color: #2A2828;
	}

	.top4_2 .title2 {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.top4_2 .title2>view:nth-of-type(2) {
		font-size: 28rpx;
		padding: 8rpx 30rpx;
		border-radius: 14px;
	}

	.top4_2>view:nth-of-type(2) .yifu1 {
		color: #FFFFFF;
		background: linear-gradient(137deg, #FEC200 0%, #FE8800 100%);
	}

	.top4_2>view:nth-of-type(2) .yifu2 {
		color: #979797;
		border: 1px solid #979797;
	}

	.top4_2>view:nth-of-type(2) .yifu3 {
		color: #FEC200;
		background: #000000;
	}
</style>
