<template>
	<view class="content">
		<view class="tab">
			<view v-for="(item,index) in tab" :key="index" :class="forminfo.send_status==index?'act':''" @click="change(index)">{{item}}</view>
		</view>
		<view class="top1" v-if="forminfo.send_status==0">当前配送费为0元</view>
		<view class="top2" v-if="forminfo.send_status==1">
			<input type="number" v-model="forminfo.base_send" placeholder="请输入金额(元)" />
		</view>
		<view class="top3" v-if="forminfo.send_status==2">
			<view><text>基础配送费</text><input type="number" v-model="forminfo.base_send" placeholder="请输入金额(元)" /></view>
			<view><text class="blue">满</text><input type="number" v-model="forminfo.discount" placeholder="请输入金额(元)" /> <text
				 style="margin-left: 18rpx;" class="blue">及以上</text></view>
			<view><text class="blue">配送费为</text><input type="number" v-model="forminfo.send_fee" placeholder="请输入金额(元)" /></view>
		</view>
		<view class="btn" @click="submit">保存</view>
	</view>
</template>

<script>
	import {
		storeDetail,
		CreateStore
	} from "../../../../../services/shop.js";
	export default {
		data() {
			return {
				tab: ["无配送费", "有配送费", "满*免配送费"],
				forminfo: {
					base_send: "",
					send_status: "",
					discount: "",
					send_fee: "",
				},
				shopId: "",
			}
		},
		methods: {
			change(index) {
				this.forminfo.send_status = index;
			},
			submit() {
				if (this.forminfo.send_status == 1 && this.forminfo.base_send < 0) {
					uni.showToast({
						title: "配送费金额不得小于0",
						icon: 'none'
					});
					return false;
				} else if (this.forminfo.send_status == 2) {
					if (this.forminfo.base_send < 0 || this.forminfo.discount < 0 || this.forminfo.send_fee < 0) {
						uni.showToast({
							title: "金额不得小于0",
							icon: 'none'
						});
						return false;
					}
				}
				CreateStore({
					id: this.shopId,
					data: this.forminfo,
				}).then(res => {
					uni.showToast({
						title: res.message,
						icon: 'none',
					});
					if (res.code == 200) {
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					}
				})
			},
		},
		onLoad(options) {
			this.shopId = options.shopId;
			storeDetail({
				id: options.shopId, //店铺id
			}).then(res => {
				if (res.code == 200) {
					this.forminfo.base_send = res.result.base_send;
					this.forminfo.send_status = res.result.send_status;
					this.forminfo.discount = res.result.discount;
					this.forminfo.send_fee = res.result.send_fee;
				}
			});
		},
	}
</script>

<style scoped>
	.content {
		padding: 52rpx 24rpx 0;
		font-size: 28rpx;
	}

	.tab {
		border-radius: 22px;
		border: 1px solid #E7E7E7;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		overflow: hidden;
		margin-bottom: 52rpx;
	}

	.tab>view {
		flex: 1;
		padding: 12rpx 0;
		border-right: 1px solid rgba(229, 229, 229, 1);
		text-align: center;
	}

	.tab>view:nth-of-type(3) {
		border-right: none;
	}

	.act {
		background: #FEC200;
	}

	.top1 {
		text-align: center;
		color: rgba(51, 51, 51, .4);
	}

	.top2 input,
	.top3 input {
		height: 86rpx;
		line-height: 86rpx;
		border: none;
		background: #F9F9F9;
		margin-top: 24rpx;
		padding-left: 24rpx;
	}

	.top3>view {
		display: flex;
		align-items: center;
	}

	.top3 input {
		flex: 1;
	}

	.top3>view text:nth-of-type(1) {
		width: 152rpx;
	}

	.content .btn {
		line-height: 108rpx;
		text-align: center;
		background: #FEC200;
		border-radius: 4px;
		font-size: 36rpx;
		margin-top: 200rpx;
	}

	.blue {
		color: #0091FF;
	}
</style>
