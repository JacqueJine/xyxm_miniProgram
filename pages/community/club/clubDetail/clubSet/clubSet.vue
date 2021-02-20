<template>
	<view class="content">
		<view class="top">
			<input placeholder="社团名称不超过12个字" maxlength="12" type="text" v-model="name" v-if="setType == 1" />
			<textarea placeholder="请输入(限100个字)" maxlength="100" type="text" v-model="text" v-else style="width: 100%;"></textarea>
		</view>
		<view v-if="is_add == 1" class="btn" @click="submit">保存</view>
		<view v-if="is_add != 1" class="btn" @click="sendData">保存</view>
	</view>
</template>

<script>
import { editClubInfo } from '../../../../../services/community.js';
export default {
	data() {
		return {
			setType: '',
			name: '',
			text: '',
			form: '',
			is_add: 1,
			club_id: ''
		};
	},
	onLoad(options) {
		this.setType = options.setType;
		this.is_add = options.is_add;
		if (options.is_add == 1) {
			this.form = options.form;
		} else {
			this.club_id = options.id;
		}
		if (options.setType == 1) {
			uni.setNavigationBarTitle({
				title: '社团名称'
			});
		} else if (options.setType == 2) {
			uni.setNavigationBarTitle({
				title: '社团简介'
			});
		} else if (options.setType == 3) {
			uni.setNavigationBarTitle({
				title: '社团公告'
			});
		}
	},
	methods: {
		async sendData() {
			let obj = {};
			let content = '';
			if (this.setType == 1) {
				if (this.name == '') {
					uni.showToast({
						title: '请输入社团名称',
						icon: 'none'
					});
					return;
				}
				obj.club_name = this.name;
				content = this.name;
			} else if (this.setType == 2) {
				if (this.text == '') {
					uni.showToast({
						title: '请输入社团简介',
						icon: 'none'
					});
					return;
				}
				obj.club_desc = this.text;
				content = this.text;
			} else if (this.setType == 3) {
				if (this.text == '') {
					uni.showToast({
						title: '请输入社团公告',
						icon: 'none'
					});
					return;
				}
				obj.club_notice = this.text;
				content = this.text;
			}
			try {
				await this.$check.checkTxt(content);
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				editClubInfo({ id: this.club_id, data: obj }).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						uni.showToast({
							title: res.message
						});
						uni.redirectTo({
							url: '/pages/community/club/clubDetail/clubDetail1?id=' + this.club_id
						});
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			} catch (e) {
				this.name = '';
				this.text = '';
				return false;
			}
		},
		async submit() {
			let content = '';
			if (this.setType == 1) {
				content = this.name;
			} else if (this.setType == 2) {
				content = this.text;
			} else if (this.setType == 3) {
				content = this.text;
			}
			try {
				await this.$check.checkTxt(content);
				uni.redirectTo({
					url: '/pages/community/club/addClub/addClub?setType=' + this.setType + '&content=' + content + '&form=' + this.form
				});
			} catch (e) {
				this.name = '';
				this.text = '';
				return false;
				//TODO handle the exception
			}
		}
	}
};
</script>

<style scoped>
.content {
	padding: 50rpx 24rpx 0;
}

.top {
	background: #f2f2f2;
	border-radius: 8px;
	padding: 24rpx;
}

.btn {
	margin-top: 88rpx;
	font-size: 28rpx;
	font-weight: bold;
	padding: 24rpx 0;
	text-align: center;
	background: #fec200;
	border-radius: 22px;
}
</style>
