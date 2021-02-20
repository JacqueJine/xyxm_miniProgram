<template>
	<view>
		<view class="top2_list" @click="toinvDetail(1)" v-for="(item,index) in Info" :key="index">
			<view class="top2_title" @click.stop="toMinePage">
				<view style="position: relative;">
					<image src="/static/mine/name1.png" class="head"></image>
					<image class="is_auth" src="/static/index/is_auth.png"></image>
				</view>
				<view class="top2_title2">
					<view>
						<view class="top2_title2_2">
							<text>他的昵称</text>
							<image src="/static/index/female.png" class="logo"></image>
							<image src="/static/mine/shop.png" class="logo"></image>
							<text class="tag" :style="isguan?'background: #FEC200;color: #000000;':''">{{isguan?'官方':'信誉100'}}</text>
						</view>
						<view @click.stop="moreBtn(1)">
							<u-icon name="more-dot-fill" size="48rpx" color="#B8B8B8"></u-icon>
						</view>
					</view>
					<view> <text style="margin-right: 10rpx;">13:43 </text> <text> 郑州大学西亚斯福利院2016级</text> </view>
				</view>
			</view>
			<view class="top2_con">
				<view>两张及以上图片展示效果，固定大小，最多9张</view>
				<view>
					<image v-for="(ite,ind) in item.images" :src="ite" :style="item.images.length==1?'width:370rpx;height:370rpx':''"
					 :key="ind" @click.stop="showPop(ite)"></image>
				</view>
			</view>
			<view class="top2_share">
				<view>
					<u-icon name="zhuanfa" size="48rpx" style="margin-right: 6rpx;"></u-icon>415
				</view>
				<view>
					<u-icon name="chat" size="48rpx" style="margin-right: 6rpx;"></u-icon>415
				</view>
				<view :style="active==1?'color:#FF546E':''">
					<u-icon name="thumb-up-fill" size="48rpx" v-if="active==1" style="margin-right: 6rpx;"></u-icon>
					<u-icon name="thumb-up" size="48rpx" v-else style="margin-right: 6rpx;"></u-icon>
					415
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			Info: {
				type: Array,
				value: []
			},
		},
		data() {
			return {}
		},
		methods: {
			toinvDetail(id) {
				// 把每一项任务的id传递给父组件
				this.$emit("toinvDetail", id);
			},
			toMinePage(id) {
				this.$emit("toMinePage", id);
			},
			moreBtn(id) {
				this.$emit("moreBtn", id);
			},
			showPop(item) {
				this.$emit("showPop", item);
			}
		}
	}
</script>

<style scoped>
	/* 帖子 */
	.top2_list {
		padding: 40rpx 24rpx;
		border-bottom: 20rpx solid #F8FAFB;
		background: #FFFFFF;
	}

	.top2_title {
		display: flex;
		align-items: flex-start;
		margin-bottom: 20rpx;
	}

	.top2_title .head {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.top2_title .logo {
		width: 28rpx;
		height: 28rpx;
		margin-left: 12rpx;
	}

	.tag {
		font-size: 20rpx;
		padding: 0 6rpx;
		background: #E5F4FF;
		color: #0091FF;
		margin-left: 18rpx;
		border-radius: 2px;
	}
	.is_auth {
		position: absolute;
		bottom: 5rpx;
		right: 20rpx;
		width: 32rpx;
		height: 32rpx;
		z-index: 10;
	}
	.top2_title2 {
		flex: 1;
	}
	
	.top2_title2>view:nth-of-type(1) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6rpx;
		font-size: 28rpx;
	}

	.top2_title2_2 {
		display: flex;
		align-items: center;
	}

	.top2_title2>view:nth-of-type(2) {
		font-size: 24rpx;
		color: rgba(36, 36, 36, .4);
	}

	.top2_con {
		font-size: 32rpx;
	}

	.top2_con image {
		border-radius: 4px;
		width: 228rpx;
		height: 220rpx;
		margin: 20rpx 8rpx 0 0;
	}

	.top2_con image:nth-of-type(3n) {
		margin: 20rpx 0 0 0;
	}

	.top2_share {
		margin-top: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.top2_share>view {
		display: flex;
		align-items: center;
	}
</style>
