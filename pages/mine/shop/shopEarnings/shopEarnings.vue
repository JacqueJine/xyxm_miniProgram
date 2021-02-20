<template>
	<view class="all">
		<view class="top1">
			<input placeholder="请输入提现金额" type="digit" placeholder-style="color:rgba(36, 36, 36, 0.2);" v-model="inputValue"
			 maxlength="11"></input>
		</view>
		<view class="top2">
			<view>可提现金额：{{cash}}</view>
			<view class="btn" @click="inputValue=cash">全部提现</view>
		</view>
		<view class="top3" @click="withdraw">提现</view>
		<view class="top4">
			<view>提现规则</view>
			<view>收益满1元即可发起申请，平台在24小时内审核，提现金额直接到微信零钱，提现手续费为15%</view>
		</view>
		<view class="top5">
			<view>提现记录</view>
			<view class="list">
				<view>
					<view style="font-size: 28rpx;">提现</view>
					<view>2019-12-12 10:10:10</view>
				</view>
				<view>-1000</view>
			</view>
		</view>
		<!-- 支付密码输入弹窗 -->
		<u-popup v-model="showPI" mode="center" :mask-close-able="false" border-radius="8" :closeable="true" close-icon-pos="top-left"
		 :safe-area-inset-bottom="true">
			<view class="PasswordInput">
				<view>请输入支付密码</view>
				<view @click="focus=true">
					<view class="password_dot">
						<i v-if="wallets_password.length>=1"></i>
					</view>
					<view class="password_dot">
						<i v-if="wallets_password.length>=2"></i>
					</view>
					<view class="password_dot">
						<i v-if="wallets_password.length>=3"></i>
					</view>
					<view class="password_dot">
						<i v-if="wallets_password.length>=4"></i>
					</view>
					<view class="password_dot">
						<i v-if="wallets_password.length>=5"></i>
					</view>
					<view class="password_dot">
						<i v-if="wallets_password.length>=6"></i>
					</view>
				</view>
				<view style="font-size: 24rpx; color: #0091FF;" @click="toforget">忘记密码</view>
				<input @input="set_wallets_password" v-model="wallets_password" type="number" style="width:0rpx;height:0rpx" :focus="focus"
				 maxlength="6" />
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputValue: "",
				cash: 1000,
				showPI: false,
				focus:false,
				wallets_password:"",
			}
		},
		methods: {
			withdraw() {
				if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(this.inputValue)) {
					uni.showToast({
						title: '请输入正确的金额',
						icon: 'none'
					});
					return false;
				}
				this.showPI = !this.showPI;
			},
			toforget() {
				uni.navigateTo({
					url: "/pages/mine/mineSetting/setPass/findPass/findPass?type=2"
				})
			},
			// 密码输入够6位
			set_wallets_password() {
				if (this.wallets_password.length == 6) { //密码长度6位时，自动验证钱包支付结果
					console.log(this.wallets_password);
				}
			},
		}
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
		justify-content: flex-start;
		font-size: 24rpx;
		line-height: 34rpx;
	}

	.top2 .btn {
		height: 100rpx;
		line-height: 100rpx;
		width: 200rpx;
		font-size: 24rpx;
		color: rgba(49, 162, 246, 1);
		margin-left: 24rpx;
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
		margin-bottom: 64rpx;
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

	.top5 {
		margin-top: 72rpx;
		font-weight: bold;
	}

	.list {
		padding: 40rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(151, 151, 151, .1);
	}

	.list>view:nth-of-type(1)>view:nth-of-type(2) {
		font-size: 24rpx;
		color: rgba(36, 36, 36, .4);
		font-weight: normal;
		margin-top: 8rpx;
	}

	.list>view:nth-of-type(2) {
		font-size: 40rpx;
		color: #FF5151;
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
