<template>
	<view class="content" v-if="clubData">
		<view class="perFun" @click="changeAvator">
			<view class="perFun-l">社团头像</view>
			<view class="perFun-r">
				<image class="avator" :src="clubData.club_header ? imgBaseUrl + clubData.club_header : '/static/mine/name1.png'"></image>
				<u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx;"></u-icon>
			</view>
		</view>
		<view class="perFun" @click="setClub(1)">
			<view class="perFun-l">社团名称</view>
			<view class="perFun-r">
				<text>{{ clubData.club_name }}</text>
				<u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx;"></u-icon>
			</view>
		</view>
		<view class="perFun">
			<view class="perFun-l">都谁可见</view>
			<view class="perFun-r">
				<text class="readonly">{{ clubData.club_auth ? '公开' : '本校' }}</text>
			</view>
		</view>
		<view class="perFun jj">
			<view class="perFun-l">简介</view>
			<view class="readonly" @click="setClub(2)">
				<textarea style="width: 100%;" placeholder="请输入(限100个字)" auto-height disabled type="text" v-model="clubData.club_desc"></textarea>
			</view>
		</view>
		<view class="perFun jj">
			<view class="perFun-l">公告</view>
			<view class="readonly" @click="setClub(3)">
				<textarea style="width: 100%;" placeholder="暂无公告" auto-height disabled type="text" v-model="clubData.club_notice"></textarea>
			</view>
		</view>
		<view class="top1">
			<view class="perFun" @click="toPerson">
				<view class="perFun-l">成员</view>
				<view class="perFun-r">
					<text class="readonly">{{ clubData.member_num }}名成员</text>
					<u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx;"></u-icon>
				</view>
			</view>
			<view v-if="clubData.is_join && clubData.auth == 1" @click="deleteCulb" class="perFun san">解散社团</view>
			<view v-if="clubData.is_join && clubData.auth == 2" @click="exitClub" class="perFun san">退出社团</view>
		</view>
		<!-- input输入 -->
		<u-popup v-model="showinput" mode="top" :safe-area-inset-bottom="true" z-index="10099" @open="textFocus = true" @close="textFocus = false">
			<view class="writeReply">
				<view>
					<view><textarea :focus="textFocus" v-model="comment" :maxlength="maxlength" placeholder="请输入……"></textarea></view>
				</view>
				<view><text @click="addComm">确定</text></view>
			</view>
		</u-popup>
		<helang-compress ref="helangCompress"></helang-compress>
	</view>
</template>

<script>
import { getCulbInfo, editClubInfo, delCulb, outClub } from '../../../../services/community.js';
import helangCompress from '../../../../components/helang-compress/helang-compress';
export default {
	components: {
		helangCompress
	},
	data() {
		return {
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			action: getApp().globalData.imgBaseUrl + '/common/upload/image.html',
			clubData: {},
			club_id: '',
			showinput: false,
			textFocus: false,
			comment: '',
			maxlength: 12
		};
	},
	onLoad(options) {
		this.club_id = options.id;
	},
	onShow() {
		this.getData();
	},
	methods: {
		exitClub() {
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
		deleteCulb() {
			uni.showModal({
				title: '提示',
				content: '请确认进行此删除操作',
				success: res => {
					uni.showLoading({
						title: '加载中...',
						mask: true
					});
					if (res.confirm) {
						delCulb({ id: this.club_id }).then(res => {
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
		// 更换头像
		changeAvator() {
			let that = this;
			uni.chooseImage({
				sizeType: ['compressed'], //可选择原图或压缩后的图片
				sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
				success: res => {
					uni.showLoading({
						title: '检测中...',
						mask: true
					});
					const tempFilePaths = res.tempFilePaths;
					// 单张压缩
					this.$refs.helangCompress
						.compress({
							src: res.tempFilePaths[0],
						})
						.then(async res1 => {
							try {
								await this.$check.checkImg1(0, res1, tempFilePaths);
								uni.showLoading({
									title: '加载中...'
								});
								uni.uploadFile({
									url: that.action,
									filePath: tempFilePaths[0],
									name: 'file',
									header: {
										token: uni.getStorageSync('token')
									},
									success(res) {
										const datas = JSON.parse(res.data);
										if (datas.code == 200) {
											editClubInfo({ id: that.club_id, data: { club_header: datas.result.src } }).then(res => {
												uni.hideLoading();
												if (res.code == 200) {
													that.$set(that.clubData, 'club_header', datas.result.src);
												} else {
													uni.showToast({
														title: res.message,
														icon: 'none'
													});
												}
											});
										}
									}
								});
							} catch (e) {}
						})
						.catch(err => {
							uni.showToast({
								title: '上传失败'
							});
						});
				}
			});
		},
		getData() {
			uni.showLoading({
				title: '加载中...'
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
		toPerson() {
			uni.navigateTo({
				url: '/pages/community/club/clubDetail/clubPersonal/clubPersonal?id=' + this.club_id
			});
		},
		async addComm() {
			let obj = {};
			if (this.comment == '') {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				});
				return;
			}
			if (this.setType == 1) {
				obj.club_name = this.comment;
			} else if (this.setType == 2) {
				obj.club_desc = this.comment;
			} else if (this.setType == 3) {
				obj.club_notice = this.comment;
			}
			try {
				await this.$check.checkTxt(this.comment);
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				editClubInfo({ id: this.club_id, data: obj }).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						uni.showToast({
							title: res.message
						});
						this.getData();
						this.comment = '';
						this.showinput = !this.showinput;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			} catch (e) {
				this.comment = '';
				return false;
			}
		},
		setClub(index) {
			this.setType = index;
			if (index == 1) {
				this.maxlength = 12;
			} else if (index == 2) {
				this.maxlength = 100;
			} else if (index == 3) {
				this.maxlength = 100;
			}
			this.showinput = !this.showinput;
			// uni.navigateTo({
			// 	url: '/pages/community/club/clubDetail/clubSet/clubSet?is_add=2&setType=' + index + '&id=' + this.club_id
			// });
		}
	}
};
</script>

<style scoped>
.content {
	min-height: 100vh;
	background: rgba(245, 245, 245, 1);
}

.content .jj {
	flex-direction: column;
}

.content .jj > view {
	width: 100%;
}

.content .jj > view:nth-of-type(2) {
	background: #f5f5f5;
	border-radius: 8px;
	padding: 24rpx;
	margin-top: 16rpx;
}

.perFun {
	width: 100%;
	background: rgba(255, 255, 255, 1);
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 36rpx 40rpx;
	box-sizing: border-box;
	font-size: 32rpx;
	border-bottom: 1px solid rgba(245, 245, 245, 1);
}

.arrow {
	height: 24rpx;
	width: 14rpx;
	margin-left: 24rpx;
}

.avator {
	width: 88rpx;
	height: 88rpx;
	border-radius: 50%;
}

.readonly {
	color: rgba(36, 36, 36, 0.6);
}

.perFun-l,
.perFun-r {
	height: 100%;
	width: 50%;
	display: flex;
	align-items: center;
}

.perFun-l {
	color: #333333;
	justify-content: flex-start;
}

.perFun-r {
	color: #333333;
	justify-content: flex-end;
}

.top1 > view {
	margin-top: 16rpx;
}

.top1 .san {
	color: #ff3939;
	display: flex;
	justify-content: center;
	align-items: center;
}
/* 留言 */
.writeReply {
	padding: 24rpx;
}

.writeReply textarea {
	height: 50px;
}

.writeReply > view:nth-of-type(1) {
	background: #f0f1f2;
	border-radius: 8px;
	padding: 24rpx;
}

.writeReply > view:nth-of-type(2) {
	text-align: right;
	margin-top: 18rpx;
}

.writeReply > view:nth-of-type(2) text {
	display: inline-block;
	width: 150rpx;
	height: 56rpx;
	background: #0091ff;
	border-radius: 14px;
	font-size: 28rpx;
	color: #ffffff;
	text-align: center;
	line-height: 56rpx;
}
</style>
