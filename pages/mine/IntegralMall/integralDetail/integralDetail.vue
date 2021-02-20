<template>
	<view class="content">
		<ul class='ul2'>
			<li v-for="(item,index) in entity" :key="index" @click="toGoodsDetail(item.id)">
				<!-- 函数传参用data-   -->
				<image :src="item.image" />
				<image v-if="item.is_sell" src="/static/mine/sellout.png" class="sellout" />
				<view class='name_'>{{item.title}}</view>
				<view style="font-size: 20rpx;">
					<text class="colorRed">{{item.credit}}积分</text>
					<text class="colorBlack" v-if="item.price!='0.00'">+{{item.price}}元</text>
				</view>

			</li>
		</ul>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 1,
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
			}
		},
		methods: {
			//商品详情
			toGoodsDetail(id) {
				//接收参数
				uni.navigateTo({
					url: "/pages/mine/IntegralMall/goodsDetail/goodsDetail?id=" + id,
				})
			},
		},
		onLoad(options) {
			this.type = options.type;
			if (options.type == 1) {
				uni.setNavigationBarTitle({
					title: '实物礼包',
				});
			} else if (options.type == 2) {
				uni.setNavigationBarTitle({
					title: '现金礼包',
				});
			} else if (options.type == 3) {
				uni.setNavigationBarTitle({
					title: '其他礼包',
				});
			}
		},
	}
</script>

<style>
	.content{
		padding:24rpx;
	}
	/* 礼物 */
	.ul2 {
		font-weight: bold;
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
