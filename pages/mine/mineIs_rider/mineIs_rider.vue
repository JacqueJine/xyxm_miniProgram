<template>
	<view class="content">
		<view class="top1">
			成为骑手赚生活费
		</view>
		<view class="top2">
			<view> <text></text><text>自由接单</text> </view>
			<view> <text></text><text>佣金秒到账</text> </view>
			<view> <text></text><text>实名有保障</text> </view>
		</view>
		<view class="top3">
			<view class="phone" v-if="show"> <input type="number" :disabled="true" v-model="phone" maxlength="11" placeholder="请输入手机号" />
			</view>
			<view class="code" v-if="show">
				<view><input type="number" v-model="code" maxlength="6" placeholder="请输入验证码" /></view>
				<view @click="getCode">{{msg}}</view>
			</view>
			<view @click="check" class="btn">点击申请</view>
		</view>
		<view class="top4">
			常见问题
		</view>
		<view class="top5">
			<view>1：提交申请后立即审核完成，不会在上课时间打扰</view>
		</view>
	</view>
</template>

<script>
	import {
		riderAuthentication
	} from "../../../services/mine.js";
	import {
		sendSms
	} from "../../../services/message.js";
	export default {
		data() {
			return {
				show: true,
				list: [],
				disable: false,
				msg: "获取验证码",
				disable: false,
				second: 60,
				phone: "",
				code: "",
			}
		},
		methods: {
			getCode() {
				if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
					uni.showToast({
						title: "请输入正确手机号",
						icon: "none",
					})
					return false;
				}
				if (this.disable) {
					return false;
				}
				this.disable = true;
				this.code = "";
				sendSms({
					phone: this.phone,
					template: 'registerRider',
				}).then(res => {
					uni.showToast({
						title: res.message,
						icon: 'none',
					});
					if (res.code == 200) {
						let timer = setInterval(() => {
							this.second--;
							this.msg = this.second + "s后获取";
							if (this.second <= 0) {
								this.second = 60;
								this.disable = false;
								this.msg = "获取验证码";
								// 清计时器
								clearInterval(timer);
							}
						}, 1000);
					} else {
						this.disable = false;
					}
				});
			},
			check() {
				if (this.list.length) {
					uni.showActionSheet({
						itemList: this.list,
						success: res => {
							uni.startSoterAuthentication({
								requestAuthModes: ['fingerPrint', 'facial'],
								challenge: '123456',
								authContent: "请使用" + this.list[res.tapIndex],
								success: res => {
									riderAuthentication().then(res1 => {
										uni.showToast({
											title: res1.message,
											icon: "none",
										});
										if (res1.code == 200) {
											setTimeout(() => {
												uni.navigateBack();
											}, 2000);
										}
									});
								},
								fail: err => {
									uni.showToast({
										title: "认证失败",
										icon: "none",
									});
								},
							})
						},
						fail: res => {
							console.log(res.errMsg);
						}
					});
				}
				// 手机号认证
				else {
					if (this.code == '') {
						uni.showToast({
							title: "请输入验证码",
							icon: 'none',
						});
						return false;
					}
					uni.showLoading({
						title: '提交中……',
						mask: true,
					});
					riderAuthentication({
						phone: this.phone,
						code: this.code,
					}).then(res1 => {
						uni.hideLoading();
						uni.showToast({
							title: res1.message,
							icon: "none",
						});
						if (res1.code == 200) {
							setTimeout(() => {
								uni.navigateBack();
							}, 1500);
						}
					});
				}
			},
		},
		onLoad() {
			this.phone = JSON.parse(uni.getStorageSync("user")).phone;
			uni.showLoading({
				title: "加载中……",
				mask: true,
			});
			// 检查支持的认证方式
			uni.checkIsSupportSoterAuthentication({
				success: res => {
					if (res.supportMode.length) {
						this.list = [];
						uni.checkIsSoterEnrolledInDevice({
							checkAuthMode: res.supportMode[0],
							success: res1 => {
								this.show = false;
								res.supportMode[0] == 'fingerPrint' ? this.list.push("指纹认证") : this.list.push("人脸认证");
							},
							complete: res => {
								uni.hideLoading();
							}
						})
					} else {
						uni.hideLoading();
					}
				},
				fail: err => {
					uni.hideLoading();
				},
			});
		},
	}
</script>

<style>
	.content {
		min-height: 100vh;
		background: linear-gradient(138deg, #FEC200 20%, #FE9A00 100%);
		padding: 0 50rpx 0 68rpx;
	}

	.top1 {
		padding: 84rpx 0 16rpx;
		font-size: 78rpx;
	}

	.top2 {
		display: flex;
		font-size: 24rpx;
		align-items: center;
		justify-content: space-between;
	}

	.top2>view {
		display: flex;
		align-items: center;
	}

	.top2>view>text:nth-of-type(1) {
		width: 8rpx;
		height: 8rpx;
		border-radius: 50%;
		background: #333333;
		margin-right: 16rpx;
	}

	.top3>view {
		border-radius: 4px;
		background: #FFFFFF;
		margin-top: 32rpx;
		padding: 24rpx 32rpx;
		height: 88rpx;
		box-sizing: border-box;
	}

	.top3>.phone {
		margin-top: 70rpx;
	}

	.top3>.code {
		display: flex;
		align-items: center;
		background: transparent;
		padding: 0;
		justify-content: space-between;
	}

	.top3>.code>view {
		border-radius: 4px;
		background: #FFFFFF;
		height: 88rpx;
		box-sizing: border-box;
	}

	.top3>.code>view:nth-of-type(1) {
		padding: 24rpx 32rpx;
		margin-right: 16rpx;
		flex: 1;
	}

	.top3>.code>view:nth-of-type(2) {
		font-size: 24rpx;
		padding: 28rpx 32rpx;
		color: #FA6400;
		text-align: center;
	}

	.top3>.btn {
		color: #FEAE00;
		background: #333333;
		text-align: center;
		margin-top: 30rpx;
	}

	.top4 {
		text-align: center;
		margin-top: 84rpx;
	}

	.top4,
	.top5 {
		font-size: 24rpx;
	}

	.top5 {
		text-align: justify;
		padding: 0 0 18rpx;
	}

	.top5>view {
		margin-top: 32rpx;
	}
</style>
