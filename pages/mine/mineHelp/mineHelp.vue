<template>
	<view class="all">
		<view class="top1">
			<view style="position: relative;">
				<button open-type="contact"></button>
				<image src="/static/mine/kefu.png"></image>
				<text>在线客服</text>
			</view>
			<view @click="topage(1)">
				<image src="/static/mine/jianyi.png"></image>
				<text>反馈建议</text>
			</view>
		</view>
		<view class="top1">
			<view @click="topage(2)">
				<image src="/static/mine/help3.png"></image>
				<text>信誉分</text>
			</view>
			<view @click="topage(3)">
				<image src="/static/mine/help4.png"></image>
				<text>官方认证</text>
			</view>
		</view>
		<!-- <view >使用帮助</view> -->
		<view class="top2">
			<u-collapse :item-style="itemStyle">
				<u-collapse-item :title="item.title" v-for="(item, index) in info" :key="index">
					<view v-for="(v, i) in item.content" :key="i">
						<view class="" style="padding: 8rpx 0;">{{ v }}</view>
					</view>
				</u-collapse-item>
			</u-collapse>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			itemStyle: {
				borderBottom: '1px solid #EAEAEA',
				padding: '10rpx 0'
			},
			info: [
				{
					title: '任务发布问题',
					status: false,
					content: [
						'  任何人可以发布任务，任务发布后仅本校可见；',
						'  垫付任务需支付任务手续费；紧急任务可使用加急功能，将优先派单；',
						'  如果发布任务后长时间未被接取，任务会自动取消（"其他"类任务不会），发布者也可手动取消，取消责任见[任务取消问题]；'
					]
				},
				{
					title: '任务取消问题',
					status: false,
					content: [
						'  进行中的任务需双方确认后方可取消，如有问题请联系客服处理；',
						'【发布者】',
						'  如果主动取消正在进行中的任务，需接单人进行确认，且扣除部分违约金补偿接单人；',
						'  若任务未被接取，且不超过20分钟，需扣取部分手续费；若超过20分钟，任务金额退回至个人余额；',
						'【接单者】',
						'  如果主动取消正在进行中的任务，将会受到如下处罚：',
						'  扣除信誉分（信誉分影响能否继续接单）；'
					]
				},
				{
					title: '任务结算问题',
					status: true, // true 展开 false 不展开
					content: [
						'接单者和发布者双方均确认完成后，任务金额结算至接单者个人收益；',
						'若发布者未确认完成，系统将在接单者确认完成36小时后，自动结算；',
						'任务的垫付金额，接单人完成后，垫付金额全款结算至接单人余额',
					]
				},
				{
					title: '财务问题',
					status: true, // true 展开 false 不展开
					content: [
						'余额提现不收取任何费用；',
						'收益提现、转出至余额需扣除部分手续费；',
						'提现申请成功后，提现金额到账至绑定账号的微信零钱，请注意查收；',
						'收益转出至余额 实时到账；',
					]
				},
			]
		};
	},
	methods: {
		topage(index) {
			let url = '';
			if (index == 0) {
				url = '/pages/mine/mineHelp/lineHelp/lineHelp';
			} else if (index == 1) {
				url = '/pages/mine/mineHelp/sugges/sugges';
			} else if (index == 2) {
				url = '/pages/mine/mineHelp/creditPoints/creditPoints';
			} else if (index == 3) {
				url = '/pages/mine/mineHelp/officialAuth/officialAuth';
			}
			wx.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style scoped>
.all {
	height: 100vh;
	background: rgba(255, 255, 255, 1);
	display: flex;
	flex-direction: column;
	overflow: auto;
	padding: 24rpx;
	box-sizing: border-box;
	font-family: PingFangSC-Medium, PingFang SC;
	padding-bottom: 100rpx;
}

.top1 {
	display: flex;
	justify-content: space-between;
	margin-top: 16rpx;
}

.top1 > view {
	background: #f9f9f9;
	border-radius: 8px;
	padding: 32rpx 48rpx;
	font-size: 24rpx;
	display: flex;
	align-items: center;
	width: 344rpx;
	box-sizing: border-box;
	height: 148rpx;
}

.top1 > view image {
	width: 84rpx;
	height: 84rpx;
	margin-right: 18rpx;
}

.top2 {
	margin-top: 44rpx;
}

button {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: transparent;
	z-index: 10;
}
</style>
