<template>
	<view class="address">

		<view class="list" v-for="(item,index) in list" :key="index">
			<view @click="changeAddresss(item.id)">
				<view class="name">
					<u-tag text="默认" :show="item.is_default" color="#333333" bg-color="#FEC200" size="mini" border-color="#FEC200" />
					<text style="margin:0 24rpx 0 8rpx">{{item.linkman}}</text>
					<text>{{item.phone}}</text>
				</view>
				<view class="mess">{{item.address.pickerText}}{{item.detail}}</view>
			</view>
			<view>
				<view>
					<u-icon name="edit-pen" size="36rpx" @click="toAddAddress(item.id)" style="margin-right: 20rpx;"></u-icon>
					<u-icon name="trash" size="36rpx" @click="delAddress(item.id)"></u-icon>
				</view>
			</view>
		</view>
		<navigator url="./addAddress/addAddress" class="add">
			<u-icon name="plus-circle" size="56rpx" style="margin-right:8rpx"></u-icon>
			<text>添加新地址</text>
		</navigator>
	</view>
</template>

<script>
	import {
		getAddress,
		delAddress
	} from "../../../../services/mine.js";
	export default {
		data() {
			return {
				list: [],
				fromPage: "", // 标志从那个页面过来的
				goodsid: "", //商品的id
			}
		},
		methods: {
			changeAddresss(id) {
				uni.setStorage({
					key: "address_id",
					data: id,
					success() {
						uni.navigateBack({
							delta: 1
						});
					},
				});
			},
			toAddAddress(id) {
				uni.navigateTo({
					url: '/pages/mine/mineSetting/address/addAddress/addAddress?id=' + id,
				});
			},
			delAddress(id) {
				let that = this;
				uni.showModal({
					title: '警告',
					content: '确定要删除这个地址吗',
					success: (res)=> {
						if (res.confirm) {
							delAddress({
								id: id,
							}).then(res => {
								uni.showToast({
									title: res.message,
									icon:'none'
								});
								if (res.code == 200) {
									this.getAdd();
								}
							})
							// console.log('用户点击确定');
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			getAdd(){
				getAddress().then(res => {
					if (res.code == 200) {
						this.list = res.result;
					}else{
						this.list=[];
					}
				});
			},
		},
		onLoad(options) {
			if (options.fromPage) {
				this.fromPage = options.fromPage;
				this.goodsid = options.id;
			}
		},
		onShow() {
			this.getAdd();
		},
	}
</script>

<style scoped>
	.address {
		background: rgba(245, 245, 245, 1);
		min-height: 100vh;
		font-size: 32rpx;
	}

	.list {
		background: #FFF;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18rpx 40rpx 16rpx;
		border-bottom: 1px solid rgba(245, 245, 245, 1);
	}

	.name {
		font-weight: bold;
		margin-bottom: 8rpx;
	}

	.mess {
		font-size: 24rpx;
	}

	.list>view:nth-of-type(1) {
		flex: 1;
		padding-right: 110rpx;
	}

	.add {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #FFF;
		padding: 26rpx 0;
	}
</style>
