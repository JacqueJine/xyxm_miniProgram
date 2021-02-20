<template>
	<view class="content" v-if="clubData.club_name">
		<view class="top1">
			<view class="top_1">
				<view>
					<image :src="clubData.club_header ? imgBaseUrl + clubData.club_header : '/static/mine/name1.png'"></image>
				</view>
				<view>
					<view>{{ clubData.club_name }}</view>
					<view>{{ clubData.school?clubData.school.school_name:'' }}</view>
				</view>
			</view>
			<view class="top_2">
				<view>社团简介</view>
				<view>
					<textarea style="width: 100%;" placeholder="暂无简介" auto-height disabled type="text" v-model="clubData.club_desc"></textarea>
				</view>
			</view>
		</view>
		<view class="top2">
			<view>
				<u-cell-item title="成员" :value="clubData.member_num+'名成员'" @click="toPerson"></u-cell-item>
			</view>
			<view v-if="clubData.is_join">
				<u-cell-item title="退出社团" @click="exitClub"></u-cell-item>
			</view>
		</view>
		<view class="ts">举报/投诉</view>
		<view class="btn" v-if="!clubData.is_join" @click="addClub">加入社团</view>
	</view>
</template>

<script>
	import { getCulbInfo , joinClub , outClub } from '../../../../services/community.js';
	export default {
		data() {
			return {
				imgBaseUrl: getApp().globalData.imgBaseUrl,
				action: getApp().globalData.imgBaseUrl + '/common/upload/image.html',
				clubData: {},
				club_id: ''
			}
		},
		onLoad(options) {
			this.club_id = options.id;
		},
		onShow() {
			this.getData();
		},
		methods: {
			exitClub(){
				uni.showModal({
					title: '提示',
					content: '请确认是否退出该社团',
					success: res => {
						uni.showLoading({
							title: '加载中...',
							mask: true
						});
						if (res.confirm) {
							outClub({ id: this.club_id }).then(res => {
								uni.hideLoading();
								uni.showToast({
									title: res.message,
									icon: 'none'
								});
								if (res.code == 200) {
									uni.switchTab({
										url: '/pages/Tab/tabComm/community'
									});
								}
							});
						} else if (res.cancel) {
							uni.hideLoading();
							console.log('用户点击取消');
						}
					}
				});
			},
			getData() {
				uni.showLoading({
					title: '加载中...',
				});
				getCulbInfo({ id: this.club_id }).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						this.clubData = res.result;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			},
			addClub() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				joinClub({ id: this.club_id }).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						uni.showToast({
							title: res.message,
						});
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			},
			toPerson() {
				uni.navigateTo({
					url: '/pages/community/club/clubDetail/clubPersonal/clubPersonal?id=' + this.club_id
				})
			},
		}
	}
</script>

<style scoped>
	.content {
		min-height: 100vh;
		background: rgba(245, 245, 245, 1);
	}

	.top1 {
		padding: 0 24rpx;
		background: #FFFFFF;
	}

	.top_1 {
		display: flex;
		align-items: center;
		padding: 48rpx 0;
		font-size: 36rpx;
		font-weight: bold;
	}

	.top_1 image {
		width: 96rpx;
		height: 96rpx;
		border-radius: 50%;
		margin-right: 24rpx;
	}

	.top_1>view:nth-of-type(2)>view:nth-of-type(2) {
		font-size: 24rpx;
		color: rgba(51, 51, 51, .4);
		font-weight: normal;
	}

	.top_2 {
		font-size: 28rpx;
		font-weight: bold;
	}

	.top_2>view:nth-of-type(2) {
		padding: 16rpx 0 44rpx;
		color: rgba(51, 51, 51, .6);
		font-weight: normal;
		text-align: justify;
	}

	.top2>view {
		background: #FFFFFF;
		margin-top: 16rpx;
	}

	.ts {
		font-size: 24rpx;
		text-align: center;
		margin-top: 50rpx;
	}

	.btn {
		width: 702rpx;
		height: 88rpx;
		background: #42A0FF;
		border-radius: 22px;
		position: absolute;
		bottom: 24rpx;
		left: 24rpx;
		font-size: 28rpx;
		font-weight: bold;
		text-align: center;
		color: #FFFFFF;
		line-height: 88rpx;
	}
</style>
