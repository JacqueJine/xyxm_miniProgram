<template>
	<view>
		<view class="list2" v-if="tab != '系统'">
			<view class="listCell cell2" v-for="(item,index) in list" :key="index" @click="toDetail(item.message,item.message_type,item.id,index)">
				<view class="headGroup">
					<image class="head" :src="item.send.header == '' ? '/static/mine/name1.png' : imgBaseUrl + item.send.header" mode=""></image>
					<image v-if="item.send.show_attestation" class="renzheng" :src="
												item.send.show_attestation == 1
													? '/static/index/is_auth.png'
													: item.send.show_attestation == 2
													? '/static/index/is_shop.png'
													: item.send.show_attestation == 3
													? '/static/index/is_rider.png'
													: ''
											"></image>
					<u-badge :is-dot="true" v-if="item.status==0" type="error" :offset="offset"></u-badge>
				</view>
				<view class="list2right">
					<view class="nameGroup">
						<view class="name">
							<view>
								{{item.send.name}}
								<image v-if="item.send.sex.code" :src="item.send.sex.code == 1 ? '/static/index/man.png' : '/static/index/female.png'"></image>
								<u-tag :text="'信誉'+item.send.credit" size="mini" mode="light" border-color="#FFFFFF" style="margin-left: 10rpx;" />
							</view>
							<view @click.stop="delitem(item.id)" style="padding: 12rpx;">
								<image class="more" src="/static/message/gd.png" mode=""></image>
							</view>
						</view>
						<view class="time">
							<!-- 预览与真机调试不一致 -->
							<text>{{ $u.timeFrom(item.int_create_time, false) }}</text>
							<text>{{ item.send.school.school_name +' '+ item.send.en_year + '级' }}</text>
						</view>
					</view>
					<view class="text">{{item.count}}</view>
					<view class="nei">{{item.message.content?item.message.content:item.message.comment?item.message.comment:'内容已被删除'}}</view>
				</view>
			</view>
		</view>
		<view class="list2" v-if="tab == '系统'">
			<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in list" :key="item.id" @click="delMess(item.id)"
			 :options="options">
				<view class="list3cell" @click="toDetail(item.message,item.message_type,item.id,index)">
					<view class="headGroup">
						<image class="head" :src="parseInt(item.message_type / 10) == 6?'/static/mine/logo1.png':item.send.header == '' ? '/static/mine/name1.png' : imgBaseUrl + item.send.header"
						 mode=""></image>
						<image v-if="item.send.show_attestation" class="renzheng" :src="
													item.send.show_attestation == 1
														? '/static/index/is_auth.png'
														: item.send.show_attestation == 2
														? '/static/index/is_shop.png'
														: item.send.show_attestation == 3
														? '/static/index/is_rider.png'
														: ''
												"></image>
						<u-badge :is-dot="true" v-if="item.status==0" type="error" :offset="offset"></u-badge>
					</view>
					<view class="list3right1">
						<view>
							<view>
								<text>{{parseInt(item.message_type / 10) == 6?'校园小茗':item.send.name}}</text>
								<text class="tag" v-if="parseInt(item.message_type / 10) == 6">官方</text>
							</view>
							<view style="color: rgba(36, 36, 36, .4);">{{ $u.timeFrom(item.int_create_time, false) }}</view>
						</view>
						<view>{{item.count}}</view>
					</view>
				</view>
				<view slot="right" class="list3right">删除</view>
			</u-swipe-action>
		</view>
		<u-loadmore margin-top="24" margin-bottom="24" :status="status" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
	import {
		getUnread,
		readMessage,
		deleteMessage
	} from "../../../services/message.js";
	export default {
		data() {
			return {
				imgBaseUrl: getApp().globalData.imgBaseUrl,
				offset: [0, 10],
				tab: 1,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				popShow: false,
				popList: [{
					text: '删除'
				}],
				page: 1,
				status: "loading",
				iconType: "flower",
				loadText: {
					loadmore: "轻轻上拉",
					loading: "努力加载中",
					nomore: "实在没有了",
				},
				list: [],
				message_type: [],
			};
		},
		onLoad(e) {
			if (uni.getStorageSync("token")) {
				this.tab = e.type;
				uni.setNavigationBarTitle({
					title: e.type,
				});
				this.message_type = JSON.parse(e.types);
				this.getMess();
			} else {
				this.status = 'nomore';
			}

		},
		onReachBottom() {
			if (this.status == 'nomore') {
				return false;
			}
			this.getMess();
		},
		methods: {
			delitem(id) {
				uni.showActionSheet({
					itemList: ['删除'],
					success: (res) => {
						this.del(id);
					},
				});
			},
			delMess(id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除吗？',
					success: (res) => {
						if (res.confirm) {
							this.del(id);
						}
					}
				});
			},
			del(id) {
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
				})
			},
			getMess() {
				getUnread({
					where: {
						message_type: this.message_type,
					},
					limit: 10,
					page: this.page,
				}).then(res => {
					if (res.code == 200) {
						this.page++;
						this.list = this.list.concat(res.result.list);
						if (res.result.count <= 10 || !res.result.list.length) {
							this.status = "nomore";
						}
					} else {
						this.status = "nomore";
					}
				});
			},
			toDetail(message, type, messid, index) {
				if (this.tab == '点赞') {
					// 消息提醒 ：帖子点赞、评论点赞
					uni.requestSubscribeMessage({
						tmplIds: [
							"CgI2RUfrhhaM0eKIykkjG80cxBGaw7gqwg7ulv8qBOs",
							"loosDS_rJeap9JOHwFnPOpjoNp3LPCkBuG68advTU_g",
						],
						complete: (res) => {
							// 不管成功失败都执行添加任务
							readMessage({
								id: messid,
							}).then(res => {
								if (res.code == 200) {
									this.list[index].status = 1;
								}
							});
							if (message == null || message == '') {
								uni.showToast({
									title: "内容已被删除",
									icon: "none",
								})
								return false;
							}
							let id = "";
							//帖子  取十位的数字
							if (parseInt(type / 10) == 2) {
								id = message.posts_id ? message.posts_id : message.id;
								uni.navigateTo({
									url: '/pages/community/commDetail/commDetail?id=' + id,
								});
							}
							// 任务评论、点赞去任务详情
							else if (parseInt(type / 10) == 1) {
								uni.navigateTo({
									url: "/pages/task/taskList/taskDetail/taskDetail?id=" + message.task_id,
								});
							}
							// 社团申请
							else if (parseInt(type / 10) == 3) {
								uni.navigateTo({
									url: '/pages/message/messageDetail/messageDetail?id=' + messid,
								});
							}
							// 官方
							else if (parseInt(type / 10) == 6) {
								uni.navigateTo({
									url: '/pages/message/messageDetail/messageDetail?id=' + messid,
								});
							}
						},
					});
				} else if (this.tab == '系统') {
					// 消息提醒 ：申请加入
					uni.requestSubscribeMessage({
						tmplIds: [
							"Fui72A7YyTUy46w9jLHONqsZYV-Ssjionl0QvVOQeu0",
						],
						complete: (res) => {
							readMessage({
								id: messid,
							}).then(res => {
								if (res.code == 200) {
									this.list[index].status = 1;
								}
							});
							if (message == null || message == '') {
								uni.showToast({
									title: "内容已被删除",
									icon: "none",
								})
								return false;
							}
							let id = "";
							//帖子  取十位的数字
							if (parseInt(type / 10) == 2) {
								id = message.posts_id ? message.posts_id : message.id;
								uni.navigateTo({
									url: '/pages/community/commDetail/commDetail?id=' + id,
								});
							}
							// 任务评论、点赞去任务详情
							else if (parseInt(type / 10) == 1) {
								uni.navigateTo({
									url: "/pages/task/taskList/taskDetail/taskDetail?id=" + message.task_id,
								});
							}
							// 社团申请
							else if (parseInt(type / 10) == 3) {
								uni.navigateTo({
									url: '/pages/message/messageDetail/messageDetail?id=' + messid,
								});
							}
							// 官方
							else if (parseInt(type / 10) == 6) {
								uni.navigateTo({
									url: '/pages/message/messageDetail/messageDetail?id=' + messid,
								});
							}
						},
					});
				} else {
					// 消息提醒 ：评论回复、评论提醒
					uni.requestSubscribeMessage({
						tmplIds: [
							"Q0dB1QJc9GcGSfT5tpj6GBbf53JiHhz6RDQZOVM6i3Y",
							"mc5xJywLUfHxkLOaV2oIzYBbO3O0AqjTxq75RRAh_ps",
						],
						complete: (res) => {
							readMessage({
								id: messid,
							}).then(res => {
								if (res.code == 200) {
									this.list[index].status = 1;
								}
							});
							if (message == null || message == '') {
								uni.showToast({
									title: "内容已被删除",
									icon: "none",
								})
								return false;
							}
							let id = "";
							//帖子  取十位的数字
							if (parseInt(type / 10) == 2) {
								id = message.posts_id ? message.posts_id : message.id;
								uni.navigateTo({
									url: '/pages/community/commDetail/commDetail?id=' + id,
								});
							}
							// 任务评论、点赞去任务详情
							else if (parseInt(type / 10) == 1) {
								uni.navigateTo({
									url: "/pages/task/taskList/taskDetail/taskDetail?id=" + message.task_id,
								});
							}
							// 社团申请
							else if (parseInt(type / 10) == 3) {
								uni.navigateTo({
									url: '/pages/message/messageDetail/messageDetail?id=' + messid,
								});
							}
							// 官方
							else if (parseInt(type / 10) == 6) {
								uni.navigateTo({
									url: '/pages/message/messageDetail/messageDetail?id=' + messid,
								});
							}
						},
					});
				}
			},
		}
	};
</script>

<style scoped>
	.list2 {
		padding: 0 24rpx;
	}

	.listCell {
		display: flex;
		font-size: 28rpx;
		padding: 44rpx 0;
		border-bottom: 1px solid #f2f2f2;
	}

	.headGroup {
		position: relative;
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
	}

	.head {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.renzheng {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 28rpx;
		height: 28rpx;
	}

	.list2right {
		flex: 1;
	}

	.nameGroup {
		height: 80rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.cell2 .name {
		display: flex;
		justify-content: space-between;
	}

	.cell2 .name view {
		display: flex;
		align-items: center;
	}

	.name {
		font-size: 28rpx;
		display: flex;
		align-items: center;
		color: rgba(36, 36, 36, 0.6);
	}

	.nameGroup image {
		width: 28rpx;
		height: 28rpx;
		margin-left: 10rpx;
	}

	.time {
		color: rgba(36, 36, 36, 0.4);
		font-size: 24rpx;
	}

	.time text:first-child {
		margin-right: 16rpx;
	}

	.nameGroup .more {
		width: 56rpx;
		height: 30rpx;
	}

	.text {
		color: rgba(36, 36, 36, 1);
		padding: 20rpx 0;
	}

	.list2right>view:nth-of-type(3) {
		width: 600rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 12rpx;
		background: #f8fafb;
		padding: 24rpx;
		box-sizing: border-box;
		border-radius: 4px;
		color: rgba(36, 36, 36, 0.6);
	}

	.list3cell {
		font-size: 28rpx;
		border-bottom: 1px solid #f2f2f2;
		padding: 44rpx 0;
		display: flex;
		align-items: center;
	}

	.list3right1 {
		flex: 1;
	}

	.list3right1>view:nth-of-type(1) {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.list3right1>view:nth-of-type(1)>view:nth-of-type(1) {
		display: flex;
		align-items: center;
	}

	.list3right1>view:nth-of-type(1) .tag {
		font-size: 20rpx;
		background: #fec200;
		border-radius: 3px;
		margin-left: 8rpx;
		padding: 2rpx 4rpx;
	}

	.list3right1>view:nth-of-type(2) {
		width: 600rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: rgba(36, 36, 36, 0.4);
		margin-top: 12rpx;
	}

	.list3right {
		width: 130rpx;
		height: 178rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: crimson;
		color: #ffffff;
	}
</style>
