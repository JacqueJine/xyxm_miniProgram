<template>
	<view class="content">
		<view class="top1"><input type="text" placeholder="请选择学校" :disabled="true" v-model="oldName" /></view>
		<view class="top1"><input type="text" placeholder="请选择学校" :disabled="true" v-model="schoolName" @click="toPage" />
		</view>
		<view class="top2">
			<view>修改学校会导致原学校下的数据被清除，请谨慎申请。</view>
		</view>
		<view class="btn" @click="submit">去申请</view>

	</view>
</template>

<script>
	import {
		updateUserSchool
	} from 'services/mine.js';
	export default {
		data() {
			return {
				schoolName: "",
				info: {
					new_school_id: "",
					old_school_id: JSON.parse(uni.getStorageSync("user")).school_id,
				},
				oldName: '原学校：' + JSON.parse(uni.getStorageSync("user")).school.school_name,
			}
		},
		methods: {
			toPage() {
				uni.navigateTo({
					url: '/pages/mine/comInfo/schoolList/schoolList'
				});
			},
			submit() {
				if (!this.info.new_school_id) {
					uni.showToast({
						title: '请选择学校',
						icon: 'none',
					});
					return false;
				} else if (this.info.new_school_id == this.info.old_school_id) {
					uni.showToast({
						title: '请选择不同的学校',
						icon: 'none',
					});
					return false;
				}
				uni.showLoading({
					title: "提交中……",
					mask: true,
				});
				updateUserSchool({
					data: this.info,
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: res.message,
						icon: "none",
					});
					if (res.code == 200) {
						uni.removeStorageSync('school');
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {}
				});
			},
		},
		onShow() {
			if (uni.getStorageSync('school')) {
				this.schoolName = uni.getStorageSync('school').school_name;
				this.info.new_school_id = uni.getStorageSync('school').id;
			}
		}
	}
</script>

<style scoped>
	.content {
		min-height: 100vh;
		background: #f2f2f2;
	}

	.top1 {
		padding: 32rpx 24rpx;
		border-bottom: 1px solid #f2f2f2;
		background: #ffffff;
	}

	.btn {
		margin: 0 24rpx;
		background: #fec200;
		border-radius: 25px;
		text-align: center;
		padding: 28rpx 0;
		font-weight: bold;
	}

	.top2 {
		padding: 24rpx;
		margin-bottom: 60rpx;
	}

	.top2 view {
		padding: 10rpx 0;
		font-size: 24rpx;
		color: rgba(51, 51, 51, .4);
		text-align: center;
	}
</style>
