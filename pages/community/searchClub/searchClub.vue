<template>
	<view class="content">
		<view class="tabBar" :style="'padding-top:' + (navTop + 5) + 'px;height:' + navHeight + 'px'">
			<u-icon name="arrow-left" size="50rpx" @click="back" style="margin-right: 30rpx"></u-icon>
			<u-search placeholder="搜索 社团名称" :focus="focus" v-model="value" @search="onSearch" @focus="onFocus" :show-action="false"></u-search>
		</view>
		<view class="navTab" :style="'margin-top:' + navHeight + 'px'">
			<view>
				<view v-for="(item, index) in tabList" :key="index" :class="active == index ? 'tab tabAct' : 'tab'">
					<view class="tabview">{{ item }}</view>
					<view class="tabDot"></view>
				</view>
			</view>
			<veiw class="navChange">
				<image src="/static/index/change.png" @click="changeSchool"></image>
				<text @click="changeSchool">{{ selText == 1 ? '本校' : '公开' }}</text>
			</veiw>
		</view>
		<!-- 社团 -->
		<view class="top_3">
			<view class="top1_list_2" v-for="(item, index) in phbList" :key="index" @click="toClub(item.id)">
				<view><image :src="item.club_header ? imgBaseUrl + item.club_header : '/static/mine/name1.png'"></image></view>
				<view>
					<view>{{ item.club_name }}</view>
					<view>{{ item.member_num }} 名成员</view>
				</view>
				<view>{{ item.is_join ? '查看' : '加入' }}</view>
			</view>
			<view style="padding: 20rpx 0;"><u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" @loadmore="loadingMore" /></view>
		</view>

		<!-- 搜索 -->
		<view class="searchPop" v-if="focus" :style="'padding-top:' + navHeight + 'px'">
			<view class="clear">
				<view>历史记录</view>
				<view @click="clearSearch('all')">
					<image src="/static/message/qk.png"></image>
					清空
				</view>
			</view>
			<view class="listsear">
				<view v-for="(item, index) in searList" :key="index">
					<text style="flex: 1" @click="toSearch(item)">{{ item }}</text>
					<u-icon name="close" @click="clearSearch(index)"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getPostsLists, sharePosts, praisePosts, delPosts, getClubLists, listUser } from '../../../services/community.js';
export default {
	data() {
		return {
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			action: getApp().globalData.imgBaseUrl + '/common/upload/image.html',
			value: '',
			active: 0,
			navTop: getApp().globalData.navTop,
			navHeight: getApp().globalData.navHeight,
			tabList: ['社团'],
			images: ['/static/mine/name1.png'],
			isguan: false,
			focus: true,
			searList: [],
			selText: 0,
			phbList: [],
			dataList: [],
			userList: [],
			myId: null,
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
	onShow() {
		uni.getStorage({
			key: 'user',
			success: res => {
				this.myId = JSON.parse(res.data).id;
			}
		});
	},
	onPullDownRefresh() {
		this.init();
		uni.stopPullDownRefresh();
	},
	onReachBottom() {
		this.loadingMore();
	},
	methods: {
		init() {
			this.page = 1;
			this.dataList = [];
			this.phbList = [];
			this.userList = [];
			this.status = 'loadmore';
			this.getPhb();
		},
		loadingMore() {
			if (this.status == 'nomore') return;
			this.status = 'loading';
			this.page = ++this.page;
			this.getPhb();
		},
		getPhb() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			getClubLists({
				where: { club_auth: this.selText, club_name: this.value },
				page: this.page,
				limit: 20
			}).then(res => {
				if (res.code == 200) {
					if (res.result.list.length) {
						this.phbList = this.phbList.concat(res.result.list);
					} else {
						this.status = 'nomore';
					}
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
				uni.hideLoading();
			});
		},
		changeSchool() {
			if (this.selText == 0) {
				this.selText = 1;
			} else {
				this.selText = 0;
			}
			this.init();
		},
		back() {
			uni.navigateBack();
		},
		toSearch(item) {
			this.value = item;
			this.focus = false;
			this.init();
		},
		onFocus() {
			this.focus = true;
		},
		onSearch() {
			this.searList.unshift(this.value);
			// 数组去重
			this.searList = this.searList.filter(function(ele, index, self) {
				return self.indexOf(ele) === index;
			});
			this.focus = false;
			this.init();
			uni.setStorage({
				key: 'searchClubHistory',
				data: this.searList,
				success() {}
			});
		},
		changeTab(index) {
			this.active = index;
			this.init();
		},
		toClub(id) {
			uni.navigateTo({
				url: '/pages/community/club/club?id=' + id
			});
		},
		clearSearch(index) {
			if (index == 'all') {
				this.searList = [];
				uni.setStorage({
					key: 'searchClubHistory',
					data: this.searList,
					success() {}
				});
			} else {
				this.searList.splice(index, 1);
				uni.setStorage({
					key: 'searchClubHistory',
					data: this.searList,
					success() {}
				});
			}
		}
	},
	onLoad(options) {
		let that = this;
		this.focus = false;
		this.init();
		uni.getStorage({
			key: 'searchClubHistory',
			success(res) {
				that.searList = res.data;
			}
		});
	}
};
</script>

<style scoped>
.content {
	box-sizing: border-box;
	overflow: hidden;
}

.tabBar {
	background: #ffffff;
	display: flex;
	align-items: center;
	padding: 30rpx 20rpx 10rpx;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	z-index: 999;
}

.navTab {
	background: #ffffff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 28rpx 20rpx 36rpx;
}

.navChange {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	border-radius: 12px;
	border: 1px solid #e6e6e6;
	padding: 6rpx 18rpx;
}

.navChange image {
	width: 26rpx;
	height: 24rpx;
	margin-right: 10rpx;
}

.navTab > view:nth-of-type(1) {
	display: flex;
	align-items: center;
}

.tab {
	font-size: 32rpx;
	color: rgba(36, 36, 36, 0.4);
	position: relative;
	margin-right: 36rpx;
	text-align: center;
}

.tabAct {
	color: rgba(36, 36, 36);
	font-weight: bold;
	font-size: 40rpx;
}

.tabDot {
	width: 36rpx;
	height: 8rpx;
	background: #0091ff;
	border-radius: 2px;
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

/* 帖子 */
.top2_list {
	padding: 40rpx 24rpx;
	border-bottom: 20rpx solid #f8fafb;
	background: #ffffff;
}

.top2_title {
	display: flex;
	align-items: flex-start;
	margin-bottom: 20rpx;
}

.top2_title .head {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.top2_title .logo {
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

.top2_title2 {
	flex: 1;
}

.top2_title2 > view:nth-of-type(1) {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 6rpx;
	font-size: 28rpx;
}

.top2_title2_2 {
	display: flex;
	align-items: center;
}

.top2_title2 > view:nth-of-type(2) {
	font-size: 24rpx;
	color: rgba(36, 36, 36, 0.4);
}

.top2_con {
	font-size: 32rpx;
}

.top2_con image {
	border-radius: 4px;
	width: 228rpx;
	height: 220rpx;
	margin: 20rpx 8rpx 0 0;
}

.top2_con image:nth-of-type(3n) {
	margin: 20rpx 0 0 0;
}

.top2_share {
	margin-top: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.top2_share > view {
	display: flex;
	align-items: center;
}

/* 图片预览 */
.pop {
	width: 600rpx;
}

.pop image {
	width: 100%;
}

/* 社团 */
.top1_list_2 {
	display: flex;
	padding: 44rpx 0;
	border-bottom: 1px solid #f2f2f2;
	align-items: center;
	margin: 0 24rpx;
}

.top1_list_2 image {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.top1_list_2 > view:nth-of-type(2) {
	flex: 1;
	font-size: 28rpx;
	font-weight: bold;
}

.top1_list_2 > view:nth-of-type(2) > view:nth-of-type(2) {
	font-size: 24rpx;
	font-weight: normal;
	color: rgba(51, 51, 51, 0.4);
	margin-top: 4rpx;
}

.top1_list_2 > view:nth-of-type(3) {
	width: 100rpx;
	height: 56rpx;
	background: #fec200;
	border-radius: 8px;
	text-align: center;
	line-height: 56rpx;
	font-size: 24rpx;
}

/* 用户 */
.top .top2_title {
	display: flex;
	align-items: flex-start;
	margin-bottom: 0;
	margin: 0 24rpx;
	padding: 44rpx 0;
	border-bottom: 1px solid #f2f2f2;
}

/* 搜索 */
.searchPop {
	width: 100%;
	min-height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background: #ffffff;
	z-index: 100;
}

.searchPop .clear {
	padding: 24rpx;
	border-bottom: 20rpx solid #f2f2f2;
	font-size: 32rpx;
	font-weight: bold;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.searchPop .clear > view:nth-of-type(2) {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: rgba(36, 36, 36, 0.6);
	font-weight: normal;
}

.searchPop .clear > view:nth-of-type(2) image {
	width: 28rpx;
	height: 28rpx;
	margin-right: 4rpx;
}

.searchPop .listsear > view {
	padding: 36rpx 0;
	margin: 0 24rpx;
	border-bottom: 1px solid #f2f2f2;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: rgba(36, 36, 36, 0.6);
}

/* 实名 */
.is_auth {
	position: absolute;
	bottom: 5rpx;
	right: 20rpx;
	width: 32rpx;
	height: 32rpx;
	z-index: 10;
}
button {
	background: transparent;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	padding-left: 0;
	padding-right: 0;
}
</style>
