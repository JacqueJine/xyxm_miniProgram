<template>
	<!-- 举报 -->
	<view>
		<u-popup v-model="showModal" mode="center" border-radius="8" z-index="19999">
			<view class="modalDlg3">
				<view class="t">我要举报</view>
				<view class="note">注：举报成功获得奖励，恶意举报将会受到惩罚</view>
				<textarea
					placeholder-style="font-size:14px;color:rgba(36,36,36,0.6);line-height:20px;"
					placeholder="请输入举报内容(不超过100字)"
					maxlength="100"
					v-model="inform"
					class="textarea"
				></textarea>
				<view class="btn">
					<view @click="isShowModal(false)">取消</view>
					<view class="submit" @click="submit(false)">提交</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	props: {
		id: {
			type: String,
			value: ''
		},
		type: {
			type: Number,
			value: null
		}
	},
	data() {
		return {
			imgBaseUrl: getApp().globalData.imgBaseUrl,
			inform: '',
			showModal: true
		};
	},
	methods: {
		submit() {
			console.log(id,type)
			// this.showModal= false;
		},
		isShowModal(bool) {
			console.log('bbb',bool)
			this.$emit('isShowModal', bool);
		},
	}
};
</script>

<style>
/* 弹出层，举报 */

.modalDlg3 {
	width: 592rpx;
	height: 400rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 4px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	overflow: hidden;
	text-align: center;
	padding: 0 24rpx;
	box-sizing: border-box;
}

.modalDlg3 .textarea {
	width: 516rpx;
	height: 156rpx;
	background: rgba(216, 216, 216, 0.5);
	text-align: left;
	opacity: 0.6;
	padding: 16rpx 20rpx;
	box-sizing: border-box;
}

.modalDlg3 .btn {
	height: 88rpx;
	line-height: 88rpx;
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	border-top: 1px solid rgba(151, 151, 151, 0.1);
	position: absolute;
	bottom: 0;
}

.modalDlg3 .t {
	margin-top: 24rpx;
	height: 40rpx;
	font-size: 28rpx;
	font-weight: bold;
	color: rgba(36, 36, 36, 1);
	line-height: 40rpx;
}

.modalDlg3 .submit {
	color: rgba(255, 221, 5, 1);
}

.modalDlg3 .note {
	height: 34rpx;
	font-size: 24rpx;
	font-weight: 400;
	color: rgba(36, 36, 36, 0.4);
	line-height: 34rpx;
	margin-top: 12rpx;
	margin-bottom: 16rpx;
}
</style>
