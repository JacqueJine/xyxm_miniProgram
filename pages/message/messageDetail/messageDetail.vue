<template>
	<view class="main">
		<view>
			<view class="list3cell">
				<view class="headGroup">
					<image class="head" :src="parseInt(list.message_type / 10) == 6?'/static/mine/logo1.png':list.send.header == '' ? '/static/mine/name1.png' : imgBaseUrl + list.send.header"
					 mode=""></image>
					<image v-if="list.send.show_attestation" class="renzheng" :src="
												list.send.show_attestation == 1
													? '/static/index/is_auth.png'
													: list.send.show_attestation == 2
													? '/static/index/is_shop.png'
													: list.send.show_attestation == 3
													? '/static/index/is_rider.png'
													: ''
											"></image>
				</view>
				<view class="list3right1">
					<view>
						<view>
							<text>{{parseInt(list.message_type / 10) == 6?'校园小茗':list.send.name}}</text>
							<text class="tag" v-if="parseInt(list.message_type / 10) == 6">官方</text>
						</view>
						<view style="color: rgba(36, 36, 36, .4);">{{ $u.timeFrom(list.int_create_time, false) }}</view>
					</view>
					<view>{{list.count}}</view>
				</view>
			</view>
			<view v-if="list.message_type==31&&list.message.status.code==1 || list.message_type==31&&list.message==null" class="btn" style="background: rgba(36, 36, 36, .2);">{{list.message.status.code==1?"已通过":list.message==null?"已拒绝":""}}</view>
			<view v-if="list.message_type==31&&list.message.status.code==0" class="btn" @click="change(1)">同意加入</view>
			<view v-if="list.message_type==31&&list.message.status.code==0" class="btn btn1" @click="change(0)">拒绝</view>
			<view class="con">
				<u-parse v-if="parseInt(list.message_type / 10) == 6" :html="list.message.content"></u-parse>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUnread
	} from "../../../services/message.js";
	import {
		joinAudit
	} from "../../../services/community.js";
	export default {
		data() {
			return {
				type: 1,
				content: `<p>露从今夜白，月是故乡明</p><img src="https://cdn.uviewui.com/uview/swiper/2.jpg" />`,
				list: {},
				imgBaseUrl: getApp().globalData.imgBaseUrl,
			};
		},
		onLoad(e) {
			this.type = e.id;
			getUnread({
				where: {
					id: e.id,
				},
				limit: 1,
				page: 1,
			}).then(res => {
				if (res.code == 200) {
					this.list = res.result.list[0];
				} else {

				}
			});
		},
		methods: {
			change(type) {
				uni.showLoading({
					title: "提交中……",
					mask: true,
				});
				joinAudit({
					status: type,
					id: this.list.message.id,
					club_id: this.list.message.community_club_id,
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: res.message,
						icon: 'none',
					})
					if (res.code == 200) {
						setTimeout(()=>{
							uni.navigateBack();
						},1500);
					}
				})

			},
		}
	};
</script>

<style scoped>
	.main {
		padding: 32rpx 24rpx;
	}

	.headGroup {
		position: relative;
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
	}

	.head {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.renzheng {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 28rpx;
		height: 28rpx;
	}

	.list3cell {
		font-size: 28rpx;
		border-bottom: 1px solid #f2f2f2;
		padding: 44rpx 0;
		display: flex;
		align-items: center;
	}

	.list3right1 {
		flex: 1;
	}

	.list3right1>view:nth-of-type(1) {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.list3right1>view:nth-of-type(1)>view:nth-of-type(1) {
		display: flex;
		align-items: center;
	}

	.list3right1>view:nth-of-type(1) .tag {
		font-size: 20rpx;
		background: #fec200;
		border-radius: 3px;
		margin-left: 8rpx;
		padding: 2rpx 4rpx;
	}

	.list3right1>view:nth-of-type(2) {
		width: 600rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: rgba(36, 36, 36, 0.4);
		margin-top: 12rpx;
	}

	.list3right {
		width: 130rpx;
		height: 178rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: crimson;
		color: #ffffff;
	}

	.btn {
		background: rgba(254, 194, 0, 1);
		border-radius: 50rpx;
		font-size: 36rpx;
		color: rgba(51, 51, 51, 1);
		text-align: center;
		padding: 24rpx 0;
		margin-top: 136rpx;
	}

	.btn1 {
		margin-top: 40rpx;
		background: transparent;
		border: 1px solid rgba(36, 36, 36, .4);
	}

	.con {
		margin-top: 60rpx;
	}
</style>
