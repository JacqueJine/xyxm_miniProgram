<template>
	<view class="content">
		<view class="top1">
			<view class="top_1">
				<view>
					<image src="/static/mine/name1.png"></image>
				</view>
				<view>
					<view>社团的名字</view>
					<view>学校姓名</view>
				</view>
			</view>
			<view class="top_2">
				<view>社团简介</view>
				<view>这是简介100个字内，显示全部.这是简介100个字内，显示全部.这是简介100个字内，显示全部.这是简介100个字内，显示全部.这是简介100个字内，显示全部.这是简介100个字内，显示全部.这是简介100个字内，显示全部.这是简介100个字内，显示全部.这是简介100个字内，显示全部.</view>
			</view>
		</view>
		<view class="top2">
			<view>
				<u-cell-item title="成员" value="240名成员" @click="toPerson"></u-cell-item>
			</view>
			<view>
				<u-cell-item title="退出社团" @click="exitClub"></u-cell-item>
			</view>
		</view>
		<view class="ts">举报/投诉</view>
		<view class="btn" @click="addClub">加入社团</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			exitClub() {
				uni.showModal({
					title: '',
					content: '确定退出吗',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			addClub() {
				uni.showToast({
					title: '申请成功',
					duration: 2000
				});
			},

			toPerson() {
				uni.navigateTo({
					url: "/pages/community/club/clubDetail/clubPersonal/clubPersonal"
				})
			},
		}
	}
</script>

<style scoped>
	.content {
		min-height: 100vh;
		background: rgba(245, 245, 245, 1);
	}

	.top1 {
		padding: 0 24rpx;
		background: #FFFFFF;
	}

	.top_1 {
		display: flex;
		align-items: center;
		padding: 48rpx 0;
		font-size: 36rpx;
		font-weight: bold;
	}

	.top_1 image {
		width: 96rpx;
		height: 96rpx;
		border-radius: 50%;
		margin-right: 24rpx;
	}

	.top_1>view:nth-of-type(2)>view:nth-of-type(2) {
		font-size: 24rpx;
		color: rgba(51, 51, 51, .4);
		font-weight: normal;
	}

	.top_2 {
		font-size: 28rpx;
		font-weight: bold;
	}

	.top_2>view:nth-of-type(2) {
		padding: 16rpx 0 44rpx;
		color: rgba(51, 51, 51, .6);
		font-weight: normal;
		text-align: justify;
	}

	.top2>view {
		background: #FFFFFF;
		margin-top: 16rpx;
	}

	.ts {
		font-size: 24rpx;
		text-align: center;
		margin-top: 50rpx;
	}

	.btn {
		width: 702rpx;
		height: 88rpx;
		background: #42A0FF;
		border-radius: 22px;
		position: absolute;
		bottom: 24rpx;
		left: 24rpx;
		font-size: 28rpx;
		font-weight: bold;
		text-align: center;
		color: #FFFFFF;
		line-height: 88rpx;
	}
</style>
