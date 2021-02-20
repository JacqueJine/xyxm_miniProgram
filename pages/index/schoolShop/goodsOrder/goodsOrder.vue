<template>
  <view class="content">
    <view class="top1">
      <view>
        <view><text>地址</text><text @click="changeAdd(1)">换一个</text></view>
        <view
          >{{ curSelectAddress.address.pickerText
          }}{{ curSelectAddress.detail }}</view
        >
        <view>
          <text>{{ curSelectAddress.linkman }}</text>
          <text>{{ curSelectAddress.phone }}</text>
        </view>
      </view>
    </view>
    <view class="top2">
      <view class="top2_1">
        <veiw class="title">{{ shop.name }}</veiw>
        <view class="top2_1list">
          <view v-for="(item, index) in carList" :key="index">
            <view>
              <image :src="imgBaseUrl + item.goodsimage"></image>
            </view>
            <view>
              <view
                ><text>{{ item.name }}</text
                ><text style="color: rgba(255, 57, 57, 1)"
                  >￥{{ item.price }}</text
                ></view
              >
              <view>X {{ item.carnum }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="top2_2">
        <view
          ><text>配送费</text><text>￥{{ base_send }}</text></view
        >
        <view
          ><text>合计</text><text>￥{{ allprice }}</text></view
        >
        <view
          ><text>备注</text>
          <view class="bz" @click="changeAdd(2)">
            <input
              type="text"
              placeholder="点击添加(不超过30字)"
              v-model="remark"
              :disabled="true"
            />
            <u-icon name="arrow-right"></u-icon>
          </view>
        </view>
      </view>
    </view>
    <view class="top3">
      <view>
        <view
          ><text style="font-size: 24rpx">合计：</text
          ><text style="font-size: 36rpx">￥{{ allprice }}</text></view
        >
        <view>配送费￥{{ base_send }}</view>
      </view>
      <view @click="showPay = !showPay">提交订单</view>
    </view>
    <!-- 支付选择弹窗 -->
    <u-popup
      v-model="showPay"
      mode="center"
      border-radius="8"
      :closeable="true"
      close-icon-pos="top-left"
      :safe-area-inset-bottom="true"
    >
      <view class="pay">
        <view style="text-align: center"> <text>支付方式</text></view>
        <view>￥12</view>
        <view @click="changepayType(0)">
          <view>
            <image src="/static/mine/yue1.png" class="leftimg"> </image
            ><text>余额支付</text><text class="yue">(剩余{{ yue }})</text>
          </view>
          <image
            :src="
              payType == 0
                ? '/static/mine/checked.png'
                : '/static/mine/check.png'
            "
            class="rightimg"
          ></image>
        </view>
        <view @click="changepayType(1)">
          <view>
            <image src="/static/mine/wx.png" class="leftimg"> </image
            ><text>微信支付</text>
          </view>
          <image
            :src="
              payType == 1
                ? '/static/mine/checked.png'
                : '/static/mine/check.png'
            "
            class="rightimg"
          ></image>
        </view>
        <view @click="toPay">确认支付</view>
      </view>
    </u-popup>
    <!-- 支付密码输入弹窗 -->
    <u-popup
      v-model="showPI"
      mode="center"
      :negative-top="-100"
      :mask-close-able="false"
      border-radius="8"
      :closeable="true"
      close-icon-pos="top-left"
      :safe-area-inset-bottom="true"
      @close="setFocus"
      @open="focus = true"
    >
      <view class="PasswordInput">
        <view>请输入支付密码</view>
        <view>
          <view class="password_dot">
            <i v-if="wallets_password.length >= 1"></i>
          </view>
          <view class="password_dot">
            <i v-if="wallets_password.length >= 2"></i>
          </view>
          <view class="password_dot">
            <i v-if="wallets_password.length >= 3"></i>
          </view>
          <view class="password_dot">
            <i v-if="wallets_password.length >= 4"></i>
          </view>
          <view class="password_dot">
            <i v-if="wallets_password.length >= 5"></i>
          </view>
          <view class="password_dot">
            <i v-if="wallets_password.length >= 6"></i>
          </view>
        </view>
        <view style="font-size: 24rpx; color: #0091ff" @click="toforget"
          >忘记密码</view
        >
        <input
          @input="set_wallets_password"
          v-model="wallets_password"
          type="number"
          style="width: 0rpx; height: 0rpx"
          :focus="focus"
          maxlength="6"
        />
      </view>
    </u-popup>
  </view>
</template>

<script>
import { storeDetail, addOrderAll } from "../../../../services/shop.js";
import { getAddress, findUserInfo } from "../../../../services/mine.js";
import { payTask } from "../../../../services/function.js";
export default {
  data() {
    return {
      imgBaseUrl: getApp().globalData.imgBaseUrl,
      showPay: false,
      payType: 0,
      goodsid: "",
      curSelectAddress: "",
      remark: "",
      wallets_password: "",
      showPI: false,
      focus: false,
      shop: {},
      carList: [],
      shop_id: "",
      allprice: 0,
      base_send: 0,
      yue: 0,
    };
  },
  methods: {
    setFocus() {
      this.focus = false;
      this.wallets_password = "";
    },
    changepayType(index) {
      this.payType = index;
    },
    changeAdd(index) {
      if (index == 1) {
        uni.navigateTo({
          url: "/pages/mine/mineSetting/address/address",
        });
      } else {
        uni.navigateTo({
          url:
            "/pages/index/schoolShop/goodsOrder/remark/remark?frompage=goodsorder&remark=" +
            this.remark,
        });
      }
    },
    toPay() {
      if (JSON.parse(uni.getStorageSync("user")).is_pay_pwd == 0) {
        uni.navigateTo({
          url: "/pages/mine/mineSetting/setPass/setPass",
        });
      } else if (this.payType == 0) {
        if (this.yue < this.price) {
          uni.showToast({
            title: "余额不足",
            icon: "none",
          });
          return false;
        }
        this.showPay = !this.showPay;
        this.showPI = !this.showPI;
      }
    },
    toforget() {
      uni.navigateTo({
        url: "/pages/mine/mineSetting/setPass/findPass/findPass?type=2",
      });
    },
    // 密码输入够6位
    set_wallets_password() {
      if (this.wallets_password.length == 6) {
        //密码长度6位时，自动验证钱包支付结果
        this.focus = false; //不让动
        uni.showLoading({
          title: "支付中……",
          mask: true,
        });
        let desc = [];
        for (let i in this.carList) {
          desc.push({
            goods_id: this.carList[i].id,
            goods_num: this.carList[i].carnum,
            goods_price: this.carList[i].price,
          });
        }
        // payTask({
        // 	user_id: JSON.parse(uni.getStorageSync('user')).id,
        // 	money: this.allprice,
        // 	status: 2,
        // 	note: "购买商品支付",
        // 	pay_pwd: this.wallets_password,
        // }).then(res => {
        // 	uni.showToast({
        // 		title: res.message,
        // 		icon: 'none',
        // 	});
        // 	this.showPI = false;
        // 	this.wallets_password = "";
        // 	if (res.code == 200) {

        // 	} else {
        // 		setTimeout(() => {
        // 			this.loading = false;
        // 		}, 1500);
        // 	}
        // });
        addOrderAll({
          data: {
            store_id: this.shop_id,
            address_id: this.curSelectAddress.id,
            order_freight: this.base_send,
            pay_total: this.allprice,
            note: this.remark,
            desc: desc,
            pay_pwd: this.wallets_password,
          },
        }).then((res1) => {
          uni.hideLoading();
          uni.showToast({
            title: res1.message,
            icon: "none",
          });
          this.showPI = false;
          this.wallets_password = "";
          if (res1.code == 200) {
            this.delcar();
            setTimeout(() => {
              uni.redirectTo({
                url:
                  "/pages/mine/shop/myshopOrder/myorderDetail/myorderDetail?id=" +
                  res1.result.order_id,
              });
            }, 1500);
          } else {
          }
        });
      }
    },
    // 清空购物车
    delcar() {
      let car = uni.getStorageSync("car") || [];
      //查找购物车中的该店铺
      let exist = car.find((ele) => {
        return ele.shop_id === this.shop_id;
      });
      exist.cartItems = [];
      // 减购物车数据， 存入缓存
      uni.setStorage({
        key: "car",
        data: car,
        success: function (res) {},
      });
    },
    // 计算 配送费和总金额
    getPrice() {
      // 无配送费
      if (this.shop.send_status == 0) {
        for (let i in this.carList) {
          this.allprice =
            this.allprice +
            this.carList[i].carnum * Number(this.carList[i].price);
        }
      }
      // 有配送费
      else if (this.shop.send_status == 1) {
        this.base_send = this.shop.base_send;
        for (let i in this.carList) {
          this.allprice =
            this.allprice +
            this.carList[i].carnum * Number(this.carList[i].price);
        }
        this.allprice = this.allprice + this.base_send;
      }
      // 满减配送费
      else if (this.shop.send_status == 2) {
        for (let i in this.carList) {
          this.allprice =
            this.allprice +
            this.carList[i].carnum * Number(this.carList[i].price);
        }
        if (this.allprice >= this.shop.discount) {
          this.base_send = this.shop.send_fee;
        } else {
          this.base_send = this.shop.base_send;
        }
        this.allprice = this.allprice + this.base_send;
      }
    },
    getress(id) {
      getAddress().then((res) => {
        if (res.code == 200) {
          // 不是地址
          if (id) {
            this.curSelectAddress = res.result.find((el) => {
              return el.id === id;
            });
            console.log(this.curSelectAddress);
          }
          // 默认地址
          else {
            this.curSelectAddress = res.result.find((el) => {
              return el.is_default === 1;
            });
            console.log(this.curSelectAddress);
          }
        }
      });
    },
  },
  onLoad(options) {
    this.shop_id = Number(options.shop_id);
    storeDetail({
      id: this.shop_id, //店铺id
    }).then((res) => {
      if (res.code == 200) {
        this.shop = res.result;
        // 购物车
        this.carList = uni.getStorageSync("car").find((ele) => {
          return ele.shop_id === this.shop_id;
        }).cartItems;

        this.getPrice();
      }
    });
    this.getress();
    // 个人余额
    findUserInfo({}).then((res) => {
      if (res.code == 200) {
        this.yue = res.result.wallet;
      }
    });
  },
  onShow() {
    let that = this;
    uni.getStorage({
      key: "issueInfo",
      success(res) {
        let options = JSON.parse(res.data);
        that.remark = options.value;
        that.goodsid = options.goodsid;
      },
    });
    let id = "";
    id = uni.getStorageSync("address_id");
    if (id) {
      this.getress(id);
    }
  },
};
</script>

<style scoped>
.content {
  background: #f2f2f2;
  min-height: 100vh;
}

.top1 {
  height: 198rpx;
  background: linear-gradient(
    180deg,
    #fec300 0%,
    #fec200 48%,
    rgba(254, 194, 0, 0) 100%
  );
  position: relative;
}

.top1 > view {
  background: #ffffff;
  border-radius: 14px;
  position: absolute;
  left: 24rpx;
  top: 24rpx;
  padding: 24rpx;
  width: 704rpx;
}

.top1 > view > view:nth-of-type(1) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
  margin-bottom: 16rpx;
  color: rgba(51, 51, 51, 0.4);
}

.top1 > view > view:nth-of-type(1) text:nth-of-type(2) {
  background: rgba(0, 145, 255, 0.1);
  border-radius: 10px;
  color: rgba(0, 145, 255, 1);
  padding: 2rpx 14rpx;
}

.top1 > view > view:nth-of-type(2) {
  font-weight: bold;
  font-size: 32rpx;
}

.top1 > view > view:nth-of-type(3) {
  font-size: 28rpx;
  color: rgba(52, 52, 52, 0.6);
  margin-top: 8rpx;
}

.top1 > view > view:nth-of-type(3) text {
  margin-right: 20rpx;
}

.top2 {
  padding: 48rpx 24rpx;
}

.top2 > view {
  background: #ffffff;
  border-radius: 14px;
  padding: 24rpx;
}

.top2 .top2_1 {
  font-size: 24rpx;
}

.top2 .top2_1 .title {
  color: rgba(51, 51, 51, 0.4);
}

.top2 .top2_1 .top2_1list > view {
  margin-top: 24rpx;
  display: flex;
}

.top2 .top2_1 .top2_1list > view image {
  width: 96rpx;
  height: 96rpx;
}

.top2 .top2_1 .top2_1list > view > view:nth-of-type(1) {
  width: 106rpx;
}

.top2 .top2_1 .top2_1list > view > view:nth-of-type(2) {
  flex: 1;
}

.top2 .top2_1 .top2_1list > view > view:nth-of-type(2) > view:nth-of-type(1) {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.top2 .top2_2 {
  margin-top: 28rpx;
  padding: 32rpx 24rpx;
}

.top2_2 > view {
  display: flex;
  font-size: 28rpx;
  margin-bottom: 32rpx;
  align-items: center;
  justify-content: space-between;
}

.top2_2 > view > text:nth-of-type(1) {
  font-weight: bold;
}

.top2_2 > view > text:nth-of-type(2) {
  color: #ff3939;
}

.top2_2 > view:nth-of-type(3) {
  margin-bottom: 0;
}

.top2_2 .bz {
  display: flex;
  align-items: center;
}

.top2_2 input {
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.top3 {
  width: 100%;
  position: fixed;
  height: 116rpx;
  display: flex;
  bottom: 0;
  z-index: 10;
}

.top3 > view {
  flex: 1;
}

.top3 > view:nth-of-type(1) {
  background: #fec200;
  box-sizing: border-box;
}

.top3 > view:nth-of-type(1) > view {
  padding: 14rpx 0 0 48rpx;
}

.top3 > view:nth-of-type(1) > view:nth-of-type(2) {
  font-size: 20rpx;
  color: rgba(25, 25, 25, 0.4);
  padding: 0 0 0 48rpx;
  margin-top: 8rpx;
}

.top3 > view:nth-of-type(2) {
  background: #333333;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: bold;
  text-align: center;
  line-height: 116rpx;
}

/* 支付 */

.pay {
  width: 572rpx;
  height: 536rpx;
  background: #ffffff;
  border-radius: 4px;
  padding: 32rpx;
  box-sizing: border-box;
}

.pay > view:nth-of-type(1) {
  font-size: 28rpx;
  margin-bottom: 16rpx;
}

.pay > view:nth-of-type(2) {
  font-size: 60rpx;
  text-align: center;
  font-weight: bold;
}

.pay > view:nth-of-type(3),
.pay > view:nth-of-type(4) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 50rpx;
  font-weight: bold;
}

.pay > view:nth-of-type(3) > view,
.pay > view:nth-of-type(4) > view {
  display: flex;
  align-items: center;
}

.pay .yue {
  font-size: 24rpx;
  font-weight: normal;
  color: rgba(36, 36, 36, 0.4);
}

.pay .leftimg {
  width: 32rpx;
  height: 36rpx;
  margin-right: 24rpx;
}

.pay .rightimg {
  width: 32rpx;
  height: 32rpx;
}

.pay > view:nth-of-type(5) {
  width: 332rpx;
  height: 80rpx;
  background: #fec200;
  border-radius: 20px;
  text-align: center;
  line-height: 80rpx;
  font-size: 28rpx;
  font-weight: bold;
  margin: 64rpx auto 0;
}

/* 支付密码输入 */

.PasswordInput {
  width: 600rpx;
  height: 300rpx;
  padding: 30rpx 20rpx 20rpx;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  top: 0;
  left: 0;
}

.PasswordInput > view:nth-of-type(2) {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 50rpx 0 30rpx;
}

.password_dot {
  width: 90rpx;
  height: 90rpx;
  border: 2rpx solid #ddd;
  border-left: none 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password_dot:nth-child(1) {
  border-left: 2rpx solid #ddd;
}

.password_dot i {
  background: #000;
  border-radius: 50%;
  width: 20rpx;
  height: 20rpx;
  display: inline-block;
}
</style>
