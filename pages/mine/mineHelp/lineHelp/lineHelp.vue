<template>
	<view class="content">
		<view class="top1">
			<view>当前学校</view>
			<!-- @click="popShow=!popShow" -->
			<view><text></text>{{curUniversity}}<text></text></view>
		</view>
		<view class="top2">
			<image src="/static/mine/jianyi.png"></image>
			<view>
				<view style="margin-bottom: 20rpx;">李经理</view>
				<view>1366666666</view>
			</view>
		</view>
		<!-- 弹出 -->
		<!-- <u-action-sheet :list="popList" v-model="popShow" @click="onSelect" border-radius="16"></u-action-sheet> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				curUniversity: "",
				popShow: false,
				popList: [{
					text: "南阳理工大学"
				}, {
					text: "郑州大学"
				}, {
					text: "南阳理工大学"
				}],
			}
		},
		methods: {
			onSelect(index) {
				this.curUniversity = this.popList[index].text
			},
		},
		onLoad() {
			this.curUniversity = JSON.parse(uni.getStorageSync("user")).school.school_name;
		},
	}
</script>

<style scoped>
	.content {
		background: #F2F2F2;
		min-height: 100vh;
		padding: 0 24rpx 40rpx;
		box-sizing: border-box;
	}

	.top1 {
		font-size: 24rpx;
		margin-bottom: 16rpx;
	}

	.top1>view:nth-of-type(1) {
		padding: 80rpx 0 20rpx;
	}

	.top1>view:nth-of-type(2) {
		background: #FFFFFF;
		border: 1px solid #ECECEC;
		padding: 26rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.top1>view:nth-of-type(2) text {
		width: 19px;
		border-top: 1px solid #979797;
		margin: 0 20rpx;
	}

	.top2 {
		display: flex;
		align-items: center;
		background: #FFFFFF;
		margin-top: 80rpx;
	}

	.top2 image {
		width: 240rpx;
		height: 240rpx;
		margin-right: 52rpx;
	}
</style>
