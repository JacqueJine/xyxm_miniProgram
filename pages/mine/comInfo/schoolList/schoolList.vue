<template>
	<view>
		<view class="search">
			<u-search placeholder="搜索我的学校" v-model="keyword" @search="searchSchool" @custom="searchSchool"></u-search>
		</view>
		<view style="padding-top: 112rpx;">
			<view @click="toAdd" class="list" style="color: #007AFF;">添加我的学校</view>
			<view class="list" v-for="(item,index) in list" :key="index" @click="getschool(item)">{{item.school_name}}</view>
		</view>
	</view>
</template>

<script>
	import {
		getschoollist,
	} from "../../../../services/mine.js";
	export default {
		data() {
			return {
				keyword: "",
				list: [],
			}
		},
		methods: {
			toAdd() {
				uni.navigateTo({
					url: "/pages/mine/comInfo/mineMap/mineMap",
				});
			},
			getschool(item){
				uni.setStorageSync('school', item);
				uni.navigateBack();
			},
			searchSchool() {
				getschoollist({
					where:{
						school_name:this.keyword,
					}
				}).then((res) => {
					if (res.code == 200) {
						this.list = res.result;
					}else{
						this.list=[];
					}
				});
			},
			getList() {
				getschoollist({}).then((res) => {
					if (res.code == 200) {
						this.list = res.result;
					}else{
						this.list=[];
					}
				});
			},
		},
		onShow() {
			this.getList();
		},
	}
</script>

<style>
	.search {
		padding: 24rpx;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background: #ffffff;
		z-index: 10;
	}

	.list {
		border-bottom: 1px solid #f2f2f28a;
		text-align: center;
		padding: 24rpx 0;
		margin:0 50rpx;
	}
</style>
