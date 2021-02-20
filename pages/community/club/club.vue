<template>
	<view class="content" v-if="clubData && clubData.club_name != ''" style="background: #f8fafb; min-height: 100vh">
		<view class="bg" @click="changeBg"><image :src="clubData.bg_img ? imgBaseUrl + clubData.bg_img : '/static/club/bg.png'" mode="aspectFill"></image></view>
		<view
			class="tabBar"
			:style="
				showTab
					? 'background:#FFFFFF;padding-top:' + (navTop + 5) + 'px;height:' + navHeight + 'px;line-height:' + navHeight + 'px'
					: 'padding-top:' + (navTop + 5) + 'px;height:' + navHeight + 'px;line-height:' + navHeight + 'px'
			"
		>
			<u-icon name="arrow-left" size="50rpx" @click="back" :color="!showTab ? '#FFFFFF' : ''" style="margin-right: 30rpx"></u-icon>
			<text v-if="showTab" style="display: inline-block; margin: 0 auto">{{ clubData.club_name }}</text>
		</view>
		<view class="top1" v-if="clubData && clubData.club_name != ''" :style="'margin-top:' + (navHeight + 72) + 'px'">
			<view class="top1_1" @click="toclubDetail">
				<view><image :src="clubData.club_header ? imgBaseUrl + clubData.club_header : '/static/mine/name1.png'" mode="aspectFill"></image></view>
				<view class="sheTitle">
					<view>
						<view>{{ clubData.club_name }}</view>
					</view>
					<view>
						<view>
							<view style="color: #333333">
								<text>帖子 {{ clubData.posts_num }}</text>
								<text style="margin-left: 24rpx">成员 {{ clubData.member_num }}</text>
							</view>
							<view>{{ clubData.school ? clubData.school.school_name : '' }}</view>
						</view>
						<view v-if="!clubData.is_join" class="addshe">加入</view>
					</view>
				</view>
			</view>
			<view class="top1_2">
				<view>公告</view>
				<textarea style="width: 100%" placeholder="暂无公告" auto-height disabled type="text" v-model="clubData.club_notice"></textarea>
			</view>
			<view v-if="!clubData.is_join" style="background: #f8fafb; padding-top: 200rpx"><u-empty text="加入该社团方可查看所有动态" mode="permission"></u-empty></view>
			<view v-if="clubData.is_join" class="top1_3">
				<view v-for="(item, index) in tabList" :key="index" :class="active == item.val ? 'tab tabAct' : 'tab'" @click="changeTab(item.val)">
					<view class="tabview">{{ item.name }}</view>
					<view class="tabDot"></view>
				</view>
			</view>
			<view v-if="clubData.is_join" class="top1_4">
				<view style="border-bottom: 20rpx solid #f8fafb">
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
				</view>
				<view style="background: #f8fafb"><u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" @loadmore="loadingMore" /></view>
			</view>
		</view>
		<view v-if="clubData.is_join" class="addshe1" @click="addComm"><u-icon name="plus" size="60rpx" color="#FFFFFF"></u-icon></view>
		<helang-compress ref="helangCompress"></helang-compress>
	</view>
</template>

<script>
import { getCulbInfo, editClubInfo, getPostsLists, sharePosts, praisePosts, delPosts } from '../../../services/community.js';
import helangCompress from '../../../components/helang-compress/helang-compress';
export default {
	components: {
		helangCompress
	},
	data() {
		return {
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			action: getApp().globalData.imgBaseUrl + '/common/upload/image.html',
			navTop: getApp().globalData.navTop,
			navHeight: getApp().globalData.navHeight,
			tabList: [{ name: '最新', val: 'new' }, { name: '热门', val: 'hot' }],
			active: 'new',
			images: ['/static/mine/name1.png'],
			showTab: false,
			club_id: '',
			clubData: {},
			dataList: [],
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
	onPageScroll(res) {
		if (res.scrollTop >= 100) {
			this.showTab = true;
		} else {
			this.showTab = false;
		}
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
	onPullDownRefresh() {
		this.init();
		uni.stopPullDownRefresh();
	},
	onLoad(options) {
		this.club_id = options.id;
		this.getData();
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
		init() {
			this.page = 1;
			this.dataList = [];
			this.status = 'loadmore';
			this.getData();
			if (this.clubData.is_join) {
				this.getList();
			}
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
		loadingMore() {
			if (this.status == 'nomore') return;
			this.status = 'loading';
			this.page = ++this.page;
			this.getList();
		},
		getList() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			getPostsLists({
				where: {
					community_club_id: this.club_id,
					order: this.active
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
		changeBg() {
			if (!this.clubData.is_join || this.clubData.auth < 1) {
				return false;
			}
			let _this = this;
			uni.showActionSheet({
				itemList: ['更换背景'],
				success(res) {
					_this.changeAvator();
				},
				fail(res) {
					console.log(res.errMsg);
				}
			});
		},
		changeAvator() {
			let that = this;
			uni.chooseImage({
				sizeType: ['compressed'], //可选择原图或压缩后的图片
				sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
				success: res => {
					uni.showLoading({
						title: '检测中...',
						mask: true
					});
					let tempFilePaths = res.tempFilePaths;
					// 单张压缩
					this.$refs.helangCompress
						.compress({
							src: res.tempFilePaths[0]
						})
						.then(async res1 => {
							try {
								await this.$check.checkImg1(0, res1, tempFilePaths);
								uni.showLoading({
									title: '加载中...'
								});
								uni.uploadFile({
									url: that.action,
									filePath: tempFilePaths[0],
									name: 'file',
									header: {
										token: uni.getStorageSync('token')
									},
									success(res) {
										const datas = JSON.parse(res.data);
										if (datas.code == 200) {
											editClubInfo({
												id: that.club_id,
												data: { bg_img: datas.result.src }
											}).then(res => {
												uni.hideLoading();
												if (res.code == 200) {
													that.$set(that.clubData, 'bg_img', datas.result.src);
													that.getData();
												} else {
													uni.showToast({
														title: res.message,
														icon: 'none'
													});
												}
											});
										}
									}
								});
							} catch (e) {}
						})
						.catch(err => {
							uni.showToast({
								title: '上传失败'
							});
						});
				}
			});
		},
		getData() {
			uni.showLoading({
				title: '加载中...'
			});
			getCulbInfo({ id: this.club_id }).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					this.clubData = res.result;
					if (this.clubData.is_join) {
						this.dataList = [];
						this.getList();
					}
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		addComm() {
			uni.redirectTo({
				url: '/pages/community/addComm/addComm?type=2&club_id=' + this.club_id
			});
		},
		toMinePage(id) {
			uni.navigateTo({
				url: '/pages/community/minePage/minePage?id=' + id
			});
		},
		back() {
			uni.navigateBack();
		},
		changeTab(index) {
			this.active = index;
			this.status = 'loadmore';
			this.page = 1;
			this.dataList = [];
			this.getList();
		},
		toDetail(id) {
			uni.navigateTo({
				url: '/pages/community/commDetail/commDetail?id=' + id
			});
		},
		toclubDetail() {
			if (this.clubData.is_join && this.clubData.auth != 0) {
				uni.navigateTo({
					url: '/pages/community/club/clubDetail/clubDetail1?id=' + this.club_id
				});
			} else {
				uni.navigateTo({
					url: '/pages/community/club/clubDetail/clubDetail?id=' + this.club_id
				});
			}
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

.bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 400rpx;
	z-index: 1;
}

.bg image {
	width: 100%;
	height: 100%;
}

.tabBar {
	display: flex;
	align-items: center;
	padding: 30rpx 20rpx 10rpx;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	z-index: 999;
}

.top1 {
	width: 100%;
	z-index: 99;
	position: absolute;
	top: 0;
	left: 0;
	background: #ffffff;
	border-radius: 20px 20px 0px 0px;
	border-bottom: 20rpx solid #f8fafb;
}

.top1_1 {
	padding: 24rpx;
	display: flex;
	align-items: center;
}

.top1_1 image {
	width: 132rpx;
	height: 132rpx;
	border-radius: 50%;
	margin-right: 24rpx;
}

.sheTitle {
	flex: 1;
	font-size: 24rpx;
	color: rgba(51, 51, 51, 0.4);
}

.sheTitle > view {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.sheTitle > view:nth-of-type(1) {
	font-size: 32rpx;
	color: #333333;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.addshe {
	width: 124rpx;
	height: 60rpx;
	text-align: center;
	line-height: 60rpx;
	background: #0091ff;
	border-radius: 15px;
	color: #ffffff;
}

.top1_2 {
	display: flex;
	margin: 24rpx;
	padding: 24rpx;
	font-size: 24rpx;
	background: #f8fafb;
	border-radius: 8px;
	align-items: center;
}

.top1_2 > view:nth-of-type(1) {
	width: 80rpx;
}

.top1_2 > view:nth-of-type(2) {
	flex: 1;
	color: rgba(51, 51, 51, 0.4);
	margin-left: 24rpx;
	/* text-align: justify; */
}

/* tab */
.top1_3 {
	display: flex;
	align-items: center;
	padding: 36rpx 36rpx;
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

/* 内容 */
.top2_list {
	padding: 40rpx 24rpx;
	background: #ffffff;
	border-bottom: 20rpx solid #f8fafb;
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

/* 添加按钮 */
.addshe1 {
	width: 108rpx;
	height: 108rpx;
	position: fixed;
	bottom: 100rpx;
	right: 40rpx;
	z-index: 999999;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: #419fff;
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
	padding: 0;
}
</style>
