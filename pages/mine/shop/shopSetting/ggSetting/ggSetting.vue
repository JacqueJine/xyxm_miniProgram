<template>
	<view>
		<view class="content">
			<view class="top1" v-if="type==1">
				<textarea v-model="forminfo.notice" maxlength="40" placeholder="请输入公告，不超过40个字" />
				</view>
		    <view class="top2" v-if="type==2">
				<u-cell-item title="开始时间" :value="forminfo.start_time" @click="getTime(1)"></u-cell-item>
				<u-cell-item title="结束时间" :value="forminfo.end_time" @click="getTime(2)"></u-cell-item>
		    </view>
		    <view class="top3" v-if="type==3">
		        <view>请输入起送金额</view>
		        <input value="10" type="number" v-model="forminfo.upsendmoney"/>
		    </view>
		    <view class="btn" @click="submit">保存</view>
		    <!-- 弹窗 -->
		    <u-picker v-model="show" mode="time" :params="params" :default-time="defaultTime" @confirm="setTime" @cancel="show=!show"></u-picker>
		</view>
	</view>
</template>

<script>
	import {storeDetail,CreateStore} from "../../../../../services/shop.js";
	export default {
		data() {
			return {
				  type: 1,
				  forminfo:{
					  notice: "",
					  start_time:"",
					  end_time:"",
					  upsendmoney:"",
				  },
				  show: false,
				  selTime: 1,
				  params: {
				  			year: false,
				  			month: false,
				  			day: false,
				  			hour: true,
				  			minute: true,
				  			second: false
				  			},
				defaultTime:"00:00",
				shopId:"",
			}
		},
		methods: {
			getTime(index){
				this.show=!this.show;
				this.selTime=index;
				if(index==1){
					this.defaultTime=this.forminfo.start_time;
				}else if(index==2){
					this.defaultTime=this.forminfo.end_time;
				}
			},
			setTime(val){
				if(this.selTime==1){
					this.forminfo.start_time=val.hour+':'+val.minute;
				}else{
					this.forminfo.end_time=val.hour+':'+val.minute;
				}
				this.show=!this.show;
			},
			submit(){
				if(this.forminfo.upsendmoney<0){
					uni.showToast({
						title:"起送金额不得小于0",
						icon:'none'
					});
					return false;
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
						setTimeout(()=>{
							uni.navigateBack();
						},1500);
					}
				})
			},
		},
		onLoad: function(options) {
			this.type = options.type;
			this.shopId=options.shopId;
			if (options.type == 1) {
				uni.setNavigationBarTitle({
					title: '店铺公告设置'
				})
			} else if (options.type == 2) {
				uni.setNavigationBarTitle({
					title: '店铺营业时间设置'
				})
			} else if (options.type == 3) {
				uni.setNavigationBarTitle({
					title: '店铺起送金额设置'
				})
			};
			storeDetail({
				id: options.shopId, //店铺id
			}).then(res => {
				if (res.code == 200) {
					this.forminfo.notice = res.result.notice;
					this.forminfo.end_time = res.result.end_time;
					this.forminfo.start_time = res.result.start_time;
					this.forminfo.upsendmoney = res.result.upsendmoney;
				}
			});
		},
	}
</script>

<style scoped>
.content {
    padding: 0 24rpx;
}

textarea {
    background: #F9F9F9;
    width: 100%;
    padding: 24rpx;
    box-sizing: border-box;
    margin: 52rpx 0 90rpx;
}

.content .btn {
    line-height: 108rpx;
    text-align: center;
    background: #FEC200;
    border-radius: 4px;
    font-size: 36rpx;
}

.top2 {
    margin-bottom: 340rpx;
}

.top3 {
    padding: 60rpx 0 400rpx;
}

input {
    height: 86rpx;
    line-height: 86rpx;
    border: none;
    background: #F9F9F9;
    margin-top: 20rpx;
    padding-left: 24rpx;
}

.title {
    color: rgba(44, 44, 44, .4);
}
</style>
