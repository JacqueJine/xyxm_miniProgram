<template>
	<view class="all">
		<view class="nav">
			<view class="navTab">
				<view v-for="(item, index) in tabList" :key="index" :class="activeTab == index ? 'tab tabAct' : 'tab'" @click="changeTab(index)">
					<u-badge type="error" :count="
              index == 0
                ? countNum.in_the_order
                : index == 1
                ? countNum.underway
                : index == 2
                ? countNum.for_the
                : 0
            "
					 v-if="index < 3" :offset="offset"></u-badge>
					<view class="tabText">{{ item }}</view>
				</view>
			</view>
			<view class="typeTab">
				<view v-for="(item, index) in typeList" :key="index" :class="activeTypeTab == index ? 'typeItem actType' : 'typeItem'"
				 @click="changeTypeTab(index)">{{ item }}</view>
			</view>
		</view>
		<view class="content">
			<view class="per" @click="toDetail(item.id,item.destination_time.time,item.type,item.is_pay)" v-for="(item, index) in list" :key="index">
				<view class="status">
					<view class="time">{{$u.timeFormat(item.create_time, 'yy-mm-dd hh:MM:ss')}}</view>

					<view class="titleStatus" v-if="
              item.task_state == 1 &&
              item.destination_time.down != '已超时' &&
              item.static_cancel.code == 1 &&
              item.destination_time.time !== null
            ">
						任务倒计时
						<view class="tag">
							<u-count-down ref="uCountDown" color="#FEC200" separator="colon" bg-color="#2D2D2D" separator-color="#FEC200"
							 :timestamp="item.destination_time.down"></u-count-down>
						</view>
					</view>
					<view class="titleStatus" v-else>
						<view class="tag" v-if="item.task_state == 1 && item.static_cancel.code == 0" style="color: #fec200">
							取消中
						</view>
						<view class="tag" v-if="
                item.task_state == 1 &&
                item.destination_time.time == null &&
                item.static_cancel.code == 1
              "
						 style="color: #fec200">
							进行中
						</view>
						<view class="tag" v-if="item.task_state == 0&&item.is_pay==1" style="color: #fec200">
							待接单
						</view>
						<view class="tag" v-if="item.task_state == 0&&item.is_pay==0" style="color: #ff3939">
							待支付
						</view>
						<view class="tag" v-if="item.task_state == 4" style="color: #fec200">
							已完成
						</view>
						<view class="tag" v-if="item.task_state == 2" style="color: #fec200">
							待结算
						</view>
						<!-- 超时 -->
						<view class="tag" v-if="
                item.task_state == 1 &&
                item.destination_time.down == '已超时' &&
                item.static_cancel.code == 1
              "
						 style="color: #ffffff; background: #ff3939">
							已超时
						</view>
						<!-- 已完成被投诉 -->
						<view class="tag" v-if="item.status == 2" style="color: #ffffff; background: #ff3939">
							被投诉
						</view>
						<!-- 已取消 -->
						<view class="tag" v-if="item.task_state == 3" style="background: #f2f2f2">
							已取消
						</view>
					</view>
				</view>
				<view class="per-t">
					<view class="issuer1">
						<view class="head" @click.stop="toMinePage(item.user_id)">
							<image class="imgInfo" :src="
                  item.user_info.header == ''
                    ? '/static/mine/name1.png'
                    : imgBaseUrl + item.user_info.header
                "></image>
							<image v-if="item.user_info.show_attestation" class="is_auth" :src="
                  item.user_info.show_attestation == 1
                    ? '/static/index/is_auth.png'
                    : item.user_info.show_attestation == 2
                    ? '/static/index/is_shop.png'
                    : item.user_info.show_attestation == 3
                    ? '/static/index/is_rider.png'
                    : ''
                "></image>
						</view>
						<view class="user">
							<view class="user-t user-tt">
								<view class="name">
									<view>{{ item.user_name }}</view>
								</view>
								<image class="gender" v-if="item.user_info.sex.code != 0" :src="
                    item.user_info.sex.code == 1
                      ? '/static/index/man.png'
                      : '/static/index/female.png'
                  "></image>
								<!-- <image class="gender" v-if="item.user_info.is_store.code==1" src="/static/mine/shop.png"></image> -->
								<view><text class="xinyu">信誉{{ item.user_info.credit }}</text></view>
							</view>
							<view class="user-t">
								<view class="location">{{
                  item.user_info.school.school_name+' '+item.user_info.en_year+ '级'}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="per-c">
					<view class="per-c-l">
						<view style="font-weight: bold">{{ item.title }}</view>
						<!-- 加急图片 -->
						<image class="imgInfo" v-if="item.type == 2 && item.is_good_prepay == 1" src="/static/index/yu.png" style="margin-right: 8rpx"></image>
						<image class="imgInfo" v-if="item.is_urgent == 1" src="/static/index/ji.png"></image>
					</view>
					<view class="per-c-r">
						<view class="per-c-price">￥{{ item.task_price_total }}</view>
					</view>
				</view>
				<view class="per-c-b" v-if="item.type == 1">
					<view class="per2">
						<view class="t">取件：</view>
						<view class="c">{{ item.e_task_address }}</view>
					</view>
					<view class="per2">
						<view class="t">送件：</view>
						<view class="c">{{ item.e_destination }}</view>
					</view>
					<view class="per2">
						<view class="t">时间：</view>
						<view class="c">{{ item.destination_time.text }}之前</view>
					</view>
					<view class="per2">
						<view class="t">备注：</view>
						<view class="c" style="color: rgba(36, 36, 36, 0.4)">{{
              item.comment
            }}</view>
					</view>
				</view>
				<view class="per-c-b" v-if="item.type == 2">
					<view class="per2">
						<view class="t">取件：</view>
						<view class="c">{{ item.task_address }}</view>
					</view>
					<view class="per2">
						<view class="t">送件：</view>
						<view class="c">{{ item.destination }}</view>
					</view>
					<view class="per2">
						<view class="t">时间：</view>
						<view class="c">{{ item.destination_time.text }}之前</view>
					</view>
					<view class="per2">
						<view class="t">备注：</view>
						<view class="c" style="color: rgba(36, 36, 36, 0.4)">{{
              item.comment
            }}</view>
					</view>
				</view>
				<view class="per-c-b" v-if="item.type == 3">
					<view class="per2">
						<view class="t">任务内容：</view>
						<view class="c">{{ item.express_desc }}</view>
					</view>
				</view>
			</view>
			<u-loadmore margin-top="24" margin-bottom="24" :status="status" :icon-type="iconType" :load-text="loadText" />
		</view>
	</view>
</template>

<script>
	import {
		taskList,
		countTask,
		delTask
	} from "services/function.js";
	export default {
		data() {
			return {
				imgBaseUrl: getApp().globalData.imgBaseUrl,
				activeTab: 0,
				activeTypeTab: 0,
				tabList: ["待接单", "进行中", "待结算", "已取消", "已完成"],
				typeList: ["全部", "快递帮", "校园跑腿", "其他任务"],
				page: 1,
				list: [],
				offset: [0, 0],
				countNum: {
					canceled: 0,
					finish: 0,
					for_the: 0,
					in_the_order: 0,
					underway: 0,
				},
				is_show: false,
				status: "loading",
				iconType: "flower",
				loadText: {
					loadmore: "轻轻上拉",
					loading: "努力加载中",
					nomore: "实在没有了",
				},
			};
		},
		methods: {
			// 上边tab
			changeTab(index) {
				this.list = [];
				this.status = "loading";
				this.activeTab = index;
				this.page = 1;
				this.is_show = true;
				this.getList();
				this.getCount();
			},
			// 下面tab
			changeTypeTab(index) {
				this.list = [];
				this.status = "loading";
				this.activeTypeTab = index;
				this.page = 1;
				this.is_show = true;
				this.getList();
				this.getCount();
			},
			toDetail(id, time, type,is_pay) {
				let timestamp = Date.parse(new Date()) / 1000;
				// 如果任务完成时间不足30分钟删除任务
				// console.log(time,timestamp,time-timestamp,time-timestamp<1800);
				if (time - timestamp < 1800 && type != 3 && is_pay==0) {
					uni.showToast({
						title: '任务完成时间不足30分钟，即将删除该任务',
						icon: "none",
					});
					delTask({
						id: id,
					}).then((res) => {
						if (res.code == 200) {
							this.list = [];
							this.status = "loading";
							this.page = 1;
							this.is_show = true;
							this.getList();
							this.getCount();
						} else {
							uni.showToast({
								title: res.message,
								icon: "none",
							});
						}
					});
					return false;
				}
				uni.navigateTo({
					url: "/pages/mine/havePublished/orderDetail/orderDetail?id=" + id,
				});
			},
			getCount() {
				countTask({
					user_id: JSON.parse(uni.getStorageSync("user")).id,
				}).then((res) => {
					if (res.code == 200) {
						this.countNum = res.result;
					}
				});
			},
			getList() {
				let where = {};
				if (this.activeTypeTab == 0) {
					where = {
						task_state: this.activeTab,
					};
				} else {
					where = {
						type: this.activeTypeTab,
						task_state: this.activeTab,
					};
				}
				taskList({
					page: this.page,
					limit: 10,
					where: where,
				}).then((res) => {
					if (this.is_show) {
						this.list = [];
					}
					if (res.code == 200) {
						this.list = this.list.concat(res.result.data);
						if (res.result.count <= 10) {
							this.status = "nomore";
						}
						this.page++;
					} else {
						this.status = "nomore";
					}
				});
			},
			toMinePage(id) {
				uni.navigateTo({
					url: '/pages/community/minePage/minePage?id=' + id
				});
			},
		},
		onShow() {
			this.list = [];
			this.status = "loading";
			this.page = 1;
			this.is_show = true;
			this.getList();
			this.getCount();
		},
		onReachBottom() {
			if (this.status == "nomore") {
				return false;
			}
			this.is_show = false;
			this.getList();
		},
	};
</script>

<style scoped>
	.all {
		min-height: 100vh;
		background: #fec200;
		display: flex;
		flex-direction: column;
		overflow: auto;
		text-align: center;
	}

	.content {
		width: 100%;
		height: auto;
		padding: 170rpx 24rpx 24rpx;
		box-sizing: border-box;
		overflow: auto;
		flex: 1;
	}

	.nav {
		background: #fec200;
		width: 100%;
		height: auto;
		z-index: 999;
		position: fixed;
		top: 0;
		padding: 24rpx 24rpx 0 24rpx;
		box-sizing: border-box;
	}

	.navTab {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f9d561;
		border-radius: 22px;
		overflow: hidden;
	}

	.tab {
		font-size: 28rpx;
		color: #333333;
		line-height: 64rpx;
		flex: 1;
		text-align: center;
		position: relative;
	}

	.tabText {
		color: rgba(36, 36, 36, 0.4);
	}

	.tabAct .tabText {
		color: rgba(36, 36, 36);
		background: #ffffff;
		font-weight: bold;
	}

	.typeTab {
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow-x: scroll;
		font-size: 28rpx;
		padding: 0 24rpx;
	}

	.typeItem {
		height: 56rpx;
		line-height: 56rpx;
		color: rgba(36, 36, 36, 0.4);
	}

	.actType {
		border-bottom: 2px solid;
		color: rgba(36, 36, 36, 1);
		font-weight: bold;
	}

	/* list样式 */
	/* component/perFunctionInfo/expressage/expressage.wxss */

	.per {
		background: rgba(255, 255, 255, 1);
		border-radius: 8px;
		margin-top: 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		box-sizing: border-box;
		padding-bottom: 40rpx;
		/* height: 496rpx; */
	}

	.status {
		width: 100%;
		height: 80rpx;
		border-radius: 4px 4px 0px 0px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgba(36, 36, 36, 0.1);
		box-sizing: border-box;
		padding: 0 0 0 32rpx;
		overflow: hidden;
	}

	.status .time {
		font-size: 32rpx;
		color: rgba(36, 36, 36, 0.4);
	}

	.titleStatus {
		flex: 1;
		font-size: 28rpx;
		color: rgba(36, 36, 36, 1);
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.tag {
		width: 176rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #2d2d2d;
		margin-left: 22rpx;
	}

	/*  第二块*/
	.per-t {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 40rpx 24rpx 0;
	}

	.per-t .issuer1 {
		height: 100%;
		width: 80%;
		display: flex;
		justify-content: flex-start;
	}

	.per-t .issuer1 .user {
		display: flex;
		flex-direction: column;
		height: 100%;
		margin-left: 16rpx;
		/* justify-content: space-around; */
	}

	.user .user-t {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		display: flex;
		width: 100%;
		justify-content: flex-start;
		align-items: center;
	}

	.user-tt {
		height: 60rpx;
		line-height: 60rpx;
		display: block;
	}

	.name {
		height: 50rpx;
		line-height: 50rpx;
		font-size: 28rpx;
		color: #333333;
		float: left;
		font-weight: bold;
	}

	.head {
		position: relative;
	}

	.is_auth {
		position: absolute;
		bottom: 8rpx;
		right: 0;
		width: 32rpx;
		height: 32rpx;
		z-index: 10;
	}

	.per-t .imgInfo {
		height: 80rpx;
		width: 80rpx;
		border-radius: 50%;
	}

	.xinyu {
		color: #0091ff;
		font-size: 20rpx;
		padding: 0 6rpx;
		border-radius: 2px;
		background: #e5f4ff;
		margin-left: 12rpx;
	}

	.per-t .gender {
		height: 28rpx;
		width: 28rpx;
		margin-left: 12rpx;
	}

	.time {
		color: rgba(36, 36, 36, 0.4);
		margin-right: 10rpx;
		font-size: 24rpx;
	}

	.location {
		color: rgba(36, 36, 36, 0.4);
		font-size: 24rpx;
	}

	.per-c {
		height: 80rpx;
		line-height: 80rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 0 24rpx;
		margin: 14rpx 0 8rpx;
	}

	.per-c-l {
		height: 100%;
		width: 70%;
		font-size: 36rpx;
		color: #333333;
		text-align: left;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		/* overflow: hidden;
	  white-space: nowrap;
	  text-overflow: ellipsis;  */
	}

	.per-c-l view {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 85%;
		/* margin-right: 16rpx; */
	}

	.per-c-l image {
		height: 32rpx;
		width: 56rpx;
		margin-left: 16rpx;
		position: relative;
		top: 4rpx;
	}

	.per-c-r .operate {
		position: absolute;
		height: 60rpx;
		width: 160rpx;
		left: -100rpx;
		top: 40rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.per-c-r .operate .image2 {
		margin-right: 10rpx;
		height: 40rpx;
		width: 40rpx;
	}

	.per-c-b {
		/* height: 140rpx; */
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 24rpx;
	}

	.per-c-b .per2 {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: rgba(36, 36, 36, 1);
		width: 100%;
		text-align: left;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	/* .per-c-b .t {
	  color: rgba(36, 36, 36, 0.4);
	} */

	.per-c-b .t {
		color: rgba(36, 36, 36, 0.4);
		/* width: 130rpx; */
		height: 40rpx;
		line-height: 40rpx;
		margin-right: 16rpx;
		text-align: right;
	}

	.per2 .c {
		width: 500rpx;
		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.per-c-price {
		width: 100%;
		text-align: left;
		height: 66rpx;
		font-size: 48rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: bold;
		color: rgba(255, 77, 6, 1);
		line-height: 66rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	/* 动态绑定底部按钮样式 */

	.class1 {
		background: rgba(255, 221, 5, 1);
		color: #000;
		font-size: 28rpx;
		width: auto;
		height: 48rpx;
		line-height: 48rpx;
		border-radius: 4px;
		padding: 2rpx 10rpx;
	}

	.class2 {
		background: rgba(252, 35, 35, 0.8);
		color: #fff;
		font-size: 28rpx;
		width: auto;
		height: 48rpx;
		line-height: 48rpx;
		border-radius: 4px;
		padding: 2rpx 10rpx;
	}
</style>
