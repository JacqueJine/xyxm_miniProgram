<template>
	<view class="confimOrder">
		<view class="conten">
			<view class="address">
				<view>
					<view><text>买家姓名：</text><text>{{ curSelectAddress.linkman }}</text></view>
					<view><text>收货地址：</text><text>{{ curSelectAddress.address.pickerText
              }}{{ curSelectAddress.detail }}</text></view>
					<view><text>联系电话：</text><text>{{ curSelectAddress.phone }}</text></view>
				</view>
				<view @click="toAddress">更换</view>
			</view>
			<view class="inner">
				<view>
					<view>
						<image src="https://cdn.uviewui.com/uview/swiper/1.jpg" />
					</view>
					<view>
						<view>{{ goods.title }}</view>
						<view>
							<text style="font-size: 30rpx">
								<text class="colorRed" v-if="goods.credit">{{ goods.credit }}积分</text>
								<text v-if="goods.pay_price">+{{ goods.pay_price }}元</text>
							</text>
							<u-number-box :min="1" v-model="num"></u-number-box>
							<!-- <van-stepper minus-class="left" input-class="input" plus-class="left" value="{{ num }}" bind:change="changeNum" /> -->
						</view>
					</view>
				</view>
				<view>
					<view class="alltitle">商品简介</view>
					<view class="brief">
						{{ goods.remark
            }}<text class="colorRed">（运费{{ goods.freight }}元）</text>
					</view>
				</view>
				<view>
					<view class="alltitle">兑换说明</view>
					<view class="mess">{{ goods.goods_desc }}</view>
				</view>
			</view>
		</view>
		<view class="foot">
			<view>
				<text>合计</text>
				<text class="colorRed">{{ allcredit }}积分</text>
				<!-- 单价和运费 -->
				<!-- <text style="font-size:24rpx">+{{allprice}}元</text> -->
				<text style="font-size: 24rpx" v-if="goods.freight">+{{ goods.freight }}运费</text>
			</view>
			<u-button shape="circle" :custom-style="custom" :hair-line="false" @click="show = !show" hover-class="none">确认下单</u-button>
		</view>
		<!-- 支付选择弹窗 -->
		<u-popup v-model="show" mode="center" border-radius="8" :closeable="true" close-icon-pos="top-left"
		 :safe-area-inset-bottom="true">
			<view class="pay">
				<view style="text-align: center"> <text>支付方式</text></view>
				<view>￥12</view>
				<view @click="changepayType(0)">
					<view>
						<image src="/static/mine/yue1.png" class="leftimg"> </image><text>余额支付</text><text class="yue">(剩余1000)</text>
					</view>
					<image :src="
              payType == 0
                ? '/static/mine/checked.png'
                : '/static/mine/check.png'
            "
					 class="rightimg"></image>
				</view>
				<view @click="changepayType(1)">
					<view>
						<image src="/static/mine/wx.png" class="leftimg"> </image><text>微信支付</text>
					</view>
					<image :src="
              payType == 1
                ? '/static/mine/checked.png'
                : '/static/mine/check.png'
            "
					 class="rightimg"></image>
				</view>
				<view @click="toPay">确认支付</view>
			</view>
		</u-popup>
		<!-- 支付密码输入弹窗 -->
		<u-popup v-model="showPI" mode="center" :mask-close-able="false" border-radius="8" :closeable="true" close-icon-pos="top-left"
		 :safe-area-inset-bottom="true">
			<view class="PasswordInput">
				<view>请输入支付密码</view>
				<view @click="focus = true">
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
				<view style="font-size: 24rpx; color: #0091FF" @click="toforget">忘记密码</view>
				<input @input="set_wallets_password" v-model="wallets_password" type="number" style="width: 0rpx; height: 0rpx"
				 :focus="focus" maxlength="6" />
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {getAddress} from "../../../../services/mine.js";
	export default {
		data() {
			return {
				num: 1,
				goodsid: "",
				payType: 1,
				show: false,
				showPI: false,
				imgUrl: getApp().globalData.imgBaseUrl,
				wallets_password: "",
				focus: false,
				custom: {
					fontSize: "32rpx",
					backgroundColor: "#FEC200",
					height: "78rpx",
					width: "318rpx",
					border: "none",
					color: "#333333",
				},
				curSelectAddress: "",
			};
		},
		methods: {
			toAddress() {
				uni.navigateTo({
					url: "/pages/mine/mineSetting/address/address",
				});
			},
			changepayType(index) {
				this.payType = index;
			},
			toPay() {
				this.show = !this.show;
				this.showPI = !this.showPI;
			},
			toforget() {
				uni.navigateTo({
					url: "/pages/mine/mineSetting/setPass/findPass/findPass?type=2",
				});
			},
			// 密码输入够6位
			set_wallets_password() {
				if (this.wallets_password.length == 6) {
					//密码长度6位时，自动验证钱包支付结果
					console.log(this.wallets_password);
				}
			},
			// 获取地址更换地址
			getress(id) {
				getAddress().then((res) => {
					if (res.code == 200) {
						// 不是地址
						if (id) {
							this.curSelectAddress = res.result.find((el) => {
								return el.id === id;
							});
							console.log(this.curSelectAddress);
						}
						// 默认地址
						else {
							this.curSelectAddress = res.result.find((el) => {
								return el.is_default === 1;
							});
							console.log(this.curSelectAddress);
						}
					}
				});
			},
		},
		onLoad() {
			this.getress();
		},
		onShow() {
			let id = "";
			id = uni.getStorageSync("address_id");
			if (id) {
				this.getress(id);
			}
		},
	};
</script>

<style scoped>
	.confimOrder {
		font-weight: bold;
	}

	.address {
		height: 266rpx;
		background: #FEC200;
		padding: 80rpx 40rpx 44rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		font-weight: normal;
	}

	.address>view:nth-of-type(1) {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 500rpx;
		height: 100%;
	}

	.address>view:nth-of-type(1)>view {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}

	.address>view:nth-of-type(1) text:nth-of-type(1) {
		color: rgba(42, 40, 40, 0.4);
	}

	.address>view:nth-of-type(2) {
		border-radius: 12px;
		border: 1px solid #333333;
		padding: 6rpx 34rpx;
	}

	.inner {
		margin: 0 32rpx;
		margin-top: 32rpx;
		background: #FFF;
		font-size: 24rpx;
		border-radius: 4px;
		margin-top: 32rpx;
	}

	.inner image {
		width: 196rpx;
		height: 212rpx;
		margin: 0 24rpx 38rpx 0;
	}

	.inner>view:nth-of-type(1) {
		display: flex;
		justify-content: space-between;
	}

	.inner>view:nth-of-type(1)>view:nth-of-type(2) {
		flex: 1;
	}

	.inner>view:nth-of-type(1)>view:nth-of-type(2)>view:nth-of-type(1) {
		margin: 24rpx 0 72rpx 0;
		font-size: 28rpx;
	}

	.inner>view:nth-of-type(1)>view:nth-of-type(2)>view:nth-of-type(2) {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title {
		font-size: 28rpx;
		margin: 32rpx 0 24rpx;
	}

	.alltitle {
		font-weight: bold;
	}

	.colorRed {
		color: #FF3838;
	}

	.price {
		margin-bottom: 64rpx;
		font-size: 40rpx;
		font-weight: bold;
		padding: 0 18rpx 0 32rpx;
	}

	.brief {
		margin: 12rpx 0 32rpx;
		color: rgba(36, 36, 36, 0.6);
		font-weight: normal;
	}

	.mess {
		text-align: justify;
		margin-top: 12rpx;
		color: rgba(36, 36, 36, 0.6);
		font-weight: normal;
	}

	.left {
		background-color: #FEC200 !important;
		border-radius: 50% !important;
		width: 34rpx !important;
		height: 34rpx !important;
		font-size: 24rpx !important;
	}

	.input {
		background-color: transparent !important;
	}

	.fontcolor {
		color: rgba(36, 36, 36, 0.4);
		font-size: 28rpx;
		margin-left: 10rpx;
	}

	.foot {
		font-size: 28rpx;
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: 10rpx 32rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid rgba(36, 36, 36, 0.1);
	}

	.foot>view>text {
		margin-right: 16rpx;
	}

	.shouhuo {
		height: 20px;
		width: 100%;
		/* background: pink; */
		line-height: 20px;
		font-size: 14px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}

	.right {
		height: 13px;
		width: 8px;
		position: absolute;
		right: 0;
	}

	.fontcolor1 {
		width: 100%;
		height: 28px;
		font-size: 20px;
		font-weight: 500;
		color: rgba(36, 36, 36, 1);
		line-height: 28px;
		display: flex;
		justify-content: flex-start;
	}

	.fontcolor2 {
		width: 233px;
		height: 40px;
		font-size: 14px;
		font-weight: 500;
		color: rgba(36, 36, 36, 1);
		line-height: 20px;
	}

	/* 支付 */

	.pay {
		width: 572rpx;
		height: 536rpx;
		background: #FFFFFF;
		border-radius: 4px;
		padding: 32rpx;
		box-sizing: border-box;
	}

	.pay>view:nth-of-type(1) {
		font-size: 28rpx;
		margin-bottom: 16rpx;
	}

	.pay>view:nth-of-type(2) {
		font-size: 60rpx;
		text-align: center;
		font-weight: bold;
	}

	.pay>view:nth-of-type(3),
	.pay>view:nth-of-type(4) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 50rpx;
		font-weight: bold;
	}

	.pay>view:nth-of-type(3)>view,
	.pay>view:nth-of-type(4)>view {
		display: flex;
		align-items: center;
	}

	.pay .yue {
		font-size: 24rpx;
		font-weight: normal;
		color: rgba(36, 36, 36, 0.4);
	}

	.pay .leftimg {
		width: 32rpx;
		height: 36rpx;
		margin-right: 24rpx;
	}

	.pay .rightimg {
		width: 32rpx;
		height: 32rpx;
	}

	.pay>view:nth-of-type(5) {
		width: 332rpx;
		height: 80rpx;
		background: #FEC200;
		border-radius: 20px;
		text-align: center;
		line-height: 80rpx;
		font-size: 28rpx;
		font-weight: bold;
		margin: 64rpx auto 0;
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
