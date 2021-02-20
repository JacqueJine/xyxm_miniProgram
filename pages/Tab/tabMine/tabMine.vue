<template>
	<view class="all">
		<view class="tabBar" :style="'padding-top:' + (navTop + 5) + 'px;height:' + navHeight + 'px'">
			<!-- <view style="position: relative">
				<u-icon name="chat" size="48rpx" @click="topage(14)"></u-icon>
				<u-badge :is-dot="true" type="error" :offset="offset"></u-badge>
			</view> -->
			<text>我的</text>
			<!-- <view></view> -->
		</view>
		<view class="top">
			<view class="t1">
				<view style="position: relative">
					<image class="logo" :src="userInfo.header == '' ? '/static/mine/name1.png' : imgBaseUrl + userInfo.header" @click="topage(12)"></image>
					<image v-if="userInfo.show_attestation" class="is_auth" :src="
							userInfo.show_attestation == 1
								? '/static/index/is_auth.png'
								: userInfo.show_attestation == 2
								? '/static/index/is_shop.png'
								: userInfo.show_attestation == 3
								? '/static/index/is_rider.png'
								: ''
						"></image>
				</view>
				<view v-if="isLogin" style="flex: 1">
					<view class="name">
						<text>{{ userInfo.name }}</text>
						<image id="gender" v-if="userInfo.sex.code != 0" :src="userInfo.sex.code == 1 ? '/static/index/man.png' : '/static/index/female.png'"></image>
						<!-- <image v-if="userInfo.is_store.code==1" id="gender" src="/static/mine/shop.png"></image> -->
						<view @click="topage(17)">
							<text class="xinyu">信誉{{ userInfo.credit }}</text>
						</view>
					</view>
					<view style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            ">
						<view>
							<view>
								<text class="university" v-if="userInfo.school.school_name">{{ userInfo.school.school_name +' '+ userInfo.en_year+ '级'}}</text>
							</view>
						</view>
						<!-- <view class="signUp" @click="topage(7)" :style="isSignIn==0?'background:#fff':'background:#FEDA66'">
							<image v-if="isSignIn==0" src="/static/mine/signIn.png"></image>
							<view>{{isSignIn==0?'签到':'已签到'}}</view>
						</view> -->
					</view>
				</view>
				<button size="mini" style="
            margin: 8rpx 0 0;
            font-size: 34rpx;
            font-weight: 500;
            background-color: transparent;
          "
				 v-if="!isLogin" @click="getPhoneNumber">
					点击登录/注册
				</button>
			</view>
			<view class="t2">
				<view class="t2-per">
					<view>{{ userInfo.praise_count }}</view>
					<view class="t2_1">获赞</view>
				</view>
				<view class="t2-per" @click="topage(15)">
					<view>{{ userInfo.posts_count }}</view>
					<view class="t2_1">帖子</view>
				</view>
				<!-- <view class="t2-per" @click="topage(20)">
					<view>0</view>
					<view class="t2_1">收藏</view>
				</view> -->
				<view class="t2-per" @click="topage(15)">
					<view>{{userInfo.club_count}}</view>
					<view class="t2_1">社团</view>
				</view>
				<view class="t2_btn" @click="topage(15)">个人主页</view>
			</view>
			<view class="t3">
				<view @click="topage(6)">
					<text>余额</text>
					<text>{{ userInfo.wallet }}</text>

				</view>
				<view @click="topage(16)">
					<text>收益</text>
					<text>{{ userInfo.profit }}</text>

				</view>
				<!-- @click="topage(7)" -->
				<view @click="topage(21)">
					<text>积分</text>
					<text>{{ userInfo.integral }}</text>
					<!-- <view class="tag">签到赚积分</view> -->
				</view>
			</view>
		</view>
		<!-- 02 -->
		<view class="top2">
			<view class="top2_1">
				<view>任务管理</view>
				<view class="top2_1_2">
					<view @click="topage(1)">
						<view>
							<image src="/static/mine/fabu.png"></image>
							我的发布
						</view>
						<view>
							已完成：
							<text class="num">{{ countNum.finish }}</text>
						</view>
						<view style="justify-content: space-between;">
							<view>
								进行中：
								<text class="num" style="color: #fa6400">{{ countNum.underway+countNum.for_the }}</text>
							</view>
							<u-icon name="arrow-right" color="#B3B2B2"></u-icon>
						</view>
					</view>
					<view @click="topage(2)">
						<view>
							<image src="/static/mine/jiedan.png"></image>
							我的接单
						</view>
						<view>
							已完成：
							<text class="num">{{ countOrder.finish }}</text>
						</view>
						<view style="justify-content: space-between;">
							<view>
								进行中：
								<text class="num" style="color: #38a9ff">{{ countOrder.underway+countOrder.for_the }}</text>
							</view>
							<u-icon name="arrow-right" color="#B3B2B2"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<!-- <view >
				
			</view> -->
			<image class="qi" v-if="userInfo.is_rider.code != 1" @click="topage(19)" src="/static/mine/qi.png" mode="widthFix"></image>
			<!-- 			<view class="top2_2" v-if="userInfo.is_store.code == 1">
				<view>
					<view>
						店铺管理
					</view>
					<view @click="topage(3)">进入店铺</view>
				</view>
				<view class="top2_2_2">
					<view @click="topage(3)">
						<text>今日订单</text>
						<text>0</text>
						<text>昨日：1223</text>
					</view>
					<view @click="topage(3)">
						<text>今日收益</text>
						<text>0</text>
						<text>昨日：11111</text>
					</view>
					<view>
						<text>待处理订单</text>
						<text style="color: #ff3939">0</text>
						<text style="color: #1ec6b2" @click="topage(4)">点击查看</text>
					</view>
				</view>
			</view> -->
			<view class="top2_3">
				<view style="margin: 58rpx 0 12rpx">更多功能</view>
				<view class="top2_3_2">
					<!-- <view @click="topage(5)">
						<image src="/static/mine/s_d.png"></image>
						<text>商城订单</text>
					</view> -->
					<view @click="topage(22)">
						<image src="/static/mine/more1.png"></image>
						<text>消费记录</text>
					</view>
					<!-- <view @click="topage(8)">
						<image src="/static/mine/j_d.png"></image>
						<text>积分订单</text>
					</view> -->
					<view @click="topage(13)">
						<image src="/static/mine/shiming.png"></image>
						<text>官方认证</text>
					</view>
					<view @click="topage(12)">
						<image src="/static/mine/setting.png"></image>
						<text>设置</text>
					</view>
					<view @click="topage(23)">
						<image src="/static/mine/more2.png"></image>
						<text>反馈建议</text>
					</view>
					<view @click="topage(10)">
						<image src="/static/mine/help.png"></image>
						<text>联系帮助</text>
					</view>
					<!-- <view @click="topage(9)">
						<image src="/static/mine/addshop.png"></image>
						<text>店铺加盟</text>
					</view> -->
					<!-- <view @click="topage(11)">
						<image src="/static/mine/he.png"></image>
						<text>商务合作</text>
					</view> -->
				</view>
			</view>
		</view>
		<view>
			<!-- <image src="/static/mine/logo.png" class="mlogo"></image> -->
		</view>
	</view>
</template>

<script>
	import {
		findUserInfo
	} from 'services/mine.js';
	import {
		countTask,
		countTaskOrder
	} from 'services/function.js';
	import {
		getUnreadOrEmpty
	} from "../../../services/message.js";
	export default {
		data() {
			return {
				offset: [0, 0],
				navTop: getApp().globalData.navTop,
				navHeight: getApp().globalData.navHeight,
				isLogin: false,
				isSignIn: 0,
				userInfo: {
					header: '',
					profit: 0,
					wallet: 0,
					sex: {
						code: 0
					},
					credit: 0,
					integral: 0,
					praise_count: 0,
					posts_count: 0,
					club_count: 0,
				},
				countNum: {
					underway: 0,
					finish: 0,
					for_the: 0,
				},
				countOrder: {
					underway: 0,
					finish: 0,
					for_the: 0,
				},
				imgBaseUrl: getApp().globalData.imgBaseUrl
			};
		},
		methods: {
			topage(index) {
				let url = '';
				// 我的发布
				if (!uni.getStorageSync('token') && index != 10) {
					uni.showToast({
						title: '请先进行登录',
						icon: 'none'
					});
					return false;
				} else if (index == 1) {
					url = '/pages/mine/havePublished/havePublished';
				}
				// 我的接单
				else if (index == 2) {
					if (this.userInfo.is_rider.code != 1) {
						uni.showToast({
							title: '您不是骑手暂无法进入',
							icon: 'none'
						});
						return false;
					}
					url = '/pages/mine/acceptOrder/acceptOrder';
				}
				// 店铺
				else if (index == 3) {
					url = '/pages/mine/shop/shop?store_id=' + this.userInfo.store_id;
				}
				// 商家店铺订单
				else if (index == 4) {
					url = '/pages/mine/shop/shopOrder/shopOrder?shop_id=' + this.userInfo.store_id;
				}
				// 个人店铺订单
				else if (index == 5) {
					url = '/pages/mine/shop/myshopOrder/myshopOrder';
				}
				//余额 收益公用一个
				else if (index == 6 || index == 16) {
					url = '/pages/mine/balance/balance?type=' + index;
				}
				//签到
				else if (index == 7) {
					url = '/pages/mine/IntegralMall/IntegralMall';
				}
				//积分订单
				else if (index == 8) {
					url = '/pages/mine/IntegralMall/integralOrder/integralOrder';
				}
				// 店铺加盟
				else if (index == 9) {
					uni.showToast({
						title: '暂未开通',
						icon: 'none'
					});
					return false;
					url = '/pages/mine/shop/openShop/openShop?type=' + this.userInfo.is_store.code;
				}
				// 联系帮助
				else if (index == 10) {
					url = '/pages/mine/mineHelp/mineHelp';
				}
				// 商务合作
				else if (index == 11) {
					url = '/pages/mine/cooperation/cooperation';
				}
				// 设置
				else if (index == 12) {
					url = '/pages/mine/mineSetting/mineSetting';
				}
				// 官方认证
				else if (index == 13) {
					url = '/pages/mine/mineHelp/officialAuth/officialAuth';
				}
				// 我的消息
				else if (index == 14) {
					url = '/pages/Tab/tabMessage/message';
				}
				// 帖子
				else if (index == 15) {
					url = '/pages/community/minePage/minePage?id=' + this.userInfo.id;
				}
				// 信誉分
				else if (index == 17) {
					url = '/pages/mine/mineHelp/creditPoints/creditPoints';
				}
				// 消息
				else if (index == 18) {
					url = '/pages/Tab/tabMessage/message';
				}
				// 申请骑手
				else if (index == 19) {
					if (this.userInfo.is_real.code != 1) {
						uni.showToast({
							title: '实名认证未成功，无法进行骑手申请,即将跳转验证',
							icon: 'none'
						});
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/mine/mineHelp/officialAuth/officialAuth'
							});
						}, 2000);
						return false;
					}
					url = '/pages/mine/mineIs_rider/mineIs_rider';
				}
				// 收藏
				else if (index == 20) {
					url = '/pages/mine/shop/collect/collect';
				}
				// 积分列表
				else if (index == 21) {
					url = '/pages/mine/IntegralMall/credits/credits';
				}
				// 交易记录
				else if (index == 22) {
					url = '/pages/mine/transaction/transaction';
				}
				// 反馈建议
				else if (index == 23) {
					url = '/pages/mine/mineHelp/sugges/sugges';
				}
				uni.navigateTo({
					url: url
				});
			},
			getPhoneNumber() {
				uni.reLaunch({
					url: '/pages/Tab/login/login'
				});
			},
			// 获取个人信息
			getUser() {
				findUserInfo({}).then(res => {
					if (res.code == 200) {
						this.userInfo = res.result;
						uni.setStorageSync('user', JSON.stringify(res.result));
						countTask({
							user_id: res.result.id
						}).then(res => {
							if (res.code == 200) {
								this.countNum = res.result;
							}
						});
						countTaskOrder().then(res => {
							if (res.code == 200) {
								this.countOrder = res.result;
							}
						});
					}
				});
			}
		},
		onShow() {
			if (uni.getStorageSync('token')) {
				this.getUser();
				this.isLogin = true;
				getUnreadOrEmpty().then(res => {
					if (res.code == 200) {
						uni.showTabBarRedDot({
							index: 3
						});
					} else {
						uni.hideTabBarRedDot({
							index: 3
						});
					}
				});
			} else {
				this.isLogin = false;
			}
		},
		onLoad() {}
	};
</script>

<style scoped>
	.all {
		min-height: 100vh;
		background: rgba(245, 245, 245, 1);
		display: flex;
		flex-direction: column;
		padding-bottom: 30rpx;
	}

	.tabBar {
		background: #fec200;
		font-size: 34rpx;
		padding: 60rpx 24rpx 20rpx;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	button::after {
		border: none;
	}

	/* 01 */

	.top {
		height: 467rpx;
		width: 100%;
		background: #fec200;
		padding: 60rpx 38rpx 0;
		box-sizing: border-box;
		position: relative;
		margin-top: 120rpx;
		border-radius: 0 0 20px 20px;
	}

	.t1 {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.t1 .logo {
		border-radius: 50%;
		height: 100rpx;
		width: 100rpx;
		margin-right: 20rpx;
	}

	.is_auth {
		position: absolute;
		bottom: 0;
		right: 20rpx;
		width: 32rpx;
		height: 32rpx;
		z-index: 10;
		bottom: 6rpx;
	}

	.xinyu {
		border-radius: 2px;
		background: rgba(51, 51, 51, 0.1);
		font-size: 20rpx;
		padding: 0 6rpx;
		font-weight: normal;
		margin-left: 10rpx;
	}

	.name {
		font-size: 34rpx;
		color: rgba(33, 33, 33, 1);
		font-weight: bold;
		display: flex;
		line-height: 40rpx;
		align-items: center;
	}

	.university {
		background: #333333;
		border-radius: 9px;
		font-size: 20rpx;
		color: #fec200;
		height: 36rpx;
		line-height: 36rpx;
		padding: 0 12rpx;
		margin: 16rpx 0;
		display: inline-block;
		max-width: 360rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	#gender {
		height: 28rpx;
		width: 28rpx;
		margin-left: 10rpx;
	}

	.signUp {
		width: 168rpx;
		height: 64rpx;
		line-height: 64rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 32rpx;
		font-size: 28rpx;
		color: #333333;
		text-align: center;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 0 16rpx;
		box-sizing: border-box;
	}

	.signUp image {
		height: 40rpx;
		width: 40rpx;
	}

	.t2 {
		margin-top: 45rpx;
		width: 100%;
		height: 92rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.t2-per {
		height: 100%;
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		color: #333333;
	}

	.t2-per image {
		height: 30rpx;
		width: 30rpx;
		margin-right: 4rpx;
	}

	.t2_1 {
		display: flex;
		align-items: center;
		color: rgba(51, 51, 51, 0.6);
	}

	.t2_btn {
		width: 250rpx;
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(360deg, rgba(253, 249, 249, 0.2) 0%, rgba(255, 255, 255, 0.4) 100%);
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, .6);
		font-size: 24rpx;
	}

	.t2-per view:nth-child(1) {
		font-size: 40rpx;
		font-family: Roboto-Medium, Roboto;
		font-weight: bold;
	}

	.t2-per view:nth-child(2) {
		font-size: 24rpx;
		font-family: Roboto-Medium, Roboto;
		font-weight: 400;
	}

	.t3 {
		position: absolute;
		left: 24rpx;
		bottom: -58rpx;
		width: 702rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 24rpx;
		border-radius: 8px;
		background: #FFFFFF;
	}

	.t3>view {
		display: flex;
		align-items: flex-start;
		flex: 1;
		flex-direction: column;
		background: rgba(216, 216, 216, .2);
		border-radius: 4px;
		margin-right: 18rpx;
		padding: 16rpx 24rpx;
		position: relative;
	}

	.tag {
		position: absolute;
		right: 0;
		top: 0;
		padding: 6rpx 12rpx;
		border-radius: 0 4px 0 9px;
		font-size: 20rpx;
		color: #FFFFFF;
		background: linear-gradient(90deg, #FF3B6E 0%, #FF2061 100%);
	}

	.t3>view:nth-of-type(3) {
		margin-right: 0;
	}

	.t3>view>text:nth-of-type(1) {

		font-size: 24rpx;
		color: rgba(0, 0, 0, 0.4);
	}

	.t3>view>text:nth-of-type(2) {
		font-size: 36rpx;
		font-weight: bold;
	}

	/* 02 */
	.qi {
		width: 100%;
		margin-top: 22rpx;
		display: block;
	}

	.top2 {
		padding: 46rpx 24rpx 0;
	}

	.top2_1>view:nth-of-type(1),
	.top2_2>view:nth-of-type(1),
	.top2_3>view:nth-of-type(1) {
		font-size: 28rpx;
		margin: 58rpx 0 28rpx;
		font-weight: 500;
	}

	.top2_1 .top2_1_2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.top2_1 .top2_1_2>view {
		background: #ffffff;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 338rpx;
		height: 318rpx;
		box-sizing: border-box;
		padding: 20rpx 36rpx;
		font-size: 24rpx;
	}

	.top2_1 .top2_1_2>view .num {
		font-size: 40rpx;
		/* margin-right: 100rpx; */
	}

	.top2_1 .top2_1_2>view>view:nth-of-type(1) {
		font-size: 28rpx;
		font-weight: bold;
	}

	.top2_1 .top2_1_2>view>view {
		display: flex;
		align-items: center;
	}

	.top2_1 .top2_1_2>view image {
		width: 46rpx;
		height: 44rpx;
		margin-right: 16rpx;
	}

	.top2_2>view:nth-of-type(1) {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.top2_2>view:nth-of-type(1)>view:nth-of-type(1) {
		display: flex;
		align-items: center;
	}

	.top2_2>view:nth-of-type(1)>view:nth-of-type(1) image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 16rpx;
	}

	.top2_2>view:nth-of-type(1)>view:nth-of-type(2) {
		font-size: 24rpx;
		color: #333333;
		border-radius: 12px;
		opacity: 0.24;
		border: 1px solid #333333;
		padding: 4rpx 18rpx;
	}

	.top2_2_2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		border-radius: 8px;
		padding: 20rpx 48rpx;
		font-size: 24rpx;
		color: rgba(33, 33, 33, 0.4);
	}

	.top2_2_2>view {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		height: 216rpx;
	}

	.top2_2_2>view>text:nth-of-type(2) {
		color: #333333;
		font-size: 48rpx;
	}

	.top2_3_2 {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.top2_3_2>view {
		margin: 16rpx 16rpx 0 0;
		background: #ffffff;
		border-radius: 4px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		width: 223rpx;
		height: 176rpx;
		box-sizing: border-box;
		padding: 30rpx 0;
		font-size: 24rpx;
	}

	.top2_3_2>view:nth-of-type(3n) {
		margin: 16rpx 0 0;
	}

	.top2_3_2>view image {
		width: 68rpx;
		height: 68rpx;
	}

	.mlogo {
		width: 180rpx;
		height: 78rpx;
		display: block;
		margin: 100rpx auto;
	}
</style>
