<template>
	<view class="balance">
		<view class='align'>{{integral}}</view>
		<view class='align'>我的积分</view>
		<view style="padding:24rpx 0; font-weight: bold;border-top:2rpx solid rgba(151, 151, 151, 0.2)">账单明细</view>
		<view class='content'>
			<ul>
				<li v-for="(item,index) in balanceDetail" :key="index">
					<view>
						<image style="margin-right: 10rpx;" src="/static/mine/balance1.png" />
					</view>
					<view style='flex:1'>
						<view class='name'>{{item.note}}</view>
						<view style="color: rgba(36, 36, 36, .4);">{{item.create_time}}</view>
					</view>
					<view :class="item.status==1?'add':'subtract'">{{item.status==1?'+':'-'}}{{item.point}}</view>
				</li>
			</ul>
			<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
		</view>
	</view>
</template>

<script>
	import {
		getUserIntegral
	} from "../../../../services/mine.js";
	export default {
		data() {
			return {
				integral: 0,
				balanceDetail: [],
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				page:1,
			}
		},
		methods: {
			getIntegral(){
				getUserIntegral({
					page: this.page,
					limit: 10,
				}).then(res => {
					if (res.code == 200) {
						this.balanceDetail = this.balanceDetail.concat(res.result.list);
						this.integral = res.result.integral;
						this.page++;
						if (res.result.count <= 10) {
							this.status = 'nomore';
						}
					} else {
						this.status = 'nomore';
					}
				});
			},
		},
		onLoad() {
			this.getIntegral();
		},
		onReachBottom() {
			if(this.status == 'nomore'){
				return false;
			}
			this.getIntegral();
		},
	}
</script>

<style scoped>
	.balance {
		padding: 0 40rpx;
		box-sizing: border-box;
		font-size: 32rpx;
	}

	.balance .align {
		text-align: center;
		font-weight: bold;
	}

	.balance .align:nth-of-type(1) {
		font-size: 100rpx;
		margin: 120rpx 0 24rpx;
	}

	.balance .align:nth-of-type(2) {
		font-size: 28rpx;
		color: rgba(36, 36, 36, .4);
		font-weight: normal;
		margin-bottom: 56rpx;
	}

	.content image {
		width: 40rpx;
		height: 40rpx;
	}

	.content li {
		display: flex;
		padding: 22rpx 0;
		border-bottom: 2rpx solid rgba(151, 151, 151, 0.2);
	}

	.content li:last-of-type {
		border-bottom: none;
	}

	.content li {
		font-size: 24rpx;
	}

	.content li .name {
		font-size: 28rpx;
		font-weight: bold;
	}

	.content li>view:nth-of-type(2) view {
		line-height: 40rpx;
	}

	.content li .add {
		font-size: 40rpx;
		color: #333333;
		display: flex;
		align-items: center;
		font-weight: bold;
	}

	.content li .subtract {
		font-size: 40rpx;
		color: #FF5151;
		display: flex;
		align-items: center;
		font-weight: bold;
	}
</style>
