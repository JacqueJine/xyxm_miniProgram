<template>
	<view class='goods'>
		<view>
			<swiper class='swiper1' indicator-dots='true' indicator-active-color='#FFDD05' indicator-color='rgba(36,36,36,.8)'
			 autoplay='true' interval="3000" circular='true'>
				<swiper-item v-for="(item,index) in banner" :key="index">
					<image class='banner' :src="item"></image>
				</swiper-item>
			</swiper>
		</view>
		<view>
			<view class="title alltitle">

				<view>{{goods.title}}</view>
				<view class="saled">
					<view class="saled-l">剩余</view>
					<view class="saled-r">{{goods.sum}}</view>

				</view>
			</view>
			<view class="price">
				<text v-if="goods.integral" class="colorRed">{{goods.integral}}积分</text>
				<text v-if="goods.integral && goods.money">+</text>
				<text v-if="goods.money">{{goods.money}}元</text>
			</view>
		</view>
		<view>
			<view class="alltitle">商品简介</view>
			<view class="brief">
				{{goods.remark}}
				<text class="colorRed">（运费{{goods.freight}}元）</text>
			</view>
		</view>
		<view>
			<view class="alltitle">兑换说明</view>
			<view class="mess">{{goods.goods_desc}}</view>
		</view>
		<view class="btn">
			<u-button shape="circle" hover-class="none" :custom-style="custom" :hair-line="false" @click="toPage">立即兑换</u-button>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				goods: {
					id: 1,
					sum: 1,
					title: "法国gay男一枚",
					integral: 200, // 积分
					money: '12', // 元
					carriage: '12', // 运费
					introduction: "富文本组件内部引入了一些基本的样式使得内容可以正确的展示，开发时可以进行覆盖。需要注意的是，在其它组件或环境中使用富文本组件导出的html时，需要额外引入 这段样式富文本组件内部引入了一些基本的样式使得内容可以正确的展示，开发时可以进行覆盖。需要注意的是，在其它组件或环境中使用富文本组件导出的html时，需要额外引入 这段样式..",
				},
				banner: [
					"https://cdn.uviewui.com/uview/swiper/1.jpg", "https://cdn.uviewui.com/uview/swiper/2.jpg",
					"https://cdn.uviewui.com/uview/swiper/1.jpg"
				],
				custom: {
					fontSize: '32rpx',
					backgroundColor: '#FEC200',
					width: "402rpx",
					height: "78Krpx",
					fontWeight: 'bold',
					border:'none',
					color:"#333333",
				}
			}
		},
		methods: {
			toPage() {
				uni.navigateTo({
					url: "../confirmOrder/confirmOrder?id=" + this.goods.id,
					fail(err) {
						console.log(err);
					}
				})
			},
		}
	}
</script>

<style scoped>
	.goods {
		font-size: 24rpx;
		height: 100vh;
		overflow: auto;
		font-family: PingFangSC-Medium, PingFang SC;
	}

	.swiper1 {
		height: 814rpx;
	}

	.banner {
		width: 100%;
		height: 100%;
	}

	.title {
		width: 100%;
		font-size: 28rpx;
		margin: 32rpx 0 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-right: 50rpx;
		box-sizing: border-box;
	}

	.alltitle {
		font-weight: bold;
		padding: 0 18rpx 0 32rpx;
	}

	.colorRed {
		color: #FF3838
	}

	.price {
		margin-bottom: 64rpx;
		font-size: 40rpx;
		font-weight: bold;
		padding: 0 18rpx 0 32rpx;
	}

	.brief {
		padding: 0 18rpx 0 32rpx;
		margin: 12rpx 0 32rpx;
		line-height: 34rpx;
	}

	.mess {
		text-align: justify;
		margin-top: 12rpx;
		padding: 0 18rpx 140rpx 32rpx;
		color: rgba(36, 36, 36, .6);
	}

	.btn {
		background: #FFF;
		width: 100%;
		position: fixed;
		bottom: 0;
		text-align: center;
		padding: 10rpx 0;
		box-shadow: 0px -1px 1px 0px rgba(36, 36, 36, 0.1);
	}

	.saled {
		font-weight: 400;
		/* color:rgba(36,36,36,0.4);  */
		width: 186rpx;
		height: 46rpx;
		background: rgba(36, 36, 36, 1);
		border-radius: 32rpx;
		font-size: 24rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.saled-l {
		width: 94rpx;
		height: 46rpx;
		background: #FEC200;
		border-radius: 32rpx 0px 0px 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.saled-r {
		color: #FFF;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		width: 94rpx;
		height: 46rpx;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
</style>
