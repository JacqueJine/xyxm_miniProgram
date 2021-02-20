<template>
	<view class="content">
		<view class="top1">
			<view><textarea v-model="form.content" maxlength="500" placeholder="想说点什么… (不超过500个字)"></textarea></view>
			<view>
				<u-upload
					:action="action"
					:size-type="['compressed']"
					ref="uUpload"
					:auto-upload="true"
					:before-upload="beforeUpload"
					@on-remove="onRemove"
					max-count="9"
					@on-success="onSuccess"
					width="180rpx"
					height="180rpx"
				></u-upload>
			</view>
		</view>
		<view v-if="type == 1">
			<u-cell-item title="谁可看" :value="typeValue" @click="getType(1)"></u-cell-item>
			<u-cell-item title="类型" :value="clubValue" @click="getType(2)"></u-cell-item>
		</view>
		<view class="btn" @click="addComm">发布</view>
		<!-- 弹窗 -->
		<u-select v-model="show" :list="list" value-name="id" label-name="class_name" @confirm="confirm"></u-select>
		<u-popup v-model="showShare" :mask-close-able="false" mode="center" border-radius="8">
			<view class="sharePop">
				<view>发布成功</view>
				<view>快去把它分享给小伙伴们吧</view>
				<view>
					<button open-type="share" class="sharebtn"></button>
					<u-icon name="weixin-fill" color="#FFFFFF" size="48rpx" style="margin-right: 24rpx;"></u-icon>
					分享给朋友
				</view>
				<view @click="closeItem">关闭</view>
			</view>
		</u-popup>
		<helang-compress ref="helangCompress"></helang-compress>
	</view>
</template>

<script>
import { getCommunityClassify, delImages, posts, sharePosts } from '../../../services/community.js';
import helangCompress from '@/components/helang-compress/helang-compress';
export default {
	components: {
		helangCompress
	},
	data() {
		return {
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			action: getApp().globalData.imgBaseUrl + '/common/upload/image.html',
			show: false,
			selType: '',
			showShare: false,
			typeValue: '公开',
			clubValue: '',
			fileList: [],
			form: {
				content: '',
				img: [],
				posts_auth: 0,
				community_classify_id: null
			},
			typeList: [],
			communityList: [
				{
					id: 0,
					class_name: '公开'
				},
				{
					id: 1,
					class_name: '本校'
				}
			],
			list: [],
			type: 1,
			end_id: null,
			club_id: ''
		};
	},
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			sharePosts({ id: this.end_id }).then(res1 => {
				if (res1.code == 200) {
					uni.showToast({
						title: res1.message,
						duration: 1500
					});
					this.closeItem();
				}
			});
		}
		return {
			title: '动态发布',
			path: '/pages/community/commDetail/commDetail?id=' + this.end_id,
			imageUrl: '/static/dongtai/share_dt.png'
		};
	},
	onShareTimeline(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(2, res.target);
		}
		return {
			title: '自定义转发标题',
			path: '/pages/community/commDetail/commDetail?id=' + this.end_id
		};
	},
	onLoad(options) {
		this.type = options.type;
		if (options.type != 1) {
			this.club_id = options.club_id;
		}
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
		getCommunityClassify({}).then(res => {
			uni.hideLoading();
			if (res.code == 200) {
				this.typeList = res.result;
				this.form.community_classify_id = res.result[0].id;
				this.clubValue = res.result[0].class_name;
			}
		});
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
		onRemove(index, lists) {
			delImages(this.form.img[index]).then(res => {});
			this.form.img.splice(index, 1);
		},
		onSuccess(data, index, lists, name) {
			if (data.code == 200) {
				this.form.img.push({ path: data.result.src });
			} else {
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				});
			}
		},
		getType(index) {
			this.selType = index;
			this.show = !this.show;
			if (index == 1) {
				this.list = this.communityList;
			} else {
				this.list = this.typeList;
			}
		},
		confirm(e) {
			if (this.selType == 1) {
				this.typeValue = e[0].label;
				this.form.posts_auth = e[0].value;
			} else {
				this.clubValue = e[0].label;
				this.form.community_classify_id = e[0].value;
			}
		},
		submit() {
			let obj = {};
			if (this.type != 1) {
				obj.content = this.form.content;
				obj.img = this.form.img;
				obj.community_club_id = this.club_id;
			} else {
				obj = this.form;
			}
			posts({ data: obj }).then(res => {
				uni.hideLoading();
				if (res.code == 200) {
					this.end_id = res.result.id;
					this.showShare = !this.showShare;
				} else if (res.code == 0) {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		addComm() {
			uni.showLoading({
				title: '提交中...',
				mask: true
			});
			if (this.form.content == '') {
				uni.hideLoading();
				uni.showToast({
					title: '请输入想要发布的内容!',
					icon: 'none'
				});
				return false;
			}
			// 消息提醒：新的评论提醒、帖子被赞
			uni.requestSubscribeMessage({
				tmplIds: ['mc5xJywLUfHxkLOaV2oIzYBbO3O0AqjTxq75RRAh_ps', 'CgI2RUfrhhaM0eKIykkjG80cxBGaw7gqwg7ulv8qBOs'],
				complete: async res => {
					try {
						await this.$check.checkTxt(this.form.content);
						this.submit();
					} catch (e) {
						this.form.content = '';
						return false;
					}
				}
			});
		},
		closeItem() {
			if (this.type != 1) {
				uni.redirectTo({
					url: '/pages/community/club/club?id=' + this.club_id
				});
			} else {
				uni.switchTab({
					url: '/pages/Tab/tabComm/community'
				});
			}
			this.showShare = !this.showShare;
		}
	}
};
</script>

<style scoped>
.content {
	padding: 32rpx 24rpx;
}

.top1 {
	padding: 24rpx;
	background: #fbfbfb;
	border-radius: 8px;
}

.btn {
	width: 702rpx;
	height: 98rpx;
	font-size: 36rpx;
	text-align: center;
	line-height: 98rpx;
	color: #ffffff;
	background: linear-gradient(137deg, #3ba8ff 0%, #508aff 100%);
	border-radius: 25px;
	margin-top: 40rpx;
}

.sharePop {
	width: 592rpx;
	padding: 48rpx 44rpx;
	text-align: center;
}

.sharePop > view:nth-of-type(1) {
	font-size: 32rpx;
	font-weight: bold;
}

.sharePop > view:nth-of-type(2) {
	font-size: 28rpx;
	color: rgba(51, 51, 51, 0.6);
	margin: 16rpx 0 38rpx;
}

.sharePop > view:nth-of-type(3) {
	position: relative;
	border-radius: 26px;
	height: 120rpx;
	line-height: 120rpx;
	color: #ffffff;
	background: #2cd175;
	border-radius: 30px;
	size: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.sharePop > view:nth-of-type(3) .sharebtn {
	position: absolute;
	z-index: 100;
	top: 0;
	left: 0;
	width: 504rpx;
	height: 120rpx;
	border: none;
	background: transparent;
	border-radius: 30px;
}

.sharePop > view:nth-of-type(4) {
	margin: 38rpx auto 0;
	color: #409fff;
	font-size: 32rpx;
	height: 104rpx;
	border-radius: 26px;
	border: 1px solid #0091ff;
	line-height: 104rpx;
}
</style>
