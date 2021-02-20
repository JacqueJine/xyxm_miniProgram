<template>
	<view>
		<u-cell-group>
			<u-cell-item title="店铺信息设置" @click="topage(1)"></u-cell-item>
			<u-cell-item title="店铺公告设置" @click="topage(2)"></u-cell-item>
			<u-cell-item title="营业时间设置" :value="shop.start_time+'-'+shop.end_time" @click="topage(3)"></u-cell-item>
			<u-cell-item title="起送金额设置" :value-style="valueStyle" :value="shop.upsendmoney+'元起送'" @click="topage(4)"></u-cell-item>
			<u-cell-item title="配送费设置" @click="topage(5)"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	import {
		storeDetail
	} from "../../../../services/shop.js";
	export default {
		data() {
			return {
				valueStyle: {
					color: "#0095FF"
				},
				shopId: "",
				shop:{},
			}
		},
		methods: {
			topage(index) {
				let url = "";
				if (index == 1) {
					url = "/pages/mine/shop/openShop/openShop?type=3&shopId=" + this.shopId;
				} else if (index == 2) {
					url = "/pages/mine/shop/shopSetting/ggSetting/ggSetting?type=1&shopId=" + this.shopId;
				} else if (index == 3) {
					url = "/pages/mine/shop/shopSetting/ggSetting/ggSetting?type=2&shopId=" + this.shopId;
				} else if (index == 4) {
					url = "/pages/mine/shop/shopSetting/ggSetting/ggSetting?type=3&shopId=" + this.shopId;
				} else if (index == 5) {
					url = "/pages/mine/shop/shopSetting/psSetting/psSetting?shopId=" + this.shopId;
				}
				uni.navigateTo({
					url: url,
				})
			}
		},
		onLoad(options) {
			this.shopId = options.shopId;
		},
		onShow() {
			storeDetail({
				id: this.shopId, //店铺id
			}).then(res => {
				if (res.code == 200) {
					this.shop = res.result;
				}
			});
		},
	}
</script>

<style scoped>

</style>
