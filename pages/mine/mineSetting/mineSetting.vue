<template>
	<view class="mineSetting">
		<view class="con">
			<view class="perFun" @click="changeAvator">
				<view class="perFun-l">头像</view>
				<view class="perFun-r">
					<image class="avator" :src="userInfo.header == '' ? '/static/mine/name1.png' : imgBaseUrl + userInfo.header"></image>
					<u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx"></u-icon>
				</view>
			</view>
			<navigator url="./setNickname/setNickname?type=2" class="perFun" style="height: 108rpx; line-height: 108rpx">
				<view class="perFun-l">昵称</view>
				<view class="perFun-r">
					<text>{{ userInfo.name }}</text>
					<u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx"></u-icon>
				</view>
			</navigator>
			<view class="perFun" @click="toPage">
				<view class="perFun-l">学校</view>
				<view class="perFun-r">
					<text class="hides" v-if="userInfo.school.school_name">{{ userInfo.school.school_name + ' ' + userInfo.en_year + '级' }}</text>
					<u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx"></u-icon>
				</view>
			</view>
			<navigator url="./setNickname/setNickname?type=1" class="perFun" style="height: 108rpx; line-height: 108rpx">
				<view class="perFun-l">性别</view>
				<view class="perFun-r">
					<text >{{ userInfo.sex.text }}</text>
					<u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx"></u-icon>
				</view>
			</navigator>
			<view class="perFun">
				<view class="perFun-l">手机</view>
				<view class="perFun-r">
					<text class="readonly">{{ userInfo.phone }}</text>
				</view>
			</view>
			<navigator :url="'./address/address?uid=' + userInfo.id" class="perFun" style="height: 108rpx; line-height: 108rpx; margin-top: 32rpx">
				<view class="perFun-l">收货地址</view>
				<view class="perFun-r"><u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx"></u-icon></view>
			</navigator>
			<navigator url="./setPass/setPass" class="perFun" style="height: 108rpx; line-height: 108rpx; margin-top: 32rpx">
				<view class="perFun-l">支付密码</view>
				<view class="perFun-r"><u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx"></u-icon></view>
			</navigator>
			<navigator url="/pages/mine/mineHelp/creditPoints/creditPoints" class="perFun" style="height: 108rpx; line-height: 108rpx; margin-top: 32rpx">
				<view class="perFun-l">信誉积分</view>
				<view class="perFun-r">
					<text>{{ userInfo.credit }}</text>
					<u-icon name="arrow-right" size="30rpx" style="margin-left: 24rpx"></u-icon>
				</view>
			</navigator>
			<view class="ts">如果要修改学校、年级等信息，请联系客服</view>
		</view>
		<helang-compress ref="helangCompress"></helang-compress>
		<view class="foot" @click="exit">退出登录</view>
	</view>
</template>

<script>
import { findUserInfo, saveUser, logout } from '../../../services/mine.js';
import helangCompress from '../../../components/helang-compress/helang-compress';
export default {
	components: {
		helangCompress
	},
	data() {
		return {
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			userInfo: {
				head: ''
			},
			action: getApp().globalData.imgBaseUrl + '/common/upload/image.html'
		};
	},
	methods: {
		toPage(){
			uni.navigateTo({
				url:"/pages/mine/mineSetting/setSchool/setSchool"
			});
		},
		// 更换头像
		changeAvator() {
			let that = this;
			uni.chooseImage({
				sizeType: ['compressed'], //可选择压缩后的图片
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
										const datas = JSON.parse(res.data);
										if (datas.code == 200) {
											saveUser({
												data: {
													header: datas.result.src
												}
											})
												.then(res1 => {
													uni.showToast({
														title: res1.message,
														icon: 'none'
													});
													if (res1.code == 200) {
														that.$set(that.userInfo, 'header', datas.result.src);
													}
												})
												.catch(e => {
													uni.showToast({
														title: '上传失败'
													});
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
		// 退出登录
		exit() {
			uni.showModal({
				title: '提示',
				content: '您确定要退出登录吗？',
				success: res => {
					if (res.confirm) {
						logout().then(res => {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
							if (res.code == 200) {
								uni.clearStorageSync();
								uni.setStorageSync('Login', false);
								uni.reLaunch({
									url: '/pages/Tab/tabIndex/index'
								});
							}
						});
					}
				}
			});
		}
	},
	onShow() {
		findUserInfo({}).then(res => {
			if (res.code == 200) {
				this.userInfo = res.result;
				uni.setStorageSync('user', JSON.stringify(res.result));
			}
		});
	}
};
</script>

<style scoped>
.mineSetting {
	min-height: 100vh;
	background: rgba(245, 245, 245, 1);
}

.perFun {
	width: 100%;
	height: 108rpx;
	line-height: 108rpx;
	background: rgba(255, 255, 255, 1);
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 40rpx;
	box-sizing: border-box;
	font-size: 32rpx;
	border-bottom: 2rpx solid rgba(245, 245, 245, 1);
}

.perFun:nth-of-type(1) {
	height: 160rpx;
	line-height: 160rpx;
}

.arrow {
	height: 24rpx;
	width: 14rpx;
	margin-left: 24rpx;
}

.readonly {
	color: rgba(36, 36, 36, 0.2);
	font-weight: bold;
	text-align: right;
	/* display: inline-block; */
	/* width: 500rpx; */
}
.hides{
	text-align: right;
	display: inline-block;
	width: 450rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.perFun-l,
.perFun-r {
	height: 100%;
	display: flex;
	align-items: center;
}

.perFun-l {
	color: #333333;
	justify-content: flex-start;
	font-weight: 500;
	min-width: 100rpx;
}

.perFun-r {
	flex: 1 !important;
	color: #333333;
	justify-content: flex-end;
}

.ts {
	font-size: 22rpx;
	color: rgba(36, 36, 36, 0.4);
	padding: 28rpx 40rpx;
}

.foot {
	position: fixed;
	bottom: 0;
	width: 100%;
	text-align: center;
	color: #ff3939;
	padding: 32rpx 0;
	background: #ffffff;
}

.headImg {
	width: 88rpx;
	height: 88rpx;
}

.avator {
	height: 88rpx;
	width: 88rpx;
	border-radius: 50%;
}
</style>
