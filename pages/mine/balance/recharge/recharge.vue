<template>
	<view class="all">
		<view class="top1">
			<input placeholder="请输入金额" type="digit" placeholder-style="color:rgba(36, 36, 36, 0.2);" v-model="inputValue"></input>
		</view>
		<view class="top3" @click="recharge">{{type==6?'充值':'转余额'}}</view>
		<view class="top2" v-if="type==16">
			<view>可转收益：{{cash}}</view>
			<view class="btn" @click="withdrawAll">全部转出</view>
		</view>
		<view class="top4">
			<view>规则</view>
			<view>*	转出至余额可用于余额消费、提现</view>
			<view>*	转出时平台收取 {{t_rate}}% 手续费</view>
			<view>*	余额提现不收取手续费</view>
		</view>
		<!-- 支付密码输入弹窗 -->
		<u-popup v-model="showPI" mode="center" :mask-close-able="false" border-radius="8" :closeable="true" close-icon-pos="top-left"
		 :safe-area-inset-bottom="true" :negative-top="100" @close="setFocus" @open="focus = true">
			<view class="PasswordInput">
				<view>请输入支付密码</view>
				<view>
					<view class="password_dot">
						<i v-if="wallets_password.length >= 1"></i>
					</view>
					<view class="password_dot">
						<i v-if="wallets_password.length >= 2"></i>
					</view>
					<view class="password_dot">
						<i v-if="wallets_password.length >= 3"></i>
					</view>
					<view class="password_dot">
						<i v-if="wallets_password.length >= 4"></i>
					</view>
					<view class="password_dot">
						<i v-if="wallets_password.length >= 5"></i>
					</view>
					<view class="password_dot">
						<i v-if="wallets_password.length >= 6"></i>
					</view>
				</view>
				<view style="font-size: 24rpx; color: #0091ff" @click="toforget">忘记密码</view>
				<input @input="set_wallets_password" v-model="wallets_password" type="number" style="width: 0rpx; height: 0rpx"
				 :focus="focus" maxlength="6" />
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getProfitNum,
		transferProfit
	} from "../../../../services/mine.js";
	import {
		getInfoSystem
	} from "../../../../services/function.js";
	export default {
		data() {
			return {
				t_rate: 0,
				cash: 0,
				inputValue: "",
				type: 6,
				// 支付
				showPI: false,
				wallets_password: "",
				focus: false,
				regMoney: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^[1-9]$)|(^\d\.[1-9]{1,2}$)|(^\d\.[0]{1}[1-9]{1}$|(^\d\.[1-9]{1}[0]{1}$)$)/,
			}
		},
		methods: {
			withdrawAll() {
				this.inputValue = this.cash;
			},
			setFocus() {
				this.focus = false;
				this.wallets_password = "";
			},
			recharge() {
				if (JSON.parse(uni.getStorageSync("user")).is_pay_pwd == 0) {
					uni.navigateTo({
						url: "/pages/mine/mineSetting/setPass/setPass",
					});
				} else if (this.type == 6) {
					// 充值 微信支付
				} else if (!this.regMoney.test(this.inputValue)) {
					uni.showToast({
						title: "请输入正确金额",
						icon: "none",
					});
					return false;
				} else if (this.type == 16) {
					// 转余额
					this.showPI = !this.showPI;
				}
			},
			// 余额支付
			set_wallets_password() {
				if (this.wallets_password.length == 6) {
					this.focus = false;
					uni.showLoading({
						title: "申请中……",
						mask: true,
					});
					transferProfit({
						price: this.inputValue,
						pay_pwd:this.wallets_password,
					}).then(res => {
						this.wallets_password = "";
						this.showPI = !this.showPI;
						uni.hideLoading();
						uni.showToast({
							title: res.message,
							icon: "none",
						});
						if(res.code==200){
							setTimeout(()=>{
								uni.navigateBack({
									delta:2,
								});
							},1500);
						}
					});
				}
			},
			toforget() {
				uni.navigateTo({
					url: "/pages/mine/mineSetting/setPass/findPass/findPass?type=2",
				});
			},
		},
		onLoad(options) {
			this.type = options.type;
			if (options.type == 16) {
				uni.setNavigationBarTitle({
					title: "转余额"
				});
				getProfitNum({
					page: 1,
					limit: 10,
				}).then(res => {
					if (res.code == 200) {
						// this.cash = (res.result.profit - res.result.no_take).toFixed(2);
						this.cash = this.$Numcheck.rounding(res.result.profit - res.result.no_take,2);
					} else {
						this.cash = 0;
					}
				});
			}
			getInfoSystem({
				key: "提现费率",
			}).then(res => {
				if (res.code == 200) {
					this.t_rate = res.result.value;
				}
			});
		},
	}
</script>

<style scoped>
	.all {
		height: 100vh;
		background: #fff;
		display: flex;
		flex-direction: column;
		padding: 0 40rpx;
		box-sizing: border-box;
		font-family: PingFangSC-Medium, PingFang SC;
	}

	.top1 {
		height: 314rpx;
		line-height: 314rpx;
		text-align: center;
		width: 100%;
		font-size: 72rpx;
		font-weight: bold;
		color: rgba(36, 36, 36, 0.2);
	}

	.top1 input {
		height: 100%;
		color: rgba(36, 36, 36, 1);
	}

	.top2 {
		height: 100rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		font-size: 24rpx;
		line-height: 34rpx;
	}

	.top2 .btn {
		height: 100rpx;
		line-height: 100rpx;
		/* width: 200rpx; */
		font-size: 24rpx;
		color: rgba(49, 162, 246, 1);
		/* margin-left: 24rpx; */
	}

	.top3 {
		width: 670rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background: #FEC200;
		border-radius: 50rpx;
		font-size: 32rpx;
		font-weight: bold;
		/* margin-top: 80rpx; */
	}

	.top4 {
		color: rgba(36, 36, 36, .4);
		font-size: 24rpx;
	}

	.top4>view {
		margin-top: 22rpx;
	}

	.top4>view:nth-of-type(1) {
		text-align: center;
		font-size: 28rpx;
		margin-bottom: 18rpx;
		color: rgba(36, 36, 36, 1);
	}

	/* 支付密码输入 */

	.PasswordInput {
		width: 600rpx;
		height: 300rpx;
		padding: 30rpx 20rpx 20rpx;
		box-sizing: border-box;
		text-align: center;
		position: relative;
		top: 0;
		left: 0;
	}

	.PasswordInput>view:nth-of-type(2) {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 50rpx 0 30rpx;
	}

	.password_dot {
		width: 90rpx;
		height: 90rpx;
		border: 2rpx solid #ddd;
		border-left: none 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.password_dot:nth-child(1) {
		border-left: 2rpx solid #ddd;
	}

	.password_dot i {
		background: #000;
		border-radius: 50%;
		width: 20rpx;
		height: 20rpx;
		display: inline-block;
	}
</style>
