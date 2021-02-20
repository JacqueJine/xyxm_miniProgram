<template>
	<view>
		<view class="per" v-for="(item, index) in curHelpInfo" :key="index" @click="toExpressDetail(item.id)">
			<view class="per-t">
				<view class="issuer1">
					<view class="head" @click.stop="toMinePage(item.user_info.id)">
						<image class="imgInfo" :src="
                item.user_info.header == ''
                  ? '/static/mine/name1.png'
                  : imgBaseUrl + item.user_info.header
              "></image>
						<image v-if="item.user_info.show_attestation" class="is_auth" :src="
                item.user_info.show_attestation == 1
                  ? '/static/index/is_auth.png'
                  : item.user_info.show_attestation == 2
                  ? '/static/index/is_shop.png'
                  : item.user_info.show_attestation == 3
                  ? '/static/index/is_rider.png'
                  : ''
              "></image>
					</view>
					<view class="user">
						<view class="user-t user-tt">
							<view class="name">
								<view>{{ item.user_name }}</view>
							</view>
							<image class="gender" v-if="item.user_info.sex.code != 0" :src="
                  item.user_info.sex.code == 1
                    ? '/static/index/man.png'
                    : '/static/index/female.png'
                "></image>
							<!-- <image v-if="item.user_info.is_store.code==1" class="gender" src="/static/mine/shop.png"></image> -->
							<view>
								<text class="xinyu">信誉{{ item.user_info.credit }}</text>
							</view>
						</view>
						<view class="user-t" style="line-height: 16px;height: auto;">
							<!--  -->
							<view class="time">{{ $u.timeFrom(item.create_time, false) }} {{item.user_info.school.school_name}}</view>
							<!-- <view class="location"></view> -->
						</view>
					</view>
				</view>
				<image class="imgInfo" :src="
            item.task_state == 0
              ? '/static/index/noorder.png'
			  :item.task_state == 4
			    ? '/static/index/yesorder1.png'
              : '/static/index/yesorder.png'
          "></image>
			</view>

			<view class="per-c">
				<view class="per-c-l">
					<view>{{ item.title }}</view>
					<!-- 加急图片 -->
					<image class="imgInfo" v-if="item.type == 2 && item.is_good_prepay == 1" src="/static/index/yu.png" style="margin-right: 8rpx"></image>
					<image class="imgInfo" v-if="item.is_urgent == 1" src="/static/index/ji.png"></image>
				</view>
				<view class="per-c-r"> ￥{{ item.task_price_total }} </view>
			</view>

			<view class="per-c-b" v-if="item.type == 1">
				<view class="per2">
					<view class="t">取件：</view>
					<view class="c">{{ item.e_task_address }}</view>
				</view>
				<view class="per2">
					<view class="t">送件：</view>
					<view class="c">{{ item.e_destination }}</view>
				</view>
				<view class="per2">
					<view class="t">时间：</view>
					<view class="c">{{ item.destination_time.text }}之前</view>
				</view>
				<view class="per2">
					<view class="t">备注：</view>
					<view class="c" style="color: rgba(36, 36, 36, 0.4)">{{
            item.comment
          }}</view>
				</view>
			</view>
			<view class="per-c-b" v-if="item.type == 2">
				<view class="per2">
					<view class="t">取件：</view>
					<view class="c">{{ item.task_address }}</view>
				</view>
				<view class="per2">
					<view class="t">送件：</view>
					<view class="c">{{ item.destination }}</view>
				</view>
				<view class="per2">
					<view class="t">时间：</view>
					<view class="c">{{ item.destination_time.text }}之前</view>
				</view>
				<view class="per2">
					<view class="t">备注：</view>
					<view class="c" style="color: rgba(36, 36, 36, 0.4)">{{
            item.comment
          }}</view>
				</view>
			</view>
			<view class="per-c-b" v-if="item.type == 3">
				<view class="per2" style="align-items: flex-start;">
					<!-- class="t" -->
					<view style="color: rgba(36, 36, 36, 0.4);width:160rpx">任务内容：</view>
					<!-- class="c" -->
					<view>{{ item.express_desc }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			curHelpInfo: {
				type: Array,
				value: [],
			},
		},
		data() {
			return {
				imgBaseUrl: getApp().globalData.imgBaseUrl,
			};
		},
		methods: {
			toExpressDetail(id) {
				// 把每一项任务的id传递给父组件
				this.$emit("toExpressDetail", id);
			},
			toMinePage(id) {
				this.$emit("toMinePage", id);
			},
		},
	};
</script>

<style scoped>
	@import url("./expressage.css");
</style>
