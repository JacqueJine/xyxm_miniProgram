<template>
	<view class="content">
		<view>
			<image src='/static/message/logo.png' mode="widthFix"></image>
		</view>
		<view>校园小茗登录</view>
		<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
			<u-icon name="weixin-fill" color="#FFFFFF" size="48rpx" style="margin-right: 16rpx;"></u-icon> 微信授权登录
		</button>
	</view>
</template>

<script>
	import {
		Login,
		getToken,
	} from 'services/mine.js';
	export default {
		data() {
			return {
				code: "",
			}
		},
		methods: {
			getPhoneNumber(val) {
				if (val.target.errMsg == "getPhoneNumber:ok") {
					uni.showLoading({
						title: "登录中……"
					});
					Login({
						code: this.code,
					}).then(res => {
						if (res.code == 200) {
							getToken({
								session_key: res.result.session_key,
								openid: res.result.openid,
								encryptedData: val.detail.encryptedData,
								iv: val.detail.iv
							}).then(res => {
								uni.hideLoading();
								if (res.code == 200) {
									uni.setStorageSync('token', res.result.token);
									uni.setStorageSync('logintype', res.result.type);
									uni.setStorageSync('lqMoney',res.result.money);
									if (!res.result.is_login) {
										uni.navigateTo({
											url: '/pages/mine/comInfo/comInfo'
										});
									} else {
										uni.setStorageSync('Login', true);
										uni.switchTab({
											url: '/pages/Tab/tabIndex/index'
										});
									}

								} else {
									uni.showToast({
										title: "授权失败，请重新点击授权",
										icon: "none"
									})
								}
							})
						}
					});
				}

			},
		},
		onShow() {
			uni.login({
				provider: 'weixin',
				success: (loginRes) => {
					this.code = loginRes.code;
				},
			});
		},
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.content>view:nth-of-type(1) {
		margin: 54rpx 0 40rpx;
	}

	.content>view:nth-of-type(1) image {
		width: 144rpx;
	}

	.content>view:nth-of-type(2) {
		font-size: 36rpx;
		font-weight: bold;
	}

	button {
		width: 604rpx;
		height: 116rpx;
		background: #46DA7D;
		border-radius: 29px;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		justify-content: center;
		margin-top: 370rpx;
		padding: 0;
	}
</style>
