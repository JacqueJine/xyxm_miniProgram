<template>
	<view class="balance">
		<view class="align">{{ credit }}</view>
		<!-- <view class='align' v-if="type==6">我的余额</view> -->
		<view class="top1" v-if="type == 16 && no_take > 0">
			您有
			<text style="color: #0091FF;padding:0 8rpx">{{ no_take }}</text>
			元收益核算中，三天后才可提现
		</view>
		<view class="btn">
			<navigator :url="'./recharge/recharge?type=' + type" v-if="type == 16">
				<view style="border: 1px solid;">{{ type == 16 ? '转余额' : '充值' }}</view>
			</navigator>
			<view :style="type == 6 ? 'width:100%;background: #FEC200;' : 'background: #FEC200;'" @click="toWithdraw">提现</view>
		</view>
		<!-- <view class="top4" v-if="type==16">
			<view>规则</view>
			<u-read-more show-height="200" :toggle="true"> -->
		<!-- <rich-text> -->
		<!-- <view style="font-size: 24rpx;">规则1：可提现收益满10元即可发起申请，平台在24小时内审核</view>
					<view style="font-size: 24rpx;">规则2：金额可转出至平台余额（余额提现无手续费）或直接提现至微信零钱</view>
					<view style="font-size: 24rpx;">规则3：提现、转出手续费为{{t_rate}}%</view> -->
		<!-- </rich-text> -->
		<!-- </u-read-more>
		</view> -->
		<!-- <view class="top4" v-else>
			<view>规则</view>
			<view>规则1：余额满10元即可发起申请，平台在24小时内审核，提现金额直接到微信零钱，无手续费</view>
		</view> -->
		<view style="padding:24rpx 0; font-weight: bold;">账单明细</view>
		<view class="content">
			<ul>
				<li v-for="(item, index) in balanceDetail" :key="index">
					<view><image style="margin-right: 10rpx;" src="/static/mine/balance1.png" /></view>
					<view style="flex:1">
						<view class="name">{{ item.note }}</view>
						<view style="color: rgba(36, 36, 36, .4);">{{ item.create_time }}</view>
					</view>
					<view :class="item.status == 1 ? 'add' : 'subtract'">{{ item.status == 1 ? '+' : '-' }}{{ item.money }}</view>
				</li>
			</ul>
			<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
		</view>
	</view>
</template>

<script>
import { getProfitNum, getWalletNum } from '../../../services/mine.js';
import { getInfoSystem } from '../../../services/function.js';
export default {
	data() {
		return {
			no_take: 0,
			type: 6,
			balanceDetail: [],
			page: 1,
			credit: 0,
			t_rate: '',
			status: 'loading',
			iconType: 'flower',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			}
		};
	},
	methods: {
		getYue() {
			getWalletNum({
				page: this.page,
				limit: 10
			}).then(res => {
				if (res.code == 200) {
					this.balanceDetail = this.balanceDetail.concat(res.result.list);
					this.credit = res.result.wallet;
					this.page++;
					if (res.result.count <= 10) {
						this.status = 'nomore';
					}
				} else {
					this.status = 'nomore';
				}
			});
		},
		getSy() {
			getProfitNum({
				page: this.page,
				limit: 10
			}).then(res => {
				if (res.code == 200) {
					this.balanceDetail = this.balanceDetail.concat(res.result.list);
					this.credit = res.result.profit;
					this.no_take = res.result.no_take;
					this.page++;
					if (res.result.count <= 10) {
						this.status = 'nomore';
					}
				} else {
					this.status = 'nomore';
				}
			});
		},
		toWithdraw() {
			// 		// 不管成功失败都执行添加任务
			uni.navigateTo({
				url: '/pages/mine/balance/withdraw/withdraw?type=' + this.type
			});
		}
	},
	onLoad(options) {
		this.type = options.type;
		if (options.type == 16) {
			uni.setNavigationBarTitle({
				title: '我的收益'
			});
			this.getSy();
		} else {
			this.getYue();
		}
		getInfoSystem({
			key: '提现费率'
		}).then(res => {
			if (res.code == 200) {
				this.t_rate = res.result.value;
			}
		});
	},

	onReachBottom() {
		if (this.status == 'nomore') {
			return false;
		}
		if (this.type == 16) {
			this.getSy();
		} else {
			this.getYue();
		}
	}
};
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
	color: rgba(36, 36, 36, 0.4);
	font-weight: normal;
}

.top1 {
	text-align: center;
	font-size: 24rpx;
}

.balance .btn {
	display: flex;
	justify-content: space-between;
	margin: 56rpx 0;
}

.balance .btn view {
	width: 314rpx;
	height: 100rpx;
	font-weight: bold;
	border-radius: 25px;
	display: flex;
	align-items: center;
	justify-content: center;
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

.content li > view:nth-of-type(2) view {
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
	color: #ff5151;
	display: flex;
	align-items: center;
	font-weight: bold;
}

/* 规则 */
.top4 {
	color: rgba(36, 36, 36, 0.4);
	font-size: 24rpx;
}

.top4 > view {
	margin-top: 22rpx;
}

.top4 > view:nth-of-type(1) {
	text-align: center;
	font-size: 28rpx;
	margin-bottom: 18rpx;
	color: rgba(36, 36, 36, 1);
}
</style>
