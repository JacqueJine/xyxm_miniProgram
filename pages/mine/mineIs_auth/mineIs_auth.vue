<template>
	<view>
		<view class="top1">
			<image src="/static/mine/ren.png" mode="widthFix"></image>
			<text>信息安全保障，坚决保障用户隐私</text>
		</view>
		<view class="top2">
			<view @click="upimg(1)"><image :src="id_cardA ? id_cardA : '/static/mine/is_auth1.png'" mode="widthFix"></image></view>
			<view @click="upimg(2)"><image :src="id_cardB ? id_cardB : '/static/mine/is_auth2.png'" mode="widthFix"></image></view>
			<view @click="upimg(3)"><image :src="student_card ? student_card : '/static/mine/is_auth3.png'" mode="widthFix"></image></view>
		</view>
		<view v-if="is_auth != 0" class="btn" style="background:#D4D4D4">已提交，等待审核</view>
		<view v-if="is_auth == 0" class="btn" @click="submit">提交</view>
	</view>
</template>

<script>
import { identityAuthentication } from '../../../services/mine.js';
export default {
	data() {
		return {
			is_auth: 0,
			id_cardA: '',
			id_cardB: '',
			student_card: '',
			form: {
				student_card: '',
				id_cardA: '',
				id_cardB: ''
			},
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			action: getApp().globalData.imgBaseUrl + '/common/upload/image.html'
		};
	},
	methods: {
		submit() {
			if (!this.id_cardA && !this.id_cardA && !this.id_cardA) {
				return false;
			}
			uni.requestSubscribeMessage({
				tmplIds: ['GO3lxKO667mWH5Thu970f4WAl2jTsvDhPitXNoP5hRE'],
				complete: res => {
					this.realName();
				}
			});
		},
		realName(){
			uni.showLoading({
				title: '加载中',
				mask: true,
				success: () => {
					identityAuthentication(this.form).then(res => {
						uni.showToast({
							title: res.message,
							icon: 'none',
							mask: true,
							duration: 1000
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 999);
					});
				}
			});
		},
		upimg(index) {
			if (this.is_auth != 0) {
				return false;
			}
			let that = this;
			uni.chooseImage({
				sizeType: ['compressed'], //可选择原图或压缩后的图片
				sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
				success(res) {
					const tempFilePaths = res.tempFilePaths;
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
								if (index == 1) {
									that.id_cardA = that.imgBaseUrl + datas.result.src;
									that.form.id_cardA = datas.result.src;
								} else if (index == 2) {
									that.id_cardB = that.imgBaseUrl + datas.result.src;
									that.form.id_cardB = datas.result.src;
								} else if (index == 3) {
									that.student_card = that.imgBaseUrl + datas.result.src;
									that.form.student_card = datas.result.src;
								}
								// that.$set(that.userInfo, 'header', );
							}
						}
					});
				}
			});
		}
	},
	onLoad() {
		this.is_auth = JSON.parse(uni.getStorageSync('user')).is_real.code;
	}
};
</script>

<style>
.top1 {
	background: rgba(250, 167, 0, 0.24);
	font-size: 24rpx;
	color: #fa6400;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20rpx;
}

.top1 image {
	width: 26rpx;
	margin-right: 10rpx;
}

.top2 {
	padding-top: 14rpx;
}

.top2 > view {
	text-align: center;
	margin-top: 40rpx;
}

.top2 > view image {
	width: 496rpx;
}

.btn {
	margin: 50rpx 24rpx 132rpx;
	font-size: 24rpx;
	padding: 24rpx 0;
	background: #fec200;
	border-radius: 22px;
	text-align: center;
	font-weight: bold;
}
</style>
