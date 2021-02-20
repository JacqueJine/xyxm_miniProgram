<template>
	<view class="all">
		<!-- 		<view class="sort">
			<view class="sort-p" @click="sortNew(1)">
				<text>最新发布</text>
				<image src="/static/task/sort.png"></image>
			</view>
			<view class="sort-p" @click="sortNew(2)">
				<text>赏金排序</text>
				<image src="/static/task/sort.png"></image>
			</view>
			<view class="sort-p" @click="sortNew(3)">
				<text>任务状态</text>
				<image src="/static/task/sort.png"></image>
			</view>
		</view> -->
		<view class="content">
			<!-- <swiper class='swiper1' :indicator-dots='true' indicator-active-color='#FEC200' indicator-color='rgba(0,0,0,0.39)'
			 :autoplay='true' interval="3000" :circular='true'>
				<swiper-item v-for="(item,index) in image" :key="index">
					<image class='banner' :src="item"></image>
				</swiper-item>
			</swiper> -->
			<Expressage @toExpressDetail="toExpressDetail" @toMinePage="toMinePage" :curHelpInfo="expressInfo"></Expressage>
			<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
		</view>
	</view>
</template>

<script>
	import Expressage from "@/components/perFunctionInfo/expressage/expressage.vue";
	import {
		taskHall
	} from "../../../services/function.js";
	export default {
		data() {
			return {
				taskType: 1,
				image: ["https://cdn.uviewui.com/uview/swiper/1.jpg", "https://cdn.uviewui.com/uview/swiper/2.jpg",
					"https://cdn.uviewui.com/uview/swiper/1.jpg"
				],
				expressInfo: [],
				// 调接口的当前页码
				curExpressPage: 1,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				}
			}
		},
		components: {
			Expressage
		},
		methods: {
			toExpressDetail(params) {
				uni.navigateTo({
					url: "/pages/task/taskList/taskDetail/taskDetail?id=" + params,
				})
			},
			toMinePage(params) {
				uni.navigateTo({
					url: "/pages/community/minePage/minePage?id="+params,
				});
			},
			// 获取功能任务列表  taskList
			functionList() {
				taskHall({
					page: this.curExpressPage,
					limit: 10,
					where: {
						type: this.taskType,
						task_state_or: [0, 1, 2],
						is_pay:1,
					}
				}).then(res => {
					if (res.code == 200) {
						this.expressInfo = this.expressInfo.concat(res.result.data);
						this.curExpressPage++;
						 if(res.result.count<=10){
								this.status = 'nomore';
						}
					} else if (res.code == 0) {
						this.status = 'nomore';
					}
				})

			},
		},
		onLoad(options) {
			this.taskType = options.taskType;
			if (options.taskType == 1) {
				uni.setNavigationBarTitle({
					title: "快递帮"
				})
			} else if (options.taskType == 2) {
				uni.setNavigationBarTitle({
					title: "跑腿"
				})
			} else if (options.taskType == 3) {
				uni.setNavigationBarTitle({
					title: "其他任务"
				})
			}
			this.functionList();
		},
		onShow() {
		},
		// 触底事件
		onReachBottom() {
			if (this.status == 'nomore') {
				return false;
			}
			this.status == 'loading'
			this.functionList();
		}
	}
</script>

<style scoped>
	.all {
		min-height: 100vh;
		background: rgba(245, 245, 245, 1);
		display: flex;
		flex-direction: column;
		overflow: auto;
		text-align: center;
	}

	.sort {
		height: 80rpx;
		background: #FEC200;
		line-height: 80rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 20;
	}

	.sort-p {
		width: 30%;
		color: #333333;
		font-size: 28rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
		justify-content: center;
	}

	.sort-p image {
		margin-left: 10rpx;
		height: 26rpx;
		width: 24rpx;
		margin-top: 30rpx;
	}

	.content {
		width: 100%;
		height: auto;
		padding: 24rpx 24rpx 24rpx;
		box-sizing: border-box;
		flex: 1;
		overflow: auto;
	}


	/* 轮播图 */

	.banner {
		width: 100%;
		height: 300rpx;
		border-radius: 10rpx;
		overflow: hidden;
		margin-bottom: 16rpx;
	}

	.swiper1 {
		height: 300rpx;
		width: 100%;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.swiper-box {
		width: 686rpx;
		height: 32rpx;
		line-height: 100%;
		overflow: hidden;
	}

	.swiper-box .item {
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.bottom {
		margin: 0 auto;
		height: 60rpx;
		line-height: 60rpx;
		width: 60%;
		margin-top: 54rpx;
		margin-bottom: 122rpx;
	}
</style>
