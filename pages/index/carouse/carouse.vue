<template>
	<view>
		<view class="con">
			<u-parse :html="list.CarouselInfo.text" :domain="domain" :lazy-load="true" :use-cache="true"></u-parse>
		</view>
	</view>
</template>

<script>
	import {
		carouselList
	} from 'services/mine.js';
	export default {
		data() {
			return {
				list: "",
				domain:getApp().globalData.imgBaseUrl,
			}
		},
		methods: {

		},
		onLoad(options) {
			carouselList({
				where: {
					id: options.id,
				},
				page: 1,
				limit: 1,
			}).then(res => {
				if (res.code == 200) {
					uni.setNavigationBarTitle({
						title: res.result.list[0].name,
					});
					this.list = res.result.list[0];
				}
			});
		},
	}
</script>

<style>
.con{
	padding:24rpx;
}
</style>
