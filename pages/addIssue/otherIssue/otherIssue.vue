<template>
	<view class="all">
		<!-- 标题 -->
		<view class="top1">
			<view class="perFlex">
				<view class="t">
					<text style="color:rgba(252, 35, 35, 1);margin-right:10rpx;">*</text>标题</view>
				<input placeholder-style="color:rgba(36, 36, 36, 0.4);" :disabled="true" @click="getindex(8)" class="inputC"
				 maxlength="12" v-model="taskInfo.title" placeholder="请输入不超过12个字"></input>
			</view>
		</view>
		<!-- 快递信息 -->
		<view class="top2" v-if="issueType==1">
			<view class="top2-per">
				<view class="perFlex">
					<view class="t">
						<text style="color:rgba(252, 35, 35, 1);">*</text> 取件地点</view>
					<input placeholder-style="color:rgba(36, 36, 36, 0.4);" :disabled="true" @click="getindex(6)" class="inputC"
					 v-model="taskInfo.task_address" maxlength="16" placeholder="请输入不超过16个字"></input>
				</view>
				<view class="perFlex">
					<view class="t">
						<text style="color:rgba(252, 35, 35, 1);">*</text> 送件地点</view>
					<input placeholder-style="color:rgba(36, 36, 36, 0.4);" :disabled="true" @click="getindex(7)" class="inputC"
					 maxlength="16" placeholder="请输入不超过16个字" v-model="taskInfo.destination"></input>
				</view>
				<view class="perFlex" @click="getTime">
					<view class="t">
						<text style="color:rgba(252, 35, 35, 1);">*</text> 送件时间</view>
					<input placeholder-style="color:rgba(36, 36, 36, 0.4);" :disabled="true" class="inputC" maxlength="16" placeholder="请选择"
					 v-model="time"></input>
				</view>
			</view>
		</view>
		<!-- 发布人信息 -->
		<view class="top3">
			<view class="top2-per">
				<view class="perFlex">
					<view class="t">
						<text style="color:rgba(252, 35, 35, 1);">*</text> 我的称呼</view>
					<input placeholder-style="color:rgba(36, 36, 36, 0.4);" class="inputC" :disabled="true" @click="getindex(1)"
					 v-model="issuerInfo.name" placeholder="请输入" maxlength="14"></input>
				</view>

				<view class="perFlex">
					<view class="t">
						<text style="color:rgba(252, 35, 35, 1);">*</text> 我的电话</view>
					<input placeholder-style="color:rgba(36, 36, 36, 0.4);" :disabled="true" @click="getindex(2)" v-model="issuerInfo.tel"
					 class="inputC" placeholder="请输入" maxlength="11" type="number"></input>
				</view>

				<view class="perFlex pickInfo">
					<view class="t">
						<text style="color:rgba(252, 35, 35, 1);" v-if="issueType!=1">*</text>
						{{issueType==1?'备注':'任务内容'}}
					</view>
					<!-- @click="goTextarea('',2)" -->
					<view class="textarea" v-if="issueType==1" @click="getindex(9)">
						<textarea fixed v-model="issuerInfo.notes" placeholder="选填（限30个字）" style="height: 100%;" :disabled="true"
						 ></textarea>
						<!-- <text v-if="issuerInfo.notes==''" style="color:rgba(36, 36, 36, 0.4);">选填（限30个字）</text>
						<text v-else>{{issuerInfo.notes}}</text> -->
					</view>
					<!-- @click="goTextarea('',2)" -->
					<view class="textarea" v-else @click="getindex(10)">
						<textarea fixed v-model="taskInfo.express_desc" placeholder="必填（限30个字）" style="height: 100%;" :disabled="true"
						 ></textarea>
						<!-- <text v-if="taskInfo.express_desc==''" style="color:rgba(36, 36, 36, 0.4);">必填（限30个字）</text>
						<text v-else>{{taskInfo.express_desc}}</text> -->
					</view>
				</view>
			</view>
		</view>
		<!-- 加急信息 -->
		<view class="top4">
			<view class="top2-per">
				<view class="perFlex">
					<view class="t">
						<text style="color:rgba(252, 35, 35, 1);">*</text> 赏金(元)</view>
					<input class="inputC" :fixed="true" v-model="money" :disabled="true" @click="getindex(3)" type="digit"
					 placeholder-style="color:rgba(36, 36, 36, 0.4);" placeholder="请输入赏金，不可为0"></input>
				</view>

				<view class="perFlex" style="border:none;">
					<view class="t" style="width:90%;">
						是否加急
						<text style="color:rgba(36, 36, 36, 0.4);font-size:24rpx;">（排名置顶，优先接单）</text> </view>
					<u-switch v-model="is_urgent" active-color="#FEC200"></u-switch>
				</view>
				<view class="perFlex" v-if="is_urgent">
					<view class="t" style="height:108rpx;line-height:108rpx;">
						<text style="color:rgba(252, 35, 35, 1);">*</text>
						<text>加赏金额(元)</text>
						<u-icon name="info-circle" @click="urgentWarn(1)" size="40rpx" color="#CCCCCC" style="position:relative;top:6rpx;margin-left:6rpx;"></u-icon>
					</view>
					<input :fixed="true" placeholder-style="color:rgba(36, 36, 36, 0.4);" :disabled="true" @click="getindex(4)" type="digit"
					 v-model="urgent_price" class="inputC " id="teshu" placeholder="请输入加急赏金，最低2元"></input>
				</view>
				<view class="perFlex" style="border:none;" v-if="issueType==1">
					<view class="t" style="width:90%;">
						商品预付
						<text style="color:rgba(36, 36, 36, 0.4);font-size:24rpx;">预付或凭跑腿凭据线下支付</text> </view>
					<u-switch v-model="is_good_prepay" active-color="#FEC200"></u-switch>
				</view>
				<view class="perFlex" v-if="is_good_prepay">
					<view class="t" style="height:108rpx;line-height:108rpx;">
						<text style="color:rgba(252, 35, 35, 1);">*</text>
						<text>预付价格(元)</text>
						<u-icon name="info-circle" @click="urgentWarn(2)" size="40rpx" color="#CCCCCC" style="position:relative;top:6rpx;margin-left:6rpx;"></u-icon>
					</view>
					<input :fixed="true" :disabled="true" @click="getindex(5)" placeholder-style="color:rgba(36, 36, 36, 0.4);" type="digit"
					 v-model="good_prepay" class="inputC " id="teshu" placeholder="请输入预付金额"></input>
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
				issueType: "",
				issuerInfo: {
					name: "",
					tel: "",
					notes: "",
				},
				taskInfo: {
					title: "",
					task_address: "",
					destination: "",
					express_desc: "",
				},
				showTime: false,
				list: [],
				time: "",
				destination_time: "",
				money: "",
				urgent_price: "0",
				is_urgent: 0,
				is_good_prepay: 0,
				good_prepay: "0",
				price: 0,
				loading: false,
				y_rate: 0,
				j_rate: 0,
				regMoney: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^[1-9]$)|(^\d\.[1-9]{1,2}$)|(^\d\.[0]{1}[1-9]{1}$|(^\d\.[1-9]{1}[0]{1}$)$)/,
				regPhone: /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/,
			};
		},
		methods: {
			getindex(index) {
				this.index = index;
				this.showinput = !this.showinput;
				if (index == 1) {
					this.comment = this.issuerInfo.name;
				} else if (index == 2) {
					this.comment = this.issuerInfo.tel;
				} else if (index == 3) {
					this.comment = this.money;
				} else if (index == 4) {
					this.comment = this.urgent_price;
				} else if (index == 5) {
					this.comment = this.good_prepay;
				} else if (index == 6) {
					this.comment = this.taskInfo.task_address;
				} else if (index == 7) {
					this.comment = this.taskInfo.destination;
				} else if (index == 8) {
					this.comment = this.taskInfo.title;
				} else if (index == 9) {
					this.comment = this.issuerInfo.notes;
				} else if (index == 10) {
					this.comment = this.taskInfo.express_desc;
				}
				//
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
				} else if (this.index == 5) {
					if (!this.regMoney.test(this.comment)) {
						uni.showToast({
							title: "请输入正确预付金额",
							icon: "none",
						});
						return false;
					}
					this.good_prepay = this.comment;
				}
				if (this.index == 6) {
					if (this.comment.length > 16) {
						uni.showToast({
							title: "取件地点不能超过16个字",
							icon: "none",
						});
						return false;
					}
					this.taskInfo.task_address = this.comment;
				} else if (this.index == 7) {
					if (this.comment.length > 16) {
						uni.showToast({
							title: "送件地点不能超过16个字",
							icon: "none",
						});
						return false;
					}
					this.taskInfo.destination = this.comment;
				} else if (this.index == 8) {
					if (this.comment.length > 12) {
						uni.showToast({
							title: "标题不能超过12个字",
							icon: "none",
						});
						return false;
					}
					this.taskInfo.title = this.comment;
				} else if (this.index == 9) {
					if (this.comment.length > 30) {
						uni.showToast({
							title: "备注不能超过30个字",
							icon: "none",
						});
						return false;
					}
					this.issuerInfo.notes = this.comment;
				} else if (this.index == 10) {
					if (this.comment.length > 30) {
						uni.showToast({
							title: "任务内容不能超过30个字",
							icon: "none",
						});
						return false;
					}
					this.taskInfo.express_desc = this.comment;
				}
				this.showinput = !this.showinput;
			},
			getKey() {
				getInfoSystem({
					key: "预付费率",
				}).then((res) => {
					if (res.code == 200) {
						this.y_rate = res.result.value;
					}
				});
				getInfoSystem({
					key: "加急费率",
				}).then((res) => {
					if (res.code == 200) {
						this.j_rate = res.result.value;
					}
				});
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
				if (minutes >= 30) {
					this.list[0].children[0].children.splice(1, 1);
				}
			},
			// 加急警告
			urgentWarn(index) {
				if (index == 1) {
					uni.showModal({
						title: "赏金说明",
						content: "加急赏金是给接单者的加急奖励，平台收取" +
							this.j_rate +
							"% 手续费,且加急金额不能小于2元",
						confirmText: "我已了解",
						confirmColor: "rgba(255, 221, 5, 1)",
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log("点击确认回调");
							} else {
								console.log("点击取消回调");
							}
						},
					});
				} else {
					uni.showModal({
						title: "预付说明",
						content: "如果输入预付金额，根据微信平台规则将收取全部" +
							this.y_rate +
							"%手续费，且预付金额不能为0",
						confirmText: "我已了解",
						confirmColor: "rgba(255, 221, 5, 1)",
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log("点击确认回调");
							} else {
								console.log("点击取消回调");
							}
						},
					});
				}
			},
			goTextarea(index, type) {
				if (this.issueType == 1) {
					uni.navigateTo({
						url: "/pages/index/schoolShop/goodsOrder/remark/remark?frompage=expressageIssue&remark=" +
							this.issuerInfo.notes +
							"&type=" +
							type,
					});
				} else {
					uni.navigateTo({
						url: "/pages/index/schoolShop/goodsOrder/remark/remark?frompage=expressageIssue&remark=" +
							this.taskInfo.express_desc +
							"&type=" +
							type,
					});
				}
			},
			issue() {
				let datas = "";
				// 跑腿发布
				if (this.issueType == 1) {
					if (this.taskInfo.title == "") {
						uni.showToast({
							title: "请输入标题",
							icon: "none",
						});
						return false;
					} else if (this.taskInfo.task_address == "") {
						uni.showToast({
							title: "请输入取件地点",
							icon: "none",
						});
						return false;
					} else if (this.taskInfo.destination == "") {
						uni.showToast({
							title: "请输入送件地点",
							icon: "none",
						});
						return false;
					} else if (this.destination_time == "") {
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
					} else if (this.is_urgent) {
						if (!this.regMoney.test(this.urgent_price) || this.urgent_price < 2) {
							uni.showToast({
								title: "请输入正确加急金额",
								icon: "none",
							});
							return false;
						}
					}
					// 预付
					if (this.is_good_prepay) {
						if (!this.regMoney.test(this.good_prepay) || this.good_prepay <= 0) {
							uni.showToast({
								title: "请输入正确预付金额",
								icon: "none",
							});
							return false;
						} else {
							let li =
								((this.money * 1 + this.urgent_price * 1 + this.good_prepay * 1) *
									this.y_rate) /
								100;
								li=this.$Numcheck.rounding(li, 2);
							// li = li.toFixed(2);
								this.price=this.$Numcheck.rounding(this.money * 1 +
								this.urgent_price * 1 +
								this.good_prepay * 1 +
								li * 1, 2);
							// this.price = (
							// 	this.money * 1 +
							// 	this.urgent_price * 1 +
							// 	this.good_prepay * 1 +
							// 	li * 1
							// ).toFixed(2);
						}
					} else {
						// this.price = (this.money * 1 + this.urgent_price * 1).toFixed(2);
						this.price =this.$Numcheck.rounding(this.money * 1 + this.urgent_price * 1,2);
					}
					// 文本检测
					let text =
						this.taskInfo.title +
						this.issuerInfo.name +
						this.taskInfo.task_address +
						this.taskInfo.destination +
						this.issuerInfo.notes;
					// 数据
					datas = {
						type: 2,
						title: this.taskInfo.title,
						user_name: this.issuerInfo.name,
						user_phone: this.issuerInfo.tel,
						money: this.money,
						task_address: this.taskInfo.task_address,
						destination: this.taskInfo.destination,
						destination_time: this.destination_time,
						is_urgent: this.is_urgent,
						is_good_prepay: this.is_good_prepay,
						good_prepay: this.good_prepay,
						comment: this.issuerInfo.notes,
						user_id: JSON.parse(uni.getStorageSync("user")).id,
						urgent_price: this.urgent_price,
						price: this.price,
					};
					// 消息提醒 新的评论回复 、新的评论提醒、服务进度
					uni.requestSubscribeMessage({
						tmplIds: ['Q0dB1QJc9GcGSfT5tpj6GBbf53JiHhz6RDQZOVM6i3Y', 'mc5xJywLUfHxkLOaV2oIzYBbO3O0AqjTxq75RRAh_ps',
							'VkSklDJC5xONLGxOfWoJS1uWdVzBztd--rZasHzsMMI'
						],
						complete: async res => {
							// 不管成功失败都执行添加任务
							try {
								await this.$check.checkTxt(text);
								this.createTask(datas);
							} catch (error) {
								this.taskInfo.title = "";
								this.issuerInfo.name = "";
								this.taskInfo.task_address = "";
								this.taskInfo.destination = "";
								this.issuerInfo.notes = "";
								this.destination_time = "";
								return false;
							}
						}
					});
				}
				// 其他任务发布
				else {
					if (this.taskInfo.title == "") {
						uni.showToast({
							title: "请输入标题",
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
					} else if (this.taskInfo.express_desc == "") {
						uni.showToast({
							title: "请输入任务内容",
							icon: "none",
						});
						return false;
					} else if (!this.regMoney.test(this.money)) {
						uni.showToast({
							title: "请输入正确赏金",
							icon: "none",
						});
						return false;
					} else if (this.is_urgent) {
						if (!this.regMoney.test(this.urgent_price) || this.urgent_price < 2) {
							uni.showToast({
								title: "请输入正确加急金额",
								icon: "none",
							});
							return false;
						}
					}

					// this.price = (this.money * 1 + this.urgent_price * 1).toFixed(2);
					this.price = this.$Numcheck.rounding(this.money * 1 + this.urgent_price * 1,2);
					datas = {
						type: 3,
						title: this.taskInfo.title,
						user_name: this.issuerInfo.name,
						user_phone: this.issuerInfo.tel,
						money: this.money,
						express_desc: this.taskInfo.express_desc,
						is_urgent: this.is_urgent,
						user_id: JSON.parse(uni.getStorageSync("user")).id,
						is_good_prepay: 0,
						good_prepay: 0,
						urgent_price: this.urgent_price,
						price: this.price,
					};
					// 文本检测
					let text =
						this.taskInfo.title +
						this.issuerInfo.name +
						this.taskInfo.express_desc;

					// 消息提醒 新的评论回复 、新的评论提醒、服务进度
					uni.requestSubscribeMessage({
						tmplIds: ['Q0dB1QJc9GcGSfT5tpj6GBbf53JiHhz6RDQZOVM6i3Y', 'mc5xJywLUfHxkLOaV2oIzYBbO3O0AqjTxq75RRAh_ps',
							'VkSklDJC5xONLGxOfWoJS1uWdVzBztd--rZasHzsMMI'
						],
						complete: async res => {
							// 不管成功失败都执行添加任务
							try {
								await this.$check.checkTxt(text);
								this.createTask(datas);
							} catch (error) {
								this.taskInfo.title = "";
								this.issuerInfo.name = "";
								this.taskInfo.express_desc = "";
								return false;
							}
						}
					});
				}
			},
			createTask(datas) {
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
			},
		},
		onLoad(options) {
			this.issueType = options.issueType;
			if (options.issueType == 1) {
				uni.setNavigationBarTitle({
					title: "跑腿发布",
				});
			} else {
				uni.setNavigationBarTitle({
					title: "其他任务发布",
				});
			}
			if (options.id) {
				getInfoTask({
					id: options.id,
				}).then((res) => {
					if (res.code == 200) {
						this.issuerInfo.name = res.result.user_name;
						this.issuerInfo.tel = res.result.user_phone;
						this.issuerInfo.notes = res.result.comment;

						this.taskInfo.title = res.result.title;
						this.taskInfo.task_address = res.result.task_address;
						this.taskInfo.destination = res.result.destination;
						this.taskInfo.express_desc = res.result.express_desc;

						this.money = res.result.money;
						this.is_urgent = res.result.is_urgent;
						this.urgent_price = res.result.urgent_price;
						this.is_good_prepay = res.result.is_good_prepay;
						this.good_prepay = res.result.good_prepay;
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
			// 		if (that.issueType == 1) {
			// 			that.issuerInfo.notes = options.value;
			// 		} else {
			// 			that.taskInfo.express_desc = options.value;
			// 		}
			// 	},
			// });
		},
	};
</script>

<style scoped>
	/* pages/expressage/expressageIssue/expressageIssue.wxss */

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
		border-bottom: 2prx solid rgba(245, 245, 245, 1);
	}

	.top2 {
		width: 100%;
		height: 320rpx;
		background: #fff;
		margin-top: 24rpx;
		position: relative;
		padding-bottom: 50rpx;
	}

	/* 公共 -start */

	.top2-per {
		width: 100%;
		height: 500rpx;
		/* background: rgb(255, 240, 192); */
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
		border-bottom: 2rpx solid rgba(245, 245, 245, 1);
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

	.add {
		height: 46rpx;
		width: 166rpx;
		position: absolute;
		bottom: 20rpx;
		right: 40rpx;
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
		background: rgba(245, 245, 245, 1);
		margin-top: 24rpx;
		position: relative;
		margin-bottom: 100rpx;
	}

	.top4 .perFlex {
		background: #fff;
	}

	/* top5 */

	.top5 {
		height: 80rpx;
		width: 100%;
		padding: 0 40rpx;
		box-sizing: border-box;
		background: rgba(245, 245, 245, 1);
		margin-bottom: 216rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(36, 36, 36, 0.4);
		line-height: 34rpx;
		margin-top: 24rpx;
	}

	.issue-wai {
		height: 98rpx;
		width: 100%;
		display: block;
		background: #fff;
		position: fixed;
		z-index: 1000;
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
		border-radius: 16rpx;
		padding: 24rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		background: rgba(245, 245, 245, 1);
		color: rgba(36, 36, 36, 1);
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
