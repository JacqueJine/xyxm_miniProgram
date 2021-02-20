<template>
	<!-- v-if="alldata!=''" -->
	<view class="all" v-if="alldata!=''">
		<view class="c">
			<view class="c-t">
				<view>待支付</view>
				<view>￥{{ alldata.price }} </view>
				<view v-if="alldata.is_good_prepay == 1"><text style="font-size: 24rpx; font-weight: normal">因微信平台交易规则需额外收取{{ y_rate }}%手续费</text></view>
			</view>
			<view class="c-c">
				<view class="c-c-per">
					<view class="name">我的姓名</view>
					<view class="tel">{{ alldata.user_name }}</view>
				</view>

				<view class="c-c-per">
					<view class="name">我的手机</view>
					<view class="tel">{{ alldata.user_phone }}</view>
				</view>
			</view>
			<!-- 中间帮取快递信息 -->
			<view class="center">
				<view class="center-per">
					<!-- 快递 -->
					<view v-if="alldata.type == 1">
						<view :style="index>0?'padding-top:32rpx;border-bottom: 1px solid #f2f2f2':'border-bottom: 1px solid #f2f2f2'"
						 v-for="(item, index) in alldata.task_expressage" :key="index">
							<view class="takePlace">
								<view class="dot red"></view>
								<view class="cp-t">取件地点：</view>
								<view class="cp-c">{{ item.task_address }}</view>
							</view>
							<view class="deliveryPlace">
								<view class="dot blue"></view>
								<view class="cp-t">送件地点：</view>
								<view class="cp-c">{{ item.destination }}</view>
							</view>
						</view>
					</view>
					<!-- 跑腿 -->
					<view style="border-bottom: 1px solid #f2f2f2" v-if="alldata.type == 2">
						<view class="takePlace">
							<view class="dot red"></view>
							<view class="cp-t">取件地点：</view>
							<view class="cp-c">{{ alldata.task_address }}</view>
						</view>
						<view class="deliveryPlace">
							<view class="dot blue"></view>
							<view class="cp-t">送件地点：</view>
							<view class="cp-c">{{ alldata.destination }}</view>
						</view>
					</view>
					<!-- 其他任务 -->
					<view v-if="alldata.type == 3">
						<view class="takePlace">
							<view class="dot red"></view>
							<view class="cp-t">任务内容：</view>
							<view class="cp-c">{{ alldata.express_desc }}</view>
						</view>
					</view>
					<view class="deliveryPlace" v-if="alldata.type != 3">
						<view class="dot" style="background: #00c85b"></view>
						<view class="cp-t">送件时间：</view>
						<view class="cp-c">{{ alldata.destination_time.text }} 前</view>
					</view>
					<view class="takePlace" v-if="alldata.type != 3">
						<view class="cp-t">备注：</view>
						<view class="cp-c notes-c">{{ alldata.comment }}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="bottom">
			<view class="b-l" @click="showmx = !showmx">
				<view class="allPrice1">总计</view>
				<view class="allPrice2">{{ alldata.price }}</view>
				<view class="beizhu">查看明细</view>
			</view>

			<view class="confirmPayment" @click="addMess">确认支付</view>
		</view>
		<!-- 支付选择弹窗 -->
		<u-popup v-model="show" mode="center" border-radius="8" :closeable="true" close-icon-pos="top-left"
		 :safe-area-inset-bottom="true">
			<view class="pay">
				<view style="text-align: center"> <text>支付方式</text></view>
				<view>￥{{ alldata.price }}</view>
				<view @click="changepayType(0)">
					<view>
						<image src="/static/mine/yue1.png" class="leftimg"> </image><text>余额支付</text><text class="yue">(剩余{{ alldata.user_info.wallet }})</text>
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
		<!-- mingxi -->
		<u-popup v-model="showmx" mode="bottom" border-radius="20">
			<view class="goodsmx">
				<view v-if="alldata.is_good_prepay == 1"><text>商品预付价</text><text>￥{{ alldata.good_prepay }}</text></view>
				<view><text>赏金</text><text>￥{{ alldata.money }}</text></view>
				<view v-if="alldata.is_urgent == 1"><text>加急费</text><text>￥{{ alldata.urgent_price }}</text></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getInfoTask,
		getInfoSystem,
		payTask,
		delTask
	} from "../../../services/function.js";
	import {
		findUserInfo
	} from "../../../services/mine.js";
	export default {
		data() {
			return {
				y_rate: "",
				alldata: "",
				// 支付
				payType: 0,
				show: false,
				showPI: false,
				wallets_password: "",
				focus: false,
				showmx: false,
			};
		},
		methods: {
			addMess() {
				// 时间不足不让弹窗 且删除改任务
				let timestamp = Date.parse(new Date()) / 1000;
				if (this.alldata.destination_time.time - timestamp < 1800 && this.alldata.type != 3) {
					uni.showToast({
						title: '任务完成时间不足30分钟，即将删除该任务',
						icon: "none",
					});
					delTask({
						id: this.alldata.id,
					}).then((res) => {
						if (res.code == 200) {
							uni.navigateBack({
								delta:2
							})
						} else {
							uni.showToast({
								title: res.message,
								icon: "none",
							});
						}
					});
					return false;
				}
				// 消息提醒: 接单成功、服务完成通知（任务完成）、退款成功
				uni.requestSubscribeMessage({
					tmplIds: ['he7i5d7vW5Xj6NBfjg3-ylPgZC5Icet7uo_dORB0bA8', 'JghFiwRp6XHRSbCjuobZFtfkrx9P3khSJyaNU-5zCrM',
						'DaKUHHAXb6pW07VzQWQn1UB0mnr0W8aTQZy0FGm4IL8'
					],
					complete: res => {
						// 不管成功失败都执行添加任务
						this.show = true;
					}
				});

			},
			setFocus() {
				this.focus = false;
				this.wallets_password = "";
			},
			getKey() {
				getInfoSystem({
					key: "预付费率",
				}).then((res) => {
					if (res.code == 200) {
						this.y_rate = res.result.value;
					}
				});
			},
			changepayType(index) {
				if (this.alldata.user_info.wallet < this.alldata.price * 1) {
					if (index == 0) {
						uni.showToast({
							title: "余额不足",
							icon: "none",
						});
					}
					this.payType = 1;
					return false;
				}
				this.payType = index;
			},
			toPay() {
				// 没有设置支付密码
				if (JSON.parse(uni.getStorageSync("user")).is_pay_pwd == 0 && this.payType == 0) {
					uni.navigateTo({
						url: "/pages/mine/mineSetting/setPass/setPass",
					});
				} else if (this.payType == 0) {
					this.show = !this.show;
					this.showPI = !this.showPI;
				} else if (this.payType == 1) {
					// 微信支付
					uni.showLoading({
						title: "支付中……",
						mask: true,
					});
					payTask({
						task_id: this.alldata.id,
						pay_type: 2,
						openid: this.alldata.user_info.openid,
					}).then((res) => {
						if (res.code == 200) {
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: res.result.timeStamp,
								nonceStr: res.result.nonceStr,
								package: res.result.package,
								signType: res.result.signType,
								paySign: res.result.paySign,
								success: res1 => {
									payTask({
										task_id: this.alldata.id,
										pay_type: 21,
										openid: this.alldata.user_info.openid,
									}).then(res => {
										uni.hideLoading();
										uni.showToast({
											title: res.message,
											icon: "none",
										});
										if (res.code == 200) {
											uni.reLaunch({
												url: "/pages/mine/havePublished/orderDetail/orderDetail?id=" + this.alldata.id,
											});
										}
									})

								},
								fail: err => {
									uni.hideLoading();
									uni.showToast({
										title: '您已取消支付',
										icon: 'none',
									});
									// console.log('fail:' + err);
								}
							});
						} else {
							uni.showToast({
								title: res.message,
								icon: "none",
							});
						}

					});
				}
			},
			toforget() {
				this.focus = false;
				this.wallets_password = "";
				this.showPI=false;
				uni.navigateTo({
					url: "/pages/mine/mineSetting/setPass/findPass/findPass?type=2",
				});
			},
			// 密码输入够6位 余额支付输入支付密码
			set_wallets_password() {
				if (this.wallets_password.length == 6) {
					//密码长度6位时，自动验证钱包支付结果
					this.showPI = false;
					this.focus = false; //不让动
					uni.showLoading({
						title: "支付中……",
						mask: true,
					});
					payTask({
						task_id: this.alldata.id,
						pay_type: 1,
						pwd: this.wallets_password,
					}).then((res) => {
						uni.hideLoading();
						this.wallets_password = "";
						uni.showToast({
							title: res.message,
							icon: "none",
						});
						if (res.code == 200) {
							uni.reLaunch({
								url: "/pages/mine/havePublished/orderDetail/orderDetail?id=" + this.alldata.id,
							});
						} else {}
					});
				}
			},
		},
		onLoad(options) {
			uni.showLoading({
				title: "加载中……",
				mask: true,
			});
			this.getKey();
			getInfoTask({
				id: options.id,
			}).then((res) => {
				if (res.code == 200) {
					uni.hideLoading();
					this.alldata = res.result;
					if (this.alldata.user_info.wallet < this.alldata.price * 1) {
						this.payType = 1;
					}
				}
			});
		},
	};
</script>

<style scoped>
	.all {
		height: 100vh;
		width: 100%;
		background: rgba(245, 245, 245, 1);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		overflow: auto;
		color: rgba(36, 36, 36, 1);
		padding-bottom: 70rpx;
		box-sizing: border-box;
	}

	.c {
		width: 100%;
		height: auto;
		padding: 32rpx;
		box-sizing: border-box;
		padding-bottom: 40px;
	}

	.c-t {
		width: 686rpx;
		height: 242rpx;
		background: #fec200;
		border-radius: 5px;
		padding: 50rpx 32rpx;
		box-sizing: border-box;
	}

	.c-t view:nth-child(1) {
		font-size: 36rpx;
		font-weight: bold;
	}

	.c-t view:nth-child(2) {
		font-size: 48rpx;
		font-weight: bold;
	}

	.c-c {
		width: 686rpx;
		height: 164rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 5px;
		margin: 32rpx 0;
		padding: 32rpx;
		box-sizing: border-box;
		font-weight: 400;
		color: rgba(36, 36, 36, 0.4);
		font-size: 28rpx;
		/* line-height:20px; */
	}

	.c-c-per {
		height: 40rpx;
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.c-c-per:nth-child(2) {
		margin-top: 16rpx;
	}

	.tel {
		margin-left: 28rpx;
		color: rgba(36, 36, 36, 1);
	}

	/* 02 */

	.center {
		width: 100%;
		height: auto;
		margin-top: 32rpx;
	}

	.center-per {
		background: rgba(255, 255, 255, 1);
		border-radius: 5px;
		padding: 32rpx;
		box-sizing: border-box;
		color: rgba(36, 36, 36, 0.4);
		font-size: 20rpx;
		text-align: left;
		padding-left: 68rpx;
		margin-bottom: 32rpx;
	}

	.takePlace {
		/* height: 100rpx; */
		width: 100%;
		position: relative;
	}

	.deliveryPlace {
		margin-top: 30rpx;
		margin-bottom: 10rpx;
		height: 100rpx;
		width: 100%;
		position: relative;
	}

	.dot {
		width: 12rpx;
		height: 12rpx;
		background: rgba(255, 112, 5, 1);
		position: absolute;
		left: -30rpx;
		top: 10rpx;
		border-radius: 50%;
	}

	.cp-t {
		font-size: 20rpx;
	}

	.cp-c {
		/* height: 80rpx; */
		/* line-height: 80rpx; */
		font-size: 32rpx;
		color: #333333;
		width: 100%;
		padding-top: 24rpx;
	}

	.notes {
		/* height: 30rpx; */
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.notes .cp-t {
		float: left;
		width: 60rpx;
		/* background: paleturquoise; */
	}

	.notes .notes-c {
		margin-left: 10rpx;
		color: #333333;
		font-size: 20rpx;
		flex: 1;
		line-height: 28rpx;
	}

	.title {
		width: 100%;
		height: 44rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: rgba(36, 36, 36, 1);
		line-height: 44rpx;
		margin-bottom: 30rpx;
	}

	.blue {
		background: #346cff;
	}

	/* bottom */

	.bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 750rpx;
		height: 54px;
		background: rgba(36, 36, 36, 1);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.confirmPayment {
		width: 278rpx;
		height: 78rpx;
		background: #fec200;
		border-radius: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: rgba(36, 36, 36, 1);
		line-height: 44rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
	}

	.b-l {
		margin-left: 24rpx;
		width: auto;
		height: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.allPrice1 {
		font-size: 28rpx;
		color: rgba(245, 245, 245, 0.4);
	}

	.allPrice2 {
		font-size: 48rpx;
		color: rgba(245, 245, 245, 1);
		margin: 0 10px;
		margin-right: 10rpx;
	}

	.beizhu {
		font-size: 20rpx;
		color: rgba(245, 245, 245, 0.4);
	}

	/* 支付 */

	.pay {
		width: 572rpx;
		height: 536rpx;
		background: #ffffff;
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
		background: #fec200;
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

	/* 费用明细 */
	.goodsmx {
		padding: 22rpx 0;
	}

	.goodsmx>view {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		padding: 22rpx 24rpx;
	}

	.goodsmx>view text:nth-of-type(2) {
		color: #ff3939;
	}
</style>
