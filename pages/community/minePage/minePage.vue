<template>
	<view class="content">
		<view class="con1" v-if="name != ''">
			<view class="top2_title">
				<view style="position: relative">
					<image :src="header != '' ? imgBaseUrl + header : '/static/mine/name1.png'" class="head"></image>
					<image
						v-if="show_attestation"
						class="is_auth"
						:src="
							show_attestation == 1
								? '/static/index/is_auth.png'
								: show_attestation == 2
								? '/static/index/is_shop.png'
								: show_attestation == 3
								? '/static/index/is_rider.png'
								: ''
						"
					></image>
				</view>
				<view class="top2_title2">
					<view>
						<text>{{ name }}</text>
						<image v-if="sexCode" :src="sexCode == 1 ? '/static/index/man.png' : '/static/index/female.png'" class="logo"></image>
						<text class="tag1" :style="isguan ? 'background: #FEC200;color: #000000;' : ''">{{ isguan ? '官方' : '信誉' + credit }}</text>
					</view>
					<view>
						<text>{{ school.school_name +' '+ en_year }}级</text>
					</view>
					<view>获赞 {{praise_count}}</view>
				</view>
			</view>
		</view>
		<view class="bg">
			<view class="top">
				<view class="navTab">
					<view v-for="(item, index) in tabList" :key="index" :class="active == index ? 'tab tabAct' : 'tab'" @click="changeTab(index)">
						<view class="tabview">{{ item }}</view>
						<view class="tabDot"></view>
					</view>
				</view>
				<!-- 帖子 -->
				<view class="top2" v-if="active == 0">
					<view>
						<view v-for="(item, index) in dataList" :key="index" class="top2_list">
							<view class="top2_title">
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
											<image
												v-if="item.user.sex.code"
												:src="item.user.sex.code == 1 ? '/static/index/man.png' : '/static/index/female.png'"
												class="logo"
											></image>
											<text class="tag" :style="isguan ? 'background: #FEC200;color: #000000;' : ''">{{ isguan ? '官方' : '信誉' + item.user.credit }}</text>
										</view>
										<view @click.stop="moreBtn(item.id,item.user_id)"><u-icon name="more-dot-fill" size="44rpx" color="#B8B8B8"></u-icon></view>
									</view>
									<view>
										<text style="margin-right: 10rpx">{{ $u.timeFrom(item.create_time, false) }}</text>
										<text>{{ item.user.school.school_name +' '+ item.user.en_year + '级' }}</text>
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
										<image src="/static/message/share.png" style="width:48rpx;height: 48rpx;margin-right: 6rpx"></image>
										{{ item.share_num }}
									</button>
								</view>
								<view @click.stop="toDetail(item.id)">
									<image src="/static/message/mess.png" style="width:48rpx;height: 48rpx;margin-right: 6rpx"></image>
									{{ item.comment_num }}
								</view>
								<view @click.stop="like(item.id, index)">
									<image src="/static/message/zan_full.png" v-if="item.is_praise" style="width:48rpx;height: 48rpx;margin-right: 6rpx"></image>
									<image src="/static/message/zan.png" v-else style="width:48rpx;height: 48rpx;margin-right: 6rpx"></image>
									{{ item.praise_num }}
								</view>
							</view>
						</view>
					</view>
					<view style="background: #f8fafb;padding: 20rpx 0;"><u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" @loadmore="loadingMore" /></view>
				</view>
				<!-- 社团 -->
				<view class="top_3" v-if="active == 1">
					<view class="top1_list_2" v-for="(item, index) in clubList" :key="index">
						<view><image :src="item.club_header ? imgBaseUrl + item.club_header : '/static/mine/name1.png'"></image></view>
						<view>
							<view>{{ item.club_name }}</view>
							<view>{{ item.member_num }} 名成员</view>
						</view>
						<view v-if="mySchoolId == item.school_id" @click="toClub(item.id)">{{ item.is_join ? '查看' : '加入' }}</view>
					</view>
					<view style="padding: 20rpx 0;"><u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" @loadmore="loadingMore" /></view>
				</view>
				<!-- 任务 -->
				<view class="top_4" v-if="active == 2">
					<Expressage @toExpressDetail="toExpressDetail" :curHelpInfo="expressInfo"></Expressage>
					<view style="padding: 20rpx 0;"><u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" @loadmore="loadingMore" /></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getPostsLists, sharePosts, praisePosts, getMyClub , delPosts } from '../../../services/community.js';
import { findUserInfo } from '../../../services/mine.js';
import { taskList } from '../../../services/function.js';
import Expressage from '@/components/perFunctionInfo/expressage/expressage.vue';
// import Invitation from '@/components/perFunctionInfo/invitation/invitation.vue';
export default {
	data() {
		return {
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			action: getApp().globalData.imgBaseUrl + '/common/upload/image.html',
			navHeight: getApp().globalData.navHeight,
			tabList: ['帖子', '社团', '任务'],
			active: 0,
			images: ['/static/mine/name1.png'],
			isguan: false,
			expressInfo: [],
			dataList: [],
			clubList: [],
			uid: '',
			header: '',
			show_attestation: 0,
			name: '',
			sexCode: 0,
			credit: 0,
			en_year: 0,
			praise_count: 0,
			mySchoolId: '',
			myId: null,
			school: {},
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
	components: {
		Expressage
		// Invitation
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
	onReachBottom() {
		this.loadingMore();
	},
	onLoad(options) {
		this.uid = options.id;
		this.getData();
		this.getList();
	},
	onShow() {
		uni.getStorage({
			key: 'user',
			success: res => {
				this.mySchoolId = JSON.parse(res.data).school_id;
				this.myId = JSON.parse(res.data).id;
			}
		});
	},
	methods: {
		delPost(id){
			uni.showModal({
				title: '提示',
				content: '请确认进行此删除操作',
				success: res => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中...',
							mask: true
						})
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
					if(this.myId == uid){
						this.delPost(id)
					}else{
						this.showModal = true;
					}
				},
				fail(res) {
				}
			});
		},
		init(){
			this.getData();
			this.page = 1;
			this.status = 'loadmore';
			if (this.active == 0) {
				this.dataList = [];
				this.getList();
			} else if (this.active == 1) {
				this.clubList = [];
				this.getClub();
			} else if (this.active == 2) {
				this.expressInfo = [];
				this.getTask();
			}
		},
		changeTab(index) {
			this.active = index;
			this.status = 'loadmore';
			this.page = 1;
			if (this.active == 0) {
				this.dataList = [];
				this.getList();
			} else if (this.active == 1) {
				this.clubList = [];
				this.getClub();
			} else if (this.active == 2) {
				this.expressInfo = [];
				this.getTask();
			}
		},
		getTask() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			taskList({ where: { task_state_or: [0, 1, 2, 4], user_id: this.uid }, page: this.page, limit: 10 }).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					this.expressInfo = this.expressInfo.concat(res.result.data);
				} else {
					this.status = 'nomore';
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		getClub() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			getMyClub({ where: { club_auth: [0, 1], user_id: this.uid }, page: this.page, limit: 20 }).then(res => {
				uni.hideLoading();
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
			});
		},
		loadingMore() {
			if (this.status == 'nomore') return;
			this.status = 'loading';
			this.page = ++this.page;
			if (this.active == 0) {
				this.getList();
			} else if (this.active == 1) {
				this.getClub();
			} else if (this.active == 2) {
				this.getTask();
			}
		},
		getList() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			getPostsLists({
				where: {
					user_id: this.uid,
					community_club_id: 0
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
		getData() {
			findUserInfo({ uid: this.uid }).then(res => {
				if (res.code == 200) {
					this.header = res.result.header;
					this.show_attestation = res.result.show_attestation;
					this.name = res.result.name;
					this.credit = res.result.credit;
					this.en_year = res.result.en_year;
					this.sexCode = res.result.sex.code;
					this.school = res.result.school;
					this.praise_count = res.result.praise_count;
				}
			});
		},
		toExpressDetail(params) {
			uni.navigateTo({
				url: '/pages/task/taskList/taskDetail/taskDetail?id=' + params
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
				if (res.code==200) {
					this.dataList[index].praise_num++;
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				} else if(res.code==1) {
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
		toClub(id) {
			uni.navigateTo({
				url: '/pages/community/club/club?id=' + id
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
/* 第一部分 */
.con1 {
	background: #fec200;
	padding: 40rpx;
}

.con1 .top2_title {
	display: flex;
	align-items: flex-start;
}

.con1 .top2_title .head {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.con1 .top2_title .logo {
	width: 28rpx;
	height: 28rpx;
	margin-left: 12rpx;
}

.con1 .top2_title2 > view:nth-of-type(1) .tag1 {
	font-size: 20rpx;
	padding: 0 6rpx;
	background: #e5f4ff;
	color: #0091ff;
	margin-left: 18rpx;
	border-radius: 2px;
	font-weight: normal;
}

.con1 .top2_title2 > view:nth-of-type(1) {
	font-size: 34rpx;
	font-weight: bold;
	margin-bottom: 18rpx;
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.con1 .top2_title2 > view:nth-of-type(2) text {
	display: inline-block;
	font-size: 20rpx;
	color: #fec200;
	background: #333333;
	border-radius: 9px;
	margin-bottom: 18rpx;
	padding: 4rpx 12rpx;
}

.con1 .top2_title2 > view:nth-of-type(3) {
	font-size: 24rpx;
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

/*  */
.bg {
	background: #fec200;
}

.top {
	background: #ffffff;
	border-radius: 20px 20px 0px 0px;
}

.navTab {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx 28rpx 36rpx;
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

.top_4 {
	padding: 0 24rpx 24rpx;
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
button {
	background: transparent;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	padding: 0;
}
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
.is_auth {
	position: absolute;
	bottom: 5rpx;
	right: 20rpx;
	width: 32rpx;
	height: 32rpx;
	z-index: 10;
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
</style>
