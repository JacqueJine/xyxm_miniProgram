<template>
  <view class="content">
    <view class="top1" v-if="!isPass">
      <view
        ><input
          type="password"
          maxlength="6"
          placeholder="请输入六位数字支付密码"
          v-model="password"
      /></view>
      <view
        ><input
          type="password"
          maxlength="6"
          placeholder="再次确认支付密码"
          v-model="r_pass"
      /></view>
    </view>
    <view class="top2" v-else>
      <view>
        <navigator url="./findPass/findPass?type=1">
          <text>修改密码</text>
          <u-icon name="arrow-right"></u-icon>
        </navigator>
      </view>
      <view>
        <navigator url="./findPass/findPass?type=2">
          <text>忘记密码</text>
          <u-icon name="arrow-right"></u-icon>
        </navigator>
      </view>
    </view>
    <view class="btn" v-if="!isPass" @click="submit">保存</view>
  </view>
</template>

<script>
import { saveUser, findUserInfo } from "../../../../services/mine.js";
export default {
  data() {
    return {
      isPass: 0,
      password: "",
      r_pass: "",
    };
  },
  methods: {
    submit() {
      if (!/^\d{6}$/.test(this.password)) {
        uni.showToast({
          title: "请输入六位数字支付密码",
          icon: "none",
          duration: 2000,
        });
        return false;
      } else if (this.password != this.r_pass) {
        uni.showToast({
          title: "两次密码输入不一致",
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      uni.showLoading({
        title: "提交中……",
        mask: true,
      });
      saveUser({
        data: {
          pay_pwd: this.password,
        },
      }).then((res) => {
        uni.hideLoading();
        uni.showToast({
          title: res.message,
          icon: "none",
        });

        if (res.code == 200) {
          findUserInfo({}).then((res) => {
            if (res.code == 200) {
              uni.setStorageSync("user", JSON.stringify(res.result));
            }
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }
      });
    },
  },
  onLoad() {
    this.isPass = JSON.parse(uni.getStorageSync("user")).is_pay_pwd;
  },
};
</script>

<style scoped>
.content {
  min-height: 100vh;
  background: #f2f2f2;
}

.top1,
.top2 {
  background: #ffffff;
}

.top1 > view,
.top2 navigator {
  padding: 32rpx 24rpx;
  border-bottom: 1px solid #f2f2f2;
}

.top2 navigator {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn {
  margin: 136rpx 24rpx 0;
  background: #fec200;
  border-radius: 25px;
  text-align: center;
  padding: 28rpx 0;
  font-weight: bold;
}
</style>
