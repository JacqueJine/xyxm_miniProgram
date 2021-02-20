<template>
	<view class="content" v-if="selectList" style="background: #f8fafb; min-height: 100vh">
		<view class="tabBar" :style="'padding-top:' + (navTop + 5) + 'px;height:' + navHeight + 'px'">
			<view class="tabBar_n">
				<u-icon name="search" size="50rpx" @click="onSearch" class="uicon"></u-icon>
				<view class="tabBar_t">
					<view v-for="(item, index) in tabList" :key="index" :class="posts_auth == index ? 'tab tabAct' : 'tab'" @click="changeTab(index)">
						<view>{{ item }}</view>
						<view class="tabDot"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- <u-sticky :offset-top="0"> -->
		<view class="navTab" :style="'margin-top:' + navHeight + 'px'">
			<view class="tabLeft">
				<view :class="pageType == 0 ? 'tab Act2' : 'tab'"><view class="tabview" @click="changeTab2(0)">全部</view></view>
				<view :class="pageType == 1 ? 'tab Act2' : 'tab'">
					<view class="tabview" @click="changeTab2(1)">
						<view>{{ actType.label }}</view>
						<u-icon name="arrow-down" size="16rpx"></u-icon>
					</view>
				</view>
				<view :class="pageType == 2 ? 'tab Act2' : 'tab'"><view class="tabview" @click="changeTab2(2)">社团</view></view>
			</view>
			<view class="tabRight">
				<image src="/static/dongtai/phb.png" mode="scaleToFill" @click="changeTab2(3)" style="width: 44rpx; height: 44rpx"></image>
				<u-icon name="list-dot" size="50rpx" @click="clubBtn"></u-icon>
			</view>
		</view>
		<!-- </u-sticky> -->
		<!-- 社团 -->
		<view class="top1" v-if="pageType == 2">
			<view style="margin-bottom: 30rpx;border-top: 16rpx solid #f7f7f7;">
				<view v-for="(item, index) in clubList" :key="index" class="top3_list">
					<view class="top3_list1" @click="toClub(item.id)">
						<view><image :src="item.club_header ? imgBaseUrl + item.club_header : '/static/mine/name1.png'"></image></view>
						<view class="top3_text">
							<view>
								<view>{{ item.club_name }}</view>
								<image
									v-if="item.auth == 1"
									src="/static/club/sz1.png"
									style="
                    border-radius: 0;
                    width: 52rpx;
                    height: 28rpx;
                    margin-left: 20rpx;
                  "
								></image>
								<image v-if="item.auth == 2" src="/static/club/gly.png" style="width: 50rpx; height: 30rpx; margin-left: 20rpx"></image>
							</view>
							<view>[{{ item.unread_num }}条未读] {{ item.unread_num ? item.unread_post_count : '' }}</view>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" @loadmore="loadingMore" />
		</view>
		<!-- 排行榜 -->
		<view class="top1" v-if="pageType == 3">
			<view class="phbImg">社团排行榜</view>
			<view style="padding-bottom: 180rpx">
				<view class="top1_list" v-for="(item, index) in phbList" :key="index" @click="toClub(item.id)">
					<view>
						<image
							:src="index == 0 ? '/static/index/comm2.png' : index == 1 ? '/static/index/comm3.png' : index == 2 ? '/static/index/comm4.png' : ''"
							v-if="index < 3"
						></image>
						<text v-else>{{ index * 1 + 1 }}</text>
					</view>
					<view class="top1_list_2">
						<view><image :src="item.club_header ? imgBaseUrl + item.club_header : '/static/mine/name1.png'"></image></view>
						<view>
							<view>{{ item.club_name }}</view>
							<view>{{ item.member_num }} 名成员</view>
						</view>
						<view>{{ item.is_join ? '查看' : '加入' }}</view>
					</view>
				</view>
				<view v-if="my.id" class="top1_list teshu" @click="toClub(my.id)">
					<view>
						<image
							:src="my.rank == 1 ? '/static/index/comm2.png' : my.rank == 2 ? '/static/index/comm3.png' : my.rank == 3 ? '/static/index/comm4.png' : ''"
							v-if="my.rank < 4"
						></image>
						<text v-else>{{ my.rank }}</text>
					</view>
					<view class="top1_list_2">
						<view><image :src="my.club_header ? imgBaseUrl + my.club_header : '/static/mine/name1.png'"></image></view>
						<view>
							<view>{{ my.club_name }}</view>
							<view>{{ my.member_num }} 名成员</view>
						</view>
						<view><u-icon name="arrow-right"></u-icon></view>
					</view>
				</view>
			</view>
		</view>
		<view class="top2" v-if="pageType != 2 && pageType != 3">
			<view style="margin-bottom: 20rpx">
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
						<view v-if="item.community_posts_imgs" style="margin-top: 16rpx;">
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
			</view>
			<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" @loadmore="loadingMore" />
		</view>
		<Popup v-if="showModal" :id="'22'" :type="2" @isShowModal="isShowModal"></Popup>
		<view v-if="pageType != 2 && pageType != 3" class="addshe1" @click="addComm"><u-icon name="plus" size="60rpx" color="#FFFFFF"></u-icon></view>
		<u-select v-model="showSelect" :list="selectList" value-name="id" label-name="class_name" @confirm="selectConfirm"></u-select>
	</view>
</template>

<script>
import { getCommunityClassify, getPostsLists, sharePosts, praisePosts, getClubLists, getMyClub, delPosts } from '../../../services/community.js';
import { getUnreadOrEmpty } from '../../../services/message.js';
import Popup from '@/components/popup/popup.vue';
export default {
	data() {
		return {
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			value: '',
			showSelect: false,
			showModal: false,
			posts_auth: 0,
			pageType: 0,
			actType: {
				label: '',
				value: ''
			},
			myId: null,
			navTop: getApp().globalData.navTop,
			navHeight: getApp().globalData.navHeight,
			tabList: ['推荐', '本校'],
			selectList: [],
			dataList: [],
			clubList: [],
			phbList: [],
			images: ['/static/mine/name1.png'],
			isguan: false,
			page: 1,
			tabbarList: [],
			tabbarNum: 0,
			my: {},
			status: 'loadmore',
			iconType: 'flower',
			loadText: {
				loadmore: '上拉或点击',
				loading: '努力加载中',
				nomore: '实在没有了'
			}
		};
	},
	components: {
		Popup
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			uni.setStorage({
				key: 'isRefresh',
				data: false,
				success: res => {}
			});
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
	onLoad() {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		getCommunityClassify({}).then(res => {
			if (res.code == 200) {
				this.selectList = res.result;
				this.actType.value = res.result[0].id;
				this.actType.label = res.result[0].class_name;
			}
		});
		// this.init();
		uni.setStorage({
			key: 'isRefresh',
			data: true,
			success: res => {}
		});
	},
	onShow() {
		uni.getStorage({
			key: 'user',
			success: res => {
				this.myId = JSON.parse(res.data).id;
			}
		});
		uni.getStorage({
			key: 'isRefresh',
			success: res => {
				if (res.data) {
					this.init();
				} else {
					uni.setStorage({
						key: 'isRefresh',
						data: true,
						success: res => {}
					});
				}
			}
		});
		// 是否有新消息
		if (uni.getStorageSync('token')) {
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
		}
	},
	onPullDownRefresh() {
		this.init();
		uni.stopPullDownRefresh();
	},
	onReachBottom() {
		this.loadingMore();
	},
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
				this.init();
				this.tabbarList = [];
			}
		}
	},
	methods: {
		isShowModal(params) {
			this.showModal = params;
		},
		getClub() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			getMyClub({
				where: { club_auth: this.posts_auth },
				page: this.page,
				limit: 20
			}).then(res => {
				if (res.code == 200) {
					if (res.result.list.length) {
						this.clubList = this.clubList.concat(res.result.list);
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
		getPhb() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			this.my = {};
			getClubLists({
				where: { club_auth: this.posts_auth },
				page: 1,
				limit: 100
			}).then(res => {
				if (res.code == 200) {
					if (res.result.list.length) {
						this.phbList = this.phbList.concat(res.result.list);
						this.phbList.forEach((item, index) => {
							if (item.user_id == this.myId) {
								this.my = item;
								this.my.rank = index * 1 + 1;
							}
						});
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
		loadingMore() {
			if (this.status == 'nomore') return;
			this.status = 'loading';
			this.page = ++this.page;
			if (this.pageType != 2 && this.pageType != 3) {
				this.getList();
			} else if (this.pageType == 2) {
				this.getClub();
			} else if (this.pageType == 3) {
				// this.getPhb();
			}
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
		init() {
			this.status = 'loadmore';
			this.page = 1;
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			if (this.pageType != 2 && this.pageType != 3) {
				this.dataList = [];
				let community_classify_id = this.pageType ? this.actType.value : '';
				getPostsLists({
					where: {
						posts_auth: this.posts_auth,
						community_classify_id: community_classify_id,
						community_club_id: 0
					},
					page: this.page,
					limit: 10
				}).then(res => {
					if (res.code == 200) {
						this.dataList = this.dataList.concat(res.result);
					} else {
						this.status = 'nomore';
					}
					uni.hideLoading();
				});
			} else if (this.pageType == 2) {
				this.clubList = [];
				getMyClub({
					where: { club_auth: this.posts_auth },
					page: this.page,
					limit: 20
				}).then(res => {
					if (res.code == 200) {
						if (res.result.list.length) {
							this.clubList = this.clubList.concat(res.result.list);
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
			} else if (this.pageType == 3) {
				this.phbList = [];
				this.my = {};
				getClubLists({
					where: { club_auth: this.posts_auth },
					page: 1,
					limit: 100
				}).then(res => {
					if (res.code == 200) {
						if (res.result.list.length) {
							this.phbList = this.phbList.concat(res.result.list);
							this.phbList.forEach((item, index) => {
								if (item.user_id == this.myId) {
									this.my = item;
									this.my.rank = index * 1 + 1;
								}
							});
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
			}
		},
		getList() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			let community_classify_id = this.pageType ? this.actType.value : '';
			getPostsLists({
				where: {
					posts_auth: this.posts_auth,
					community_classify_id: community_classify_id,
					community_club_id: 0
				},
				page: this.page,
				limit: 10
			}).then(res => {
				if (res.code == 200) {
					this.dataList = this.dataList.concat(res.result);
				} else {
					this.status = 'nomore';
				}
				uni.hideLoading();
			});
		},
		selectConfirm(e) {
			this.actType = e[0];
			this.page = 1;
			this.dataList = [];
			this.getList();
		},
		changeTab(index) {
			this.posts_auth = index;
			this.status = 'loadmore';
			this.page = 1;
			if (this.pageType != 2 && this.pageType != 3) {
				this.dataList = [];
				this.getList();
			} else if (this.pageType == 2) {
				this.clubList = [];
				this.getClub();
			} else if (this.pageType == 3) {
				this.phbList = [];
				this.getPhb();
			}
		},
		changeTab2(index) {
			if (index == 1 && this.pageType == 1) {
				this.showSelect = true;
			} else if (index != 2 && index != 3) {
				this.pageType = index;
				this.status = 'loadmore';
				this.page = 1;
				this.dataList = [];
				this.getList();
			} else if (index == 2) {
				this.pageType = index;
				this.status = 'loadmore';
				this.page = 1;
				this.clubList = [];
				this.getClub();
			} else if (index == 3) {
				this.pageType = index;
				this.status = 'loadmore';
				this.page = 1;
				this.phbList = [];
				this.getPhb();
			}
		},
		clubBtn() {
			let _this = this;
			uni.showActionSheet({
				itemList: ['加入社团', '创建社团'],
				success(res) {
					if (res.tapIndex) {
						_this.addClub();
					} else {
						uni.navigateTo({
							url: '/pages/community/searchClub/searchClub'
						});
					}
				},
				fail(res) {
					console.log(res.errMsg);
				}
			});
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
			uni.setStorage({
				key: 'isRefresh',
				data: false,
				success: res => {}
			});
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
		onSearch() {
			uni.navigateTo({
				url: '/pages/community/commSearch/commSearch'
			});
		},
		back() {
			uni.navigateBack();
		},
		addClub() {
			uni.navigateTo({
				url: '/pages/community/club/addClub/addClub'
			});
		},
		addComm() {
			uni.navigateTo({
				url: '/pages/community/addComm/addComm?type=1'
			});
		},
		toDetail(id) {
			uni.navigateTo({
				url: '/pages/community/commDetail/commDetail?id=' + id
			});
		}
	}
};
</script>

<style scoped>
.content {
	box-sizing: border-box;
	overflow: hidden;
	background: #f8fafb;
}

.tabBar {
	background: #ffffff;
	padding: 30rpx 24rpx 30rpx;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	z-index: 999;
}

.navTab1 {
	background: #ffffff;
	display: flex;
	align-items: center;
	padding: 20rpx 24rpx 20rpx;
	justify-content: space-between;
}

.navTab1 > view:nth-of-type(1) {
	font-size: 28rpx;
	width: 138rpx;
	height: 56rpx;
	color: #ffffff;
	background: linear-gradient(270deg, #0091ff 0%, #00b3ff 100%);
	border-radius: 14px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 22rpx;
}

.navTab1 > view:nth-of-type(1) image {
	width: 32rpx;
	height: 32rpx;
	margin-right: 10rpx;
}

.navTab {
	background: #ffffff;
	display: flex;
	align-items: center;
	padding: 40rpx 24rpx 20rpx 36rpx;
	justify-content: space-between;
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

.Act2 {
	color: #0095ff;
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
.top2 {
	padding-bottom: 30rpx;
}
/* 最新 */
.top2_list {
	padding: 40rpx 24rpx;
	margin-bottom: 20rpx;
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

.contentBox {
	/* margin: 30rpx 0; */
}

.top2_con .imageView {
	width: 228rpx;
	height: 220rpx;
	margin: 0 8rpx 8rpx 0;
	display: inline-block;
}

.top2_con .imageView image {
	border-radius: 4px;
}

.top2_con .imageView:nth-of-type(3n) {
	margin: 0 0 8rpx 0;
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
.navTab2 {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10rpx 24rpx 30rpx;
	background: #ffffff;
}

.navTab2 > view:nth-of-type(1) {
	display: flex;
	align-items: center;
}

.navTab2 > view:nth-of-type(1) > view {
	font-size: 26rpx;
	color: #0091ff;
	background: #e5f4ff;
	border-radius: 14px;
	padding: 8rpx 34rpx;
	margin-right: 24rpx;
}

.navTab2 > view:nth-of-type(1) .act1 {
	color: #ffffff;
	background: #0091ff;
}

.navTab2 > view:nth-of-type(2) {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 12rpx 30rpx;
	background: #e5f4ff;
	border-radius: 14px;
	color: #0091ff;
}

.top1_list {
	display: flex;
	align-items: center;
	margin-top: 24rpx;
	padding: 0 24rpx 0 0;
	background: #ffffff;
}

.top1_list > view:nth-of-type(1) {
	width: 90rpx;
	text-align: center;
	/* padding-right: 24rpx; */
	font-size: 32rpx;
	font-weight: bold;
}

.top1_list > view:nth-of-type(1) image {
	width: 42rpx;
	height: 56rpx;
}

.top1_list_2 {
	flex: 1;
	display: flex;
	padding: 24rpx;
	border-radius: 8px;
	/* border: 1px solid #f4f4f4; */
	align-items: center;
}

.top1_list_2 image {
	width: 96rpx;
	height: 96rpx;
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

.top3_list {
	/* padding: 40rpx 24rpx; */
	border-top: 2rpx solid #f7f7f7;
	background: #fff;
}

.addClub {
	padding: 32rpx 0;
	text-align: center;
	color: #0091ff;
	font-size: 28rpx;
	border-radius: 8px;
	border: 1px solid #0091ff;
}

.top3_list1 {
	width: 100%;
	margin-top: 28rpx;
	display: flex;
	border-bottom: 1px solid #f4f4f4;
	padding: 24rpx;
}
.top3_list1:first-child {
	margin-top: 0;
}
.top3_list1 > view:first-child {
	width: 80rpx;
	height: 80rpx;
	margin-right: 20rpx;
}
.top3_list1 image {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}
.top3_text {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
.top3_text > view:first-child {
	display: flex;
	align-items: center;
	align-content: center;
	font-size: 32rpx;
	font-weight: bold;
}
.top3_text view:last-child {
	font-size: 24rpx;
	color: rgba(51, 51, 51, 0.4);
	/* word-break: break-all;
  white-space: pre-wrap; */
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
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

.teshu {
	position: fixed;
	z-index: 10;
	bottom: 0;
	left: 0;
	width: 100%;
	background: #fff0c0;
}

.teshu .top1_list_2 > view:nth-of-type(3) {
	background: #fff0c0;
}

button {
	background: transparent;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	padding-left: 0;
	padding-right: 0;
}
.tabBar_n {
	position: relative;
	display: flex;
	justify-content: center;
}
.tabBar_t {
	display: flex;
	align-items: center;
}
.uicon {
	position: absolute;
	left: 0;
	top: 8rpx;
}
.tabRight {
	display: flex;
}
.tabRight image {
	margin-right: 40rpx;
}
.tabview {
	display: flex;
}
.tabview view:first-child {
	margin-right: 10rpx;
}
/* 添加按钮 */
.addshe1 {
	width: 108rpx;
	height: 108rpx;
	position: fixed;
	bottom: 75rpx;
	right: 40rpx;
	z-index: 99;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: #419fff;
}
.club_s {
	display: flex;
	justify-content: center;
	padding: 20rpx;
}
.club_s > view:last-child {
	margin-left: 10rpx;
}
.club_s:last-child {
	border-top: 1rpx solid #ccc;
}
.phbImg {
	width: 100%;
	height: 144rpx;
	font-size: 40rpx;
	text-align: center;
	padding-top: 24rpx;
	color: #533d15;
	background: url(../../../static/dongtai/stphb.png) 100% 100%;
	background-size: cover;
	box-sizing: border-box;
	font-weight: 600;
}
</style>
