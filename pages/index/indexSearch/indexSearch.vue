<template>
	<view class="content">
		<view class="tabBar" :style="'padding-top:'+(navTop+5)+'px;height:'+navHeight+'px;'">
			<u-icon name="arrow-left" size="50rpx" @click="back" style="margin-right: 30rpx;"></u-icon>
			<u-search placeholder="搜索 店铺 商品" :focus="focus" v-model="value" @search="onSearch" @focus="onFocus" :show-action="false"></u-search>
		</view>
		<view class="nav" :style="'margin-top:' + navHeight + 'px'">
			<view :class="active==index?'black':'default'" @click="selected1(index)" v-for="(item,index) in functionList1" :key="index">
				<view>{{item}}</view>
				<view :class="active==index?'dot':''"> </view>
			</view>
		</view>
		<view v-if="active==0">
			<view class="fun1">
				<view class="funleft">
					<view v-for="(item,index) in goodsLeft" :key="index" @click="goodsDetial(item.id,item.store_id)">
						<image :src="imgBaseUrl+item.goodsimage" :lazy-load="true" class="zhu" mode="widthFix"></image>
						<view class="funtext">
							<view>{{item.name}}</view>
							<view>
								<view>￥<text style="font-size: 36rpx;font-weight: bold;">{{item.price}}</text></view>
								<view>销量{{item.sales_num}}</view>
							</view>
							<view>
								<image :src="imgBaseUrl+item.store_header" class="logo"></image><text>{{item.store_name}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="funright">
					<view v-for="(item,index) in goodsRight" :key="index" @click="goodsDetial(item.id,item.store_id)">
						<image :src="imgBaseUrl+item.goodsimage" :lazy-load="true" class="zhu" mode="widthFix"></image>
						<view class="funtext">
							<view>{{item.name}}</view>
							<view>
								<view>￥<text style="font-size: 36rpx;font-weight: bold;">{{item.price}}</text></view>
								<view>销量{{item.sales_num}}</view>
							</view>
							<view>
								<image :src="imgBaseUrl+item.store_header" class="logo"></image><text>{{item.store_name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore margin-top="24" margin-bottom="24" :status="shopStatus" :icon-type="iconType" :load-text="loadText" />
		</view>
		<view v-if="active==1" class="fun2">
			<view class="list" v-for="(item,index) in shopList" :key="index" @click="goshop(item.id)">
				<view>
					<image :src="imgBaseUrl+item.header" :lazy-load="true" mode="aspectFill"></image>
				</view>
				<view>
					<view><text>{{item.name}}</text><text>进店</text></view>
					<view>营业时间：{{item.start_time}}-{{item.end_time}}</view>
					<view>月销：99999</view>
					<view><text>{{item.upsendmoney}}元起送</text><text v-if="item.send_status==3">满{{item.discount}}元{{item.send_fee}}配送费</text></view>
					<view class="conlist">
						<view v-for="(itm,ind) in item.hot_goods" :key="ind" @click.stop="goodsDetial(itm.id,itm.store_id)">
							<view>
								<image :src="imgBaseUrl+itm.goodsimage" :lazy-load="true" mode="aspectFill"></image>
							</view>
							<view>{{itm.name}}</view>
							<view>￥{{itm.price}}</view>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore margin-top="24" margin-bottom="24" :status="shopStatus" :icon-type="iconType" :load-text="loadText" />
		</view>
		<!-- 搜索 -->
		<view class="searchPop" v-if="focus" :style="'padding-top:' + navHeight + 'px'">
			<view class="clear">
				<view>历史记录</view>
				<view @click="clearSearch('all')">
					<image src="/static/message/qk.png"></image>清空
				</view>
			</view>
			<view class="listsear">
				<view v-for="(item,index) in searList" :key="index">
					<text style="flex:1" @click="toSearch(item)">{{item}}</text>
					<u-icon name="close" @click="clearSearch(index)"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		listStore,
		getGood
	} from 'services/shop.js';
	export default {
		data() {
			return {
				imgBaseUrl: getApp().globalData.imgBaseUrl,
				value: "",
				active: 0,
				navTop: getApp().globalData.navTop,
				navHeight: getApp().globalData.navHeight,
				functionList1: ["热门商品", "热门店铺"],
				focus: true,
				searList: [],
				// 商铺
				shopPage: 1,
				shopList: [],
				shopStatus: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				// 商品
				goodsLeft: [],
				goodsRight:[],
			}
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			toSearch(item) {
				this.value = item;
			},
			goshop(store_id) {
				uni.navigateTo({
					url: '/pages/index/schoolShop/schoolShop?store_id=' + store_id,
				});
			},
			goodsDetial(id, shop_id) {
				uni.navigateTo({
					url: "/pages/index/schoolShop/goodsDetail/goodsDetail?id=" + id + "&shop_id=" + shop_id,
				});
			},
			onFocus() {
				this.focus = true;
			},
			onSearch() {
				this.searList.unshift(this.value);
				// 数组去重
				this.searList = this.searList.filter(function(ele, index, self) {
					return self.indexOf(ele) === index;
				});
				this.focus = false;
				uni.setStorage({
					key: 'indexHistory',
					data: this.searList,
					success() {

					}
				});
				this.shopStatus = 'loading';
				this.shopPage = 1;
				if (this.active == 0) {
					this.goodsLeft= []
					this.goodsRight= [];
					this.getGoods();
				} else {
					this.shopList = [];
					this.getShopList();
				}
			},
			selected1(index) {
				this.active = index;
				this.shopStatus = 'loading';
				this.shopPage = 1;
				if (this.active == 0) {
					this.goodsLeft= []
					this.goodsRight= [];
					this.getGoods();
				} else {
					this.shopList = [];
					this.getShopList();
				}
			},
			getShopList() {
				listStore({
					where: {
						name: this.value,
					},
					page: this.shopPage,
					limit: 10
				}).then(res => {
					if (res.code == 200) {
						this.shopList = this.shopList.concat(res.result.data);
						if (res.result.count <= 10) {
							this.shopStatus = "nomore"
						}
						this.shopPage++;
					} else {
						this.shopStatus = "nomore";
					}
				})
			},
			getGoods() {
				getGood({
					where: {
						shelves: 1,
						name: this.value,
					},
					page: this.shopPage,
					limit: 20,
				}).then(res => {
					if (res.code == 200) {
						for (let i in res.result.data) {
							if (i % 2 == 0) {
								this.goodsLeft.push(res.result.data[i]);
							} else {
								this.goodsRight.push(res.result.data[i]);
							}
						}
						if (res.result.count <= 20) {
							this.shopStatus = "nomore";
						}
						this.shopPage++;
						console.log(this.shopStatus);
					} else {
						this.shopStatus = "nomore";
					}
				})
			},
			clearSearch(index) {
				if (index == 'all') {
					this.searList = [];
					uni.setStorage({
						key: 'indexHistory',
						data: this.searList,
						success() {

						}
					});
				} else {
					this.searList.splice(index, 1);
					uni.setStorage({
						key: 'indexHistory',
						data: this.searList,
						success() {

						}
					});
				}
			}
		},
		onLoad(options) {
			let that = this;
			uni.getStorage({
				key: 'indexHistory',
				success(res) {
					that.searList = res.data;
				}
			});
		},
		onReachBottom() {
			if (this.active == 1 && this.shopStatus == "loading") {
				this.getShopList();
			}else if(this.active == 0 && this.shopStatus == "loading"){
				this.getGoods();
			}
		},
	}
</script>

<style scoped>
	.content {
		box-sizing: border-box;
		overflow: hidden;
		min-height: 100vh;
		padding: 0 24rpx 24rpx;
		background: #F2F2F2;
	}

	.tabBar {
		background: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx 10rpx;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 999;
	}

	/* 主体 */
	.nav {
		display: flex;
		font-size: 28rpx;
		color: red;
		padding: 36rpx 36rpx 4rpx;
	}

	.nav>view {
		text-align: center;
		margin-right: 60rpx;
	}

	.default {
		text-align: center;
		border-right: none;
		position: relative;
		color: rgba(36, 36, 36, 0.4);
		font-size: 28rpx;
	}

	.black {
		text-align: center;
		color: #333;
		font-size: 32rpx;
		border-right: none;
		position: relative;
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		font-weight: bold;
	}

	.black text {
		display: block;
	}

	.dot {
		width: 56rpx;
		height: 8rpx;
		background: #FFDD05;
		border-radius: 4px;
		margin-top: 4rpx;
	}

	.fun {
		background: linear-gradient(180deg, #FFFFFF 0%, #F2F2F2 100%);
		border-radius: 14px 14rpx 0 0;
	}

	.funsearch {
		padding: 16rpx;
	}

	/* fun1 */

	.fun1 {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: rgba(51, 51, 51, .4);
	}

	.funleft>view,
	.funright>view {
		width: 344rpx;
		overflow: hidden;
		background: #FFFFFF;
		border-radius: 8px;
		margin-top: 16rpx;
	}

	.fun1 .zhu {
		width: 100%;
	}

	.fun1 .logo {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		margin-right: 8rpx;
	}

	.fun1 .funtext {
		padding: 4rpx 16rpx 16rpx;
	}

	.fun1 .funtext>view:nth-of-type(1) {
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}

	.fun1 .funtext>view:nth-of-type(2) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 8rpx 0;
	}

	.fun1 .funtext>view:nth-of-type(2)>view:nth-of-type(1) {
		color: #FF3939;
		font-size: 22rpx;
	}

	.fun1 .funtext>view:nth-of-type(3) {
		display: flex;
		align-items: center;
	}

	.fun2 .list {
		display: flex;
		margin-top: 20rpx;
		background: #FFFFFF;
		border-radius: 8px;
		padding: 24rpx;
		box-sizing: border-box;
	}

	.fun2 .list>view:nth-of-type(1) image {
		width: 116rpx;
		height: 116rpx;
		border-radius: 4px;
	}

	.fun2 .list>view:nth-of-type(2) {
		font-size: 24rpx;
		flex: 1;
		box-sizing: border-box;
		padding-left: 20rpx;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(1) {
		font-size: 36rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(1) text:nth-of-type(1) {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		max-width: 400rpx;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(1) text:nth-of-type(2) {
		font-size: 24rpx;
		color: #ffffff;
		padding: 6rpx 26rpx;
		background: linear-gradient(137deg, #FEC200 0%, #FE8800 100%);
		border-radius: 14px;
		font-weight: normal;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(2),
	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(3) {
		color: rgba(51, 51, 51, .4);
		margin-top: 4rpx;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(4) {
		display: flex;
		align-items: center;
		color: #FF3939;
		font-size: 20rpx;
	}

	.fun2 .list>view:nth-of-type(2)>view:nth-of-type(4) text {
		border-radius: 4px;
		border: 1px solid #FF3939;
		padding: 2rpx 8rpx;
		margin: 12rpx 20rpx 16rpx 0;
	}

	.conlist {
		display: flex;
	}

	.conlist>view {
		width: 164rpx;
		margin-right: 12rpx;
	}

	.conlist>view:last-of-type {
		margin-right: 0;
	}

	.conlist>view>view:nth-of-type(1) {
		border-radius: 4px;
	}

	.conlist>view>view:nth-of-type(1) image {
		width: 164rpx;
		height: 164rpx;
		border-radius: 4px;
	}

	.conlist>view>view:nth-of-type(2) {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		margin: 4rpx 0;
	}

	.conlist>view>view:nth-of-type(3) {
		color: #FF3939;
	}

	/* 搜索 */
	.searchPop {
		width: 100%;
		min-height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background: #FFFFFF;
		z-index: 100;
	}

	.searchPop .clear {
		padding: 24rpx;
		border-bottom: 20rpx solid #F2F2F2;
		font-size: 32rpx;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.searchPop .clear>view:nth-of-type(2) {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: rgba(36, 36, 36, .6);
		font-weight: normal;
	}

	.searchPop .clear>view:nth-of-type(2) image {
		width: 28rpx;
		height: 28rpx;
		margin-right: 4rpx;
	}

	.searchPop .listsear>view {
		padding: 36rpx 0;
		margin: 0 24rpx;
		border-bottom: 1px solid #F2F2F2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: rgba(36, 36, 36, .6);
	}
</style>
