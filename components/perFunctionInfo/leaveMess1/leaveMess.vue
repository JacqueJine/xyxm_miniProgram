<template>
	<view class="leaveMess">
		<view class="top2_list" v-for="(item,index) in leaveMess" :key="index">
			<view class="top2_title">
				<view style="position: relative;" @click.stop="toMinePage(item.user_id)">
					<image :src="item.user_header==''?'/static/mine/name1.png':imgBaseUrl+item.user_header" class="head"></image>
					 <image
              v-if="item.show_attestation"
              class="is_auth"
              :src="
                item.show_attestation == 1
                  ? '/static/index/is_auth.png'
                  : item.show_attestation == 2
                  ? '/static/index/is_shop.png'
                  : item.show_attestation == 3
                  ? '/static/index/is_rider.png'
                  : ''
              "
            ></image>
				</view>
				<view class="top2_title2">
					<view>
						<view class="top2_title2_2">
							<text>{{item.user_name}}</text>
							<image v-if="item.user_sex.code!=0" :src="item.user_sex.code==2?'/static/index/female.png':'/static/index/man.png'" class="logo"></image>
							<!-- <image src="/static/mine/shop.png" class="logo" v-if="item.user_is_store==1"></image> -->
							<text class="tag" :style="isguan?'background: #FEC200;color: #000000;':''">{{isguan?'官方':'信誉'+item.user_credit}}</text>
							<text class="tag" style="background: #0091FF;color: #FFFFFF;" v-if="item.is_louzhu==1">楼主</text>
						</view>
						<view>
							<u-icon name="more-dot-fill" size="48rpx" color="#B8B8B8" @click.stop="moreBtn(item.id,item.user_id)"></u-icon>
						</view>
					</view>
					<view> <text style="margin-right: 10rpx;">{{item.create_time}} </text></view>
				</view>
			</view>
			<view class="top2_con">
				<view> <text v-if="item.comment_up_id!=0">回复</text> <text v-if="item.comment_up_id!=0" style="color: #0095FF;" @click="toMinePage(item.up_user_id)"> @ {{item.up_user_name}}：</text>{{item.comment}}</view>
				<view v-if="item.TaskCommentImg.length">
					<image v-for="(ite,ind) in item.TaskCommentImg" :key="ind" :lazy-load="true" :src="imgBaseUrl+ite.path" mode="aspectFill" @click.stop="showPop(item.TaskCommentImg,ind)" :style="item.TaskCommentImg.length==1?'':'width:160rpx;height:160rpx'"></image>
				</view>
			</view>
			<view class="top3_share">
				<view>
					
				</view>
				<view>
					<!-- <u-icon name="thumb-up-fill" size="40rpx" v-if="item.is_praise" color="#FF546E" style="margin-right: 6rpx;" @click="praise(2,item.id,item.user_id,index,1)"></u-icon>
					<u-icon name="thumb-up" size="40rpx" v-else style="margin-right: 6rpx;" @click="praise(1,item.id,item.user_id,index,1)"></u-icon>
					<text v-if="item.praise_count!=0">{{item.praise_count}}</text>
					<u-icon name="chat" size="40rpx" style="margin-left: 28rpx;" @click="showWrite(item.id,item.user_id,item.user_name)"></u-icon> -->
					<image src="/static/message/zan_full.png" style="width: 48rpx;height: 48rpx;margin-right: 6rpx;" v-if="item.is_praise" @click="praise(2,item.id,item.user_id,index,1)"></image>
					<image src="/static/message/zan.png" style="width: 48rpx;height: 48rpx;margin-right: 6rpx;" v-else @click="praise(1,item.id,item.user_id,index,1)"></image>
					<text v-if="item.praise_count!=0">{{item.praise_count}}</text>
					<image src="/static/message/mess.png" style="width: 48rpx;height: 48rpx;margin-left: 28rpx;" @click="showWrite(item.id,item.user_id,item.user_name)"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			leaveMess: {
				type: Array,
				value: []
			}
		},
		data() {
			return {
				imgBaseUrl: getApp().globalData.imgBaseUrl,
			}
		},
		methods: {
			toMinePage(id) {
				this.$emit("toMinePage", id);
			},
			moreBtn(id,uid) {
				this.$emit("moreBtn", id,uid);
			},
			showPop(item,index) {
				this.$emit("showPop", item,index);
			},
			showWrite(item,id,user_name){
				this.$emit("showWrite", item,id,user_name);
			},
			praise(type, task_comment_id, praise_user_id,index,page) {
				this.$emit("praise", type, task_comment_id, praise_user_id,index,page);
			},
		}
	}
</script>

<style scoped>
	@import url("./leaveMess.css");
</style>
