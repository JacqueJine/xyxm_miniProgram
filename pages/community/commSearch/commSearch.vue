<template>
	<view class="content">
		<view class="tabBar" :style="'padding-top:' + (navTop + 5) + 'px;height:' + navHeight + 'px'">
			<u-icon name="arrow-left" size="50rpx" @click="back" style="margin-right: 30rpx"></u-icon>
			<u-search placeholder="搜索 帖子 社团 用户" :focus="focus" v-model="value" @search="onSearch" @focus="onFocus" :show-action="false"></u-search>
		</view>
		<view class="navTab" :style="'margin-top:' + navHeight + 'px'">
			<view>
				<view v-for="(item, index) in tabList" :key="index" :class="active == index ? 'tab tabAct' : 'tab'" @click="changeTab(index)">
					<view class="tabview">{{ item }}</view>
					<view class="tabDot"></view>
				</view>
			</view>
			<veiw v-if="active!=2" class="navChange">
				<image src="/static/index/change.png" @click="changeSchool"></image>
				<text @click="changeSchool">{{ selText == 1 ? '本校' : '公开' }}</text>
			</veiw>
		</view>
		<!-- 帖子 -->
		<view class="top2" v-if="active == 0">
			<view v-for="(item, index) in dataList" :key="index" class="top2_list">
				<view class="top2_title" @click.stop="toMinePage(item.user_id)">
					<view style="position: relative">
						<image :src="item.user.header ? imgBaseUrl + item.user.header : '/static/mine/name1.png'" class="head"></image>
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
					<view class="top2_title2">
						<view>
							<view class="top2_title2_2">
								<text>{{ item.user.name }}</text>
								<image v-if="item.user.sex.code" :src="item.user.sex.code == 1 ? '/static/index/man.png' : '/static/index/female.png'" class="logo"></image>
								<text class="tag" :style="isguan ? 'background: #FEC200;color: #000000;' : ''">{{ isguan ? '官方' : '信誉' + item.user.credit }}</text>
							</view>
							<view @click.stop="moreBtn(item.id, item.user_id)"><u-icon name="more-dot-fill" size="44rpx" color="#B8B8B8"></u-icon></view>
						</view>
						<view>
							<text style="margin-right: 10rpx">{{ $u.timeFrom(item.create_time, false) }}</text>
							<text>{{ item.user.school.school_name + ' ' + item.user.en_year + '级' }}</text>
						</view>
					</view>
				</view>
				<view class="top2_con">
					<u-read-more
						show-height="210"
						:toggle="true"
						close-text="点击查看全文"
						color="#999"
						font-size="24"
						:shadow-style="{ backgroundImage: 'none', paddingTop: '0', marginTop: '20rpx' }"
					>
						<view class="contentBox" @click="toDetail(item.id)">{{ item.content }}</view>
					</u-read-more>
					<view v-if="item.community_posts_imgs">
						<view
							class="imageView"
							v-for="(itemImg, ind) in item.community_posts_imgs"
							:style="item.community_posts_imgs.length == 1 ? 'width:370rpx;height:370rpx' : ''"
							:key="ind"
						>
							<image
								:src="imgBaseUrl + itemImg.path"
								:style="item.community_posts_imgs.length == 1 ? 'width:370rpx;height:370rpx' : 'width:228rpx;height:220rpx'"
								:lazy-load="true"
								@click.stop="showPop(item.community_posts_imgs, ind)"
								mode="aspectFill"
							></image>
						</view>
					</view>
				</view>
				<view class="top2_share">
					<view>
						<button open-type="share" :data-id="item.id" :data-index="index" @click.stop="">
							<image src="/static/message/share.png" style="width: 48rpx; height: 48rpx; margin-right: 6rpx"></image>
							{{ item.share_num }}
						</button>
					</view>
					<view @click.stop="toDetail(item.id)">
						<image src="/static/message/mess.png" style="width: 48rpx; height: 48rpx; margin-right: 6rpx"></image>
						{{ item.comment_num }}
					</view>
					<view @click.stop="like(item.id, index)">
						<image src="/static/message/zan_full.png" v-if="item.is_praise" style="width: 48rpx; height: 48rpx; margin-right: 6rpx"></image>
						<image src="/static/message/zan.png" v-else style="width: 48rpx; height: 48rpx; margin-right: 6rpx"></image>
						{{ item.praise_num }}
					</view>
				</view>
			</view>
			<view style="padding: 20rpx 0;"><u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" @loadmore="loadingMore" /></view>
		</view>

		<!-- 用户 -->
		<view class="top" v-if="active == 2">
			<view class="top2_title" v-for="(item, index) in userList" :key="index" @click.stop="toMinePage(item.id)">
				<view style="position: relative">
					<image :src="item.header ? imgBaseUrl + item.header : '/static/mine/name1.png'" class="head"></image>
					<image
						v-if="item.show_attestation"
						class="is_auth"
						:src="
							item.show_attestation == 1
								? '/static/index/is_auth.png'
								: item.show_attestation == 2
								? '/static/index/is_shop.png'
								: item.show_attestation == 3
								? '/static/index/is_rider.png'
								: ''
						"
					></image>
				</view>
				<view class="top2_title2">
					<view>
						<view class="top2_title2_2">
							<text>{{ item.name }}</text>
							<image v-if="item.sex.code" :src="item.sex.code == 1 ? '/static/index/man.png' : '/static/index/female.png'" class="logo"></image>
							<text class="tag" :style="isguan ? 'background: #FEC200;color: #000000;' : ''">{{ isguan ? '官方' : '信誉' + item.credit }}</text>
						</view>
					</view>
					<view>
						<text>{{ item.school.school_name + ' ' + item.en_year + '级' }}</text>
					</view>
				</view>
			</view>
			<view style="padding: 20rpx 0;"><u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" @loadmore="loadingMore" /></view>
		</view>
		<!-- 社团 -->
		<view class="top_3" v-if="active == 1">
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
			tabList: ['帖子', '社团', '用户'],
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
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			sharePosts({ id: res.target.dataset.id }).then(res1 => {
				if (res1.code == 200) {
					uni.showToast({
						title: res1.message,
						duration: 1500
					});
					this.dataList[res.target.dataset.index].share_num++;
				}
			});
		}
		return {
			title: '动态发布',
			path: '/pages/community/commDetail/commDetail?id=' + res.target.dataset.id,
			imageUrl: '/static/dongtai/share_dt.png'
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
			if (this.active == 0) {
				this.getList();
			} else if (this.active == 1) {
				this.getPhb();
			} else if (this.active == 2) {
				this.getUser();
			}
		},
		loadingMore() {
			if (this.status == 'nomore') return;
			this.status = 'loading';
			this.page = ++this.page;
			if (this.active == 0) {
				this.getList();
			} else if (this.active == 1) {
				this.getPhb();
			} else if (this.active == 2) {
				this.getUser();
			}
		},
		getUser() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			listUser({
				where: {
					name: this.value
				},
				page: this.page,
				limit: 10
			}).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					this.userList = this.userList.concat(res.result.userList);
				} else {
					this.status = 'nomore';
				}
			});
		},
		getList() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			getPostsLists({
				where: {
					posts_auth: this.selText,
					community_club_id: 0,
					content: this.value
				},
				page: this.page,
				limit: 10
			}).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					this.dataList = this.dataList.concat(res.result);
				} else {
					this.status = 'nomore';
				}
			});
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
			if (this.active != 1 && item == '') {
				return false;
			}
			this.value = item;
			this.focus = false;
			this.init();
		},
		onFocus() {
			this.focus = true;
		},
		onSearch() {
			if (this.active != 1 && this.value == '') {
				return false;
			}
			this.searList.unshift(this.value);
			// 数组去重
			this.searList = this.searList.filter(function(ele, index, self) {
				return self.indexOf(ele) === index;
			});
			uni.setStorage({
				key: 'searchHistory',
				data: this.searList,
				success() {}
			});
			this.focus = false;
			this.init();
		},
		changeTab(index) {
			this.active = index;
			this.onSearch();
		},
		delPost(id) {
			uni.showModal({
				title: '提示',
				content: '请确认进行此删除操作',
				success: res => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中...',
							mask: true
						});
						delPosts({ id: id }).then(res => {
							uni.hideLoading();
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
							if (res.code == 200) {
								this.init();
							}
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		moreBtn(id, uid) {
			uni.showActionSheet({
				itemList: this.myId == uid ? ['我要删除'] : ['我要举报'],
				itemColor: this.myId == uid ? '#ff0000' : '#000000',
				success: res => {
					if (this.myId == uid) {
						this.delPost(id);
					} else {
						this.showModal = true;
					}
				},
				fail(res) {}
			});
		},
		showPop(item, index) {
			let imgs = [];
			item.forEach(img => {
				imgs.push(this.imgBaseUrl + img.path);
			});
			uni.previewImage({
				current: index,
				urls: imgs
			});
		},
		toClub(id) {
			uni.navigateTo({
				url: '/pages/community/club/club?id=' + id
			});
		},
		toMinePage(id) {
			uni.navigateTo({
				url: '/pages/community/minePage/minePage?id=' + id
			});
		},
		toDetail(id) {
			uni.navigateTo({
				url: '/pages/community/commDetail/commDetail?id=' + id
			});
		},
		like(id, index) {
			praisePosts({ id: id }).then(res => {
				this.dataList[index].is_praise = !this.dataList[index].is_praise;
				if (res.code == 200) {
					this.dataList[index].praise_num++;
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				} else if (res.code == 1) {
					this.dataList[index].praise_num--;
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				}
			});
		},
		clearSearch(index) {
			if (index == 'all') {
				this.searList = [];
				uni.setStorage({
					key: 'searchHistory',
					data: this.searList,
					success() {}
				});
			} else {
				this.searList.splice(index, 1);
				uni.setStorage({
					key: 'searchHistory',
					data: this.searList,
					success() {}
				});
			}
		}
	},
	onLoad(options) {
		let that = this;
		uni.getStorage({
			key: 'searchHistory',
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
