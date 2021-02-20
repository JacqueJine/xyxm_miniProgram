<template>
	<view class="content">
		<view class="top1">
			<view class="title">商务合作</view>
			<view class="list" @click="call">
				<view>
					<image src="/static/mine/he1.png"></image><text>广告合作</text>
				</view>
				<u-icon name="arrow-right" color="#979797"></u-icon>
			</view>
			<view class="list" @click="call">
				<view>
					<image src="/static/mine/he2.png"></image><text>商务咨询</text>
				</view>
				<u-icon name="arrow-right" color="#979797"></u-icon>
			</view>
			<view class="list" @click="call">
				<view>
					<image src="/static/mine/he3.png"></image><text>加盟咨询</text>
				</view>
				<u-icon name="arrow-right" color="#979797"></u-icon>
			</view>
		</view>
		<view class="top2">
			<view class="title">项目开发</view>
			<view class="list">
				<view>
					<image src="/static/mine/he4.png"></image><text>APP开发</text>
				</view>
				<view>
					<image src="/static/mine/he5.png"></image><text>小程序开发</text>
				</view>
			</view>
			<view class="list">
				<view>
					<image src="/static/mine/he6.png"></image><text>网站开发</text>
				</view>
				<view>
					<image src="/static/mine/he7.png"></image><text>软件开发</text>
				</view>
			</view>
			<!-- <view class="list2" @click="call">
				<view>
					<image src="/static/mine/he8.png"></image><text>更多请咨询业务经理</text>
				</view>
				<u-icon name="arrow-right" color="#979797"></u-icon>
			</view> -->
			<view class="list3">
				<cell @startmessage='startmessage' @completemessage="completemessage" plugid='03c90177b741a038a8eb8660b894c8c0' />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				call() {
					uni.makePhoneCall({
						phoneNumber: '13666666666' //仅为示例，并非真实的电话号码
					})
				},
			}
		},
		methods: {


		}
	}
</script>

<style scoped>
	.content {
		padding: 0 24rpx;
		font-size: 28rpx;
	}

	.title {
		font-weight: bold;
		margin-top: 52rpx;
	}

	.top1 .list,
	.list2 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 40rpx;
		background: #F9F9F9;
		border-radius: 8px;
		margin-top: 28rpx;
	}

	.top1 .list image {
		width: 48rpx;
		height: 48rpx;
		margin-right: 20rpx;
	}

	.top2 .list {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.top1 .list>view,
	.list2>view {
		display: flex;
		align-items: center;
	}

	.top2 .list>view {
		padding: 40rpx 0 40rpx 40rpx;
		margin-top: 28rpx;
		display: flex;
		align-items: center;
		background: #F9F9F9;
		border-radius: 8px;
		box-sizing: border-box;
		width: 342rpx;
		height: 148rpx;
	}

	.top2 .list image {
		width: 68rpx;
		height: 68rpx;
		margin-right: 24rpx;
	}

	.list2 image {
		width: 68rpx;
		height: 68rpx;
		margin-right: 24rpx;
	}

	.list3 {
		padding: 30rpx 40rpx;
		background: #F9F9F9;
		border-radius: 8px;
		margin-top: 28rpx;
	}
	/deep/ .cell--nickname{
		font-weight: normal;
		font-size: 28rpx;
	}
	/deep/ .cell--service_with_avator {
	    width: 68rpx;
	    height: 68rpx;
	}
</style>
