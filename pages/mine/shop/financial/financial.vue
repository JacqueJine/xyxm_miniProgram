<template>
	<view class="main">
		<view class="dateBtn" @click="show=!show">
			<!-- 2020年9月 -->
			{{showDate}}
			<u-icon name="play-right-fill"></u-icon>
		</view>
		<view class="count">
			<text>收入：999笔</text>
			<text>累计金额：9999999</text>
		</view>
		<view class="list">
			<view class="item">
				<view class="itemTop">
					<text>2020-09-01 16：23：59</text>
					<text>订单详情</text>
				</view>
				<view class="itemBottom">
					<text>茗仕梵</text>
					<text>+120.00</text>
				</view>
			</view>
		</view>
		<u-picker v-model="show" mode="time" :params="params" @confirm="setTime" @cancel="show=!show"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showDate: "",
				show: false,
				params: {
					year: true,
					month: true,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
			}
		},
		methods: {
			setTime(val) {
				this.show = !this.show;
				this.showDate = val.year + '年' + val.month + '年';
			},
			add0(m) {
				return m < 10 ? '0' + m : m
			},
			format(shijianchuo) {
				var time = new Date(shijianchuo);
				var y = time.getFullYear();
				var m = time.getMonth() + 1;
				return y + '年' + this.add0(m) + '月';
			},
		},
		onShow: function() {
			this.showDate = this.format(new Date().getTime());
		},
	}
</script>

<style scoped>
	.main {
		min-height: 100vh;
		box-sizing: border-box;
		padding: 42rpx 24rpx 0;
		background: #f2f2f2;
	}

	.dateBtn {
		background: rgba(0, 145, 255, 0.1);
		border-radius: 28rpx;
		font-size: 32rpx;
		color: #0091ff;
		display: flex;
		width: 260rpx;
		height: 56rpx;
		line-height: 56rpx;
		justify-content: center;
	}

	.count {
		padding: 38rpx 0 60rpx;
		font-size: 24rpx;
		color: rgba(51, 51, 51, 0.4);
	}

	.count text:first-child {
		margin-right: 76rpx;
	}

	.item {
		padding: 24rpx;
		margin-bottom: 24rpx;
		background: #fff;
		border-radius: 4rpx;
		color: #333;
	}

	.itemTop {
		font-size: 24rpx;
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.itemTop text:last-child {
		color: rgba(0, 145, 255, 1);
	}

	.itemBottom {
		display: flex;
		justify-content: space-between;
		font-size: 32rpx;
	}

	.itemBottom text:last-child {
		color: rgba(255, 57, 57, 1);
		font-weight: 500;
		font-size: 36rpx;
	}
</style>
