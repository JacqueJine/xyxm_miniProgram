<template>
	<view>
		<view class="top1">
			<view>成员共{{ count }}人</view>
			<view>
				<button open-type="share" style="background: transparent;display: flex;justify-content: center;"><u-icon name="plus" color="#979797" size="50rpx"></u-icon></button>
			</view>
		</view>
		<view class="top2">
			<view v-for="(item, index) in memberList" :key="index">
				<view class="head">
					<image :src="item.user.header ? imgBaseUrl + item.user.header : '/static/mine/name1.png'"></image>
					<image
						v-if="item.user.show_attestation"
						class="is_auth"
						:src="
							item.user.show_attestation == 1
								? '/static/index/is_auth.png'
								: item.user.show_attestation == 2
								? '/static/index/is_shop.png'
								: item.user.show_attestation == 3
								? '/static/index/is_rider.png'
								: ''
						"
					></image>
				</view>
				<view class="cont">
					<view>
						<text>{{ item.user.name }}</text>
						<image src="/static/index/female.png" class="logo"></image>
						<text class="tag" :style="item.member_auth.code == 1 ? 'background: #FEC200;color: #000000;' : ''">
							{{ item.member_auth.code == 1 ? '社长' : '信誉' + item.user.credit }}
						</text>
					</view>
					<view class="school">{{ item.user.school ? item.user.school.school_name : '' }}</view>
				</view>
				<view v-if="auth > 0 && item.member_auth.code != 1 && item.user_id != myId" @click="del(item.id, index)">踢出</view>
			</view>
		</view>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" @loadmore="loadingMore" />
	</view>
</template>

<script>
import { getClubMember, delClubMember } from '../../../../../services/community.js';
export default {
	data() {
		return {
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			club_id: null,
			memberList: [],
			auth: 0,
			myId: '',
			count: 0,
			page: 1,
			status: 'loadmore',
			iconType: 'flower',
			loadText: {
				loadmore: '上拉或点击',
				loading: '努力加载中',
				nomore: '实在没有了'
			}
		};
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
		}
		return {
			title: '社团邀请',
			path: '/pages/community/club/club?id=' + this.club_id,
			imageUrl: '/static/club/bg.png'
		};
	},
	onLoad(options) {
		this.club_id = options.id;
		this.getList();
	},
	onShow() {
		uni.getStorage({
			key: 'user',
			success: res => {
				this.myId = JSON.parse(res.data).id;
			}
		});
	},
	onReachBottom() {
		this.loadingMore();
	},
	methods: {
		del(id, index) {
			uni.showModal({
				title: '提示',
				content: '请确认是否移除该成员',
				success: res => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中...',
							mask: true
						});
						delClubMember({ club_id: this.club_id, id: id }).then(res => {
							uni.hideLoading();
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
							if (res.code == 200) {
								this.memberList.splice(index, 1);
								// this.getList();
							}
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		loadingMore() {
			if (this.status == 'nomore') return;
			this.status = 'loading';
			this.page = ++this.page;
			this.getList();
		},
		getList() {
			uni.showLoading({
				title: '加载中...'
			});
			getClubMember({ id: this.club_id, page: this.page, limit: 20 }).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					this.count = res.result.count;
					this.auth = res.result.auth;
					if (res.result.list.length) {
						this.memberList = this.memberList.concat(res.result.list);
					} else {
						this.status = 'nomore';
					}
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>

<style scoped>
.top1 {
	padding: 22rpx 36rpx;
	font-size: 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-weight: bold;
}

.top1 > view:nth-of-type(2) {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: #eeeeee;
	display: flex;
	align-items: center;
	justify-content: center;
}

.top2 {
	padding: 0 24rpx;
	margin-bottom: 30rpx;
}

.top2 > view {
	padding: 44rpx 0;
	border-bottom: 1px solid #f2f2f2;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.head {
	position: relative;
	margin-right: 20rpx;
}

.head image {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}

.head .is_auth {
	position: absolute;
	bottom: 5rpx;
	right: 0;
	width: 32rpx;
	height: 32rpx;
	z-index: 10;
}

.top2 .cont {
	flex: 1;
	font-size: 28rpx;
}
.top2 .cont > view:nth-of-type(1) {
	display: flex;
	align-items: center;
}
.top2 .cont .school {
	font-size: 24rpx;
	color: rgba(36, 36, 36, 0.4);
}
.top2 .logo {
	width: 28rpx;
	height: 28rpx;
	margin-left: 12rpx;
}

.tag {
	font-size: 20rpx;
	padding: 0 6rpx;
	background: #e5f4ff;
	color: #0091ff;
	margin-left: 18rpx;
	border-radius: 2px;
}
.top2 > view > view:nth-of-type(3) {
	width: 96rpx;
	height: 48rpx;
	border-radius: 12px;
	border: 1px solid #545454;
	font-size: 24rpx;
	text-align: center;
	line-height: 48rpx;
}
</style>
