<template>
	<view class="main">
		<view class="dateBtn" @click="show=!show">
			<!-- 2020年9月 -->
			{{showDate}}
			<u-icon name="play-right-fill"></u-icon>
		</view>
		<view class="count">
			<!-- <text>收入：999</text> -->
			<text>支出：{{user_order_list_sum}}</text>
		</view>
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index">
				<view class="itemleft">
					<view>{{item.note}}</view>
					<view>{{item.type==1?'余额支付':item.type==2?'微信支付':''}} {{item.create_time}}</view>
				</view>
				<view class="itemright">
					-{{item.total}}
				</view>
			</view>
		</view>
		<u-loadmore margin-top="24" margin-bottom="24" :status="status" :icon-type="iconType" :load-text="loadText" />
		<u-picker v-model="show" mode="time" :params="params" start-year="2018" :end-year="endYear" @confirm="setTime" @cancel="show=!show"></u-picker>
	</view>
</template>

<script>
	import {
		selfExpense
	} from "../../../services/mine.js";
	export default {
		data() {
			return {
				showDate: "",
				show: false,
				params: {
					year: true,
					month: true,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
				page: 1,
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '上拉或点击',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				list:[],
				datas:"",
				endYear:2020,
				user_order_list_sum:0,
			}
		},
		methods: {
			setTime(val) {
				this.show = !this.show;
				this.showDate = val.year + '年' + val.month + '月';
				this.datas=val.year +'-'+ val.month;
				this.list=[];
				this.page=1;
				this.status='loading';
				this.getList();
			},
			add0(m) {
				return m < 10 ? '0' + m : m
			},
			format(shijianchuo) {
				var time = new Date(shijianchuo);
				var y = time.getFullYear();
				var m = time.getMonth() + 1;
				this.datas=y +'-'+ m;
				return y + '年' + this.add0(m) + '月';
			},
			getList(){
				selfExpense({
					page:this.page,
					limit:10,
					where:{
						create_time:this.datas,
					},
				}).then(res=>{
					if(res.code==200){
						if(res.result.count<=10){
							this.status="nomore";
						}
						this.page++;
						this.list=this.list.concat(res.result.list);
						this.user_order_list_sum=res.result.user_order_list_sum;
					}else{
						this.status="nomore";
					}
				});
			},
		},
		onReachBottom() {
			if(this.status=="nomore"){
				return false;
			}
			this.getList();
		},
		onLoad() {
			this.showDate = this.format(new Date().getTime());
			this.endYear = new Date().getFullYear();
			this.getList();
		},
		onShow: function() {
			
		},
	}
</script>

<style scoped>
	.main {
		min-height: 100vh;
		box-sizing: border-box;
		padding: 42rpx 0 0;
	}

	.dateBtn {
		background: rgba(0, 145, 255, 0.1);
		border-radius: 28rpx;
		font-size: 32rpx;
		color: #0091ff;
		display: flex;
		width: 260rpx;
		height: 56rpx;
		line-height: 56rpx;
		justify-content: center;
		margin: 0 24rpx;
	}

	.count {
		padding: 38rpx 24rpx 60rpx;
		font-size: 24rpx;
		color: rgba(51, 51, 51, 0.4);
	}

	.count text:first-child {
		margin-right: 76rpx;
	}

	.item {
		padding: 40rpx 24rpx;
		border-bottom: 1px solid #F2F2F2;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.itemleft {
		width: 500rpx;
	}

	.itemleft>view:nth-of-type(1) {
		width: 500rpx;
		font-size: 28rpx;
		overflow: hidden;

		text-overflow: ellipsis;

		display: -webkit-box;

		-webkit-box-orient: vertical;

		-webkit-line-clamp: 2;
	}

	.itemleft>view:nth-of-type(2) {
		font-size: 24rpx;
		color: rgba(51, 51, 51, .4);
	}

	.itemright {
		font-size: 32rpx;
		color: #FF3939;
	}
</style>
