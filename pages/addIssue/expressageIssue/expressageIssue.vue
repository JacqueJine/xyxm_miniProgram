<template>
	<view class="all">
		<view class="top1">
			<view class="perFlex">
				<view class="t">标题</view>
				<view class="c">取快递{{ expressageInfo.length }}件</view>
			</view>
		</view>
		<!-- 快递信息 -->
		<view class="top2">
			<view class="top2-per" v-for="(item, index) in expressageInfo" :key="index">
				<view class="perFlex">
					<view class="t">
						<text style="color: rgba(252, 35, 35, 1)">*</text> 取件地点</view>
					<input placeholder-style="color:rgba(36, 36, 36, 0.4);" class="inputC" v-model="item.task_address" maxlength="16"
					 placeholder="请输入不超过16个字" :disabled="true" @click="getindex1(5, index)" />
				</view>
				<view class="perFlex">
					<view class="t">
						<text style="color: rgba(252, 35, 35, 1)">*</text> 送件地点</view>
					<input :adjust-position="false" placeholder-style="color:rgba(36, 36, 36, 0.4);" class="inputC" maxlength="16"
					 placeholder="请输入不超过16个字" v-model="item.destination" :disabled="true" @click="getindex1(6, index)" />
				</view>
				<view class="perFlex" v-if="index < 1" @click="getTime">
					<view class="t">
						<text style="color: rgba(252, 35, 35, 1)">*</text> 送件时间</view>
					<input :adjust-position="false" placeholder-style="color:rgba(36, 36, 36, 0.4);" :disabled="true" class="inputC"
					 maxlength="16" placeholder="请选择" v-model="time" />
				</view>
				<view class="perFlex pickInfo">
					<view class="t">
						<text style="color: rgba(252, 35, 35, 1)">*</text> 取件信息
					</view>
					<!-- @click="goTextarea(index, 1)" -->
					<view class="textarea" @click="getindex1(8, index)">
						<textarea v-model="item.express_desc" fixed placeholder="该信息只有接单者能见，请准确填写取件码，快递公司，取件人姓名电话。（限30个字）" style="height: 100%"
						 :disabled="true" ></textarea>
						<!-- <text v-if="item.express_desc == ''" style="color: rgba(36, 36, 36, 0.4)">该信息只有接单者能见，请准确填写取件码，快递公司，取件人姓名电话。（限30个字）</text>
						<text v-else>{{ item.express_desc }}</text> -->
					</view>
				</view>
			</view>
			<u-icon name="minus-circle-fill" @click="jian" size="46rpx" class="jian" v-if="expressageInfo.length > 1" color="#FF3939"></u-icon>
			<!-- 继续添加 -->
			<view class="add" @click="add">
				<u-icon name="plus-circle" style="margin-right: 6rpx"></u-icon>继续添加
			</view>
		</view>
		<!-- 发布人信息 -->
		<view class="top3">
			<view class="top2-per">
				<view class="perFlex">
					<view class="t">
						<text style="color: rgba(252, 35, 35, 1)">*</text> 我的称呼
					</view>
					<input :disabled="true" @click="getindex(1)" placeholder-style="color:rgba(36, 36, 36, 0.4);" class="inputC"
					 v-model="issuerInfo.name" placeholder="请输入" maxlength="8" />
				</view>

				<view class="perFlex">
					<view class="t">
						<text style="color: rgba(252, 35, 35, 1)">*</text> 我的电话</view>
					<input :disabled="true" @click="getindex(2)" placeholder-style="color:rgba(36, 36, 36, 0.4);" v-model="issuerInfo.tel"
					 class="inputC" placeholder="请输入" maxlength="11" type="number" />
				</view>

				<view class="perFlex pickInfo">
					<view class="t"> 备注 </view>
					<!-- @click="goTextarea('', 2)" -->
					<view class="textarea" @click="getindex(7)">
						<textarea fixed v-model="issuerInfo.notes" placeholder="选填（限30个字）" style="height: 100%" :disabled="true"
						 ></textarea>
						<!-- <text v-if="issuerInfo.notes == ''" style="color: rgba(36, 36, 36, 0.4)">选填（限30个字）</text>
						<text v-else>{{ issuerInfo.notes }}</text> -->
					</view>
				</view>
			</view>
		</view>
		<!-- 加急信息 -->
		<view class="top4">
			<view class="top2-per">
				<view class="perFlex">
					<view class="t">
						<text style="color: rgba(252, 35, 35, 1)">*</text> 赏金(元)</view>
					<input class="inputC" v-model="money" :disabled="true" @click="getindex(3)" type="digit" placeholder-style="color:rgba(36, 36, 36, 0.4);"
					 placeholder="请输入赏金,不可为0" />
				</view>

				<view class="perFlex" style="border: none">
					<view class="t" style="width: 90%">
						是否加急
						<text style="color: rgba(36, 36, 36, 0.4); font-size: 24rpx">（排名置顶，优先接单）</text>
					</view>
					<u-switch v-model="is_urgent" active-color="#FEC200"></u-switch>
				</view>
				<view class="perFlex" v-if="is_urgent">
					<view class="t" style="height: 108rpx; line-height: 108rpx">
						<text style="color: rgba(252, 35, 35, 1)">*</text>
						<text>加赏金额(元)</text>
						<u-icon name="info-circle" @click="urgentPrice" size="40rpx" color="#CCCCCC" style="position: relative; top: 6rpx; margin-left: 6rpx"></u-icon>
					</view>
					<input placeholder-style="color:rgba(36, 36, 36, 0.4);" type="digit" v-model="urgent_price" class="inputC" id="teshu"
					 placeholder="请输入加急赏金，最低2元" :disabled="true" @click="getindex(4)" />
				</view>
				<!-- <view class="tishi">任务完成时间默认是12个小时</view> -->
			</view>
		</view>
		<!-- 发布 -->
		<view class="issue-wai">
			<view class="issue" @click="issue">发布</view>
		</view>
		<!-- 时间选择 -->
		<u-select v-model="showTime" mode="mutil-column-auto" :list="list" @confirm="confirm"></u-select>
		<!-- input输入 -->
		<u-popup v-model="showinput" mode="top" :safe-area-inset-bottom="true" z-index="10099" @open="textFocus = true"
		 @close="textFocus = false">
			<view class="writeReply">
				<view>
					<view>
						<textarea :focus="textFocus" v-model="comment" placeholder="请输入……"></textarea>
					</view>
				</view>
				<view>
					<text @click="addComm">确定</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		addTask,
		getInfoSystem,
		getInfoTask,
	} from "../../../services/function.js";
	import {
		findUserInfo
	} from "../../../services/mine.js";
	export default {
		data() {
			return {
				showinput: false,
				textFocus: false,
				comment: "",
				index: 1,
				textindex: 0,
				expressageInfo: [{
					task_address: "",
					destination: "",
					express_desc: "",
				}, ], // 全部的待取快递信息，可为多条数据
				time: "",
				destination_time: "",
				showTime: false,
				list: [],
				issuerInfo: {
					name: "",
					tel: "",
					notes: "",
				},
				money: "",
				is_urgent: 0,
				urgent_price: "0",
				price: "",
				j_rate: "",
				regMoney: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^[1-9]$)|(^\d\.[1-9]{1,2}$)|(^\d\.[0]{1}[1-9]{1}$|(^\d\.[1-9]{1}[0]{1}$)$)/,
				regPhone: /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/,
			};
		},
		methods: {
			getindex1(index, type) {
				if (index == 5) {
					this.comment = this.expressageInfo[type].task_address;
				} else if (index == 6) {
					this.comment = this.expressageInfo[type].destination;
				} else if (index == 8) {
					this.comment = this.expressageInfo[type].express_desc;
				}
				this.showinput = !this.showinput;
				this.textindex = type;
				this.index = index;
			},
			getindex(index) {
				if (index == 1) {
					this.comment = this.issuerInfo.name;
				} else if (index == 2) {
					this.comment = this.issuerInfo.tel;
				} else if (index == 3) {
					this.comment = this.money;
				} else if (index == 4) {
					this.comment = this.urgent_price;
				} else if (index == 7) {
					this.comment = this.issuerInfo.notes;
				}
				this.showinput = !this.showinput;
				this.index = index;
			},
			addComm() {
				if (this.comment == "") {
					uni.showToast({
						title: "请输入内容",
						icon: "none",
					});
					return false;
				}

				if (this.index == 1) {
					if (this.comment.length > 8) {
						uni.showToast({
							title: "昵称不能超过8个字",
							icon: "none",
						});
						return false;
					}
					this.issuerInfo.name = this.comment;
				} else if (this.index == 2) {
					if (!this.regPhone.test(this.comment)) {
						uni.showToast({
							title: "请输入正确手机号",
							icon: "none",
						});
						return false;
					}
					this.issuerInfo.tel = this.comment;
				} else if (this.index == 3) {
					if (!this.regMoney.test(this.comment)) {
						uni.showToast({
							title: "请输入正确赏金",
							icon: "none",
						});
						return false;
					}
					this.money = this.comment;
				} else if (this.index == 4) {
					if (!this.regMoney.test(this.comment)) {
						uni.showToast({
							title: "请输入正确加急金额",
							icon: "none",
						});
						return false;
					}
					this.urgent_price = this.comment;
				}
				if (this.index == 5) {
					if (this.comment.length > 16) {
						uni.showToast({
							title: "取件地点不能超过16个字",
							icon: "none",
						});
						return false;
					}
					this.expressageInfo[this.textindex].task_address = this.comment;
				} else if (this.index == 6) {
					if (this.comment.length > 16) {
						uni.showToast({
							title: "送件地点不能超过16个字",
							icon: "none",
						});
						return false;
					}
					this.expressageInfo[this.textindex].destination = this.comment;
				} else if (this.index == 8) {
					if (this.comment.length > 30) {
						uni.showToast({
							title: "取件信息不能超过30个字",
							icon: "none",
						});
						return false;
					}
					this.expressageInfo[this.textindex].express_desc = this.comment;
				} else if (this.index == 7) {
					if (this.comment.length > 30) {
						uni.showToast({
							title: "备注不能超过30个字",
							icon: "none",
						});
						return false;
					}
					this.issuerInfo.notes = this.comment;
				}
				this.showinput = !this.showinput;
			},
			getTime() {
				this.setTime();
				this.showTime = !this.showTime;
			},
			confirm(e) {
				let myDate = new Date();
				this.time = e[0].label + " " + e[1].label + ":" + e[2].label + "前";
				this.destination_time =
					myDate.getFullYear() +
					"/" +
					Number(myDate.getMonth() + 1) +
					"/" +
					myDate.getDate() +
					" " +
					e[1].label +
					":" +
					e[2].label +
					":00";
			},
			// 时间设置
			setTime() {
				this.list = [];
				let myDate = new Date();
				let minutes = myDate.getMinutes();
				let hour = myDate.getHours() + 1;
				for (let i = 0; i < 2; i++) {
					this.list.push({
						value: "",
						label: i == 0 ?
							"今天 " + Number(myDate.getMonth() + 1) + "/" + myDate.getDate() : "明天" +
							Number(myDate.getMonth() + 1) +
							"/" +
							Number(myDate.getDate() + 1),
						children: [],
					});

					if (i == 0) {
						// 时
						if (hour == 24) {
							return false;
						}
						for (let j = hour; j < 24; j++) {
							if (j < 10) {
								this.list[0].children.push({
									value: "",
									label: "0" + j,
									children: [],
								});
							} else {
								this.list[0].children.push({
									value: "",
									label: j,
									children: [],
								});
							}
						}
					} else {
						// 时
						for (let j = 0; j < 24; j++) {
							if (j < 10) {
								this.list[1].children.push({
									value: "",
									label: "0" + j,
									children: [],
								});
							} else {
								this.list[1].children.push({
									value: "",
									label: j,
									children: [],
								});
							}
						}
					}
				}
				// 分

				for (let j = 0; j < this.list[1].children.length; j++) {
					for (let n = 0; n < 60; n += 30) {
						this.list[1].children[j].children.push({
							value: "",
							label: n == 0 ? "00" : n,
						});
					}
				}
				for (let j = 0; j < this.list[0].children.length; j++) {
					if (minutes < 30) {
						for (let n = minutes; n < 60; n += 30) {
							this.list[0].children[j].children.push({
								value: "",
								label: n < 10 ? "0" + n : n,
							});
						}
					} else if (minutes >= 30) {
						for (let n = minutes; n >= 0; n -= 30) {
							this.list[0].children[j].children.push({
								value: "",
								label: n < 10 ? "0" + n : n,
							});
						}
					}
				}
				// 去掉半小时的那一个
				if (minutes >= 30) {
					this.list[0].children[0].children.splice(1, 1);
				}
			},
			// 加急警告
			urgentPrice() {
				uni.showModal({
					title: "赏金说明",
					content: "加急赏金是给接单者的加急奖励，平台收取 " +
						this.j_rate +
						"% 手续费，且加急金额不能小于2元",
					confirmText: "我已了解",
					confirmColor: "rgba(255, 221, 5, 1)",
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							// console.log("点击确认回调");
						} else {
							// console.log("点击取消回调");
						}
					},
				});
			},
			jian() {
				this.expressageInfo.splice(-1, 1);
			},
			// 添加快递信息
			add() {
				this.expressageInfo = this.expressageInfo.concat({
					task_address: "",
					destination: "",
					express_desc: "",
				});
			},
			// goTextarea(index, type) {
			// 	if (type == 1) {
			// 		wx.navigateTo({
			// 			url: "/pages/index/schoolShop/goodsOrder/remark/remark?frompage=expressageIssue&remark=" +
			// 				this.expressageInfo[index].express_desc +
			// 				"&type=" +
			// 				type +
			// 				"&index=" +
			// 				index,
			// 		});
			// 	} else {
			// 		wx.navigateTo({
			// 			url: "/pages/index/schoolShop/goodsOrder/remark/remark?frompage=expressageIssue&remark=" +
			// 				this.issuerInfo.notes +
			// 				"&type=" +
			// 				type,
			// 		});
			// 	}
			// },
			getKey() {
				getInfoSystem({
					key: "加急费率",
				}).then((res) => {
					if (res.code == 200) {
						this.j_rate = res.result.value;
					}
				});
			},
			issue() {
				//判断取件信息是否完整
				for (let i in this.expressageInfo) {
					if (this.expressageInfo[i].task_address == "") {
						uni.showToast({
							title: "请输入取件地点",
							icon: "none",
						});
						return false;
					} else if (this.expressageInfo[i].destination == "") {
						uni.showToast({
							title: "请输入送件地点",
							icon: "none",
						});
						return false;
					} else if (this.expressageInfo[i].express_desc == "") {
						uni.showToast({
							title: "请输入取件信息",
							icon: "none",
						});
						return false;
					}
				}
				if (this.destination_time == "") {
					uni.showToast({
						title: "请选择送件时间",
						icon: "none",
					});
					return false;
				} else if (this.issuerInfo.name == "") {
					uni.showToast({
						title: "请输入您的称呼",
						icon: "none",
					});
					return false;
				} else if (!this.regPhone.test(this.issuerInfo.tel)) {
					uni.showToast({
						title: "请输入正确手机号",
						icon: "none",
					});
					return false;
				} else if (!this.regMoney.test(this.money)) {
					uni.showToast({
						title: "请输入正确赏金",
						icon: "none",
					});
					return false;
				} else if (this.is_urgent == 1) {
					if (!this.regMoney.test(this.urgent_price) || this.urgent_price < 2) {
						uni.showToast({
							title: "请输入正确加急金额",
							icon: "none",
						});
						return false;
					}
				}
				this.price =this.$Numcheck.rounding(this.money * 1 + this.urgent_price * 1, 2);
				// this.price = (this.money * 1 + this.urgent_price * 1).toFixed(2);
				let datas = {
					type: 1,
					desc: this.expressageInfo,
					title: "取快递" + this.expressageInfo.length + "件",
					destination_time: this.destination_time,
					user_name: this.issuerInfo.name,
					user_phone: this.issuerInfo.tel,
					comment: this.issuerInfo.notes,
					money: this.money,
					is_urgent: this.is_urgent,
					is_good_prepay: 0,
					good_prepay: 0,
					user_id: JSON.parse(uni.getStorageSync("user")).id,
					urgent_price: this.urgent_price,
					price: this.price,
				};
				// 文本检测
				let text = "";
				for (let i in this.expressageInfo) {
					text =
						text +
						this.expressageInfo[i].task_address +
						this.expressageInfo[i].destination +
						this.expressageInfo[i].express_desc;
				}
				text = text + this.issuerInfo.name + this.issuerInfo.notes;
				// 消息提醒 新的评论回复 、新的评论提醒、服务进度
				uni.requestSubscribeMessage({
					tmplIds: ['Q0dB1QJc9GcGSfT5tpj6GBbf53JiHhz6RDQZOVM6i3Y', 'mc5xJywLUfHxkLOaV2oIzYBbO3O0AqjTxq75RRAh_ps',
						'VkSklDJC5xONLGxOfWoJS1uWdVzBztd--rZasHzsMMI'
					],
					complete: async res => {
						// 不管成功失败都执行添加任务
						try {
							await this.$check.checkTxt(text);
							uni.showLoading({
								title: "提交中……",
								mask: true,
							});
							addTask({
								data: datas,
							}).then((res1) => {
								if (res1.code == 200) {
									setTimeout(() => {
										uni.hideLoading();
										uni.redirectTo({
											url: "/pages/addIssue/issueOrder/issueOrder?id=" +
												res1.result.task_id,
										});
									}, 1500);
								} else {
									uni.hideLoading();
									uni.showToast({
										title: res1.message,
										icon: "none",
									});
								}
							});
						} catch (e) {
							for (let i in this.expressageInfo) {
								this.expressageInfo[i].task_address = "";
								this.expressageInfo[i].destination = "";
								this.expressageInfo[i].express_desc = "";
							}
							this.time = "";
							this.destination_time = "";
							this.issuerInfo.name = "";
							this.issuerInfo.notes = "";
							return false;
						}
					}
				});
			},
		},
		onLoad(options) {
			// 重新发布
			if (options.id) {
				getInfoTask({
					id: options.id,
				}).then((res) => {
					if (res.code == 200) {
						this.issuerInfo.name = res.result.user_name;
						this.issuerInfo.tel = res.result.user_phone;
						this.issuerInfo.notes = res.result.comment;
						this.money = res.result.money;
						this.is_urgent = res.result.is_urgent;
						this.urgent_price = res.result.urgent_price;
						this.expressageInfo = [];
						for (let i in res.result.task_expressage) {
							this.expressageInfo.push({
								task_address: res.result.task_expressage[i].task_address,
								destination: res.result.task_expressage[i].destination,
								express_desc: res.result.task_expressage[i].express_desc,
							});
						}
						this.getKey();
					}
				});
			} else {
				findUserInfo({}).then((res) => {
					if (res.code == 200) {
						this.issuerInfo.name = res.result.name;
						this.issuerInfo.tel = res.result.phone;
						this.getKey();
					}
				});
			}
		},
		onShow() {
			// let that = this;
			// uni.getStorage({
			// 	key: "issueInfo",
			// 	success(res) {
			// 		let options = JSON.parse(res.data);
			// 		if (options.type == 1) {
			// 			that.expressageInfo[options.index].express_desc = options.value;
			// 		} else if (options.type == 2) {
			// 			that.issuerInfo.notes = options.value;
			// 		}
			// 	},
			// });
		},
	};
</script>

<style scoped>
	.all {
		height: 100vh;
		width: 100%;
		background: rgba(245, 245, 245, 1);
		display: flex;
		flex-direction: column;
		overflow: auto;
		color: rgba(36, 36, 36, 1);
		padding-bottom: 70rpx;
		box-sizing: border-box;
	}

	.top1 {
		width: 100%;
		height: 108rpx;
		line-height: 108rpx;
		background: #fff;
	}

	.perFlex-top1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		border-bottom: 1px solid rgba(245, 245, 245, 1);
	}

	.top2 {
		width: 100%;
		height: auto;
		background: #fff;
		margin-top: 24rpx;
		position: relative;
		padding-bottom: 50rpx;
	}

	/* 公共 -start */

	.top2-per {
		width: 100%;
		margin-bottom: 24rpx;
	}

	.perFlex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 40rpx;
		box-sizing: border-box;
		height: 108rpx;
		width: 100%;
		border-bottom: 1px solid rgba(245, 245, 245, 1);
	}

	.top2-per .perFlex:nth-last-child(1) {
		border: none;
	}

	.perFlex input {
		width: 70%;
		height: 100%;
		text-align: right;
		font-size: 32rpx;
	}

	#teshu {
		width: 60%;
	}

	.t {
		font-size: 32rpx;
		height: 108rpx;
		line-height: 108rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
	}

	.c {
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(36, 36, 36, 1);
		line-height: 44rpx;
	}

	.pickInfo {
		height: 272rpx;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.pickInfo .t {
		width: 100%;
		height: 108rpx;
		line-height: 108rpx;
	}

	.jian {
		position: absolute;
		bottom: 20rpx;
		right: 220rpx;
	}

	.add {
		height: 46rpx;
		width: 166rpx;
		position: absolute;
		bottom: 20rpx;
		right: 40rpx;
		background: #fec200;
		border-radius: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.top3 {
		width: 100%;
		height: auto;
		background: #fff;
		margin-top: 24rpx;
		position: relative;
	}

	.top4 {
		width: 100%;
		height: 330rpx;
		background: rgba(245, 245, 245, 1);
		margin-top: 24rpx;
		position: relative;
		margin-bottom: 200rpx;
	}

	.top4 .perFlex {
		background: #fff;
	}

	.issue-wai {
		height: 98rpx;
		width: 100%;
		display: block;
		background: #fff;
		position: fixed;
		z-index: 10;
		bottom: 0;
		left: 0;
	}

	.issue {
		width: 668rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		background: #fec200;
		border-radius: 50rpx;
		margin: 5rpx auto;
	}

	/* 模拟textarea的input输入框*/

	#teshuInput1 {
		width: 100%;
		height: 164rpx;
		background: rgba(245, 245, 245, 1);
		border-radius: 16rpx;
	}

	.pickInfo .textarea {
		width: 670rpx;
		height: 164rpx;
		background: rgba(245, 245, 245, 1);
		border-radius: 16rpx;
		padding: 24rpx;
		box-sizing: border-box;
		font-size: 24rpx;
	}

	.simulateUserNote {
		width: 670rpx;
		height: 164rpx;
		background: rgba(245, 245, 245, 1);
		border-radius: 8px;
		padding: 24rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		background: rgba(245, 245, 245, 1);
		color: rgba(36, 36, 36, 1);
	}

	.textareaBtn {
		margin-top: 24rpx;
		padding: 14rpx 24rpx !important;
	}

	.reset {
		float: right;
		color: #fec200;
		font-size: 28rpx;
	}

	/* 送件时间 */

	.top12 {
		width: 100%;
		height: auto;
		background: #fff;
		margin-top: 24rpx;
		padding-bottom: 10rpx;
	}

	.time {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		background: #fff;
		padding: 0 40rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.time-l,
	.time-r {
		width: 308rpx;
		height: 76rpx;
		background: rgba(245, 245, 245, 1);
		border-radius: 16rpx;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		color: rgba(36, 36, 36, 0.3);
		font-size: 28rpx;
	}

	.time-c {
		width: 32rpx;
		height: 2rpx;
		background: rgba(36, 36, 36, 1);
		margin: 0 10rpx;
	}

	.arrow {
		height: 24rpx;
		width: 14rpx;
		margin-left: 16rpx;
	}

	.tishi {
		padding: 24rpx 40rpx;
		font-size: 24rpx;
		color: rgba(36, 36, 36, 0.4);
	}

	/* 留言 */
	.writeReply {
		padding: 24rpx;
	}

	.writeReply textarea {
		height: 50px;
	}

	.writeReply>view:nth-of-type(1) {
		background: #f0f1f2;
		border-radius: 8px;
		padding: 24rpx;
	}

	.writeReply>view:nth-of-type(2) {
		text-align: right;
		margin-top: 18rpx;
	}

	.writeReply>view:nth-of-type(2) text {
		display: inline-block;
		width: 150rpx;
		height: 56rpx;
		background: #0091ff;
		border-radius: 14px;
		font-size: 28rpx;
		color: #ffffff;
		text-align: center;
		line-height: 56rpx;
	}
</style>
