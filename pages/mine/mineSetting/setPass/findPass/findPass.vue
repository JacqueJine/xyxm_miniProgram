<template>
	<view class="content">
		<view class="top1" v-if="type==1">
			<view><input type="password" maxlength="6" placeholder="请输入原支付密码" v-model="forminfo2.oldpass" /></view>

		</view>
		<view class="top2" v-if="type==2&&show">
			<view><input type="number" maxlength="11" :disabled="true" placeholder="请输入绑定手机号" v-model="forminfo1.phone" /></view>
			<view class="code">
				<input type="number" maxlength="6" placeholder="请输入验证码" v-model="forminfo1.code" />
				<view @click="getCode">{{msg}}</view>
			</view>
		</view>
		<view class="top2">
			<view v-if="type==1"><input type="password" maxlength="6" placeholder="请输入六位数字支付密码" v-model="forminfo2.password" /></view>
			<view v-if="type==2"><input type="password" maxlength="6" placeholder="请输入六位数字支付密码" v-model="forminfo1.password" /></view>
			<view><input type="password" maxlength="6" placeholder="再次确认支付密码" v-model="r_pass" /></view>
		</view>
		<view class="btn" @click="submit">保存</view>
	</view>
</template>

<script>
	import {
		saveUser,
		changePassword
	} from "../../../../../services/mine.js";
	import {
		sendSms
	} from "../../../../../services/message.js";
	export default {
		data() {
			return {
				type: 1,
				forminfo1: {
					phone: "",
					code: "",
					password: "",
				},
				forminfo2: {
					password: "",
					oldpass: "",
				},

				r_pass: "",
				msg: "获取验证码",
				disable: false,
				second: 60,
				show: true,
				list: [],
			}
		},
		methods: {
			getCode() {
				if (!(/^1[3456789]\d{9}$/.test(this.forminfo1.phone))) {
					uni.showToast({
						title: '请输入正确手机号',
						icon: "none",
						duration: 2000
					});
					return false;
				}
				if (this.disable) {
					return false;
				}
				this.disable = true;
				this.forminfo1.code = '';
				sendSms({
					phone: this.forminfo1.phone,
					template: 'changePassword',
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
			submit() {
				if (this.type == 1) {
					if (!/^\d{6}$/.test(this.forminfo2.oldpass)) {
						uni.showToast({
							title: '原密码为六位数字',
							icon: "none",
							duration: 2000
						});
						return false;
					} else if (!/^\d{6}$/.test(this.forminfo2.password)) {
						uni.showToast({
							title: '请输入六位数字支付密码',
							icon: "none",
							duration: 2000
						});
						return false;
					} else if (this.forminfo2.password != this.r_pass) {
						uni.showToast({
							title: '两次密码输入不一致',
							icon: "none",
							duration: 2000
						});
						return false;
					}
					uni.showLoading({
						title: "提交中……",
						mask: true,
					});
					saveUser({
						data: {
							old_pay_pwd: this.forminfo2.oldpass,
							pay_pwd: this.forminfo2.password,
						}
					}).then(res => {
						uni.hideLoading();
						uni.showToast({
							title: res.message,
							icon: "none",
						});
						if (res.code == 200) {
							setTimeout(() => {
								uni.navigateBack();
							}, 1500);
						}
					})
				}
				// 忘记密码
				else {
					if (this.list.length) {
						if (!/^\d{6}$/.test(this.forminfo1.password)) {
							uni.showToast({
								title: '请输入六位数字支付密码',
								icon: "none",
								duration: 2000
							});
							return false;
						} else if (this.forminfo1.password != this.r_pass) {
							uni.showToast({
								title: '两次密码输入不一致',
								icon: "none",
								duration: 2000
							});
							return false;
						}
						uni.showActionSheet({
							itemList: this.list,
							success: res => {
								uni.startSoterAuthentication({
									requestAuthModes: ['fingerPrint', 'facial'],
									challenge: '123456',
									authContent: "请使用" + this.list[res.tapIndex],
									success: res => {
										changePassword({
											password: this.forminfo1.password,
										}).then(res => {
											uni.showToast({
												title: res.message,
												icon: 'none',
											});
											if (res.code == 200) {
												setTimeout(() => {
													uni.navigateBack();
												}, 1500);
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
						if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.forminfo1.phone)) {
							uni.showToast({
								title: '请输入正确手机号',
								icon: "none",
								duration: 2000
							});
							return false;
						} else if (this.forminfo1.code == "") {
							uni.showToast({
								title: '请输入验证码',
								icon: "none",
								duration: 2000
							});
							return false;
						} else if (!/^\d{6}$/.test(this.forminfo1.password)) {
							uni.showToast({
								title: '请输入六位数字支付密码',
								icon: "none",
								duration: 2000
							});
							return false;
						} else if (this.forminfo1.password != this.r_pass) {
							uni.showToast({
								title: '两次密码输入不一致',
								icon: "none",
								duration: 2000
							});
							return false;
						}
						uni.showLoading({
							title: '提交中……',
							mask: true,
						});
						changePassword(this.forminfo1).then(res => {
							uni.hideLoading();
							uni.showToast({
								title: res.message,
								icon: 'none',
							});
							if (res.code == 200) {
								setTimeout(() => {
									uni.navigateBack();
								}, 1500);
							}
						});
					}
				}
			},
		},
		onLoad: function(options) {
			this.forminfo1.phone = JSON.parse(uni.getStorageSync("user")).phone;
			this.type = options.type
			if (options.type == 1) {
				uni.setNavigationBarTitle({
					title: '修改密码'
				});
			} else {
				uni.setNavigationBarTitle({
					title: '忘记密码'
				});
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
			};


		},
	}
</script>

<style scoped>
	.content {
		min-height: 100vh;
		background: #F2F2F2;
		overflow: hidden;
	}

	.top1,
	.top2,
	.top3 {
		background: #FFFFFF;
	}

	.top2 {
		margin-bottom: 32rpx;
	}

	.code {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.code view {
		color: #0091FF;
		font-weight: bold;
	}

	.top1>view,
	.top2>view,
	.top3>view {
		padding: 32rpx 24rpx;
		border-bottom: 1px solid #F2F2F2;
	}

	.btn {
		margin: 136rpx 24rpx 0;
		background: #FEC200;
		border-radius: 25px;
		text-align: center;
		padding: 28rpx 0;
		font-weight: bold;
	}
</style>
