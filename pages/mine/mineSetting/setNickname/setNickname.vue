<template>
	<view class="content">
		<view class="top1"><input type="text" maxlength="8" :placeholder="type == 2 ? '请输入昵称不超过8个字' : '请选择性别'" :disabled="type == 1"
			 v-model="nickname" @click="selSex" /></view>
		<view class="btn" @click="submit">保存</view>
		<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
	</view>
</template>

<script>
	import {
		saveUser,findUserInfo
	} from "../../../../services/mine.js";
	export default {
		data() {
			return {
				userInfo: "",
				nickname: "",
				sex: "",
				type: "",
				show: false,
				list: [{
						value: 1,
						label: "男",
					},
					{
						value: 2,
						label: "女",
					},
				],
			};
		},
		methods: {
			selSex() {
				if (this.type == 1) {
					this.show = !this.show;
				}
			},
			confirm(e) {
				this.nickname = e[0].label;
				this.sex = e[0].value;
			},
			async submit() {
				if (this.type == 1 && this.nickname == "") {
					uni.showToast({
						title: "请选择性别 ",
						icon: "none",
					});
					return false;
				}else if(this.type == 1 && this.nickname == this.userInfo.sex.text){
					uni.showToast({
						title: "并未切换性别",
						icon: "none",
					});
					return false;	
				}else if(this.type == 2 && this.nickname == this.userInfo.name){
					uni.showToast({
						title: "请填写不同昵称",
						icon: "none",
					});
					return false;	
				}else if(this.type == 2 && this.nickname.length>8){
					uni.showToast({
						title: "昵称不能超过8个字",
						icon: "none",
					});
					return false;	
				} else if (this.type == 2 && this.nickname == "") {
					uni.showToast({
						title: "请输入昵称",
						icon: "none",
					});
					return false;
				}
				// 文本检测
				try {
					let res = await this.$check.checkTxt(this.nickname);
				} catch (error) {
					this.nickname = "";
					return false;
				}
				uni.showLoading({
					title: "提交中……",
					mask: true,
				});
				let data = "";
				if (this.type == 1) {
					data = {
						sex: this.sex,
					};
				} else {
					data = {
						name: this.nickname,
					};
				}
				saveUser({
					data,
				}).then((res) => {
					uni.hideLoading();
					uni.showToast({
						title: res.message,
						icon: "none",
					});
					if (res.code == 200) {
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {}
				});
			},
		},
		onLoad(options) {
			// 2 昵称  1性别
			this.type = options.type;
			if (options.type == 1) {
				uni.setNavigationBarTitle({
					title: "设置性别",
				});
			}
			findUserInfo({}).then(res => {
				if (res.code == 200) {
					this.userInfo = res.result;
					if (this.type == 1) {
						this.nickname = res.result.sex.text;
					} else {
						this.nickname = res.result.name;
					}
				}
			});
		},
	};
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
		margin: 136rpx 24rpx 0;
		background: #fec200;
		border-radius: 25px;
		text-align: center;
		padding: 28rpx 0;
		font-weight: bold;
	}
</style>
