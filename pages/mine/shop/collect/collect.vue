<template>
	<view class="content">
		<view v-for="(item, index) in list" :key="item.id" style="margin-top: 8rpx;">
			<u-swipe-action :index="index" @click="click" :options="options">
				<view class="item u-border-bottom">
					<image mode="aspectFill" :src="imgBaseUrl+item.store_header" />
					<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
					<view class="title-wrap">
						<view class="top" @click="toPage(item.store_id)">
							<view>
								<view>{{item.store_name}}</view>
								<view>商品：100</view>
								<view>地址：{{item.store_address}}</view>
							</view>
							<view>进店</view>
						</view>
					</view>
				</view>
			</u-swipe-action>
		</view>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
	import {
		UserStoreCollect,
		UserStoreCollectList
	} from "services/shop.js";
	export default {
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#FF3939'
					}
				}],
				list: [],
				page: 1,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				imgBaseUrl: getApp().globalData.imgBaseUrl,
			}
		},
		methods: {
			click(index) {
				uni.showModal({
				    title: '警告',
				    content: '确定要删除该收藏吗？',
				    success: (res)=> {
				        if (res.confirm) {
							UserStoreCollect({
								store_id:this.list[index].store_id,
								status:0,
							}).then(res=>{
								uni.showToast({
									title:res.message,
									icon:'none',
								});
								if(res.code==200){
									this.list=[];
									this.page=1;
									this.status = "loading";
									this.getList();
								}
							})
				            // console.log('用户点击确定');
				        } else if (res.cancel) {
				            // console.log('用户点击取消');
				        }
				    }
				});
			},
			getList() {
				UserStoreCollectList({
					page: this.page,
					limit: 10,
				}).then(res => {
					if (res.code == 200) {
						this.list=this.list.concat(res.result.data);
						this.page++;
						if (res.result.count <= 10) {
							this.status = 'nomore';
						}
					} else {
						this.status = "nomore";
					}
				})
			},
			toPage(store_id){
				uni.navigateTo({
					url: '/pages/index/schoolShop/schoolShop?store_id=' + store_id,
				});
			},
		},
		onLoad() {
			this.getList();
		},
		onReachBottom() {
			if (this.status == 'nomore') {
				return false;
			}
			this.status == 'loading'
			this.getList();
		}
	}
</script>

<style scoped>
	.content {
		min-height: 100vh;
		background: #F2F2F2;
		padding-top: 20rpx;
		box-sizing: border-box;
	}

	.top {
		display: flex;
		background: #ffffff;
		align-items: center;
		justify-content: space-between;
	}

	.item {
		display: flex;
		align-items: center;
		padding: 28rpx 24rpx;
	}

	image {
		width: 140rpx;
		height: 140rpx;
		margin-right: 24rpx;
	}

	.top>view:nth-of-type(1) {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		color: rgba(33, 33, 33, .4);
		margin-right: 20rpx;
		height: 140rpx;
		width: 380rpx;
	}

	.top>view:nth-of-type(1)>view:nth-of-type(1) {
		color: #333333;
		font-size: 28rpx;
	}

	.top>view:nth-of-type(1)>view {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
		font-size: 24rpx;
	}

	.top>view:nth-of-type(2) {
		background: linear-gradient(137deg, #FEC200 0%, #FE8800 100%);
		border-radius: 14px;
		color: #ffffff;
		width: 132rpx;
		height: 56rpx;
		text-align: center;
		line-height: 56rpx;
		box-sizing: border-box;
		font-size: 28rpx;
	}
</style>
