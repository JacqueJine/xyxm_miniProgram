<template>
	<view class="all">
		<!-- 	<view class="top1">
			<view><input type="number" maxlength="11" v-model="phone" placeholder="请输入绑定手机号" /></view>
			<view class="code">
				<input type="number" maxlength="6" v-model="code" placeholder="请输入验证码" />
				<view @click="getcode">{{msg}}</view>
			</view>
		</view> -->
		<view class="per" @click="select(1)">
			<view>{{ university ? university : '请选择学校' }}</view>
			<u-icon name="arrow-right" size="30rpx"></u-icon>
		</view>
		<view class="per" @click="select(2)">
			<view>{{ infos.en_year ? infos.en_year + '级' : '请选择入学年份' }}</view>
			<u-icon name="arrow-right" size="30rpx"></u-icon>
		</view>

		<view class="per" @click="select(3)">
			<view>{{ sex ? sex : '请选择性别' }}</view>
			<u-icon name="arrow-right" size="30rpx"></u-icon>
		</view>
		<!-- <view class="top1">
			<view><input type="text" v-model="infos.school_number" maxlength="20" placeholder="请输入学号" /></view>
		</view> -->
		<view class="notes" style="padding-top: 50rpx;">注：请认真填写真实学校和年级，提交后不可更改</view>

		<view class="bottom">
			<view class="submit" @click="submit">提交</view>
			<view class="xieyi">
				注册即代表同意
				<text style="color: #1677ff" @click="showxy = !showxy">《用户注册协议》</text>
			</view>
		</view>
		<!-- 弹窗选择 -->
		<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
		<u-popup v-model="showxy" mode="center" border-radius="8">
			<view class="popxy"><u-parse :html="content" class="uParse"></u-parse></view>
		</u-popup>
	</view>
</template>

<script>
import { getschoollist, perfectUserInfo } from '../../../services/mine.js';
export default {
	data() {
		return {
			msg: '获取验证码',
			disable: false,
			second: 60,
			show: false,
			sel: 1,
			showxy: false,
			university: '',
			sex: '',
			infos: {
				school_id: '',
				en_year: '',
				sex: '',
				school_number: ''
			},
			list: [],
			content: `
				<div class="about-text">
					<p>感谢您申请校园小茗账户！在成为校园小茗用户之前，请您仔细阅读以下条文，确保您理解并同意本协议全部内容。校园小茗平台是由郑州茗仕梵网络科技有限公司（名商网）运营的商标转让的综合平台，域名为shangbiao.com。以下内容将构成您和杭州名商网络有限公司之间的服务合同条款。</p>
					<h4>一、用户注册</h4>
					<p>您同意本协议并注册成功即成为校园小茗的注册用户直至您的账户注销。校园小茗可能在必要的时候对本协议条款及校园小茗各单项服务协议进行更改，此种更改在校园小茗上公布或在具体服务过程中经双方以口头、书面等形式协商一致生效。您可以选择停止使用校园小茗相关的服务或者注销您在校园小茗的账户，否则校园小茗将认为您同意更改后的服务条款。未在校园小茗发布或在具体服务过程中未经校园小茗告知的服务条款将不具有法律效力，除非签有书面协议，并且仅对签署协议的当事人有效。</p>
					<h4>二、用户账户</h4>
					<p>您应当拥有中华人民共和国法律认可的完全民事权利能力和完全民事行为能力，否则您和能够代表您行使权利或承担责任的其他主体将承担一切后果。为此，您应当提供相应的证明。如果您是自然人，此类证明可以是您的居民身份证件、个人户营业执照。如果您是法人，此类证明可以是您的营业执照。如果您是其他组织类型，您应当提供相应的合法证明。</p>
					<p>如果使用校园小茗提供的各单项服务，您可能还需要提交其他相关的资料和信息。为了提供更好的服务，您也可以向我们提供其他资料和信息，我们将按照校园小茗的隐私政策保护您的资料和信息。</p>
					<p>您应当保护好您的账户，除非已经得到您的提前通知，校园小茗将认为您的账户处于您的控制之下。如果您的账户在不受您控制的情况下处于风险状态或者已经发生损失，请您及时以有效方式通知校园小茗，您可以要求校园小茗暂停服务或者冻结账户。</p>
					<p>如果您使用校园小茗账户直接访问其他网站，您应当遵守该网站的服务条款。</p>
					<h4>三、账户管理</h4>
					<p>1、校园小茗帐号的所有权归校园小茗所有，用户完成申请注册手续后，获得校园小茗帐号的使用权，该使用权仅属于初始申请注册人，禁止赠与、借用、租用、转让或售卖。校园小茗因经营需要，有权回收用户的校园小茗帐号。</p>
					<p>2、用户可以更改、删除校园小茗帐户上的个人资料、注册信息及传送内容等，但需注意，删除有关信息的同时也会删除用户储存在系统中的文字和图片。用户需承担该风险。</p>
					<p>3、用户有责任妥善保管注册帐号信息及帐号密码的安全，因用户保管不善可能导致遭受盗号或密码失窃，责任由用户自行承担。用户需要对注册帐号以及密码下的行为承担法律责任。用户同意在任何情况下不使用其他用户的帐号或密码。在用户怀疑他人使用其帐号或密码时，用户同意立即通知校园小茗。</p>
					<p>4、用户应遵守本协议的各项条款，正确、适当地使用本服务，如因用户违反本协议中的任何条款，校园小茗在通知用户后有权依据协议中断或终止对违约用户校园小茗帐号提供服务。同时，校园小茗保留在任何时候收回校园小茗帐号、用户名的权利。</p>
					<p>5、如用户注册校园小茗帐号后一年不登录，通知用户后，校园小茗可以收回该帐号，以免造成资源浪费，由此造成的不利后果由用户自行承担。</p>
					<h4>四、用户责任</h4>
					<p>用户使用校园小茗必须遵守所有适用的国家法律、地方法规和国际准则。用户对用户账户进行的一切操作及言论负完全的责任，用户注销账户后，仍然应当对注销前的操作和言论负责。</p>
					<p>用户必须遵循：</p>
					<p>（1）从中国境内向外传输技术性资料时必须符合中国有关法规。</p>
					<p>（2）使用网络服务不作非法用途</p>
					<p>（3）不干扰或混乱网络服务</p>
					<p>（4）遵守所有使用网络服务的网络协议、规定、程序和惯例。</p>
					<p>用户须承诺不传输任何非法的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的，淫秽等信息资料。用户也不能传输任何教唆他人构成犯罪行为的资料。不得进行任何有可能对校园小茗的系统造成任何不良的影响的操作，不能传输助长国内不利条件和涉及国家安全的资料。不能传输任何不符合当地法规、国家法律和国际准则的资料。未经许可而非法进入其它电脑系统是禁止的。若用户的行为不符合以上提到的服务条款，校园小茗单方面有权冻结或注销用户账户。用户需对用户本身在网上的行为承担法律责任。用户若在校园小茗上散布和传播反动、色情或其他违反国家法律的信息，校园小茗的系统记录有可能作为用户违反法律的证据。</p>
					<h4>五、数据储存</h4>
					<p>1、校园小茗不对用户在本服务中相关数据的删除或储存失败负责。</p>
					<p>2、校园小茗可以根据实际情况自行决定用户在本服务中数据的最长储存期限，并在服务器上为其分配数据最大存储空间等。用户可根据自己的需要自行备份本服务中的相关数据。</p>
					<p>3、如用户停止使用本服务或本服务终止，校园小茗可以从服务器上永久地删除用户的数据。本服务停止、终止后校园小茗没有义务向用户返还任何数据。</p>
					<h4>六、风险承担</h4>
					<p>1、用户理解并同意，校园小茗仅为用户提供信息分享、传送及获取的平台，用户必须为自己注册帐号下的一切行为负责，包括用户所传送的任何内容以及由此产生的任何后果。用户应对校园小茗及本服务中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险校园小茗无法且不会对因用户行为而导致的任何损失或损害承担责任。</p>
					<p>如果用户发现任何人违反本协议约定或以其他不当的方式使用本服务，请立即向校园小茗举报或投诉，校园小茗将依本协议约定进行处理。</p>
					<p>2、用户理解并同意，因业务发展需要，校园小茗保留单方面对本服务的全部或部分服务内容变更、暂停、终止或撤销的权利，用户需承担此风险。</p>
					<h4>七、校园小茗服务</h4>
					<p>校园小茗为用户提供商标交易、商标论坛等相关服务各项服务。用户应当按照校园小茗的服务规则和页面提示进行操作，也可以直接联系校园小茗获取更多的服务。校园小茗各单项服务协议与本协议冲突或是有特别规定的，应当优先适用各单项服务协议。</p>
					<p>校园小茗的各项服务费用在校园小茗上公布，校园小茗有权根据有关政策的变化、市场情况、服务范围变化等原因，单方面调整价格标准，调整的项目将在校园小茗上更新，不作额外的通知。校园小茗有权拒绝为不按照校园小茗要求提供信息或不服从校园小茗服务规则的用户提供服务，有权注销或者冻结该用户账户。</p>
					<p>用户有权取回用户在校园小茗账户中未使用的资金，但不得利用校园小茗资金账户套现信用卡资金，不得有其他违反银行、支付中介机构及校园小茗资金规范的行为。用户在校园小茗账户消费的的订单将提供明细以供查询的资金不产生任何形式的孳息。</p>
					<p>校园小茗的数据来源于互联网，版权归源网站所有，平台通过技术手段对信息进行汇总实现快照，无法避免后续网站内容的变更，汇总的数据如有出入本站不承担责任。</p>
					<p>校园小茗没有为用户保存账户各项资料和记录的义务。</p>
					<h4>八、校园小茗免责条款</h4>
					<p>校园小茗不保证提供的服务不受干扰、及时提供或免于出错。校园小茗不保证所交易的商标具有适销性、适用性，也不能保证交易方实际拥有该商标。校园小茗不对用户的真实身份进行核实。除非有效法律文书明确要求并提供相应保护，校园小茗将遵守隐私政策，不对外提供用户信息。</p>
					<p>因下列情形无法按照约定提供各项服务时，校园小茗不承担责任，包括但不限于：</p>
					<p>（1）校园小茗公告的休假或者系统维护的。</p>
					<p>（2）电信设备出现故障不能进行数据传输的。</p>
					<p>（3）因台风、地震、海啸、洪水、停电、战争、恐怖袭击等不可抗力之因素，造成校园小茗障碍不能提供服务的。</p>
					<p>（4）由于黑客攻击、电信部门技术调整或故障、网站升级、银行方面的问题等原因而造成的服务中断或者延迟的。</p>
					<h4>九、知识产权保护</h4>
					<p>用户不得擅自在全球任何国家和地区申请与校园小茗及其他服务的名称、标识、品牌、特色标志、域名相同或类似的商标、服务商标、域名、著作权等。用户不得擅自使用、复制、修改、改编、翻译、汇编、转载、发行校园小茗所有内容，包括但不限于文字作品、图片作品、摄影作品、示意图、网站架构、网站画面的安排、网页设计。</p>
					<h4>十、隐私政策</h4>
					<p>校园小茗隐私政策构成本协议的有效内容。隐私政策调整的，适用最新的隐私政策。</p>
					<h4>十一、法律适用和管辖</h4>
					<p>本协议及其他单项服务协议适用中华人民共和国法律，法律没有明文规定的，按照校园小茗的服务和交易惯例解释。协议的部分条款发生无效的情形，不受影响的其他条款和协议仍然有效。因本协议及其他单项服务协议产生的争议，浙江省杭州市拱墅区人民法院为有权管辖法院。</p>
					<h4>十二、其他</h4>
					<p>工作日是指校园小茗的营业日。除非校园小茗公告通知休假，一般为中华人民共和国适用的休息日以及法定节假日之外的正常工作日。日期的计算使用公历年月日，时间的计算使用北京时间。</p>
					<p>校园小茗通过公告通知，公告的时间为送达到用户的时间；通过校园小茗网页向用户提醒，提醒出现的时间为送达的时间；通过用户提供的联系方式向用户送达，用户或其代表签收、用户系统接收的时间为送达的时间。</p>
					<p></p>
				</div>`
		};
	},
	methods: {
		confirm(val) {
			this.show = !this.show;
			if (this.sel == 1) {
				if (val[0].label == '添加更多') {
					// const key = 'A3ABZ-YPBC2-3QUUO-C3F4Q-STCUO-LPB4A'; //使用在腾讯位置服务申请的key
					// const referer = '校园小茗'; //调用插件的app的名称
					// const category = '教育学校';
					// uni.navigateTo({
					// 	url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&category=' +
					// 		category
					// });
					uni.navigateTo({
						url: '/pages/mine/comInfo/mineMap/mineMap'
					});
				} else {
					this.university = val[0].label;
					this.infos.school_id = val[0].value;
				}
			} else if (this.sel == 2) {
				this.infos.en_year = val[0].value;
			} else if (this.sel == 3) {
				this.infos.sex = val[0].value;
				this.sex = val[0].label;
			}
		},
		select(index) {
			this.sel = index;
			if (index == 1) {
				// this.list = [];
				// // 学校列表
				// getschoollist({}).then((res) => {
				// 	if (res.code == 200) {
				// 		for (let i in res.result) {
				// 			this.list.push({
				// 				value: res.result[i].id,
				// 				label: res.result[i].school_name,
				// 			});
				// 		}
				// 		this.list.push({
				// 			value: "",
				// 			label: "添加更多",
				// 		});
				// 		this.show = !this.show;
				// 	}
				// });
				uni.navigateTo({
					url: '/pages/mine/comInfo/schoolList/schoolList'
				});
			} else if (index == 2) {
				this.list = [];
				let date = new Date();
				let year = null;
				if (date.getMonth() >= 8) {
					year = date.getFullYear();
				} else {
					year = date.getFullYear() - 1;
				}
				for (let i = year; i > year - 6; i--) {
					this.list.push({
						value: i,
						label: i + '级'
					});
				}
				this.show = !this.show;
			} else if (index == 3) {
				this.show = !this.show;
				this.list = [
					{
						value: 1,
						label: '男'
					},
					{
						value: 2,
						label: '女'
					}
				];
			}
		},
		async submit() {
			if (!this.infos.school_id) {
				uni.showToast({
					title: '请选择学校',
					icon: 'none',
					duration: 1000
				});
				return false;
			} else if (!this.infos.en_year) {
				uni.showToast({
					title: '请选择入学年份',
					icon: 'none',
					duration: 1000
				});
				return false;
			} else if (!this.infos.sex) {
				uni.showToast({
					title: '请选择性别',
					icon: 'none',
					duration: 1000
				});
				return false;
				// } else if (!this.infos.school_number) {
				// 	uni.showToast({
				// 		title: "请填写学号",
				// 		icon: "none",
				// 		duration: 1000,
				// 	});
				// 	return false;
			}
			// 文本检测
			// try {
			// 	let res = await this.$check.checkTxt(this.infos.school_number);
			// } catch (error) {
			// 	this.infos.school_number = "";
			// 	return false;
			// }
			uni.showLoading({
				title: '提交中',
				mask: true
			});
			// 学校列表
			perfectUserInfo(
				JSON.stringify({
					data: this.infos
				})
			).then(res => {
				if (res.code == 200) {
					uni.removeStorageSync('school');
					uni.setStorage({
						key: 'token',
						data: res.result.token,
						success: function() {
							uni.showToast({
								title: res.message,
								duration: 1000,
								mask: true,
								success: () => {
									uni.setStorageSync('Login', true);
									uni.switchTab({
										url: '/pages/Tab/tabIndex/index'
									});
								}
							});
						}
					});
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				}
				uni.hideLoading();
			});
		},
		getCode() {
			if (!/^1[3456789]\d{9}$/.test(this.infos.phone)) {
				uni.showToast({
					title: '请输入正确手机号',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (this.disable) {
				return false;
			}
			this.disable = true;
			let timer = setInterval(() => {
				this.second--;
				this.msg = this.second + 's后获取';
				if (this.second <= 0) {
					this.second = 60;
					this.disable = false;
					this.msg = '获取验证码';
					// 清计时器
					clearInterval(timer);
				}
			}, 1000);
		}
	},
	onShow() {
		if (uni.getStorageSync('school')) {
			this.university = uni.getStorageSync('school').school_name;
			this.infos.school_id = uni.getStorageSync('school').id;
		}
	},
	// onUnload() {
	// 	const chooseLocation = requirePlugin('chooseLocation');
	// 	// 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
	// 	chooseLocation.setLocation(null);
	// },
	onLoad() {
		uni.removeStorageSync('school');
	}
};
</script>

<style scoped>
.all {
	width: 100%;
	min-height: 100vh;
	box-sizing: border-box;
	background: #f2f2f2;
	overflow: hidden;
}

.top1 {
	background: #ffffff;
}

.top1 > view {
	padding: 32rpx 36rpx;
	border-bottom: 1px solid #f2f2f2;
}

.code {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.code view {
	color: #0091ff;
	font-weight: bold;
}

.per {
	width: 100%;
	height: 92rpx;
	line-height: 94rpx;
	box-sizing: border-box;
	background: rgba(255, 255, 255, 1);
	margin-top: 32rpx;
	padding: 0 36rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #f2f2f2;
}

.notes {
	width: 100%;
	height: 40rpx;
	font-size: 24rpx;
	color: #ff3939;
	line-height: 40rpx;
	margin-top: 24rpx;
	text-align: center;
}

.bottom {
	position: fixed;
	bottom: 32rpx;
	width: 100%;
	left: 0;
}

.submit {
	text-align: center;
	margin: 0 24rpx;
	background: #fec200;
	border-radius: 25px;
	padding: 28rpx 0;
}

.xieyi {
	font-size: 24rpx;
	text-align: center;
	color: rgba(51, 51, 51, 0.4);
	margin-top: 36rpx;
}

.popxy {
	overflow: hidden;
	padding:40rpx 20rpx;
	box-sizing: border-box;
}
.uParse{
	width: 600rpx;
	height: 700rpx;
	overflow-y: scroll;
}
</style>
