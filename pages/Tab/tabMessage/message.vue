<template>
	<view class="content">
		<!-- 		<view class="top">
			<view class="t1" :style="'padding-top:' + (navTop + 5) + 'px;height:' + navHeight + 'px;line-height:' + navHeight + 'px'">
				<view class="navLeft" style="z-index:10;">
					<u-icon name="arrow-left" size="50rpx" style="margin-right: 20rpx;" @click="back"></u-icon>
					<image src="/static/message/qk.png"></image>
					<view class="location">全部已读</view>
				</view>
				<view style="justify-content: center;">消息</view>
				<view></view>
			</view>
		</view> -->
		<!-- :style="'margin-top:' + navHeight + 'px'" -->
		<view>
			<view class="tabList">
				<view class="tabItem" @click="toType('点赞',counts.praise.type)">
					<image src="/static/message/dz.png"></image>
					<view>点赞</view>
					<u-badge type="error" :count="counts.praise.count" :offset="offset"></u-badge>
				</view>
				<view class="tabItem" @click="toType('任务',counts.task.type)">
					<image src="/static/message/rw.png"></image>
					<view>任务</view>
					<u-badge type="error" :count="counts.task.count" :offset="offset"></u-badge>
				</view>
				<view class="tabItem" @click="toType('评论',counts.comment.type)">
					<image src="/static/message/pl.png"></image>
					<view>评论</view>
					<u-badge type="error" :count="counts.comment.count" :offset="offset"></u-badge>
				</view>
				<view class="tabItem" @click="toType('系统',counts.sysem.type)">
					<image src="/static/message/xt.png"></image>
					<view>系统</view>
					<u-badge type="error" :count="counts.sysem.count" :offset="offset"></u-badge>
				</view>
			</view>
			<view class="lists">
				<u-swipe-action :index="index" v-for="(item, index) in list" :key="index" @click="delMess(item.id)" :options="options">
					<view class="listItem" @click="toDetail(item.id,item.message)">
						<view :class="item.status==1?'isRead':''">{{item.count}}</view>
						<view>{{ $u.timeFrom(item.int_create_time, false) }}</view>
					</view>
				</u-swipe-action>
			</view>
			<u-loadmore margin-top="24" margin-bottom="24" :status="status" :icon-type="iconType" :load-text="loadText" />
		</view>
	</view>
</template>

<script>
	import {
		getUnreadOrEmpty,
		getUnread,
		getUnreadCount,
		readMessage,
		deleteMessage
	} from "../../../services/message.js";
	export default {
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				counts: {
					comment: {
						count: 0,
					},
					praise: {
						count: 0,
					},
					sysem: {
						count: 0,
					},
					task: {
						count: 0,
					},
				},
				navTop: getApp().globalData.navTop,
				navHeight: getApp().globalData.navHeight,
				offset: [-10, -10],
				page: 1,
				status: "loading",
				iconType: "flower",
				loadText: {
					loadmore: "轻轻上拉",
					loading: "努力加载中",
					nomore: "实在没有了",
				},
				list: [],
			};
		},
		onShow() {
			if (uni.getStorageSync("token")) {
				getUnreadOrEmpty().then(res => {
					if (res.code == 200) {
						uni.showTabBarRedDot({
							index: 3
						});
					} else {
						uni.hideTabBarRedDot({
							index: 3
						});
					}
					this.status = "loading";
					this.page = 1;
					this.list = [];
					this.getMess();
				});
			} else {
				this.status = "nomore";
			}
			// this.$store.dispatch('wsConnect','ws://192.168.31.37:8000')
		},
		methods: {
			getMess() {
				getUnread({
					where: {
						message_type: [11],
					},
					limit: 10,
					page: this.page,
				}).then(res => {
					if (res.code == 200) {
						getUnreadCount().then(res => {
							if (res.code == 200) {
								this.counts = res.result;
							}
						})
						this.page++;
						this.list = this.list.concat(res.result.list);
						if (res.result.count <= 10) {
							this.status = "nomore";
						}
					} else {
						this.status = "nomore";
					}
				});
			},
			delMess(id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除吗？',
					success: (res) => {
						if (res.confirm) {
							deleteMessage({
								id: id,
							}).then(res => {
								if (res.code == 200) {
									this.list = [];
									this.page = 1;
									this.status = "loading";
									this.getMess();
								} else {
									uni.showToast({
										title: res.message,
										icon: 'none',
									})
								}
							});
						}
					}
				});
			},
			toDetail(id, message) {
				readMessage({
					id: id,
				});
				if (message == null || message == '') {
					uni.showToast({
						title: "任务已被删除",
						icon: "none",
					})
					return false;
				}
				// 任务状态去 订单详情
				uni.navigateTo({
					url: "/pages/mine/havePublished/orderDetail/orderDetail?id=" + message.id,
				});
			},
			toType(index, type) {
				uni.navigateTo({
					url: '/pages/message/messageTab/messageTab?type=' + index + '&types=' + JSON.stringify(type),
				});
			}
		},
		onReachBottom() {
			if (this.status == "nomore") {
				return false;
			}
			this.getMess();
		},
	};
</script>

<style scoped>
	.content {
		width: 100%;
		box-sizing: border-box;
		font-family: PingFangSC-Medium, PingFang SC;
		overflow: hidden;
		min-height: 100vh;
		background: #f2f2f2;
		/* padding: 0 24rpx 24rpx; */
	}

	.top {
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;
		position: absolute;
		left: 0;
	}

	.t1 {
		background: #fff;
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 60rpx 0 25rpx 24rpx;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}

	.t1 view {
		flex: 1;
		text-align: center;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.location {
		color: rgba(36, 36, 36, 0.6);
		font-size: 24rpx;
	}

	.navLeft image {
		width: 28rpx;
		height: 28rpx;
		margin-right: 12rpx;
	}

	.tabList {
		padding: 40rpx 48rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		background: #fff;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 300;
	}

	.tabItem {
		position: relative;
	}

	.tabItem image {
		width: 92rpx;
		height: 92rpx;
	}

	.tabItem view {
		text-align: center;
		font-size: 24rpx;
	}

	.lists {
		padding: 0 24rpx;
		background: #fff;
		margin-top: 230rpx;
	}

	.listItem {
		padding: 40rpx 0;
		font-size: 26rpx;
		color: rgba(36, 36, 36, 1);
		display: flex;
		border-bottom: 1px solid rgba(242, 242, 242, 1);
	}

	.listItem view:first-child {
		flex: 3;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.isRead {
		color: rgba(36, 36, 36, 0.4);
	}

	.listItem view:last-child {
		flex: 1;
		color: rgba(36, 36, 36, 0.4);
		text-align: right;
	}
</style>
