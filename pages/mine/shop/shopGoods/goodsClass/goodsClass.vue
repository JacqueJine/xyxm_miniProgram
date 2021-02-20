<template>
	<view class="main">
		<view class="topNav">
			<view>
				分类名称（最多8个字）
			</view>
			<view v-if="!isEdit" @click="isEdit=!isEdit">
				排序
			</view>
			<view v-if="isEdit" @click="isEdit=!isEdit">
				编辑
			</view>
		</view>
		<view class="classList">
			<view class="classItem" v-for="(item,idx) in list" :key="idx">
				<view>
					{{item.name}}
				</view>
				<view v-if="!isEdit" class="classIcon">
					<u-icon @click="edit(item.id,item.name)" name="edit-pen" size="36rpx"></u-icon>
					<u-icon @click="delClass(item.id)" name="trash" style="margin-left: 40rpx;"></u-icon>
				</view>
				<view v-if="isEdit" class="classIcon">
					<u-icon name="arrow-up" size="36rpx" :color="idx!=0?'rgba(0, 145, 255, 1)':''" style="margin-right:40rpx;" @click="changeOrder('up',idx,item.id)"></u-icon>
					<u-icon name="arrow-down" size="36rpx" :color="idx!=list.length-1?'rgba(0, 145, 255, 1)':''" @click="changeOrder('down',idx,item.id)"></u-icon>
				</view>
			</view>
			<view class="classItem" v-if="showAdd&&!isEdit">
				<input v-model="className" maxlength="8" placeholder="请输入分类名称" />
				<view class="addBtn">
					<view @click="addClass">保存</view>
					<view @click="showClass">取消</view>
				</view>
			</view>
		</view>
		<u-popup v-model="showBox" :mask-close-able="false" border-radius="8" mode="center">
			<view class="showBox">
				<view class="title">请输入修改后的名称</view>
				<input placeholder="点击输入" maxlength="8" v-model="newName"></input>
				<view class="boxBtn">
					<view @click="showBox=!showBox">取消</view>
					<view @click="saveNew">确定</view>
				</view>
			</view>
		</u-popup>
		<view class="btn" v-if="!showAdd&&!isEdit" @click="showClass">
			<u-icon name="plus-circle" size="36rpx" style="margin-right:4rpx;"></u-icon>
			添加分类
		</view>
	</view>
</template>

<script>
	import {
		CreateClass,
		getClass,
		delClass,
	} from "../../../../../services/shop.js";
	export default {
		data() {
			return {
				isEdit: false,
				showAdd: false,
				className: '',
				showBox: false,
				newName: '',
				id: "",
				list: [],
			}
		},
		methods: {
			// 获取分类
			getList() {
				getClass({
					id: 1,
				}).then(res => {
					if (res.code == 200) {
						this.list = res.result;
					}
				})
			},
			showClass() {
				this.className = '';
				this.showAdd = !this.showAdd;
			},
			// 删除
			delClass(id) {
				let that = this;
				uni.showModal({
					title: '确认删除',
					content: '删除分类后，分类里面的商品将一起删除，谨慎操作',
					success(res) {
						if (res.confirm) {
							delClass({
								id: id,
							}).then(res => {
								uni.showToast({
									title: res.message,
									icon: 'none',
								});
								if (res.code == 200) {
									getClass({
										id: 1,
									}).then(res => {
										if (res.code == 200) {
											that.list = res.result;
										}
									})
								}
							})
							console.log(this);
						} else if (res.cancel) {

						}
					}
				})
			},
			// 排序
			changeOrder(type, order, id) {
				let orders = "";
				let datas = [];
				if (type == 'up') {
					if (order == 0) {
						uni.showToast({
							title: "已经是第一个了",
							icon: 'none',
						});
						return false;
					} else {
						orders = order - 1;
						datas.push({
							id: id,
							order: orders,
						});
						datas.push({
							id: this.list[order - 1].id,
							order: order,
						});
					}
				} else {
					if (order == this.list.length - 1) {
						uni.showToast({
							title: "已经是最后一个了",
							icon: 'none',
						});
						return false;
					} else {
						orders = order + 1;
						datas.push({
							id: id,
							order: orders,
						});
						datas.push({
							id: this.list[order + 1].id,
							order: order,
						});
					}
				}
				CreateClass({
					data: datas
				}).then(res => {
					uni.showToast({
						title: res.message,
						icon: 'none',
					});
					if (res.code == 200) {
						// 获取列表
						this.getList();
					}
				});
			},
			// 编辑
			edit(id, name) {
				this.id = id;
				this.newName = name;
				this.showBox = !this.showBox;
			},
			saveNew() {
				// 
				if (this.newName == "") {
					uni.showToast({
						icon: 'none',
						title: '请填写名称',
					})
					return false
				}
				CreateClass({
					data: [{
						id: this.id,
						store_id: 1,
						name: this.newName,
					}]
				}).then(res => {
					uni.showToast({
						title: res.message,
						icon: 'none',
					});
					this.showBox = false;
					if (res.code == 200) {
						this.showAdd = !this.showAdd;
						// 获取列表
						this.getList();
					}
				});
			},

			// 保存添加分类名称
			addClass() {
				if (this.className == "") {
					uni.showToast({
						icon: 'none',
						title: '请填写名称',
					})
					return false
				}
				CreateClass({
					data: [{
						store_id: 1,
						name: this.className,
					}]
				}).then(res => {
					uni.showToast({
						title: res.message,
						icon: 'none',
					});
					if (res.code == 200) {
						this.showAdd = !this.showAdd;
						// 获取列表
						this.getList();
					}
				});
			},
		},
		onShow() {
			this.getList();
		},
	}
</script>

<style scoped>
	.main {
		padding: 0 24rpx;
		background: #f9f9f9;
		min-height: 100vh;
	}

	.topNav {
		display: flex;
		justify-content: space-between;
		padding: 50rpx 0 16rpx;
		color: rgba(51, 51, 51, 0.4);
		font-size: 24rpx;
	}

	.topNav view:last-child {
		color: rgba(0, 145, 255, 1);
	}

	.classList {
		width: 100%;
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 16rpx;
	}

	.classItem {
		padding: 36rpx 38rpx 36rpx 24rpx;
		color: rgba(51, 51, 51, 1);
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid rgba(249, 249, 249, 1);
	}

	.classList .classItem:last-child {
		border-bottom: none;
	}

	.classIcon image {
		width: 36rpx;
		height: 36rpx;
		margin-left: 40rpx;
	}

	.addBtn {
		display: flex;
		align-items: center;
		color: rgba(162, 162, 162, 1);
		font-size: 28rpx;
	}

	.addBtn view:first-child {
		color: rgba(71, 175, 255, 1);
		margin-right: 40rpx;
	}

	.btn {
		display: flex;
		justify-content: center;
		padding: 28rpx 0;
		background: #fff;
		border-radius: 16rpx;
		font-size: 28rpx;
		color: rgba(0, 145, 255, 1);
	}

	.showBox {
		width: 560rpx;
		padding: 60rpx 40rpx 0rpx;
		text-align: center;
		font-size: 32rpx;
	}

	.showBox input {
		height: 116rpx;
		line-height: 116rpx;
		background: #ededed;
		margin-bottom: 20rpx;
	}

	.title {
		color: rgba(51, 51, 51, 1);
		margin-bottom: 46rpx;
	}

	.boxBtn {
		display: flex;
	}

	.boxBtn view {
		flex: 1;
		padding: 40rpx 0;
		color: rgba(162, 162, 162, 1);
	}

	.boxBtn view:last-child {
		color: rgba(71, 175, 255, 1);
	}
</style>
