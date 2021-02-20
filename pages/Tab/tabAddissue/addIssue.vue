<template>
	<view class="content">
		<image src="/static/issue/bg.png"></image>
		<view class="top">
			<view class="top_1">发布一些任务，你的校友可以查看接单哦</view>
			<viwe class="top_2">
				<view class="top_3">
					<view class="per" v-for="(item,index) in functionList" :key="index" @click="toFunctionModule(index)">
						<image :src="item.logo"></image>
						<view>{{item.title}}</view>
					</view>
				</view>
				<view class="top_4" @click="addComm">
					<view>
						<image src="/static/index/comm1.png"></image> <text>发布动态</text>
					</view>
					<view>跟全国的高校同学分享快乐吧</view>
				</view>
			</viwe>
		</view>
	</view>
</template>

<script>
	import {
		getUnreadOrEmpty
	} from "../../../services/message.js";
	export default {
		data() {
			return {
				functionList: [{
					logo: "/static/issue/1.png",
					title: "快递帮"
				}, {
					logo: "/static/issue/2.png",
					title: "校园跑腿"
				}, {
					logo: "/static/issue/3.png",
					title: "其他任务"
				}],
			}
		},
		onShow() {
			// 清除缓存
			uni.removeStorage({
				key: 'issueInfo',
				success: function(res) {
					// console.log('success');
				}
			});
			if (uni.getStorageSync("token")) {
				getUnreadOrEmpty().then(res => {
					if (res.code == 200) {
						uni.showTabBarRedDot({
							index: 3
						});
					} else {
						uni.hideTabBarRedDot({
							index: 3
						});
					}
				});
			}
		},
		onLoad() {

		},
		methods: {
			toFunctionModule(index) {
				if (index == 0) {
					uni.navigateTo({
						url: "/pages/addIssue/expressageIssue/expressageIssue"
					})
				} else {
					uni.navigateTo({
						url: "/pages/addIssue/otherIssue/otherIssue?issueType=" + index,
					});
				}
			},
			addComm() {
				uni.navigateTo({
					url: "/pages/community/addComm/addComm?type=1",
				});
			},
		}
	}
</script>

<style scoped>
	.content {
		min-height: 100vh;
		position: relative;
		font-size: 32rpx;
	}

	.content>image {
		width: 100%;
		height: 100vh;
		position: absolute;
		z-index: 1;
	}

	.top {
		padding: 0 28rpx;
		position: absolute;
		z-index: 10;
		height: 100vh;
	}

	.top_1 {
		font-size: 48rpx;
		margin: 76rpx 0 24rpx;
	}

	.top_2 {
		position: fixed;
		width: 100%;
		bottom: 40rpx;
		left: 0;
	}

	.top_3 {
		display: flex;
		justify-content: space-between;
		padding: 40rpx 40rpx 0;
		margin: 0 0 40rpx;

	}

	.top_3 .per {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		padding: 38rpx 0;
		border-radius: 10px;
		width: 200rpx;
	}

	.top_3 .per:nth-of-type(1) {
		background: #FFF7DE;
		color: #FDA608;
	}

	.top_3 .per:nth-of-type(2) {
		background: #FFF1EC;
		color: #FE7153;
	}

	.top_3 .per:nth-of-type(3) {
		background: #E4FFF0;
		color: #00C85B;
	}

	.top_3 image {
		height: 84rpx;
		width: 84rpx;
	}

	.top_4 {
		margin: 0 40rpx 0;
		text-align: center;
		padding: 32rpx 0;
		background: #0094FF;
		border-radius: 10px;
		font-size: 24rpx;
		color: rgba(253, 253, 252, .4);
	}

	.top_4 image {
		width: 42rpx;
		height: 42rpx;
		margin-right: 16rpx;
	}

	.top_4>view:nth-of-type(1) {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		font-size: 32rpx;
	}
</style>
