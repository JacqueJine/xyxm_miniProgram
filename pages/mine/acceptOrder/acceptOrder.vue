<template>
	<view class="all">
		<view class="nav">
			<view class="navTab">
				<view v-for="(item,index) in tabList" :key="index" :class="activeTab == index ? 'tab tabAct' : 'tab'" @click="changeTab(index)">
					<u-badge type="error" :count="index==0?countNum.underway:index==1?countNum.for_the:0" v-if="index<2" :offset="offset"></u-badge>
					<view class="tabText">{{item}}</view>
				</view>
			</view>
			<view class="typeTab">
				<view v-for="(item,index) in typeList" :key="index" :class="activeTypeTab == index ? 'typeItem actType' : 'typeItem'"
				 @click="changeTypeTab(index)">{{item}}</view>
			</view>
		</view>
		<view class="content">
			<view class="per" v-for="(item,index) in list" :key="index" @click="toDetail(item.id)">
				<view class="status">
					<view class="time">{{item.update_time ?item.update_time :''}}</view>

					<view class="titleStatus" v-if="item.order_static==1 && item.getTask.destination_time.down!='已超时' && item.getTask.static_cancel.code==1&&item.getTask.destination_time.time!=null">
						任务倒计时
						<view class="tag">
							<u-count-down ref="uCountDown" color="#FEC200" separator="colon" bg-color="#2D2D2D" separator-color="#FEC200"
							 :timestamp="item.getTask.destination_time.down"></u-count-down>
						</view>
					</view>
					<view class="titleStatus" v-else>
						<view class="tag" v-if="item.order_static==1 && item.getTask.static_cancel.code==0" style="color: #FEC200;">
							取消中
						</view>
						<view class="tag" v-if="item.order_static==1 &&item.getTask.destination_time.time==null && item.getTask.static_cancel.code==1"
						 style="color: #FEC200;">
							进行中
						</view>
						<view class="tag" v-if="item.order_static==4" style="color: #FEC200;">
							已完成
						</view>
						<!-- 进行中已超时 -->
						<view class="tag" v-if="item.order_static==1 && item.getTask.destination_time.down=='已超时' && item.getTask.static_cancel.code==1"
						 style="color: #ffffff;background: #FF3939;">
							已超时
						</view>
						<!-- 已完成被投诉 -->
						<view class="tag" v-if="item.order_static==2" style="color: #FEC200;">
							待结算
						</view>
						<!-- 已取消 -->
						<view class="tag" v-if="item.order_static==3" style="background: #F2F2F2;">
							已取消
						</view>
					</view>
				</view>
				<view class="per-t">
					<view class="issuer1">
						<view class="head" @click.stop="toMinePage(item.task_user_id)">
							<image class="imgInfo" :src="item.getTask.user_info.header==''?'/static/mine/name1.png':imgBaseUrl+item.getTask.user_info.header"></image>
							 <image
              			v-if="item.getTask.user_info.show_attestation"
              		class="is_auth"
              		:src="
               		 item.getTask.user_info.show_attestation == 1
                  ? '/static/index/is_auth.png'
                  :item.getTask.user_info.show_attestation == 2
                  ? '/static/index/is_shop.png'
                  :item.getTask.user_info.show_attestation == 3
                  ? '/static/index/is_rider.png'
                  : ''
              "
            ></image>
						</view>
						<view class="user">
							<view class="user-t user-tt ">
								<view class="name">
									<view>{{item.getTask.user_name}}</view>
								</view>
								<image class="gender" v-if="item.getTask.user_info.sex.code!=0" :src="item.getTask.user_info.sex.code == 1?'/static/index/man.png':'/static/index/female.png'"></image>
								<!-- <image class="gender" v-if="item.getTask.user_info.is_store.code==1" src="/static/mine/shop.png"></image> -->
								<view><text class="xinyu">信誉{{item.getTask.user_info.credit}}</text></view>
							</view>
							<view class="user-t">
								<view class="location">{{item.getTask.user_info.school.school_name+' '+item.getTask.user_info.en_year+ '级'}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="per-c">
					<view class="per-c-l">
						<view style="font-weight:bold;">{{item.getTask.title}}</view>
						<!-- 加急图片 -->
						<image class="imgInfo" v-if="item.getTask.type==2&&item.getTask.is_good_prepay==1" src="/static/index/yu.png"
						 style="margin-right: 8rpx;"></image>
						<image class="imgInfo" v-if="item.getTask.is_urgent==1" src="/static/index/ji.png"></image>
					</view>
					<view class="per-c-r">
						<view class="per-c-price">￥{{item.getTask.task_price_total}}</view>
					</view>
				</view>
				<view class="per-c-b" v-if="item.getTask.type==1">
					<view class="per2">
						<view class="t">取件：</view>
						<view class="c">{{item.getTask.task_expressage[0].task_address}}</view>
					</view>
					<view class="per2">
						<view class="t">送件：</view>
						<view class="c">{{item.getTask.task_expressage[0].destination}}</view>
					</view>
					<view class="per2">
						<view class="t">时间：</view>
						<view class="c">{{item.getTask.destination_time.text}}之前</view>
					</view>
					<view class="per2">
						<view class="t">备注：</view>
						<view class="c" style="color: rgba(36, 36, 36, 0.4)">{{item.getTask.comment}}</view>
					</view>
				</view>
				<view class="per-c-b" v-if="item.getTask.type==2">
					<view class="per2">
						<view class="t">取件：</view>
						<view class="c">{{item.getTask.task_address}}</view>
					</view>
					<view class="per2">
						<view class="t">送件：</view>
						<view class="c">{{item.getTask.destination}}</view>
					</view>
					<view class="per2">
						<view class="t">时间：</view>
						<view class="c">{{item.getTask.destination_time.text}}之前</view>
					</view>
					<view class="per2">
						<view class="t">备注：</view>
						<view class="c" style="color: rgba(36, 36, 36, 0.4)">{{item.getTask.comment}}</view>
					</view>
				</view>
				<view class="per-c-b" v-if="item.getTask.type==3">
					<view class="per2">
						<view class="t">任务内容：</view>
						<view class="c">{{item.getTask.express_desc}}</view>
					</view>
				</view>
			</view>
			<u-loadmore margin-top="24" margin-bottom="24" :status="status" :icon-type="iconType" :load-text="loadText" />
		</view>
	</view>
</template>

<script>
	import {
		listOrder,
		countTaskOrder
	} from "../../../services/function.js";
	export default {
		data() {
			return {
				imgBaseUrl: getApp().globalData.imgBaseUrl,
				activeTab: 0,
				activeTypeTab: 0,
				tabList: ['进行中', '待结算', '已取消', '已完成'],
				typeList: ['全部', '快递帮', '校园跑腿', '其他任务'],
				page: 1,
				list: [],
				offset: [5, 10],
				countNum: {
					canceled: 0,
					finish: 0,
					for_the: 0,
					in_the_order: 0,
					underway: 0,
				},
				is_show: false,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
			}
		},
		methods: {
			// 上边tab
			changeTab(index) {
				this.status = 'loading';
				this.list = [];
				this.activeTab = index;
				this.page = 1;
				this.is_show = true;
				this.getList();
			},
			// 下面tab
			changeTypeTab(index) {
				this.status = 'loading';
				this.activeTypeTab = index;
				this.list = [];
				this.page = 1;
				this.is_show = true;
				this.getList();
			},
			toDetail(id) {
				uni.navigateTo({
					url: "/pages/mine/acceptOrder/orderDetail/orderDetail?id=" + id,
				})
			},
			getCount() {
				countTaskOrder().then(res => {
					if (res.code == 200) {
						this.countNum = res.result;
					}
				})
			},
			getList() {
				let where = {};
				let order_static = "";
				order_static = this.activeTab + 1;
				if (this.activeTypeTab == 0) {
					where = {
						order_static: order_static
					}
				} else {
					where = {
						task_type: this.activeTypeTab,
						order_static: order_static
					}
				}
				listOrder({
					page: this.page,
					limit: 10,
					where: where,
				}).then(res => {
					if (this.is_show) {
						this.list = [];
					}
					if (res.code == 200) {
						this.list = this.list.concat(res.result.data);
						if (res.result.count <= 10) {
							this.status = "nomore";
						}
						this.page++;
					} else if (res.code == 0) {
						this.status="nomore";
					}
				})
			},
			toMinePage(id) {
				uni.navigateTo({
					url: '/pages/community/minePage/minePage?id=' + id
				});
			},

		},
		onShow() {
			this.status= 'loading';
			this.list = [];
			this.page = 1;
			this.is_show = true;
			this.getList();
			this.getCount();
		},
		onReachBottom() {
			if (this.status=="nomore") {
				return false;
			}
			this.is_show = false;
			this.getList();
		},
	}
</script>

<style scoped>
	.all {
		min-height: 100vh;
		background: #FEC200;
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
		background: #FEC200;
		width: 100%;
		height: auto;
		z-index: 10;
		position: fixed;
		top: 0;
		padding: 24rpx 24rpx 0 24rpx;
		box-sizing: border-box;
	}

	.navTab {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #F9D561;
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
		background: #2D2D2D;
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
		color: #0091FF;
		font-size: 20rpx;
		padding: 0 6rpx;
		border-radius: 2px;
		background: #E5F4FF;
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
