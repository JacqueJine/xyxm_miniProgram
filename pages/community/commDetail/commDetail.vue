<template>
	<view class="content" v-if="content !== ''">
		<view class="top2_list">
			<view class="top2_title">
				<view style="position: relative" @click="toMinePage(user.id)">
					<image :src="user.header ? imgBaseUrl + user.header : '/static/mine/name1.png'" class="head"></image>
					<image
						v-if="user.show_attestation"
						class="is_auth"
						:src="
							user.show_attestation == 1
								? '/static/index/is_auth.png'
								: user.show_attestation == 2
								? '/static/index/is_shop.png'
								: user.show_attestation == 3
								? '/static/index/is_rider.png'
								: ''
						"
					></image>
				</view>
				<view class="top2_title2">
					<view>
						<view class="top2_title2_2">
							<text>{{ user.name }}</text>
							<image v-if="user.sex.code" :src="user.sex.code == 1 ? '/static/index/man.png' : '/static/index/female.png'" class="logo"></image>
							<text class="tag" :style="isguan ? 'background: #FEC200;color: #000000;' : ''">{{ isguan ? '官方' : '信誉' + user.credit }}</text>
						</view>
						<view><u-icon name="more-dot-fill" size="48rpx" color="#B8B8B8" @click.stop="moreBtn(id, user.id, 1)"></u-icon></view>
					</view>
					<view>
						<text style="margin-right: 10rpx">{{ $u.timeFrom(create_time, false) }}</text>
						<text>{{ user.school.school_name+' '+user.en_year + '级' }}</text>
					</view>
				</view>
			</view>
			<view class="top2_con">
				<view class="contentBox">{{ content }}</view>
				<view v-if="images">
					<view class="imageView" v-for="(item, index) in images" :style="images.length == 1 ? 'width:370rpx;height:370rpx' : 'width:228rpx;height:220rpx'" :key="index">
						<image
							:src="imgBaseUrl + item.path"
							:style="images.length == 1 ? 'width:370rpx;height:370rpx' : 'width:228rpx;height:220rpx'"
							:lazy-load="true"
							mode="aspectFill"
							@click.stop="showPop(images, index)"
						></image>
					</view>
				</view>
				<view class="dzfx">
					<view class="fen">
						<image src="/static/message/star.png"></image>
						<view>{{ community_classify ? community_classify.class_name : '社团动态' }}</view>
					</view>
					<view>
						<view @click.stop="like()" style="display: flex;align-items: center;margin-right: 40rpx;">
							<image src="/static/message/zan_full.png" v-if="is_praise" style="width:48rpx;height: 48rpx"></image>
							<image src="/static/message/zan.png" v-else style="width:48rpx;height: 48rpx"></image>
							<text>{{ praise_num ? praise_num : '' }}</text>
						</view>
						<button open-type="share"><u-icon name="weixin-circle-fill" size="48rpx" color="#2AC969"></u-icon></button>
					</view>
				</view>
			</view>
		</view>
		<!-- 评论 -->
		<view class="top3">
			<view class="listBox">
				<view v-for="(val, i) in community_comment" :key="i" class="top2_list">
					<view class="top2_title">
						<view style="position: relative" @click="toMinePage(val.user_id)">
							<image :src="val.user.header ? imgBaseUrl + val.user.header : '/static/mine/name1.png'" class="head"></image>
							<image
								v-if="val.user.show_attestation"
								class="is_auth"
								:src="
									val.user.show_attestation == 1
										? '/static/index/is_auth.png'
										: val.user.show_attestation == 2
										? '/static/index/is_shop.png'
										: val.user.show_attestation == 3
										? '/static/index/is_rider.png'
										: ''
								"
							></image>
						</view>
						<view class="top2_title2">
							<view>
								<view class="top2_title2_2">
									<text>{{ val.user.name }}</text>
									<image v-if="val.user.sex.code" :src="val.user.sex.code == 1 ? '/static/index/man.png' : '/static/index/female.png'" class="logo"></image>
									<text class="tag" :style="isguan ? 'background: #FEC200;color: #000000;' : ''">{{ isguan ? '官方' : '信誉' + val.user.credit }}</text>
									<text v-if="val.user_id == uid" class="tag" style="background: #0091ff; color: #ffffff">楼主</text>
								</view>
								<view><u-icon name="more-dot-fill" size="48rpx" color="#B8B8B8" @click.stop="moreBtn(val.id, val.user_id, 0)"></u-icon></view>
							</view>
							<view>
								<text style="margin-right: 10rpx">{{ $u.timeFrom(val.create_time, false) }}</text>
								<text>{{ val.user.school.school_name +' '+ val.user.en_year + '级' }}</text>
							</view>
						</view>
					</view>
					<view class="top2_con">
						<view class="contentBox" style="padding-left: 100rpx;">{{ val.content }}</view>
						<view v-if="val.community_posts_comment_imgs" style="padding: 0 100rpx;">
							<view
								v-for="(itemImg, ind) in val.community_posts_comment_imgs"
								class="imageView"
								:style="val.community_posts_comment_imgs.length == 1 ? 'width:200rpx;height:200rpx' : ''"
								:key="ind"
							>
								<image
									:src="imgBaseUrl + itemImg.path"
									:style="val.community_posts_comment_imgs.length == 1 ? 'width:200rpx;height:200rpx' : 'width:160rpx;height:160rpx'"
									:lazy-load="true"
									@click.stop="showPop(val.community_posts_comment_imgs, ind)"
									mode="aspectFill"
								></image>
							</view>
						</view>
					</view>
					<view class="top3_share">
						<view v-if="val.comment_num">
							<text @click="showhf(val.id, val.user.name)">{{ val.comment_num }}条回复</text>
						</view>
						<view v-else><text @click="showWrite(val.id, val.user.name)">回复</text></view>
						<view style="display: flex;align-items: center;">
							<image
								@click.stop="likeComment(val.id, i, 1)"
								src="/static/message/zan_full.png"
								v-if="val.is_praise"
								style="width:48rpx;height: 48rpx;margin-right: 6rpx"
							></image>
							<image @click.stop="likeComment(val.id, i, 1)" src="/static/message/zan.png" v-else style="width:48rpx;height: 48rpx;margin-right: 6rpx"></image>
							<text style="margin-right: 20rpx">{{ val.praise_num ? val.praise_num : '' }}</text>
							<image @click="showWrite(val.id, val.user.name)" src="/static/message/mess.png" style="width:48rpx;height: 48rpx;margin-right: 6rpx"></image>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" @loadmore="loadingMore" />
		</view>
		<view class="foot"><view @click="showWrite(0)">我也说两句…</view></view>
		<!-- 回复详情 -->
		<u-popup v-model="showReply" mode="bottom" border-radius="20" @close="init()">
			<view class="reply">
				<view>
					<text @click="showReply = !showReply" class="close">关闭</text>
					回复详情
				</view>
				<scroll-view :scroll-y="true" class="scrollY top3" @scrolltolower="loadMore">
					<view v-for="(val, i) in comment_other" :key="i" class="top2_list">
						<view class="top2_title">
							<view style="position: relative" @click="toMinePage(val.user_id)">
								<image :src="val.user.header ? imgBaseUrl + val.user.header : '/static/mine/name1.png'" class="head"></image>
								<image
									v-if="val.user.show_attestation"
									class="is_auth"
									:src="
										val.user.show_attestation == 1
											? '/static/index/is_auth.png'
											: val.user.show_attestation == 2
											? '/static/index/is_shop.png'
											: val.user.show_attestation == 3
											? '/static/index/is_rider.png'
											: ''
									"
								></image>
							</view>
							<view class="top2_title2">
								<view>
									<view class="top2_title2_2">
										<text>{{ val.user.name }}</text>
										<image v-if="val.user.sex.code" :src="val.user.sex.code == 1 ? '/static/index/man.png' : '/static/index/female.png'" class="logo"></image>
										<text class="tag" :style="isguan ? 'background: #FEC200;color: #000000;' : ''">{{ isguan ? '官方' : '信誉' + val.user.credit }}</text>
										<text v-if="val.user_id == uid" class="tag" style="background: #0091ff; color: #ffffff">楼主</text>
									</view>
									<view><u-icon name="more-dot-fill" size="48rpx" color="#B8B8B8" @click.stop="moreBtn(val.id, val.user_id, 0)"></u-icon></view>
								</view>
								<view>
									<text style="margin-right: 10rpx">{{ $u.timeFrom(val.create_time, false) }}</text>
									<text>{{ val.user.school.school_name +' '+ val.user.en_year + '级' }}</text>
								</view>
							</view>
						</view>
						<view class="top2_con">
							<view class="contentBox" style="padding-left: 100rpx;">{{ val.content }}</view>
							<view v-if="val.community_posts_comment_imgs" style="padding: 0 100rpx;">
								<view
									v-for="(itemImg, ind) in val.community_posts_comment_imgs"
									class="imageView"
									:style="val.community_posts_comment_imgs.length == 1 ? 'width:200rpx;height:200rpx' : ''"
									:key="ind"
								>
									<image
										:src="imgBaseUrl + itemImg.path"
										:style="val.community_posts_comment_imgs.length == 1 ? 'width:200rpx;height:200rpx' : 'width:160rpx;height:160rpx'"
										:lazy-load="true"
										@click.stop="showPop(val.community_posts_comment_imgs, ind)"
										mode="aspectFill"
									></image>
								</view>
							</view>
						</view>
						<view class="top3_share">
							<view></view>
							<view style="display: flex;align-items: center;">
								<image
									@click.stop="likeComment(val.id, i, 2)"
									src="/static/message/zan_full.png"
									v-if="val.is_praise"
									style="width:48rpx;height: 48rpx;margin-right: 6rpx"
								></image>
								<image @click.stop="likeComment(val.id, i, 2)" src="/static/message/zan.png" v-else style="width:48rpx;height: 48rpx;margin-right: 6rpx"></image>
								<text style="margin-right: 20rpx">{{ val.praise_num ? val.praise_num : '' }}</text>
								<image
									@click="showWrite(val.id, val.user.name, val.user_id)"
									src="/static/message/mess.png"
									style="width:48rpx;height: 48rpx;margin-right: 6rpx"
								></image>
							</view>
						</view>
						<view v-for="(last, lindex) in val.last" style="margin-top: 20rpx;" :key="lindex">
							<view class="top2_title">
								<view style="position: relative" @click="toMinePage(last.user_id)">
									<image :src="last.user.header ? imgBaseUrl + last.user.header : '/static/mine/name1.png'" class="head"></image>
									<image
										v-if="last.user.show_attestation"
										class="is_auth"
										:src="
											last.user.show_attestation == 1
												? '/static/index/is_auth.png'
												: last.user.show_attestation == 2
												? '/static/index/is_shop.png'
												: last.user.show_attestation == 3
												? '/static/index/is_rider.png'
												: ''
										"
									></image>
								</view>
								<view class="top2_title2">
									<view>
										<view class="top2_title2_2">
											<text>{{ last.user.name }}</text>
											<image
												v-if="last.user.sex.code"
												:src="last.user.sex.code == 1 ? '/static/index/man.png' : '/static/index/female.png'"
												class="logo"
											></image>
											<text class="tag" :style="isguan ? 'background: #FEC200;color: #000000;' : ''">{{ isguan ? '官方' : '信誉' + last.user.credit }}</text>
											<text v-if="last.user_id == uid" class="tag" style="background: #0091ff; color: #ffffff">楼主</text>
										</view>
										<view><u-icon name="more-dot-fill" size="48rpx" color="#B8B8B8" @click.stop="moreBtn(last.id, last.user_id, 0)"></u-icon></view>
									</view>
									<view>
										<text style="margin-right: 10rpx">{{ $u.timeFrom(last.create_time, false) }}</text>
										<text>{{ last.user.school.school_name +' '+ last.user.en_year + '级' }}</text>
									</view>
								</view>
							</view>
							<view class="top2_con">
								<view class="contentBox" style="padding-left: 100rpx;">
									回复
									<text @click="toMinePage(last.user_id)">@{{ last.fuser.name ? last.fuser.name : '已注销用户' }}</text>
									：{{ last.content }}
								</view>
								<view v-if="last.community_posts_comment_imgs" style="padding: 0 100rpx;">
									<view
										v-for="(itemImg, ind) in last.community_posts_comment_imgs"
										class="imageView"
										:style="last.community_posts_comment_imgs.length == 1 ? 'width:200rpx;height:200rpx' : ''"
										:key="ind"
									>
										<image
											:src="imgBaseUrl + itemImg.path"
											:style="last.community_posts_comment_imgs.length == 1 ? 'width:200rpx;height:200rpx' : 'width:160rpx;height:160rpx'"
											:lazy-load="true"
											@click.stop="showPop(last.community_posts_comment_imgs, ind)"
											mode="aspectFill"
										></image>
									</view>
								</view>
							</view>
							<view class="top3_share">
								<view></view>
								<view style="display: flex;align-items: center;">
									<image
										@click.stop="likeComment(last.id, i, 3, lindex)"
										src="/static/message/zan_full.png"
										v-if="last.is_praise"
										style="width:48rpx;height: 48rpx;margin-right: 6rpx"
									></image>
									<image
										@click.stop="likeComment(last.id, i, 3, lindex)"
										src="/static/message/zan.png"
										v-else
										style="width:48rpx;height: 48rpx;margin-right: 6rpx"
									></image>
									<text style="margin-right: 20rpx">{{ last.praise_num ? last.praise_num : '' }}</text>
									<image
										@click="showWrite(val.id, last.user.name, last.user.id)"
										src="/static/message/mess.png"
										style="width:48rpx;height: 48rpx;margin-right: 6rpx"
									></image>
								</view>
							</view>
						</view>
					</view>
					<u-loadmore :status="status1" :icon-type="iconType1" :load-text="loadText1" @loadmore="loadMore" />
				</scroll-view>
				<view class="foot"><view @click="showWrite(fast_id, fastName)">我也说两句…</view></view>
			</view>
		</u-popup>
		<!-- 回复 -->
		<u-popup v-model="writeReply" mode="top" border-radius="20" @open="textFocus = true" @close="textFocus = false">
			<view class="writeReply">
				<view>
					<view><textarea v-model="form.content" maxlength="500" :focus="textFocus" :placeholder="placeholder"></textarea></view>
					<view>
						<u-upload
							ref="uUpload"
							:auto-upload="true"
							:before-upload="beforeUpload"
							:action="action"
					:size-type="['compressed']"
							@on-remove="onRemove"
							@on-success="onSuccess"
							width="120"
							height="120"
							max-count="9"
						></u-upload>
					</view>
				</view>
				<view><text @click="sendComment">发送</text></view>
			</view>
		</u-popup>
		<helang-compress ref="helangCompress"></helang-compress>
	</view>
</template>

<script>
import { getPostsInfo, sharePosts, praisePosts, delImages, comment, getPostsComment, praiseComment, delPosts, delComment } from '../../../services/community.js';
import helangCompress from '../../../components/helang-compress/helang-compress';
export default {
	components: {
		helangCompress
	},
	data() {
		return {
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			action: getApp().globalData.imgBaseUrl + '/common/upload/image.html',
			content: '',
			images: ['/static/mine/name1.png'],
			user: {},
			community_classify: {},
			praise_num: 0,
			share_num: 0,
			is_praise: false,
			create_time: null,
			showReply: false,
			writeReply: false,
			textFocus: false,
			placeholder: '我也要说两句...',
			id: '',
			uid: '',
			comment_id: '',
			last_id: '',
			community_comment: [],
			comment_other: [],
			form: {
				imgs: [],
				content: ''
			},
			page: 1,
			page1: 1,
			status1: 'loadmore',
			iconType1: 'flower',
			loadText1: {
				loadmore: '上拉或点击',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			status: 'loadmore',
			iconType: 'flower',
			loadText: {
				loadmore: '上拉或点击',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			shadowStyle: {
				backgroundImage: 'none',
				paddingTop: '0',
				marginTop: '0'
			},
			myId: null,
			fast_id: '',
			fastName: '',
			navTop: getApp().globalData.navTop,
			navHeight: getApp().globalData.navHeight
		};
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 参数id
			sharePosts({
				id: this.id
			}).then(res1 => {
				if (res1.code == 200) {
					uni.showToast({
						title: res1.message,
						duration: 1500,
						icon: 'none'
					});
					this.share_num++;
				}
			});
		}
		return {
			title: '动态发布',
			path: '/pages/community/commDetail/commDetail?id=' + this.id,
			imageUrl: '/static/dongtai/share_dt.png'
		};
	},
	onPullDownRefresh() {
		this.init();
		uni.stopPullDownRefresh();
	},
	onLoad(option) {
		this.id = option.id;
		this.getData();
		this.getCommentList();
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
		async beforeUpload(index, lists) {
			uni.showLoading({
				title: '检测中...',
				mask: true
			});
			try {
				await this.$refs.helangCompress
					.compress({
						src: lists[index].url
					})
					.then(async res => {
						await this.$check.checkImg1(index, res, lists);
					});
			} catch (e) {
				console.log('e', e);
			}
		},
		loadingMore() {
			if (this.status == 'nomore') return;
			this.status = 'loading';
			this.page = ++this.page;
			this.getCommentList();
		},
		initBox() {
			this.comment_other = [];
			this.page1 = 0;
			this.status1 = 'loadmore';
			this.loadMore();
		},
		loadMore() {
			if (this.status1 == 'nomore') return;
			this.status1 = 'loading';
			this.page1 = ++this.page1;
			uni.showLoading({
				title: '加载中...'
			});
			getPostsComment({
				where: {
					posts_id: this.id,
					fast_id: this.fast_id
				},
				page: this.page1,
				limit: 10
			}).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					this.comment_other = this.comment_other.concat(res.result);
					this.status1 = 'loadmore';
				} else {
					this.status1 = 'nomore';
				}
			});
		},
		likeComment(id, index, type, last) {
			praiseComment({
				id: id
			}).then(res => {
				if (type == 1) {
					this.community_comment[index].is_praise = !this.community_comment[index].is_praise;
				} else if (type == 2) {
					this.comment_other[index].is_praise = !this.comment_other[index].is_praise;
				} else if (type == 3) {
					this.comment_other[index].last[last].is_praise = !this.comment_other[index].last[last].is_praise;
				}
				if (res.code == 200) {
					if (type == 1) {
						this.community_comment[index].praise_num++;
					} else if (type == 2) {
						this.comment_other[index].praise_num++;
					} else if (type == 3) {
						this.comment_other[index].last[last].praise_num++;
					}
					uni.showToast({
						title: res.message,
						duration: 1500,
						icon: 'none'
					});
				} else if (res.code == 1) {
					if (type == 1) {
						this.community_comment[index].praise_num--;
					} else if (type == 2) {
						this.comment_other[index].praise_num--;
					} else if (type == 3) {
						this.comment_other[index].last[last].praise_num--;
					}
				}
			});
		},
		init() {
			this.status = 'loadmore';
			this.page = 1;
			this.community_comment = [];
			this.getCommentList();
		},
		getCommentList() {
			getPostsComment({
				where: {
					posts_id: this.id,
					fast_id: 0
				},
				page: this.page,
				limit: 10
			}).then(res => {
				if (res.code == 200) {
					this.community_comment = this.community_comment.concat(res.result);
				} else {
					this.status = 'nomore';
				}
			});
		},
		onRemove(index, lists) {
			delImages(this.form.imgs[index]).then(res => {});
			this.form.imgs.splice(index, 1);
		},
		onSuccess(data, index, lists, name) {
			if (data.code == 200) {
				this.form.imgs.push({
					path: data.result.src
				});
			} else {
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				});
			}
		},
		like() {
			praisePosts({
				id: this.id
			}).then(res => {
				this.is_praise = !this.is_praise;
				if (res.code == 200) {
					this.praise_num++;
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				} else if (res.code == 1) {
					this.praise_num--;
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				}
			});
		},
		getData() {
			uni.showLoading({
				title: '加载中...'
			});
			getPostsInfo({
				id: this.id
			}).then(res => {
				if (res.code == 200) {
					uni.hideLoading();
					this.uid = res.result.user_id;
					this.is_praise = res.result.is_praise;
					this.user = res.result.user;
					this.content = res.result.content;
					this.create_time = res.result.create_time;
					this.images = res.result.community_posts_imgs;
					this.praise_num = res.result.praise_num;
					this.share_num = res.result.share_num;
					this.community_classify = res.result.community_classify;
				}
			});
		},
		delPost(id, type) {
			uni.showModal({
				title: '提示',
				content: '请确认进行此删除操作',
				success: res => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中...',
							mask: true
						});
						if (type == 1) {
							delPosts({ id: id }).then(res => {
								uni.hideLoading();
								uni.showToast({
									title: res.message,
									icon: 'none'
								});
								if (res.code == 200) {
									uni.switchTab({
										url: '/pages/Tab/tabComm/community'
									});
								}
							});
						} else {
							delComment({ id: id }).then(res => {
								uni.hideLoading();
								uni.showToast({
									title: res.message,
									icon: 'none'
								});
								if (res.code == 200) {
									if (this.showReply) {
										this.initBox();
									} else {
										this.init();
									}
								}
							});
						}
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		moreBtn(id, uid, type) {
			uni.showActionSheet({
				itemList: this.myId == uid ? ['我要删除'] : ['我要举报'],
				itemColor: this.myId == uid ? '#ff0000' : '#000000',
				success: res => {
					if (this.myId == uid) {
						this.delPost(id, type);
					} else {
						this.showModal = true;
					}
				},
				fail(res) {}
			});
		},
		toMinePage(id) {
			uni.navigateTo({
				url: '/pages/community/minePage/minePage?id=' + id
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
		showhf(id, name) {
			uni.showLoading({
				title: '加载中...'
			});
			this.fast_id = id;
			this.fastName = name;
			this.comment_other = [];
			this.page1 = 1;
			this.status1 = 'loadmore';
			getPostsComment({
				where: {
					posts_id: this.id,
					fast_id: id
				},
				page: this.page1,
				limit: 10
			}).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					this.comment_other = this.comment_other.concat(res.result);
					this.showReply = !this.showReply;
				} else {
					this.status1 = 'nomore';
				}
			});
		},
		sendComment() {
			if (this.form.content === '') {
				uni.showToast({
					title: '请输入评论内容',
					icon: 'none'
				});
				return false;
			}
			// 消息提醒 ：评论点赞、新的评论回复
			uni.requestSubscribeMessage({
				tmplIds: ['loosDS_rJeap9JOHwFnPOpjoNp3LPCkBuG68advTU_g', 'Q0dB1QJc9GcGSfT5tpj6GBbf53JiHhz6RDQZOVM6i3Y'],
				complete: async res => {
					try {
						await this.$check.checkTxt(this.form.content);
						let obj = this.form;
						if (this.comment_id) {
							obj.fast_id = this.comment_id;
						}
						if (this.last_id) {
							obj.last_id = this.last_id;
						}
						comment({
							id: this.id,
							data: obj
						}).then(res => {
							if (res.code == 200) {
								this.writeReply = false;
								this.form = {
									content: '',
									imgs: []
								};
								this.$refs.uUpload.clear();
								if (this.showReply) {
									// this.init();
									// this.showReply = true;
									this.initBox();
								} else {
									this.init();
								}
								this.comment_id = '';
								this.last_id = '';
								uni.showToast({
									title: res.message,
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: res.message,
									icon: 'none'
								});
							}
						});
					} catch (e) {
						this.form.content = '';
						return false;
					}
				}
			});
		},
		showWrite(id, name, last) {
			if (id) {
				this.comment_id = id;
				if (last) {
					this.last_id = last;
				}
			}
			if (name) {
				this.placeholder = '回复：' + name;
			} else {
				this.placeholder = '我也要说两句...';
			}
			this.writeReply = !this.writeReply;
		},
		toClub() {
			uni.navigateTo({
				url: '/pages/community/club/club'
			});
		}
	}
};
</script>

<style scoped>
.content {
	padding-bottom: 70px;
	min-height: 100vh;
	box-sizing: border-box;
	overflow: hidden;
	background: #f8fafb;
}

/* 第一部分 */
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

.top2_con .imageView {
	width: 228rpx;
	height: 220rpx;
	margin: 0 8rpx 8rpx 0;
	display: inline-block;
}

.contentBox text {
	color: #0091ff;
}

.top2_con .imageView image {
	border-radius: 4px;
}

.top2_con .imageView:nth-of-type(3n) {
	margin: 0 0 8rpx 0;
}

/* 评论 */
.top3 .top2_list {
	margin-bottom: 0;
	border-bottom: 1px solid #f8fafb;
}

.listBox {
	margin-bottom: 20rpx;
}

.top3 .top2_con {
	/* padding: 0 100rpx; */
}

.top3 .top2_con .imageView {
	width: 160rpx;
	height: 160rpx;
	margin: 0 6rpx 6rpx 0;
	display: inline-block;
}

.top3 .top2_con image {
	border-radius: 4px;
}

.top3 .top2_con image:nth-of-type(3n) {
	margin: 0 0 6rpx 0;
}

.top3 .top3_share {
	padding-left: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 10rpx;
}

.top3 .top3_share > view:nth-of-type(1) text {
	display: inline-block;
	width: 136rpx;
	height: 48rpx;
	background: #f0f1f2;
	border-radius: 12px;
	text-align: center;
	line-height: 48rpx;
	color: rgba(36, 36, 36, 0.6);
	font-size: 24rpx;
}

.contentBox {
	margin: 30rpx 0;
}

/* 图片预览 */
.pop {
	width: 600rpx;
}

.pop image {
	width: 100%;
}

.foot {
	background: #ffffff;
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	z-index: 10;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18rpx 24rpx;
	box-shadow: 0px -1px 0px 0px rgba(226, 226, 226, 0.5);
}

.foot > view:nth-of-type(1) {
	font-size: 28rpx;
	color: rgba(51, 51, 51, 0.4);
	width: 100%;
	height: 84rpx;
	line-height: 84rpx;
	padding: 0 32rpx;
	background: #f0f1f2;
	border-radius: 21px;
	box-sizing: border-box;
}

/* 底部 */
.foot {
	background: #ffffff;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	z-index: 100;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18rpx 24rpx;
	box-shadow: 0px -1px 0px 0px rgba(226, 226, 226, 0.5);
}

.foot > view:nth-of-type(1) {
	font-size: 28rpx;
	color: rgba(51, 51, 51, 0.4);
	width: 100%;
	height: 84rpx;
	line-height: 84rpx;
	padding: 0 32rpx;
	background: #f0f1f2;
	border-radius: 21px;
	box-sizing: border-box;
}

.dzfx {
	display: flex;
	justify-content: space-between;
	margin-top: 20rpx;
}

.dzfx .fen {
	display: flex;
	align-items: center;
	border-radius: 14px;
	padding: 0 32rpx;
	font-size: 24rpx;
	color: #ffb021;
	background: #fef8e5;
	height: 56rpx;
	justify-content: center;
}
.dzfx > view:nth-of-type(2) {
	display: flex;
	align-items: center;
}
.dzfx .fen image {
	width: 36rpx;
	height: 36rpx;
	margin-right: 5rpx;
}

.dzfx text {
	margin-left: 6rpx;
	font-size: 28rpx;
}

/* 弹窗回复详情 */
.reply {
	max-height: 80vh;
}

.scrollY {
	height: calc(80vh - 264rpx);
	padding-bottom: 150rpx;
}

.close {
	color: rgba(36, 36, 36, 0.4);
	font-size: 28rpx;
	font-weight: normal;
	position: absolute;
	top: 36rpx;
	left: 24rpx;
}

.reply > view:nth-of-type(1) {
	padding: 36rpx 12rpx;
	text-align: center;
	font-size: 32rpx;
	font-weight: bold;
	position: absolute;
	width: 100%;
	top: 0;
	left: 0;
	z-index: 100;
	background: #ffffff;
}

.reply .top3 {
	padding-top: 114rpx;
}

/* 写回复 */
.writeReply {
	padding: 24rpx;
}

.writeReply > view:nth-of-type(1) {
	background: #f0f1f2;
	border-radius: 8px;
	padding: 24rpx;
}

.writeReply > view:nth-of-type(2) {
	text-align: right;
	margin-top: 18rpx;
}

.writeReply > view:nth-of-type(2) text {
	display: inline-block;
	width: 150rpx;
	height: 56rpx;
	background: #0091ff;
	border-radius: 14px;
	font-size: 28rpx;
	color: #ffffff;
	text-align: center;
	line-height: 56rpx;
}

/* 社团 */
.top1_list_2 {
	flex: 1;
	display: flex;
	padding: 24rpx;
	border-radius: 8px;
	border: 1px solid #f4f4f4;
	align-items: center;
	margin-top: 40rpx;
}

.top1_list_2 image {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	padding-right: 20rpx;
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
	background: rgba(254, 194, 0, 0.2);
	border-radius: 8px;
	color: #614a00;
	text-align: center;
	line-height: 56rpx;
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

button {
	background: transparent;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	padding: 0;
	margin: 0;
}
</style>
