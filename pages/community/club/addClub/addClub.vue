<template>
	<view class="content">
		<view class="perFun" @click="changeAvator">
			<view class="perFun-l">社团头像</view>
			<view class="perFun-r">
				<image class="avator" :src="form.club_header == '' ? '/static/mine/name1.png' : imgBaseUrl + form.club_header"></image>
				<u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx;"></u-icon>
			</view>
		</view>
		<view class="perFun" @click="setClub(1)">
			<view class="perFun-l">社团名称</view>
			<view class="perFun-r">
				<input placeholder="请输入不超12个字" v-model="form.club_name" disabled maxlength="12" style="text-align: right;" />
				<u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx;"></u-icon>
			</view>
		</view>
		<view class="perFun">
			<view class="perFun-l">都谁可见</view>
			<view class="perFun-r">
				<u-radio-group v-model="form.club_auth">
					<u-radio :name="0">公开</u-radio>
					<u-radio :name="1">本校</u-radio>
				</u-radio-group>
			</view>
		</view>
		<view class="perFun jj">
			<view class="perFun-l">简介</view>
			<view @click="setClub(2)"><textarea placeholder="必填（限100个字）" v-model="form.club_desc" disabled maxlength="100"></textarea></view>
		</view>
		<view class="add" @click="addClub">创建</view>
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
import { foundCulb } from '../../../../services/community.js';
import helangCompress from '../../../../components/helang-compress/helang-compress';
export default {
	components: {
		helangCompress
	},
	data() {
		return {
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			action: getApp().globalData.imgBaseUrl + '/common/upload/image.html',
			form: {
				club_name: '',
				club_header: '',
				club_desc: '',
				club_auth: 0
			},
			setType: '',
			showinput: false,
			textFocus: false,
			comment: '',
			maxlength: 12
		};
	},
	methods: {
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
							src: res.tempFilePaths[0]
						})
						.then(async res1 => {
							try {
								await this.$check.checkImg1(0, res1, tempFilePaths);
								uni.uploadFile({
									url: that.action,
									filePath: tempFilePaths[0],
									name: 'file',
									header: {
										token: uni.getStorageSync('token')
									},
									success(res) {
										uni.hideLoading();
										const datas = JSON.parse(res.data);
										if (datas.code == 200) {
											that.$set(that.form, 'club_header', datas.result.src);
										}
									}
								});
							} catch (e) {
								uni.hideLoading();
							}
						})
						.catch(err => {
							uni.showToast({
								title: '上传失败'
							});
						});
				}
			});
		},
		addClub() {
			if (!this.form.club_header) {
				uni.showToast({
					title: '请上传社团头像',
					icon: 'none'
				});
				return;
			} else if (this.form.club_name == '') {
				uni.showToast({
					title: '请输入社团名称',
					icon: 'none'
				});
				return;
			} else if (this.form.club_desc == '') {
				uni.showToast({
					title: '请填写社团简介',
					icon: 'none'
				});
				return;
			}
			// 消息提醒 ：申请加入
			uni.requestSubscribeMessage({
				tmplIds: ['Fui72A7YyTUy46w9jLHONqsZYV-Ssjionl0QvVOQeu0'],
				complete: res => {
					this.create();
				}
			});
		},
		create() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			foundCulb({ data: this.form }).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					uni.redirectTo({
						url: '/pages/community/club/club?id=' + res.result.id
					});
					uni.showToast({
						title: res.message
					});
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		async addComm() {
			if (this.comment == '') {
				uni.showToast({
					title: '请输入内容',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			try {
				await this.$check.checkTxt(this.comment);
				if (this.setType == 1) {
					this.form.club_name = this.comment;
				} else if (this.setType == 2) {
					this.form.club_desc = this.comment;
				}
				this.comment = '';
				this.showinput = !this.showinput;
			} catch (e) {
				this.comment = '';
				return false;
			}
		},
		setClub(type) {
			this.setType = type;
			if (type == 1) {
				this.maxlength = 12;
			} else if (type == 2) {
				this.maxlength = 100;
			}
			this.showinput = !this.showinput;
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
	color: rgba(36, 36, 36, 0.2);
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

.add {
	width: 702rpx;
	height: 98rpx;
	font-size: 36rpx;
	text-align: center;
	line-height: 98rpx;
	background: #fec200;
	border-radius: 25px;
	position: absolute;
	bottom: 24rpx;
	left: 24rpx;
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
