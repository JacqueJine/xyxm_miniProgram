<template>
	<view class="content">
		<view class="navTab">
			<view v-for="(item,index) in tabList" :key="index" :class="active == index ? 'tab tabAct' : 'tab'" @click="changeTab(index)">
				<view class="tabview">{{item}}</view>
				<view class="tabDot"></view>
			</view>
		</view>
		<swiper :current="swiperCurrent" @animationfinish="animationfinish" style="min-height: 100vh;overflow-y: scroll">
			<swiper-item class="swiper-item">
				<scroll-view scroll-y @scrolltolower="onreachBottom" :scroll-top="scrollTop" @scroll="scroll">
					<view class="top">
						<Expressage @toExpressDetail="toExpressDetail" @toMinePage="toMinePage" :curHelpInfo="expressInfo0"></Expressage>
						<u-loadmore margin-top="24" margin-bottom="24" :status="status" :icon-type="iconType" :load-text="loadText" />
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y @scrolltolower="onreachBottom" :scroll-top="scrollTop" @scroll="scroll">
					<view class="top">
						<Expressage @toExpressDetail="toExpressDetail" @toMinePage="toMinePage" :curHelpInfo="expressInfo1"></Expressage>
						<u-loadmore margin-top="24" margin-bottom="24" :status="status1" :icon-type="iconType" :load-text="loadText" />
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y @scrolltolower="onreachBottom" :scroll-top="scrollTop" @scroll="scroll">
					<view class="top">
						<Expressage @toExpressDetail="toExpressDetail" @toMinePage="toMinePage" :curHelpInfo="expressInfo2"></Expressage>
						<u-loadmore margin-top="24" margin-bottom="24" :status="status2" :icon-type="iconType" :load-text="loadText" />
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- <view class="top">
			<Expressage @toExpressDetail="toExpressDetail" @toMinePage="toMinePage" :curHelpInfo="expressInfo"></Expressage>
		</view> -->
	</view>
</template>

<script>
	import Expressage from "@/components/perFunctionInfo/expressage/expressage.vue";
	import {
		taskHall
	} from "../../services/function.js";
	export default {
		data() {
			return {
				active: 0,
				swiperCurrent: 0,
				tabList: ['快递帮', '跑腿', '其他'],
				// 调接口的当前页码 
				curExpressPage: 1,
				tabbarList: [],
				tabbarNum: 0,
				// 数据
				expressInfo: [],
				expressInfo0: [],
				expressInfo1: [],
				expressInfo2: [],
				status: 'loading',
				status1: 'loading',
				status2: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				is_show: false,
				// 滚动
				scrollTop: 0,
				old: {
					scrollTop: 0
				}
			}
		},
		components: {
			Expressage
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.status = 'loading';
			this.status1 = 'loading';
			this.status2 = 'loading';
			this.is_show = true;
			this.curExpressPage = 1;
			// 调接口的当前页码
			this.functionList(this.active);
		},
		onShareAppMessage() {
			return {
				title: '任务大厅',
				path: '/pages/task/task'
			}
		},
		// 单击返回顶部双击加载重新加载
		onTabItemTap() {
			this.tabbarNum++;
			this.tabbarList.push(new Date().getTime());
			if (this.tabbarNum != 0) {
				this.goTop();
				this.tabbarNum = 0;
			}
			if (this.tabbarList.length >= 2) {
				if (this.tabbarList[this.tabbarList.length - 1] - this.tabbarList[this.tabbarList.length - 2] <= 1000) {
					if (this.active == 0) {
						this.status = 'loading';
						this.expressInfo0 = [];
					} else if (this.active == 1) {
						this.status1 = 'loading';
						this.expressInfo1 = [];
					} else if (this.active == 2) {
						this.status2 = 'loading';
						this.expressInfo2 = [];
					}
					this.is_show = true;
					this.curExpressPage = 1;
					this.functionList(this.active);
					this.tabbarList = [];
				}
			}
		},
		methods: {
			// 滚动
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop;
			},
			goTop(e) {
				this.scrollTop = this.old.scrollTop;
				this.$nextTick(function() {
					let timer = setInterval(() => {
						this.scrollTop = this.scrollTop - this.scrollTop / 5;
						if (this.scrollTop <= 10) {
							this.scrollTop = 0;
							clearInterval(timer);
						}
					}, 10);
				});
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				if (this.active == 0 && this.status == 'nomore') {
					return false;
				} else if (this.active == 1 && this.status1 == 'nomore') {
					return false;
				} else if (this.active == 2 && this.status2 == 'nomore') {
					return false;
				}
				this.is_show = false;
				this.functionList(this.active);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				this.is_show = true;
				this.curExpressPage = 1;
				let current = e.detail.current;
				this.swiperCurrent = current;
				this.active = current;
				// 



				if (this.active == 0) {
					this.status = 'loading';
					this.expressInfo0 = [];
				} else if (this.active == 1) {
					this.status1 = 'loading';
					this.expressInfo1 = [];
				} else if (this.active == 2) {
					this.status2 = 'loading';
					this.expressInfo2 = [];
				}
				// 切屏数据
				this.functionList(this.active);
			},
			changeTab(index) {
				// 改变之后调用 swiper滑动结束，改变一定会调用滑动
				// this.curExpressPage = 1;
				// this.is_show = true;
				this.active = index;
				this.swiperCurrent = index;
				// this.functionList();
			},
			toExpressDetail(params) {
				uni.navigateTo({
					url: "/pages/task/taskList/taskDetail/taskDetail?id=" + params,
				});
			},
			toMinePage(params) {
				uni.navigateTo({
					url: "/pages/community/minePage/minePage?id="+params
				});
			},
			// 获取功能任务列表  taskList
			functionList(active) {
				taskHall({
					page: this.curExpressPage,
					limit: 10,
					where: {
						type: active + 1,
						task_state_or: [0, 1, 2],
						is_pay:1,
					}
				}).then(res => {
					uni.stopPullDownRefresh();
					if (res.code == 200) {
						// 接口请求慢避免重复
						if (this.is_show) {
							// this.status = 'loading';
							// this.noMore = false;
							// this.noMore1 = false;
							// this.noMore2 = false;
							// 数据
							if (res.result.data[0].type == 1) {
								this.expressInfo0 = [];
							} else if (res.result.data[0].type == 2) {
								this.expressInfo1 = [];
							} else if (res.result.data[0].type == 3) {
								this.expressInfo2 = [];
							}
						}
						if (res.result.data[0].type == 1) {
							this.expressInfo0 = this.expressInfo0.concat(res.result.data);
							if(res.result.count<=10){
								this.status = 'nomore';
							}
						} else if (res.result.data[0].type == 2) {
							this.expressInfo1 = this.expressInfo1.concat(res.result.data);
							if(res.result.count<=10){
								this.status1 = 'nomore';
							}
						} else if (res.result.data[0].type == 3) {
							this.expressInfo2 = this.expressInfo2.concat(res.result.data);
							if(res.result.count<=10){
								this.status2 = 'nomore';
							}
						}
						this.curExpressPage++;
					} else if (res.code == 0) {
						if (active == 0) {
							this.status = 'nomore';
						} else if (active == 1) {
							this.status1 = 'nomore';
						} else if (active == 2) {
							this.status2 = 'nomore';
						}
					}
				})

			},
		},
		onShow() {
			// if (this.active == 0) {
			// 	this.status = 'loading';
			// 	this.expressInfo0 = [];
			// } else if (this.active == 1) {
			// 	this.status1 = 'loading';
			// 	this.expressInfo1 = [];
			// } else if (this.active == 2) {
			// 	this.status2 = 'loading';
			// 	this.expressInfo2 = [];
			// }
			// this.is_show = true;
			// this.curExpressPage = 1;
			
		},
		onLoad(options) {
			if (uni.getStorageSync("token")) {
				this.functionList(this.active);
			} else {
				this.status="nomore";
			}
			// this.active = Number(options.taskType);
			// this.swiperCurrent = options.taskType;
			
		},
		// 触底事件
		onReachBottom() {
			// this.functionList(this.active + 1, this.curExpressPage);
		}
	}
</script>

<style scoped>
	.content {
		min-height: 100vh;
		box-sizing: border-box;
		background: #f2f2f2;
	}

	.navTab {
		display: flex;
		background: #fff;
		align-items: center;
		padding: 20rpx 0 20rpx 52rpx;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 10;
	}

	.tab {
		font-size: 28rpx;
		color: rgba(36, 36, 36, 0.4);
		position: relative;
		margin-right: 56rpx;
		text-align: center;
	}

	.tabAct {
		color: rgba(36, 36, 36);
		font-size: 32rpx;
	}

	.tabDot {
		width: 38rpx;
		height: 6rpx;
		border-radius: 2px;
		background: #333333;
		position: absolute;
		left: 0;
		right: 0;
		bottom: -14rpx;
		margin: auto;
		display: none;
	}

	.tabAct .tabDot {
		display: block;
	}

	.top {
		padding: 80rpx 24rpx 24rpx;
		height: 100vh;
	}
</style>
