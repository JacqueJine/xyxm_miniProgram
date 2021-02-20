<template>
	<view class="content">
		<view class="top" @click="toPage(1)" :style="dataObj.show_attestation == 1 ? 'border: 1px solid #FEC200;' : ''">
			<view class="t1" :style="dataObj.is_real != 0 ? 'color:#0091FF' : 'color:#333333'">
				{{ dataObj.is_real == 1 ? '已认证' : dataObj.is_real == 2 ? '申请中' : '点击认证' }}
			</view>
			<view class="t2">
				<image src="/static/mine/is_auth.png"></image>
				<view>
					<view>实名认证</view>
					<view>实名认证后才能接单，信任度高</view>
				</view>
			</view>
			<view class="tag" v-show="dataObj.show_attestation == 1">使用中</view>
		</view>
		<view class="top" @click="toPage(3)" :style="dataObj.show_attestation == 3 ? 'border: 1px solid #FEC200;' : ''">
			<view class="t1" :style="dataObj.is_real != 1 ? 'color:rgba(25, 25, 25, 0.6)' : dataObj.is_real == 1 && dataObj.is_rider != 0 ? 'color:#0091FF' : 'color:#333333'">
				{{
					dataObj.is_real != 1
						? '请先完成实名认证'
						: dataObj.is_real == 1 && dataObj.is_rider == 1
						? '已认证'
						: dataObj.is_real == 1 && dataObj.is_rider == 2
						? '申请中'
						: '点击认证'
				}}
			</view>
			<view class="t2">
				<image src="/static/mine/is_rider.png"></image>
				<view>
					<view>骑手认证</view>
					<view>认证骑手可以接单赚钱</view>
				</view>
			</view>
			<view class="tag" v-show="dataObj.show_attestation == 3">使用中</view>
		</view>
<!-- 		<view class="top" @click="toPage(2)" :style="dataObj.show_attestation == 2 ? 'border: 1px solid #FEC200;' : ''">
			<view class="t1" :style="dataObj.is_real != 1 ? 'color:rgba(25, 25, 25, 0.6)' : dataObj.is_real == 1 && dataObj.is_store != 0 ? 'color:#0091FF' : 'color:#333333'">
				{{
					dataObj.is_real != 1
						? '请先完成实名认证'
						: dataObj.is_real == 1 && dataObj.is_store == 1
						? '已认证'
						: dataObj.is_real == 1 && dataObj.is_store == 2
						? '申请中'
						: '点击认证'
				}}
			</view>
			<view class="t2">
				<image src="/static/mine/shop1.png"></image>
				<view>
					<view>店铺认证</view>
					<view>实名认证后即可开通店铺获得认证，信誉度较高</view>
				</view>
			</view>
			<view class="tag" v-show="dataObj.show_attestation == 2">使用中</view>
		</view> -->
		<view class="top" @click="toPage(0)" :style="dataObj.show_attestation == 0 ? 'border: 1px solid #FEC200;' : ''">
			<view class="t1"></view>
			<view class="t2">
				<image src="/static/mine/none.png"></image>
				<view>
					<view>不展示</view>
					<view>不展示任何认证信息</view>
				</view>
			</view>
			<view class="tag" v-show="dataObj.show_attestation == 0">使用中</view>
		</view>
	</view>
</template>

<script>
import { getAuthenticationState, showAuthentication } from '../../../../services/mine.js';
export default {
	data() {
		return {
			dataObj: {},
			active: 1,
			sel: 4
		};
	},
	methods: {
		change(type) {
			uni.showLoading({
				title: '提交中',
				mask: true
			});
			showAuthentication({ type: type }).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
					this.getData();
				}
			});
		},
		toPage(index) {
			let url = '';
			// 实名认证
			if (index == 1) {
				// 判断是否认证 未认证去认证 认证已通过改变标签
				if (this.dataObj.is_real == 1) {
					if (this.dataObj.show_attestation != 1) {
						this.change(index);
					}
					return false;
				} else if (this.dataObj.is_real != 1 && this.dataObj.is_real != 2) {
					url = '/pages/mine/mineIs_auth/mineIs_auth';
				}
			}
			// 骑手认证
			else if (index == 3) {
				if (this.dataObj.is_real != 1) {
					uni.showToast({
						title: '请先进行实名认证',
						icon: 'none'
					});
					return false;
				} else if (this.dataObj.is_rider == 1) {
					if (this.dataObj.show_attestation != 3) {
						this.change(index);
					}
					return false;
				} else if (this.dataObj.is_rider != 1 && this.dataObj.is_rider != 2) {
					url = '/pages/mine/mineIs_rider/mineIs_rider';
				}
			}
			// 店铺认证
			else if (index == 2) {
				if (this.dataObj.is_real != 1) {
					uni.showToast({
						title: '请先进行实名认证',
						icon: 'none'
					});
					return false;
				} else if (this.dataObj.is_store == 1) {
					if (this.dataObj.show_attestation != 2) {
						this.change(index);
					}
					return false;
				} else if (this.dataObj.is_store != 1 && this.dataObj.is_store != 2) {
					url = '/pages/mine/shop/openShop/openShop?type=0';
				}
			} else if (index == 0) {
				if (this.dataObj.show_attestation != 0) {
					this.change(index);
				}
				return false;
			}
			uni.navigateTo({
				url: url
			});
		},
		getData() {
			getAuthenticationState().then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					this.dataObj = res.result;
				}
			});
		}
	},
	onLoad() {},
	onShow() {
		uni.showLoading({
			title: '加载中',
			mask: true
		});
		this.getData();
	}
};
</script>

<style scoped>
.content {
	padding: 30rpx 24rpx;
}

.top {
	margin-top: 24rpx;
	border-radius: 8px;
	border: 1px solid #f2f2f2;
	padding: 24rpx 24rpx 44rpx;
	position: relative;
}

.tag {
	position: absolute;
	bottom: 0;
	right: 0;
	background: #fec200;
	border-radius: 8px 0px 7px 0px;
	font-size: 20rpx;
	padding: 6rpx 12rpx;
}

.top image {
	width: 100rpx;
	height: 100rpx;
	margin-right: 16rpx;
}

.t1 {
	text-align: right;
	font-size: 24rpx;
	color: rgba(25, 25, 25, 0.4);
}

.t2 {
	display: flex;
	align-items: center;
}

.t2 > view > view:nth-of-type(1) {
	font-size: 28rpx;
	font-weight: bold;
}

.t2 > view > view:nth-of-type(2) {
	font-size: 24rpx;
	color: rgba(25, 25, 25, 0.4);
	margin-top: 8rpx;
}
</style>
