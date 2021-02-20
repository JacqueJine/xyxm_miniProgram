<template>
	<view class="content">
		<!-- 第一部分 -->
		<view class="top-w">
			<view class="top-diceng"></view>
			<view class="t1" :style="'padding-top:' + (navTop + 5) + 'px;height:' + navHeight + 'px'">
				<view style="z-index:10;">
					<!-- <u-icon name="map" size="44rpx" color="#5B4F29"></u-icon> -->
					<view class="location" @click="tologin">{{ curUniversity }}</view>
				</view>
			</view>
			<view class="top" :style="'margin-top:' + (navHeight + 12) + 'px'">
				<view>
					<swiper class="swiper1 t2" :indicator-dots="true" indicator-active-color="#FEC200" indicator-color="rgba(0,0,0,0.39)"
					 :autoplay="true" :interval="3000" :circular="true">
						<swiper-item v-for="(item, index) in image" :key="index" @click="toCarouse(index)">
							<image class="banner" :src="item"></image>
						</swiper-item>
					</swiper>
				</view>
				<view class="t3">
					<!-- <view class="per" v-for="(item,index) in functionList" :key="index" @click="toFunctionModule(index)">
						<image :src="item.logo"></image>
						<view style="margin-top: 10rpx;">{{item.title}}</view>
					</view> -->
					<view v-for="(item, index) in List" :key="index" :class="active == index ? 'tab tabAct' : 'tab'" @click="changeTab(index)">
						<view class="tabview">{{ item.title }}</view>
						<view class="tabDot"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="top2" :style="'padding-top:' + (navHeight + 200) + 'px'" v-show="active == 0">
			<Expressage @toExpressDetail="toExpressDetail" @toMinePage="toMinePage" :curHelpInfo="expressInfo"></Expressage>
			<u-loadmore margin-top="24" margin-bottom="24" :status="status" :icon-type="iconType" :load-text="loadText" />
		</view>
		<view class="top2" :style="'padding-top:' + (navHeight + 200) + 'px'" v-show="active == 1">
			<Expressage @toExpressDetail="toExpressDetail" @toMinePage="toMinePage" :curHelpInfo="expressInfo0"></Expressage>
			<u-loadmore margin-top="24" margin-bottom="24" :status="status1" :icon-type="iconType" :load-text="loadText" />
		</view>
		<view class="top2" :style="'padding-top:' + (navHeight + 200) + 'px'" v-show="active == 2">
			<Expressage @toExpressDetail="toExpressDetail" @toMinePage="toMinePage" :curHelpInfo="expressInfo1"></Expressage>
			<u-loadmore margin-top="24" margin-bottom="24" :status="status2" :icon-type="iconType" :load-text="loadText" />
		</view>
		<view class="top2" :style="'padding-top:' + (navHeight + 200) + 'px'" v-show="active == 3">
			<Expressage @toExpressDetail="toExpressDetail" @toMinePage="toMinePage" :curHelpInfo="expressInfo2"></Expressage>
			<u-loadmore margin-top="24" margin-bottom="24" :status="status3" :icon-type="iconType" :load-text="loadText" />
		</view>
		<u-mask :show="redPacket" @click="closeRed" :mask-click-able="false">
			<view class="warp">
				<view v-if="isLq == 2" class="modd1">
					<image @tap.stop="tologin" src="../../../static/login/wlq.png" mode="aspectFit" style="width: 100%;height: 100%;"></image>
					<u-icon @click.stop="closeRed" style="position: absolute;width: 52rpx;left: 0;right: 0;bottom: 40rpx;margin: auto;"
					 size="52" color="#FFFFFF" name="close-circle"></u-icon>
				</view>
				<view v-if="isLq == 1" class="modd1">
					<image @tap.stop="goYu" @load="showM = true" src="../../../static/login/ylq.png" mode="aspectFit" style="width: 100%;height: 100%;"></image>
					<view v-if="showM" @tap.stop="goYu" class="modd2">
						<u-count-to :start-val="0" :decimals="2" color="#f00" font-size="120" :end-val="lqMoney"></u-count-to>
						<text>元</text>
					</view>
					<u-icon @click.stop="closeRed" style="position: absolute;width: 52rpx;left: 0;right: 0;bottom: 40rpx;margin: auto;"
					 size="52" color="#FFFFFF" name="close-circle"></u-icon>
				</view>
			</view>
		</u-mask>
		<!-- 第二部分 -->
		<!-- 		<view class="function" :style="'margin-top:'+(navHeight+230)+'px'">
			<view class="fun">
				<view class="funsearch">
					<u-search placeholder="搜商品/店铺…" shape="square" :disabled="true" :show-action="false" @click="toSearch"></u-search>
				</view>
				<view class="nav">
					<view :class="active==index?'black':'default'" @click="selected1(index)" v-for="(item,index) in functionList1"
					 :key="index">
						<view>{{item}}</view>
						<view :class="active==index?'dot':''"> </view>
					</view>
				</view>
			</view>
			<view v-if="active==0">
				<view class="fun1">
					<view class="funleft">
						<view v-for="(item,index) in goodsLeft" :key="index" @click="goodsDetial(item.id,item.store_id)">
							<image :src="imgBaseUrl+item.goodsimage" :lazy-load="true" class="zhu" mode="widthFix"></image>
							<view class="funtext">
								<view>{{item.name}}</view>
								<view>
									<view>￥<text style="font-size: 36rpx;font-weight: bold;">{{item.price}}</text></view>
									<view>销量{{item.sales_num}}</view>
								</view>
								<view>
									<image :src="imgBaseUrl+item.store_header" class="logo"></image><text>{{item.store_name}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="funright">
						<view v-for="(item,index) in goodsRight" :key="index" @click="goodsDetial(item.id,item.store_id)">
							<image :src="imgBaseUrl+item.goodsimage" :lazy-load="true" class="zhu" mode="widthFix"></image>
							<view class="funtext">
								<view>{{item.name}}</view>
								<view>
									<view>￥<text style="font-size: 36rpx;font-weight: bold;">{{item.price}}</text></view>
									<view>销量{{item.sales_num}}</view>
								</view>
								<view>
									<image :src="imgBaseUrl+item.store_header" class="logo"></image><text>{{item.store_name}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore margin-top="24" margin-bottom="24" :status="shopStatus" :icon-type="iconType" :load-text="loadText" />
			</view>
			<view v-if="active==1" class="fun2">
				<view class="list" v-for="(item,index) in shopList" :key="index" @click="goshop(item.id)">
					<view>
						<image :src="imgBaseUrl+item.header" :lazy-load="true" mode="aspectFill"></image>
					</view>
					<view>
						<view><text>{{item.name}}</text><text>进店</text></view>
						<view>营业时间：{{item.start_time}}-{{item.end_time}}</view>
						<view>销量：{{item.store_sales_num}}</view>
						<view><text>{{item.upsendmoney}}元起送</text><text v-if="item.send_status==3">满{{item.discount}}元{{item.send_fee}}配送费</text></view>
						<view class="conlist">
							<view v-for="(itm,ind) in item.hot_goods" :key="ind" @click.stop="goodsDetial(itm.id,itm.store_id)">
								<view>
									<image :src="imgBaseUrl+itm.goodsimage" :lazy-load="true" mode="aspectFill"></image>
								</view>
								<view>{{itm.name}}</view>
								<view>￥{{itm.price}}</view>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore margin-top="24" margin-bottom="24" :status="shopStatus" :icon-type="iconType" :load-text="loadText" />
			</view>
		</view> -->
	</view>
</template>

<script>
	import Expressage from '@/components/perFunctionInfo/expressage/expressage.vue';
	import {
		taskHall
	} from 'services/function.js';
	import {
		findUserInfo,
		carouselList
	} from 'services/mine.js';
	import {
		listStore,
		getGood
	} from 'services/shop.js';
	import {
		getUnreadOrEmpty
	} from 'services/message.js';
	export default {
		components: {
			Expressage
		},
		data() {
			return {
				imgBaseUrl: getApp().globalData.imgBaseUrl,
				navTop: getApp().globalData.navTop,
				navHeight: getApp().globalData.navHeight,
				curUniversity: '登录',
				List: [{
						logo: '/static/index/task1.png',
						title: '全部'
					},
					{
						logo: '/static/index/task1.png',
						title: '快递'
					},
					{
						logo: '/static/index/task2.png',
						title: '跑腿'
					},
					{
						logo: '/static/index/task3.png',
						title: '其他'
					}
				],
				image: [],
				allCarouse: [],
				active: 0,
				// 调接口的当前页码
				curExpressPage: 1,
				tabbarList: [],
				tabbarNum: 0,
				// 数据
				expressInfo: [],
				expressInfo0: [],
				expressInfo1: [],
				expressInfo2: [],
				status: 'loading',
				status1: 'loading',
				status2: 'loading',
				status3: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				is_show: false,
				showM: false,
				redPacket: false,
				isLq: 2,
				lqMoney: 0
			};
		},
		onShow() {
			if (uni.getStorageSync('token')) {
				if (uni.getStorageSync('logintype') == 'register') {
					// console.log('领取金额')
					this.isLq = 1;
					this.redPacket = true;
					this.lqMoney = uni.getStorageSync('lqMoney');
					uni.removeStorageSync('lqMoney');
					uni.removeStorageSync('logintype');
				}
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
				this.isLq = 2;
				this.redPacket = true;
				// console.log('未领取');
			}
			// this.curUniversity = JSON.parse(uni.getStorageSync("user")).school.school_name;
		},
		onLoad() {
			// 字符串只能是数字、字母和中文组成，不能包含特殊符号和空格。
			// console.log(/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test('还是%啥'))
			// 轮播图
			carouselList({
				where: {
					type: '',
					location: '首页'
				},
				page: 1,
				limit: 20
			}).then(res => {
				if (res.code == 200) {
					this.allCarouse = res.result.list;
					res.result.list.map(item => {
						this.image.push(this.imgBaseUrl + item.img);
					});
				}
			});
			if (uni.getStorageSync('token')) {
				findUserInfo({}).then(res => {
					if (res.code == 200) {
						if (res.result.school_id == null) {
							uni.showToast({
								title: '您未完善个人信息，即将跳转完善',
								icon: 'none'
							});
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/mine/comInfo/comInfo'
								});
							}, 2000);
						} else {
							this.curUniversity = res.result.school.school_name + res.result.en_year + '级';
							uni.setStorageSync('user', JSON.stringify(res.result));
							this.functionList(this.active);
						}
					} else {
						this.status = 'nomore';
						this.curUniversity = '登录';
					}
				});
			} else {
				this.functionList(this.active);
				this.status = 'nomore';
				this.curUniversity = '登录';
			}
		},
		methods: {
			closeRed() {
				this.redPacket = false;
			},
			goYu() {
				this.redPacket = false;
				uni.navigateTo({
					url: '/pages/mine/balance/balance'
				});
			},
			toCarouse(index) {
				if (this.allCarouse[index].type == 1) {
					uni.navigateTo({
						url: this.allCarouse[index].url
					});
				} else {
					uni.navigateTo({
						url: '/pages/index/carouse/carouse?id=' + this.allCarouse[index].id
					});
				}
			},
			tologin() {
				if (uni.getStorageSync('token')) {
					return false;
				} else {
					uni.reLaunch({
						url: '/pages/Tab/login/login'
					});
				}
			},
			changeTab(index) {
				this.is_show = true;
				this.curExpressPage = 1;
				this.active = index;
				if (this.active == 0) {
					this.status = 'loading';
					this.expressInfo = [];
				} else if (this.active == 1) {
					this.status1 = 'loading';
					this.expressInfo0 = [];
				} else if (this.active == 2) {
					this.status2 = 'loading';
					this.expressInfo1 = [];
				} else if (this.active == 3) {
					this.status3 = 'loading';
					this.expressInfo2 = [];
				}
				this.functionList(this.active);
			},
			toExpressDetail(params) {
				uni.navigateTo({
					url: '/pages/task/taskList/taskDetail/taskDetail?id=' + params
				});
			},
			toMinePage(params) {
				uni.navigateTo({
					url: '/pages/community/minePage/minePage?id=' + params
				});
			},
			// 获取功能任务列表  taskList
			async functionList(active) {
				let where = {};
				if (active == 0) {
					where = {
						task_state_or: [0, 1, 2, 4],
						is_pay: 1
					};
				} else {
					where = {
						type: active,
						task_state_or: [0, 1, 2, 4],
						is_pay: 1
					};
				}
				await taskHall({
					page: this.curExpressPage,
					limit: 10,
					where: where
				}).then(res => {
					if (res.code == 200) {
						if (this.is_show) {
							if (active == 0) {
								this.expressInfo = [];
							} else if (active == 1) {
								this.expressInfo0 = [];
							} else if (active == 2) {
								this.expressInfo1 = [];
							} else if (active == 3) {
								this.expressInfo2 = [];
							}
						}
						if (active == 0) {
							this.expressInfo = this.expressInfo.concat(res.result.data);
							if (res.result.count <= 10) {
								this.status = 'nomore';
							}
						} else if (active == 1) {
							this.expressInfo0 = this.expressInfo0.concat(res.result.data);
							if (res.result.count <= 10) {
								this.status1 = 'nomore';
							}
						} else if (active == 2) {
							this.expressInfo1 = this.expressInfo1.concat(res.result.data);
							if (res.result.count <= 10) {
								this.status2 = 'nomore';
							}
						} else if (active == 3) {
							this.expressInfo2 = this.expressInfo2.concat(res.result.data);
							if (res.result.count <= 10) {
								this.status3 = 'nomore';
							}
						}

						this.curExpressPage++;
					} else {
						if (active == 0) {
							this.status = 'nomore';
						} else if (active == 1) {
							this.status1 = 'nomore';
						} else if (active == 2) {
							this.status2 = 'nomore';
						} else if (active == 3) {
							this.status3 = 'nomore';
						}
					}
				});
			}
		},
		// 单击双击
		onTabItemTap() {
			this.tabbarNum++;
			this.tabbarList.push(new Date().getTime());
			if (this.tabbarNum != 0) {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.tabbarNum = 0;
			}
			if (this.tabbarList.length >= 2) {
				if (this.tabbarList[this.tabbarList.length - 1] - this.tabbarList[this.tabbarList.length - 2] <= 1000) {
					this.changeTab(this.active);
					this.tabbarList = [];
				}
			}
		},
		onReachBottom() {
			if (this.active == 0 && this.status == 'nomore') {
				return false;
			} else if (this.active == 1 && this.status1 == 'nomore') {
				return false;
			} else if (this.active == 2 && this.status2 == 'nomore') {
				return false;
			} else if (this.active == 3 && this.status3 == 'nomore') {
				return false;
			}
			this.is_show = false;
			this.functionList(this.active);
		}
	};
</script>

<style scoped>
	.content {
		width: 100%;
		box-sizing: border-box;
		background: #f2f2f2;
		font-family: PingFangSC-Medium, PingFang SC;
		overflow: hidden;
		min-height: 100vh;
		padding: 0 24rpx 24rpx;
	}

	/* 第一部分 */
	.top-w {
		background: #f2f2f2;
		width: 100%;
		padding: 0 24rpx;
		box-sizing: border-box;
		position: absolute;
		left: 0;
	}

	.top-w .top-diceng {
		position: absolute;
		width: 100%;
		height: 340rpx;
		background: linear-gradient(180deg, #fec300 0%, #fec200 48%, rgba(254, 194, 0, 0) 100%);
		left: 0;
	}

	.top-w .top {
		width: 100%;
		background: #fff;
		border-radius: 14px;
		position: relative;
		z-index: 10;
		overflow: hidden;
		padding: 16rpx 16rpx 0 16rpx;
		box-sizing: border-box;
	}

	.top-w .t1 {
		background: #fec200;
		width: 100%;
		padding: 60rpx 0 25rpx 24rpx;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}

	.top-w .t1 view {
		/* display: flex;
		justify-content: flex-start;
		align-items: center; */
	}

	.top-w .location {
		width: 450rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-weight: bold;
		font-size: 36rpx;
		margin-left: 20rpx;
		color: #333333;
	}

	.top-w .banner {
		width: 100%;
		height: 100%;
	}

	.top-w .t2 {
		height: 240rpx;
		overflow: hidden;
		border-radius: 4px;
	}

	.top-w .t3 {
		display: flex;
		justify-content: space-around;
		padding: 32rpx 0;
	}

	.top-w .t3 .per {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		font-size: 26rpx;
		color: #333333;
	}

	.top-w .t3 .per image {
		width: 212rpx;
		height: 116rpx;
	}

	/* 02 */

	.function {
		width: 100%;
	}

	.function .nav {
		display: flex;
		font-size: 28rpx;
		color: red;
		padding: 18rpx 36rpx 4rpx;
	}

	.function .nav>view {
		text-align: center;
		margin-right: 60rpx;
	}

	.function .default {
		text-align: center;
		border-right: none;
		position: relative;
		color: rgba(36, 36, 36, 0.4);
		font-size: 28rpx;
	}

	.function .black {
		text-align: center;
		color: #333;
		font-size: 32rpx;
		border-right: none;
		position: relative;
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		font-weight: bold;
	}

	.function .black text {
		display: block;
	}

	.function .dot {
		width: 56rpx;
		height: 8rpx;
		background: #ffdd05;
		border-radius: 4px;
		margin-top: 4rpx;
	}

	.fun {
		background: linear-gradient(180deg, #ffffff 0%, #f2f2f2 100%);
		border-radius: 14px 14rpx 0 0;
	}

	.funsearch {
		padding: 16rpx;
	}

	/* fun1 */

	.fun1 {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: rgba(51, 51, 51, 0.4);
	}

	.funleft>view,
	.funright>view {
		width: 344rpx;
		overflow: hidden;
		background: #ffffff;
		border-radius: 8px;
		margin-top: 16rpx;
	}

	.fun1 .zhu {
		width: 100%;
	}

	.fun1 .logo {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		margin-right: 8rpx;
	}

	.fun1 .funtext {
		padding: 4rpx 16rpx 16rpx;
	}

	.fun1 .funtext>view:nth-of-type(1) {
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}

	.fun1 .funtext>view:nth-of-type(2) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 8rpx 0;
	}

	.fun1 .funtext>view:nth-of-type(2)>view:nth-of-type(1) {
		color: #ff3939;
		font-size: 22rpx;
	}

	.fun1 .funtext>view:nth-of-type(3) {
		display: flex;
		align-items: center;
	}

	.fun2 .list {
		display: flex;
		margin-top: 20rpx;
		background: #ffffff;
		border-radius: 8px;
		padding: 24rpx;
		box-sizing: border-box;
	}

	.fun2 .list>view:nth-of-type(1) image {
		width: 116rpx;
		height: 116rpx;
		border-radius: 4px;
	}

	.fun2 .list>view:nth-of-type(2) {
		font-size: 24rpx;
		flex: 1;
		box-sizing: border-box;
		padding-left: 20rpx;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(1) {
		font-size: 36rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(1) text:nth-of-type(1) {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		max-width: 400rpx;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(1) text:nth-of-type(2) {
		font-size: 24rpx;
		color: #ffffff;
		padding: 6rpx 26rpx;
		background: linear-gradient(137deg, #fec200 0%, #fe8800 100%);
		border-radius: 14px;
		font-weight: normal;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(2),
	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(3) {
		color: rgba(51, 51, 51, 0.4);
		margin-top: 4rpx;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(4) {
		display: flex;
		align-items: center;
		color: #ff3939;
		font-size: 20rpx;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(4) text {
		border-radius: 10px;
		border: 1px solid #ff3939;
		padding: 2rpx 8rpx;
		margin: 12rpx 20rpx 16rpx 0;
	}

	.conlist {
		display: flex;
	}

	.conlist>view {
		width: 164rpx;
		margin-right: 12rpx;
	}

	.conlist>view:last-of-type {
		margin-right: 0;
	}

	.conlist>view>view:nth-of-type(1) {
		border-radius: 4px;
	}

	.conlist>view>view:nth-of-type(1) image {
		width: 164rpx;
		height: 164rpx;
		border-radius: 4px;
	}

	.conlist>view>view:nth-of-type(2) {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		margin: 4rpx 0;
	}

	.conlist>view>view:nth-of-type(3) {
		color: #ff3939;
	}

	/* 任务 */
	.tab {
		flex: 1;
		font-size: 32rpx;
		color: rgba(36, 36, 36, 0.4);
		position: relative;
		text-align: center;
		border-right: 1px solid rgba(151, 151, 151, 0.1);
	}

	.tab:nth-of-type(4) {
		border-right: none;
	}

	.tabAct {
		color: rgba(36, 36, 36);
		font-size: 32rpx;
	}

	.tabDot {
		width: 32rpx;
		height: 8rpx;
		background: linear-gradient(180deg, #fec200 0%, #fea800 100%);
		border-radius: 19px;
		position: absolute;
		left: 0;
		right: 0;
		bottom: -14rpx;
		margin: auto;
		display: none;
	}

	.tabAct .tabDot {
		display: block;
	}

	.top2 {
		padding: 80rpx 0 24rpx;
		/* height: 100vh;
		box-sizing: border-box; */
	}

	.modd {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.modd1 {
		width: 100%;
		height: 840rpx;
		position: relative;
	}

	.modd2 {
		position: absolute;
		top: 33%;
		left: 0;
		right: 0;
		margin: auto;
		text-align: center;
		color: red;
		font-size: 120rpx;
	}

	.modd2 text {
		font-size: 30rpx;
	}
</style>
