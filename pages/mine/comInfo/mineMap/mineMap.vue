<template>
	<view>
		<view class="search">
			<u-search placeholder="请输入" v-model="keyword" @search="searchmap" @custom="searchmap"></u-search>
		</view>
		<!-- <map style="width: 100%; height: 70vh;" :latitude="latitude" :longitude="longitude" :markers="covers">
		</map> -->
		<view class="top1">
			<map id="myMap" :markers="covers" style="width: 100%; height: 70vh" :longitude="longitude" :latitude="latitude"
			 scale="16" @markertap="changePoint" @tap="changTap">
			</map>
		</view>
		<view class="top2">
			<u-radio-group v-model="val" @change="radioGroupChange" :wrap="true">
				<u-radio v-for="(item, index) in allcovers" :key="index" :name="item.id">
					{{ item.title }}
				</u-radio>
			</u-radio-group>
		</view>
		<view @click="addSchool" class="submit">添加学校</view>
	</view>
</template>

<script>
	import qqmapsdk from "@/utils/map/qqmap-wx-jssdk.min.js";
	import {
		createschool
	} from "../../../../services/mine.js";
	export default {
		data() {
			return {
				keyword: "",
				latitude: "", //纬
				longitude: "", //经
				covers: [],
				val: "",
				allcovers: [],
				school_name: "",
			};
		},
		methods: {
			addSchool() {
				if (!this.school_name) {
					uni.showToast({
						title: "请选择学校",
						icon: "none",
					});
					return false;
				}
				uni.showLoading({
					title: "提交中……",
					mask: true,
				});
				createschool({
					data: {
						school_name: this.school_name,
						school_address: this.longitude + "," + this.latitude,
					},
				}).then((res) => {
					uni.hideLoading();
					uni.showToast({
						title: res.message,
						icon: "none",
					});
					if (res.code == 200) {
						setTimeout(() => {
							this.loading = false;
							uni.navigateBack();
						}, 1500);
					}
				});
			},
			changTap(e) {
				uni.request({
					url: "https://apis.map.qq.com/ws/geocoder/v1/?location=" +
						e.detail.latitude +
						"," +
						e.detail.longitude +
						"&key=A3ABZ-YPBC2-3QUUO-C3F4Q-STCUO-LPB4A&poi_options=category=大学",
					success: (res1) => {
						this.covers = [{
							title: res1.data.result.formatted_addresses.recommend,
							id: 1,
							latitude: e.detail.latitude,
							longitude: e.detail.longitude,
							iconPath: "",
						}, ];
						this.allcovers = [{
							title: res1.data.result.formatted_addresses.recommend,
							id: 1,
							latitude: e.detail.latitude,
							longitude: e.detail.longitude,
							iconPath: "",
						}, ];
						this.val = 1;
						this.school_name = res1.data.result.formatted_addresses.recommend;
					},
				});
			},
			changePoint(e) {
				this.val = this.covers[0].id;
				this.school_name = this.covers[i].title;
			},
			radioGroupChange(e) {
				for (let i in this.allcovers) {
					if (this.allcovers[i].id == e) {
						this.covers[0] = this.allcovers[i];
						this.longitude = this.allcovers[i].longitude;
						this.latitude = this.allcovers[i].latitude;
						this.school_name = this.allcovers[i].title;
					}
				}
			},
			searchmap() {
				const QQMapWX = new qqmapsdk({
					key: "A3ABZ-YPBC2-3QUUO-C3F4Q-STCUO-LPB4A",
				});
				QQMapWX.search({
					keyword: this.keyword, //搜索关键词
					filter: "category=大学",
					// page_size:1,
					success: res => {
						//搜索成功后的回调
						if(!res.data.length){
							return false;
						}
						this.longitude = res.data[0].location.lng;
						this.latitude = res.data[0].location.lat;
						let mks = [];
						this.covers = [];
						for (var i = 0; i < res.data.length; i++) {
							mks.push({
								// 获取返回结果，放到mks数组中
								title: res.data[i].title,
								id: res.data[i].id,
								latitude: res.data[i].location.lat,
								longitude: res.data[i].location.lng,
								iconPath: "", //图标路径

							});
						}
						this.val = mks[0].id;
						this.school_name = mks[0].title;
						this.covers.push(mks[0]);
						this.allcovers = mks; //设置markers属性，将搜索结果显示在地图中
					},
					fail: function(res) {
						console.log(res);
					},
					complete: function(res) {},
				});
			},
		},
		onLoad() {
			uni.getLocation({
				type: "wgs84",
				success: res => {
					this.longitude = res.longitude;
					this.latitude = res.latitude;
					// console.log("当前位置的经度：" + res.longitude);
					// console.log("当前位置的纬度：" + res.latitude);
					uni.request({
						url: "https://apis.map.qq.com/ws/geocoder/v1/?location=" +
							res.latitude +
							"," +
							res.longitude +
							"&key=A3ABZ-YPBC2-3QUUO-C3F4Q-STCUO-LPB4A&poi_options=category=大学",
						success: res1 => {
							this.allcovers = [{
								title: res1.data.result.formatted_addresses.recommend,
								id: 1,
								latitude: res.latitude,
								longitude: res.longitude,
								iconPath: "",
							}, ];
							this.covers = [{
								title: res1.data.result.formatted_addresses.recommend,
								id: 1,
								latitude: res.latitude,
								longitude: res.longitude,
								iconPath: "",
							}, ];
							this.val = 1;
							this.school_name = res1.data.result.formatted_addresses.recommend;
						},
					});
				},
			});
		},
	};
</script>

<style scoped>
	.search {
		padding: 24rpx;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background: #ffffff;
		z-index: 10;
	}

	.top1 {
		padding-top: 112rpx;
	}

	.top2 {
		padding: 24rpx;
	}

	.submit {
		text-align: center;
		margin: 24rpx;
		background: #fec200;
		border-radius: 25px;
		padding: 28rpx 0;
	}
</style>
