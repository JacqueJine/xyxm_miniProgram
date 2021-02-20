<template>
	<view class="content" v-if="alldata!=''">
		<view class="top1">
			<u-icon name="checkmark-circle" size="32" style="margin-right: 16rpx;"></u-icon>任务已完成
		</view>
		<view class="top2"> <text>￥</text> <text>{{alldata.price}}</text> </view>
		<view class="top3">本次支出 <text v-if="alldata.is_good_prepay == 1">(含手续费{{alldata.good_prepay_rate}}%，金额{{alldata.good_prepay_price}}元)</text> </view>
		<view class="top4">
			<view> <text>跑腿费</text> <text>{{alldata.money}}元</text></view>
			<view v-if="alldata.type == 2 && alldata.is_good_prepay == 1"> <text>商品预付</text> <text>{{ alldata.good_prepay }}元</text></view>
			<view v-if="alldata.is_urgent == 1"> <text>加急费</text> <text>{{ alldata.urgent_price }}元</text></view>
		</view>
		<view class="top5">
			<view>
				<view>
					<image src="/static/task/ji.png"></image> <text>+{{common[0]}}</text>
				</view>
				<view>积分</view>
			</view>
			<view>
				<view>
					<image src="/static/mine/help3.png"></image> <text>+{{common[1]}}</text>
				</view>
				<view>信誉分</view>
			</view>
		</view>
		<view class="top6" @click="toPage">
			<image mode="widthFix" src="/static/task/jiang.png"></image>
		</view>
		<view class="btn" @click="toDetail">任务详情</view>
	</view>
</template>

<script>
	import {
		getInfoTask,
		taskComplete
	} from "../../../services/function.js";
	export default {
		data() {
			return {
				alldata: '',
				common:[],//0积分 1信誉分
			}
		},
		methods: {
			toPage() {
				uni.navigateTo({
					url: "/pages/mine/mineHelp/sugges/sugges"
				})
			},
			toDetail() {
				uni.navigateBack();
			},
		},
		onLoad(options) {
			getInfoTask({
				id: options.id,
			}).then((res) => {
				if (res.code == 200) {
					this.alldata = res.result;
				}
			});
			taskComplete({
				common:"发布人"
			}).then(res=>{
				if(res.code==200){
					this.common=res.result;
				}
			})
		}
	}
</script>

<style>
	.content {
		padding: 0 28rpx;
	}

	.top1,
	.top2,
	.top3 {
		text-align: center;
	}

	.top1 {
		color: #00C85B;
		margin: 48rpx 0 0;
		font-size: 32rpx;
		font-weight: bold;
	}

	.top2 {
		font-weight: bold;
		font-size: 24rpx;
		margin-top: 32rpx;
	}

	.top2>text:nth-of-type(2) {
		font-size: 72rpx;
	}

	.top3 {
		font-size: 26rpx;
		color: rgba(36, 36, 36, .4);
		margin-top: 4rpx;
	}

	.top4 {
		margin-top: 48rpx;
		font-size: 24rpx;
	}

	.top4>view {
		margin-bottom: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.top4>view>text:nth-of-type(1) {
		color: rgba(36, 36, 36, .4);
	}

	.top5 {
		display: flex;
		justify-content: space-between;
		margin: 40rpx 0 24rpx;
		font-size: 24rpx;
	}

	.top5>view {
		padding: 54rpx 106rpx 48rpx;
	}

	.top5>view:nth-of-type(1) {
		background: #FFFAF1;
		text-align: center;
	}

	.top5>view:nth-of-type(1)>view:nth-of-type(1) {
		color: #FAAD14;
		font-size: 40rpx;
		display: flex;
		align-items: center;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.top5>view:nth-of-type(2)>view:nth-of-type(1) {
		color: #00C85B;
		font-size: 40rpx;
		display: flex;
		align-items: center;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.top5>view:nth-of-type(2) {
		background: #F3FFF8;
		text-align: center;
	}

	.top5 image {
		width: 56rpx;
		height: 56rpx;
		margin-right: 18rpx;
	}

	.top6 image {
		width: 100%;
	}

	.btn {
		position: fixed;
		bottom: 40rpx;
		left: 24rpx;
		width: 702rpx;
		height: 98rpx;
		background: #FEC200;
		border-radius: 25px;
		font-size: 36rpx;
		text-align: center;
		line-height: 98rpx;
	}
</style>
