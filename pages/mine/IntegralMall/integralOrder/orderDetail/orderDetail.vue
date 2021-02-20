<template>
	<view class="content">
		<view class="top1">
			<view>待发货</view>
			<view><text>买家名称：</text><text>买家名称最多一排</text></view>
			<view><text>收货地址：</text><text>买家名称最多一排</text></view>
			<view><text>联系电话：</text><text>13666666666</text></view>
		</view>
		<view class="top2">
			<view>
				<view>
					<view>
						<image src="/static/mine/name1.png"></image>
					</view>
					<view>商品名称可显示两排商品名称可显示两排商品名称可显示两排</view>
				</view>
				<view><text>￥3980.00</text><text>*1</text></view>
			</view>
		</view>
		<view class="top3">
			<view><text>订单编号</text><text>3333333333</text></view>
			<view><text>下单时间</text><text>3333333333</text></view>
			<view><text>运费</text><text>3333333333</text></view>
			<view><text>实付金额</text><text>￥33333</text></view>
		</view>
		<view class="top4" v-if="type==1">
			<view>确认收货</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 1,
			}
		},
		methods: {

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
		font-size: 32rpx;
	}

	.top4>view:nth-of-type(1) {
		background: #FEC200;
		border-radius: 20px;
		padding: 16rpx 280rpx;
	}
</style>
