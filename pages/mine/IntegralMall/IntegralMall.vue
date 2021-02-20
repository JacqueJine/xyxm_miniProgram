<template>
	<view class="content">
		<view class="top1">
			<view class="top1_1">
				<view>
					<view>我的积分</view>
					<view @click="toCredits">
						<u-icon name="clock"></u-icon>积分记录
					</view>
				</view>
				<view>
					<view class="num">2003</view>
					<view class="sign">已签到</view>
				</view>
			</view>
			<view class="top1_2">
				<view class="qian">
					<view>连续签到取大礼</view>
					<view>已连续签到<text>11</text>天</view>
				</view>
				<view class="bao">
					<view v-for="(item,index) in 6" :key="index">
						<image src="/static/mine/bao1.png"></image>
						<view>可领取</view>
					</view>
				</view>
			</view>
		</view>
		<view style="margin-top: 180rpx;padding:0 24rpx">
			<!-- 实物礼包 -->
			<view class="conten">
				<text class='name'>实物礼包</text>
				<navigator url="./integralDetail/integralDetail?type=1" style="font-size: 26rpx;color:#979797;font-weight: normal;">
					全部商品
					<u-icon name="arrow-right" color="#ADADAD" size="24rpx"></u-icon>
				</navigator>
			</view>
			<ul class='ul2'>
				<li v-for="(item,index) in entity" :key="index" @click="toGoodsDetail(item.id)">
					<!-- 函数传参用data-   -->
					<image :src="item.image" />
					<image v-if="item.is_sell" src="/static/mine/sellout.png" class="sellout" />
					<view class='name_'>{{item.title}}</view>
					<view style="font-size: 20rpx;">
						<text class="colorRed">{{item.credit}}积分</text>
						<text class="colorBlack" v-if="item.pay_price!='0.00'">+{{item.pay_price}}元</text>
					</view>

				</li>
			</ul>
			<!-- 现金礼包 -->
			<view class="conten">
				<text class='name'>现金礼包</text>
				<navigator url="./integralDetail/integralDetail?type=2" style="font-size: 26rpx;color:#979797;font-weight: normal;">
					全部商品
					<u-icon name="arrow-right" color="#ADADAD" size="24rpx"></u-icon>
				</navigator>
			</view>
			<ul class='ul2'>
				<li v-for="(item,index) in cash" :key="index" @click="toGoodsDetail(item.id)">
					<image :src="item.image" />
					<image v-if="item.is_sell" src="/static/mine/sellout.png" class="sellout" />
					<view class='name_'>{{item.title}}</view>
					<view style="font-size: 20rpx;">
						<text class="colorRed">{{item.credit}}积分</text>
						<text class="colorBlack" v-if="item.pay_price!='0.00'">+{{item.pay_price}}元</text>
					</view>
				</li>
			</ul>
			<!-- 其他礼包 -->
			<view class="conten">
				<text class='name'>其他礼包</text>
				<navigator url="./integralDetail/integralDetail?type=3" style="font-size: 26rpx;color:#979797;font-weight: normal;">
					全部商品
					<u-icon name="arrow-right" color="#ADADAD" size="24rpx"></u-icon>
				</navigator>
			</view>
			<ul class='ul2'>
				<li v-for="(item,index) in other" :key="index" @click="toGoodsDetail(item.id)">
					<image :src="item.image" />
					<image v-if="item.is_sell" src="/static/mine/sellout.png" class="sellout" />
					<view class='name_'>{{item.title}}</view>
					<view style="font-size: 20rpx;">
						<text class="colorRed">{{item.credit}}积分</text>
						<text class="colorBlack" v-if="item.pay_price!='0.00'">+{{item.pay_price}}元</text>
					</view>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 实物礼包
				entity: [{
					image: "/static/mine/bao2.png",
					title: "hhhhh",
					price: "30",
					credit: 20,
					is_sell: true
				}, {
					image: "/static/mine/bao2.png",
					title: "hhhhh",
					price: "30",
					credit: 20,
					is_sell: true
				}, {
					image: "/static/mine/bao2.png",
					title: "hhhhh",
					price: "30",
					credit: 20,
					is_sell: false
				}, {
					image: "/static/mine/bao2.png",
					title: "hhhhh",
					price: "30",
					credit: 20,
					is_sell: false
				}],
				//现金礼包
				cash: [],
				//其他礼包
				other: [],
				imgBaseUrl: getApp().globalData.imgBaseUrl,
			}
		},
		methods: {
			//商品详情   
			toGoodsDetail(id) {
				//接收参数
				uni.navigateTo({
					url: "./goodsDetail/goodsDetail?id=" + id,
				})
			},
			toCredits() {
				uni.navigateTo({
					url: "./credits/credits",
				})
			},
		}
	}
</script>

<style scoped>
	.content {
		min-height: 100vh;
		background: #F2F2F2;
	}

	.top1 {
		background: #FEC200;
		border-radius: 0 0 10px 10px;
		height: 304rpx;
		box-sizing: border-box;
		padding: 44rpx 24rpx;
		position: relative;
	}

	.top1_1>view {
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.top1_1>view:nth-of-type(1) {
		color: rgba(51, 51, 51, .4);
	}

	.num {
		font-size: 72rpx;
		font-weight: bold;
	}

	.sign {
		width: 150rpx;
		height: 64rpx;
		font-size: 28rpx;
		background: #FFFFFF;
		border-radius: 16px;
		opacity: 0.4;
		text-align: center;
		line-height: 64rpx;
	}

	.top1_2 {
		width: 702rpx;
		height: 256rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		border-radius: 8px;
		position: absolute;
		bottom: -154rpx;
		left: 24rpx;
		padding: 0 12rpx 12rpx;
	}

	.qian {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28rpx 24rpx;
	}

	.qian>view:nth-of-type(1) {
		font-size: 28rpx;
		color: #FF4343;
	}

	.qian>view:nth-of-type(2) {
		font-size: 24rpx;
		color: rgba(51, 51, 51, .4);
	}

	.qian>view:nth-of-type(2) text {
		font-size: 36rpx;
		color: #333333;
		margin: 0 10rpx;
		font-weight: bold;
	}

	.bao {
		display: flex;
		font-size: 22rpx;
		text-align: center;
	}

	.bao>view {
		flex: 1;
	}

	.bao image {
		width: 76rpx;
		height: 92rpx;
	}

	/* 礼物 */
	.conten,
	.ul2 {
		font-weight: bold;
	}

	.conten {
		display: flex;
		justify-content: space-between;
		margin: 24rpx 0;
		align-items: center;
	}

	.conten image {
		width: 36rpx;
		height: 36rpx;
	}

	.conten .name {
		font-size: 32rpx;
		font-weight: bold;
		color: rgba(36, 36, 36, 1);
	}

	.ul2 .colorRed {
		color: #FF3838
	}

	.ul2 .colorBlack {
		color: rgba(36, 36, 36, 1);
	}

	.ul2 .name_ {
		font-size: 24rpx;
		color: rgba(36, 36, 36, 1);
		margin: 16rpx 0;
	}

	.ul2 {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.ul2 li {
		width: 220rpx;
		padding: 0 0 24rpx;
		margin-right: 20rpx;
		position: relative;
	}

	.ul2 li .sellout {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
	}

	.ul2 li image {
		width: 220rpx;
		height: 220rpx;
		border-radius: 4px;
	}

	.ul2 li:nth-of-type(3n) {
		margin-right: 0rpx;
	}

	.ul2 li view {
		width: 100%;
		box-sizing: border-box;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.ul2 li view:nth-of-type(1) {
		margin: 16rpx 0 8rpx;
	}

</style>
